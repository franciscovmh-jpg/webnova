import type { CommerceEnv } from "./commerce";

export async function sendOrderConfirmation(env: CommerceEnv, orderId: string) {
  if (!env.RESEND_API_KEY) return;
  const order = await env.DB.prepare(
    "SELECT order_number,customer_email,shipping_address,total,currency,payment_status FROM orders WHERE id=?",
  )
    .bind(orderId)
    .first<{ order_number:string;customer_email:string;shipping_address:string;total:number;currency:string;payment_status:string }>();
  if (!order || order.payment_status !== "paid") return;
  const items = (
    await env.DB.prepare(
      "SELECT name,variant_name,quantity,line_total FROM order_items WHERE order_id=?",
    )
      .bind(orderId)
      .all<{ name:string;variant_name:string;quantity:number;line_total:number }>()
  ).results;
  const address = JSON.parse(order.shipping_address) as { address1:string;address2?:string;city:string;region:string;postalCode:string;country:string };
  const money = (value:number) => new Intl.NumberFormat("en", { style:"currency",currency:order.currency }).format(value/100);
  const text = ["Thank you for your FIDORIA order.","",`Order: ${order.order_number}`,`Payment: ${order.payment_status}`,"",...items.map((item)=>`${item.name} · ${item.variant_name} × ${item.quantity} — ${money(item.line_total)}`),"",`Total: ${money(order.total)}`,"","Shipping address:",address.address1,address.address2||"",`${address.city}, ${address.region} ${address.postalCode}`,address.country].filter(Boolean).join("\n");
  const response = await fetch("https://api.resend.com/emails", { method:"POST",headers:{ Authorization:`Bearer ${env.RESEND_API_KEY}`,"Content-Type":"application/json" },body:JSON.stringify({ from:env.RESEND_FROM_EMAIL||"FIDORIA <onboarding@resend.dev>",to:[order.customer_email],subject:`FIDORIA order ${order.order_number}`,text }) });
  if (!response.ok) console.error(JSON.stringify({ event:"order_confirmation_email_failed",orderNumber:order.order_number,status:response.status }));
  else console.log(JSON.stringify({ event:"order_confirmation_email_sent",orderNumber:order.order_number }));
}
