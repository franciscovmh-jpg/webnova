# FIDORIA Commerce Engine

## Architecture

The storefront uses a shared typed catalog, a persistent browser cart, a server-validated checkout, Cloudflare D1 orders/inventory, and a provider-neutral payment contract. Payment, fulfillment, and order statuses remain separate. The browser never sends or decides the payable amount or paid state.

Current flow:

`Product → Cart → Checkout → Pending order → PayPal approval → Server capture → Paid order → Confirmation`

## Cloudflare variables and secrets

Keep `PAYPAL_ENV=sandbox` until the complete sandbox flow is approved.

```text
PAYPAL_ENV=sandbox
PAYPAL_CLIENT_ID=<Sandbox app client ID>
PAYPAL_CLIENT_SECRET=<Sandbox app secret>
PAYPAL_WEBHOOK_ID=<Sandbox webhook ID>
SHIPPING_STANDARD_PRICE=<USD cents, for example 0 only when intentionally free>
FREE_SHIPPING_THRESHOLD=<optional USD cents>
```

`PAYPAL_CLIENT_SECRET` must be stored with `wrangler secret put` or in the Cloudflare dashboard and must never be committed. The same applies to the webhook ID when operational policy treats it as a secret.

## PayPal Sandbox setup

1. Open <https://developer.paypal.com/dashboard/applications/sandbox>.
2. Create a **Merchant** REST application under Sandbox.
3. Store its Client ID in `PAYPAL_CLIENT_ID` and its Secret in `PAYPAL_CLIENT_SECRET` as Cloudflare secrets.
4. In that Sandbox app, add webhook URL `https://shopfidoria.com/api/webhooks/paypal`.
5. Subscribe to `PAYMENT.CAPTURE.COMPLETED`, `PAYMENT.CAPTURE.DENIED`, `PAYMENT.CAPTURE.REFUNDED`, and `PAYMENT.CAPTURE.REVERSED`.
6. Store the generated webhook ID in `PAYPAL_WEBHOOK_ID`.
7. Test with a PayPal Sandbox personal buyer account. Do not use real credentials or money.

The webhook endpoint verifies signatures with PayPal and stores processed event IDs, so duplicate deliveries do not duplicate payment transitions.

## Going live

Create a separate Live REST app and Live webhook, replace the three PayPal credentials, and set `PAYPAL_ENV=live`. Do not reuse Sandbox credentials and do not change application code.

## Adding another payment provider

Implement the `PaymentProvider` contract in `worker/payment-provider.ts`, add its server endpoints, and expose it in checkout only when its credentials are configured. Mercado Pago and Webpay/Transbank should each receive their own adapter; cart, pricing, orders, confirmation, and inventory remain unchanged.

## Operations

- D1 migration: `drizzle/0001_commerce.sql`
- Order lookup requires both public order number and private lookup token.
- Price, product, variant, quantity, currency, and stock are validated on the Worker.
- Taxes, discounts, currency conversion, and shipping rules are extension points and are not fabricated.
- Refund methods exist in the provider layer, but no unauthenticated refund/admin route is exposed.
