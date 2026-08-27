import type { CommerceEnv } from "./commerce";

export interface PaymentProvider {
  createOrder(payload: unknown): Promise<Response>;
  capturePayment(providerOrderId: string): Promise<Response>;
  getPaymentStatus(providerOrderId: string): Promise<Response>;
  refundPayment(
    captureId: string,
    amount?: { value: string; currency_code: string },
  ): Promise<Response>;
  verifyWebhook(headers: Headers, event: unknown): Promise<boolean>;
}

export class PayPalPaymentProvider implements PaymentProvider {
  private readonly baseUrl: string;
  constructor(private readonly env: CommerceEnv) {
    this.baseUrl =
      env.PAYPAL_ENV === "live"
        ? "https://api-m.paypal.com"
        : "https://api-m.sandbox.paypal.com";
  }
  private async token() {
    if (!this.env.PAYPAL_CLIENT_ID || !this.env.PAYPAL_CLIENT_SECRET)
      throw new Error("paypal_not_configured");
    const response = await fetch(`${this.baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`${this.env.PAYPAL_CLIENT_ID}:${this.env.PAYPAL_CLIENT_SECRET}`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });
    if (!response.ok) throw new Error("paypal_auth_failed");
    return ((await response.json()) as { access_token: string }).access_token;
  }
  async request(path: string, init: RequestInit = {}) {
    const token = await this.token();
    return fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        "PayPal-Request-Id": crypto.randomUUID(),
        ...(init.headers || {}),
      },
    });
  }
  createOrder(payload: unknown) {
    return this.request("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  }
  capturePayment(id: string) {
    return this.request(
      `/v2/checkout/orders/${encodeURIComponent(id)}/capture`,
      { method: "POST", body: "{}" },
    );
  }
  getPaymentStatus(id: string) {
    return this.request(`/v2/checkout/orders/${encodeURIComponent(id)}`);
  }
  refundPayment(
    captureId: string,
    amount?: { value: string; currency_code: string },
  ) {
    return this.request(
      `/v2/payments/captures/${encodeURIComponent(captureId)}/refund`,
      { method: "POST", body: JSON.stringify(amount ? { amount } : {}) },
    );
  }
  async verifyWebhook(headers: Headers, event: unknown) {
    if (!this.env.PAYPAL_WEBHOOK_ID) return false;
    const response = await this.request(
      "/v1/notifications/verify-webhook-signature",
      {
        method: "POST",
        body: JSON.stringify({
          auth_algo: headers.get("paypal-auth-algo"),
          cert_url: headers.get("paypal-cert-url"),
          transmission_id: headers.get("paypal-transmission-id"),
          transmission_sig: headers.get("paypal-transmission-sig"),
          transmission_time: headers.get("paypal-transmission-time"),
          webhook_id: this.env.PAYPAL_WEBHOOK_ID,
          webhook_event: event,
        }),
      },
    );
    const result = (await response.json()) as { verification_status?: string };
    return response.ok && result.verification_status === "SUCCESS";
  }
}
