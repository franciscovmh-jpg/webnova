/** Cloudflare Worker entry point for the vinext-starter template. */
import {
  handleImageOptimization,
  DEFAULT_DEVICE_SIZES,
  DEFAULT_IMAGE_SIZES,
} from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";

interface Env {
  ASSETS: Fetcher;
  DB: D1Database;
  RESEND_API_KEY?: string;
  RESEND_FROM_EMAIL?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: {
          format: string;
          quality: number;
        }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === "/api/cotizacion") {
      if (request.method !== "POST") {
        return Response.json(
          { error: "Método no permitido" },
          { status: 405, headers: { Allow: "POST" } },
        );
      }

      const contentLength = Number(request.headers.get("content-length") ?? 0);
      if (contentLength > 20_000) {
        return Response.json(
          { error: "Solicitud demasiado extensa" },
          { status: 413 },
        );
      }

      if (!env.RESEND_API_KEY) {
        console.error(JSON.stringify({ event: "quote_email_config_missing" }));
        return Response.json(
          { error: "El envío aún no está configurado" },
          { status: 503 },
        );
      }

      try {
        const parsed: unknown = await request.json();
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          return Response.json({ error: "Solicitud inválida" }, { status: 400 });
        }
        const data = parsed as Record<string, unknown>;
        if (data.website) return Response.json({ ok: true });

        const field = (name: string, max = 500) =>
          typeof data[name] === "string" ? data[name].trim().slice(0, max) : "";
        const name = field("name", 100);
        const email = field("email", 200);
        const phone = field("phone", 80);
        const description = field("description", 3000);
        if (
          !name ||
          !email ||
          !phone ||
          !description ||
          !/^\S+@\S+\.\S+$/.test(email)
        ) {
          return Response.json(
            { error: "Revisa los campos obligatorios" },
            { status: 400 },
          );
        }

        const text = [
          "Nueva solicitud de cotización en fidoriaweb",
          "",
          `Nombre: ${name}`,
          `Negocio: ${field("business", 150) || "No indicado"}`,
          `Correo: ${email}`,
          `Teléfono / WhatsApp: ${phone}`,
          `Tipo de proyecto: ${field("service", 150) || "Por definir"}`,
          `¿Ya posee página web?: ${field("hasWeb", 30) || "No indicado"}`,
          `Presupuesto: ${field("budget", 100) || "Prefiere conversarlo"}`,
          `URL actual: ${field("url", 500) || "No indicada"}`,
          "",
          "Descripción:",
          description,
        ].join("\n");

        const resendResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from:
              env.RESEND_FROM_EMAIL || "FIDORIA Web <onboarding@resend.dev>",
            to: ["Fidoria@hotmail.com"],
            reply_to: email,
            subject: `Cotización web — ${name}`,
            text,
          }),
        });

        if (!resendResponse.ok) {
          console.error(
            JSON.stringify({
              event: "quote_email_failed",
              status: resendResponse.status,
            }),
          );
          return Response.json(
            { error: "No pudimos enviar la solicitud" },
            { status: 502 },
          );
        }

        console.log(JSON.stringify({ event: "quote_email_sent" }));
        return Response.json({ ok: true });
      } catch (error) {
        console.error(
          JSON.stringify({
            event: "quote_email_exception",
            message: error instanceof Error ? error.message : "unknown",
          }),
        );
        return Response.json(
          { error: "No pudimos procesar la solicitud" },
          { status: 400 },
        );
      }
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      return handleImageOptimization(
        request,
        {
          fetchAsset: (path) =>
            env.ASSETS.fetch(new Request(new URL(path, request.url))),
          transformImage: async (body, { width, format, quality }) => {
            const result = await env.IMAGES.input(body)
              .transform(width > 0 ? { width } : {})
              .output({ format, quality });
            return result.response();
          },
        },
        allowedWidths,
      );
    }

    return handler.fetch(request, env, ctx);
  },
};

export default worker;
