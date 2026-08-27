import { getVariant } from "../app/commerce/catalog";
/* PayPal and D1 return provider-owned JSON shapes that are validated at runtime. */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayPalPaymentProvider } from "./payment-provider";
import { sendOrderConfirmation } from "./order-email";

export interface CommerceEnv {
  DB: D1Database;
  PAYPAL_ENV?: string;
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_WEBHOOK_ID?: string;
  SHIPPING_STANDARD_PRICE?: string;
  FREE_SHIPPING_THRESHOLD?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
}
type CartRequest = { productId: string; variantId: string; quantity: number };
type Address = {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};
const json = (data: unknown, status = 200) =>
  Response.json(data, { status, headers: { "cache-control": "no-store" } });
const safe = (value: unknown, max = 200) =>
  typeof value === "string" ? value.trim().slice(0, max) : "";
const cents = (value: string | undefined) =>
  value && /^\d+$/.test(value) ? Number(value) : 0;
const validOrigin = (request: Request) => {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    const host = new URL(origin).hostname;
    return (
      host === "shopfidoria.com" ||
      host === "www.shopfidoria.com" ||
      host.endsWith(".workers.dev") ||
      host === "localhost"
    );
  } catch {
    return false;
  }
};
const paypal = (env: CommerceEnv, path: string, init: RequestInit = {}) =>
  new PayPalPaymentProvider(env).request(path, init);
async function body(request: Request) {
  if (Number(request.headers.get("content-length") || 0) > 30000)
    throw new Error("payload_too_large");
  return request.json() as Promise<Record<string, unknown>>;
}
function calculate(items: CartRequest[], shippingPrice = 0) {
  if (!Array.isArray(items) || items.length === 0 || items.length > 20)
    throw new Error("invalid_cart");
  const normalized = items.map((item) => {
    const quantity = Number(item.quantity);
    const found = getVariant(
      safe(item.productId, 80),
      safe(item.variantId, 80),
    );
    if (
      !found ||
      !Number.isInteger(quantity) ||
      quantity < 1 ||
      quantity > 10 ||
      quantity > found.variant.stock
    )
      throw new Error("invalid_item");
    return { ...found, quantity, lineTotal: found.variant.price * quantity };
  });
  const subtotal = normalized.reduce((sum, item) => sum + item.lineTotal, 0);
  return {
    items: normalized,
    subtotal,
    shipping: shippingPrice,
    taxes: 0,
    discount: 0,
    total: subtotal + shippingPrice,
    currency: "USD",
  };
}
function validateCustomer(value: unknown): Address {
  if (!value || typeof value !== "object") throw new Error("invalid_customer");
  const v = value as Record<string, unknown>;
  const result = {
    email: safe(v.email),
    firstName: safe(v.firstName, 80),
    lastName: safe(v.lastName, 80),
    address1: safe(v.address1, 180),
    address2: safe(v.address2, 120),
    city: safe(v.city, 100),
    region: safe(v.region, 100),
    postalCode: safe(v.postalCode, 30),
    country: safe(v.country, 2).toUpperCase(),
  };
  if (
    !/^\S+@\S+\.\S+$/.test(result.email) ||
    !result.firstName ||
    !result.lastName ||
    !result.address1 ||
    !result.city ||
    !result.region ||
    !result.postalCode ||
    !/^[A-Z]{2}$/.test(result.country)
  )
    throw new Error("invalid_customer");
  return result;
}
async function createOrder(request: Request, env: CommerceEnv) {
  const input = await body(request);
  const customer = validateCustomer(input.customer);
  const shippingPrice = cents(env.SHIPPING_STANDARD_PRICE);
  const totals = calculate(input.items as CartRequest[], shippingPrice);
  const id = crypto.randomUUID(),
    lookupToken = crypto.randomUUID().replaceAll("-", "");
  const orderNumber = `FID-${new Date().getUTCFullYear()}-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
  const locale = ["en", "es", "fr", "de"].includes(String(input.locale))
    ? String(input.locale)
    : "en";
  const origin = new URL(request.url).origin;
  if (!env.PAYPAL_CLIENT_ID || !env.PAYPAL_CLIENT_SECRET)
    throw new Error("paypal_not_configured");
  for (const item of totals.items) {
    const inventory = await env.DB.prepare(
      "SELECT stock FROM inventory WHERE variant_id=?",
    )
      .bind(item.variant.id)
      .first<{ stock: number }>();
    if (!inventory || inventory.stock < item.quantity)
      throw new Error("out_of_stock");
  }
  await env.DB.batch([
    env.DB.prepare(
      "INSERT INTO orders (id,order_number,lookup_token,customer_email,customer_name,shipping_address,subtotal,shipping,taxes,discount,total,currency,payment_provider,payment_status,fulfillment_status,order_status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
    ).bind(
      id,
      orderNumber,
      lookupToken,
      customer.email,
      `${customer.firstName} ${customer.lastName}`,
      JSON.stringify(customer),
      totals.subtotal,
      totals.shipping,
      0,
      0,
      totals.total,
      "USD",
      "paypal",
      "pending",
      "unfulfilled",
      "pending",
    ),
    ...totals.items.map((item) =>
      env.DB.prepare(
        "INSERT INTO order_items (id,order_id,product_id,variant_id,sku,name,variant_name,unit_price,quantity,line_total) VALUES (?,?,?,?,?,?,?,?,?,?)",
      ).bind(
        crypto.randomUUID(),
        id,
        item.product.id,
        item.variant.id,
        item.variant.sku,
        item.product.name,
        item.variant.name,
        item.variant.price,
        item.quantity,
        item.lineTotal,
      ),
    ),
  ]);
  try {
    const response = await paypal(env, "/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            reference_id: id,
            custom_id: id,
            invoice_id: orderNumber,
            amount: {
              currency_code: "USD",
              value: (totals.total / 100).toFixed(2),
              breakdown: {
                item_total: {
                  currency_code: "USD",
                  value: (totals.subtotal / 100).toFixed(2),
                },
                shipping: {
                  currency_code: "USD",
                  value: (totals.shipping / 100).toFixed(2),
                },
              },
            },
            items: totals.items.map((item) => ({
              name: item.product.name,
              sku: item.variant.sku,
              quantity: String(item.quantity),
              unit_amount: {
                currency_code: "USD",
                value: (item.variant.price / 100).toFixed(2),
              },
            })),
            shipping: {
              name: { full_name: `${customer.firstName} ${customer.lastName}` },
              address: {
                address_line_1: customer.address1,
                ...(customer.address2
                  ? { address_line_2: customer.address2 }
                  : {}),
                admin_area_2: customer.city,
                admin_area_1: customer.region,
                postal_code: customer.postalCode,
                country_code: customer.country,
              },
            },
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              brand_name: "FIDORIA",
              user_action: "PAY_NOW",
              shipping_preference: "SET_PROVIDED_ADDRESS",
              return_url: `${origin}/${locale}/checkout/paypal-return?order=${encodeURIComponent(orderNumber)}&lookup=${lookupToken}`,
              cancel_url: `${origin}/${locale}/checkout?cancelled=1`,
            },
          },
        },
      }),
    });
    const data = (await response.json()) as any;
    if (!response.ok || !data.id) throw new Error("paypal_create_failed");
    await env.DB.batch([
      env.DB.prepare(
        "UPDATE orders SET payment_id=?,updated_at=CURRENT_TIMESTAMP WHERE id=?",
      ).bind(data.id, id),
      env.DB.prepare(
        "INSERT INTO payments (id,order_id,provider,provider_order_id,amount,currency,status,raw_status) VALUES (?,?,?,?,?,?,?,?)",
      ).bind(
        crypto.randomUUID(),
        id,
        "paypal",
        data.id,
        totals.total,
        "USD",
        "pending",
        data.status || "CREATED",
      ),
    ]);
    console.log(
      JSON.stringify({
        event: "payment_order_created",
        orderNumber,
        provider: "paypal",
      }),
    );
    return json({
      orderNumber,
      lookupToken,
      paypalOrderId: data.id,
      approveUrl: data.links?.find(
        (link: any) => link.rel === "payer-action" || link.rel === "approve",
      )?.href,
    });
  } catch (error) {
    console.error(
      JSON.stringify({
        event: "payment_order_create_failed",
        orderNumber,
        reason: error instanceof Error ? error.message : "unknown",
      }),
    );
    throw error;
  }
}
async function finalizePaidOrder(
  env: CommerceEnv,
  paypalOrderId: string,
  captureId = "",
  rawStatus = "COMPLETED",
) {
  const order = await env.DB.prepare(
    "SELECT id,order_number,payment_status FROM orders WHERE payment_id=?",
  )
    .bind(paypalOrderId)
    .first<{ id: string; order_number: string; payment_status: string }>();
  if (!order || order.payment_status === "paid") return null;
  const items = (
    await env.DB.prepare(
      "SELECT variant_id,quantity FROM order_items WHERE order_id=?",
    )
      .bind(order.id)
      .all<{ variant_id: string; quantity: number }>()
  ).results;
  await env.DB.batch([
    ...items.map((item) =>
      env.DB.prepare(
        "UPDATE inventory SET stock=stock-?,updated_at=CURRENT_TIMESTAMP WHERE variant_id=? AND stock>=?",
      ).bind(item.quantity, item.variant_id, item.quantity),
    ),
    env.DB.prepare(
      "UPDATE orders SET payment_status='paid',order_status='confirmed',updated_at=CURRENT_TIMESTAMP WHERE id=? AND payment_status!='paid'",
    ).bind(order.id),
    env.DB.prepare(
      "UPDATE payments SET status='paid',provider_capture_id=COALESCE(NULLIF(?,''),provider_capture_id),raw_status=?,updated_at=CURRENT_TIMESTAMP WHERE order_id=?",
    ).bind(captureId, rawStatus, order.id),
  ]);
  return order;
}
async function captureOrder(request: Request, env: CommerceEnv) {
  const input = await body(request);
  const paypalOrderId = safe(input.paypalOrderId, 80),
    lookupToken = safe(input.lookupToken, 80);
  const row = await env.DB.prepare(
    "SELECT id,order_number,total,currency,payment_status FROM orders WHERE payment_id=? AND lookup_token=?",
  )
    .bind(paypalOrderId, lookupToken)
    .first<any>();
  if (!row) return json({ error: "order_not_found" }, 404);
  if (row.payment_status === "paid")
    return json({ orderNumber: row.order_number, lookupToken, status: "paid" });
  const response = await paypal(
    env,
    `/v2/checkout/orders/${encodeURIComponent(paypalOrderId)}/capture`,
    { method: "POST", body: "{}" },
  );
  const data = (await response.json()) as any;
  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  const paid =
    response.ok &&
    data.status === "COMPLETED" &&
    capture?.status === "COMPLETED" &&
    Math.round(Number(capture.amount?.value) * 100) === row.total &&
    capture.amount?.currency_code === row.currency;
  if (!paid) {
    console.error(
      JSON.stringify({
        event: "payment_capture_failed",
        orderNumber: row.order_number,
        status: data.status || response.status,
      }),
    );
    return json({ error: "payment_not_confirmed" }, 422);
  }
  const confirmedOrder = await finalizePaidOrder(
    env,
    paypalOrderId,
    capture.id,
    capture.status,
  );
  if (confirmedOrder)
    await sendOrderConfirmation(env, confirmedOrder.id).catch(() => undefined);
  console.log(
    JSON.stringify({
      event: "payment_captured",
      orderNumber: row.order_number,
      provider: "paypal",
    }),
  );
  return json({ orderNumber: row.order_number, lookupToken, status: "paid" });
}
async function getOrder(url: URL, env: CommerceEnv) {
  const number = decodeURIComponent(url.pathname.split("/").pop() || "");
  const token = url.searchParams.get("token") || "";
  const row = await env.DB.prepare(
    "SELECT order_number,customer_email,shipping_address,subtotal,shipping,taxes,discount,total,currency,payment_status,fulfillment_status,order_status,created_at FROM orders WHERE order_number=? AND lookup_token=?",
  )
    .bind(number, token)
    .first<any>();
  if (!row) return json({ error: "order_not_found" }, 404);
  const items = (
    await env.DB.prepare(
      "SELECT product_id AS productId,variant_id AS variantId,name,variant_name AS variant,unit_price AS price,quantity FROM order_items JOIN orders ON orders.id=order_items.order_id WHERE orders.order_number=? AND orders.lookup_token=?",
    )
      .bind(number, token)
      .all<any>()
  ).results;
  return json({
    orderNumber: row.order_number,
    customerEmail: row.customer_email,
    shippingAddress: JSON.parse(row.shipping_address),
    subtotal: row.subtotal,
    shipping: row.shipping,
    taxes: row.taxes,
    discount: row.discount,
    total: row.total,
    currency: row.currency,
    paymentStatus: row.payment_status,
    fulfillmentStatus: row.fulfillment_status,
    orderStatus: row.order_status,
    createdAt: row.created_at,
    items,
  });
}
async function webhook(request: Request, env: CommerceEnv) {
  if (!env.PAYPAL_WEBHOOK_ID)
    return json({ error: "webhook_not_configured" }, 503);
  const event = await body(request);
  const eventId = safe(event.id, 120),
    eventType = safe(event.event_type, 120);
  if (!eventId || !eventType) return json({ error: "invalid_event" }, 400);
  const existing = await env.DB.prepare(
    "SELECT event_id FROM webhook_events WHERE event_id=?",
  )
    .bind(eventId)
    .first();
  if (existing) return json({ ok: true, duplicate: true });
  const verified = await new PayPalPaymentProvider(env).verifyWebhook(
    request.headers,
    event,
  );
  if (!verified) return json({ error: "invalid_signature" }, 401);
  const resource = event.resource as Record<string, unknown> | undefined;
  const supplementary = resource?.supplementary_data as
    | { related_ids?: { order_id?: string } }
    | undefined;
  const paypalOrderId =
    supplementary?.related_ids?.order_id || safe(resource?.id, 100);
  if (eventType === "PAYMENT.CAPTURE.COMPLETED")
    {
      const confirmedOrder = await finalizePaidOrder(
        env,
        paypalOrderId,
        safe(resource?.id, 100),
      );
      if (confirmedOrder)
        await sendOrderConfirmation(env, confirmedOrder.id).catch(
          () => undefined,
        );
    }
  else if (eventType === "PAYMENT.CAPTURE.DENIED")
    await env.DB.prepare(
      "UPDATE orders SET payment_status='failed',updated_at=CURRENT_TIMESTAMP WHERE payment_id=?",
    )
      .bind(paypalOrderId)
      .run();
  else if (
    eventType === "PAYMENT.CAPTURE.REFUNDED" ||
    eventType === "PAYMENT.CAPTURE.REVERSED"
  )
    await env.DB.prepare(
      "UPDATE orders SET payment_status='refunded',updated_at=CURRENT_TIMESTAMP WHERE payment_id=?",
    )
      .bind(paypalOrderId)
      .run();
  await env.DB.prepare(
    "INSERT INTO webhook_events (event_id,provider,event_type) VALUES (?,?,?)",
  )
    .bind(eventId, "paypal", eventType)
    .run();
  console.log(
    JSON.stringify({ event: "paypal_webhook_processed", eventId, eventType }),
  );
  return json({ ok: true });
}
export async function handleCommerce(
  request: Request,
  env: CommerceEnv,
): Promise<Response | null> {
  const url = new URL(request.url);
  if (
    !url.pathname.startsWith("/api/commerce/") &&
    !url.pathname.startsWith("/api/webhooks/paypal")
  )
    return null;
  try {
    if (request.method === "POST" && !validOrigin(request))
      return json({ error: "invalid_origin" }, 403);
    if (
      url.pathname === "/api/commerce/paypal/create-order" &&
      request.method === "POST"
    )
      return await createOrder(request, env);
    if (
      url.pathname === "/api/commerce/paypal/capture" &&
      request.method === "POST"
    )
      return await captureOrder(request, env);
    if (
      url.pathname.startsWith("/api/commerce/orders/") &&
      request.method === "GET"
    )
      return await getOrder(url, env);
    if (url.pathname === "/api/webhooks/paypal" && request.method === "POST")
      return await webhook(request, env);
    return json({ error: "not_found" }, 404);
  } catch (error) {
    const message = error instanceof Error ? error.message : "commerce_error";
    console.error(JSON.stringify({ event: "commerce_error", message }));
    const clientErrors = [
      "invalid_cart",
      "invalid_item",
      "invalid_customer",
      "payload_too_large",
      "out_of_stock",
    ];
    return json(
      {
        error:
          message === "paypal_not_configured"
            ? "PayPal Sandbox is not configured yet"
            : clientErrors.includes(message)
              ? message
              : "Unable to process payment",
      },
      message === "out_of_stock"
        ? 409
        : clientErrors.includes(message)
          ? 400
          : message === "paypal_not_configured"
            ? 503
            : 500,
    );
  }
}
