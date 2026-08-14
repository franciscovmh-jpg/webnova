import assert from "node:assert/strict";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the production homepage with its key conversion paths", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);
  const html = await response.text();
  assert.match(html, /<html lang="es">/);
  assert.match(html, /<title>FIDORIA \| Diseño y desarrollo web<\/title>/);
  assert.match(html, /Creamos páginas web que/);
  assert.match(html, /href="\/cotizar"/);
  assert.match(html, /href="\/cotizar\?servicio=/);
  assert.doesNotMatch(html, /codex-preview|Building your site|href="#contacto"/i);
});

test("renders the quote flow", async () => {
  const response = await render("/cotizar");
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Solicita tu cotización \| FIDORIA/);
  assert.match(html, /25% de descuento/);
  assert.match(html, /Progreso de la cotización/);
});
