"use client";
/* External order JSON is validated by the server before reaching these views. */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useState } from "react";
import { catalog, formatMoney, type Product } from "./catalog";
import { useCart } from "./CartProvider";
import type { Locale } from "../i18n/config";

const copy = {
  en: {
    bag: "Your bag",
    empty: "Your bag is empty.",
    continue: "Continue shopping",
    view: "View cart",
    checkout: "Checkout",
    remove: "Remove",
    subtotal: "Subtotal",
    add: "Add to bag",
    contact: "Contact",
    shipping: "Shipping",
    delivery: "Delivery",
    payment: "Payment",
    summary: "Order summary",
    pay: "Continue with PayPal",
    processing: "Processing…",
    required: "Please complete all required fields.",
    unavailable: "PayPal Sandbox is waiting for merchant credentials.",
    secure: "Secure Sandbox payment verified by the FIDORIA server.",
    cancelled: "Payment was cancelled. Your bag is still available.",
    next: "We will email the order confirmation. Tracking will appear after dispatch.",
    first: "First name",
    last: "Last name",
    address: "Address",
    apartment: "Apartment (optional)",
    city: "City",
    region: "State / Region",
    postal: "Postal code",
    country: "Country",
    email: "Email",
    standard: "Standard shipping",
    calculated: "Configured at checkout",
    thank: "Thank you.",
    order: "Order",
    status: "Payment status",
  },
  es: {
    bag: "Tu bolsa",
    empty: "Tu bolsa está vacía.",
    continue: "Seguir comprando",
    view: "Ver bolsa",
    checkout: "Finalizar compra",
    remove: "Eliminar",
    subtotal: "Subtotal",
    add: "Agregar a la bolsa",
    contact: "Contacto",
    shipping: "Envío",
    delivery: "Entrega",
    payment: "Pago",
    summary: "Resumen del pedido",
    pay: "Continuar con PayPal",
    processing: "Procesando…",
    required: "Completa todos los campos obligatorios.",
    unavailable: "PayPal Sandbox está esperando las credenciales del comercio.",
    secure: "Pago Sandbox seguro y verificado por el servidor de FIDORIA.",
    cancelled: "El pago fue cancelado. Tu bolsa sigue disponible.",
    next: "Enviaremos la confirmación por correo. El seguimiento aparecerá después del despacho.",
    first: "Nombre",
    last: "Apellido",
    address: "Dirección",
    apartment: "Departamento (opcional)",
    city: "Ciudad",
    region: "Estado / Región",
    postal: "Código postal",
    country: "País",
    email: "Correo electrónico",
    standard: "Envío estándar",
    calculated: "Configurado al finalizar",
    thank: "Gracias.",
    order: "Pedido",
    status: "Estado del pago",
  },
  fr: {
    bag: "Votre panier",
    empty: "Votre panier est vide.",
    continue: "Continuer mes achats",
    view: "Voir le panier",
    checkout: "Commander",
    remove: "Supprimer",
    subtotal: "Sous-total",
    add: "Ajouter au panier",
    contact: "Contact",
    shipping: "Livraison",
    delivery: "Livraison",
    payment: "Paiement",
    summary: "Résumé de la commande",
    pay: "Continuer avec PayPal",
    processing: "Traitement…",
    required: "Veuillez remplir tous les champs obligatoires.",
    unavailable: "PayPal Sandbox attend les identifiants du marchand.",
    secure: "Paiement Sandbox sécurisé et vérifié par le serveur FIDORIA.",
    cancelled: "Le paiement a été annulé. Votre panier reste disponible.",
    next: "La confirmation sera envoyée par e-mail. Le suivi apparaîtra après l’expédition.",
    first: "Prénom",
    last: "Nom",
    address: "Adresse",
    apartment: "Appartement (facultatif)",
    city: "Ville",
    region: "État / Région",
    postal: "Code postal",
    country: "Pays",
    email: "E-mail",
    standard: "Livraison standard",
    calculated: "Configuré au paiement",
    thank: "Merci.",
    order: "Commande",
    status: "État du paiement",
  },
  de: {
    bag: "Ihr Warenkorb",
    empty: "Ihr Warenkorb ist leer.",
    continue: "Weiter einkaufen",
    view: "Warenkorb ansehen",
    checkout: "Zur Kasse",
    remove: "Entfernen",
    subtotal: "Zwischensumme",
    add: "In den Warenkorb",
    contact: "Kontakt",
    shipping: "Versand",
    delivery: "Lieferung",
    payment: "Zahlung",
    summary: "Bestellübersicht",
    pay: "Weiter mit PayPal",
    processing: "Wird verarbeitet…",
    required: "Bitte füllen Sie alle Pflichtfelder aus.",
    unavailable: "PayPal Sandbox wartet auf die Händlerzugangsdaten.",
    secure: "Sichere Sandbox-Zahlung, vom FIDORIA-Server bestätigt.",
    cancelled: "Die Zahlung wurde abgebrochen. Ihr Warenkorb bleibt erhalten.",
    next: "Die Bestätigung wird per E-Mail gesendet. Die Sendungsverfolgung erscheint nach dem Versand.",
    first: "Vorname",
    last: "Nachname",
    address: "Adresse",
    apartment: "Wohnung (optional)",
    city: "Stadt",
    region: "Bundesland / Region",
    postal: "Postleitzahl",
    country: "Land",
    email: "E-Mail",
    standard: "Standardversand",
    calculated: "Beim Checkout konfiguriert",
    thank: "Vielen Dank.",
    order: "Bestellung",
    status: "Zahlungsstatus",
  },
};

function ProductVisual({ type }: { type: string }) {
  return (
    <div className={`product-visual ${type}`} aria-hidden="true">
      <span>FIDORIA</span>
      <i />
      <b />
    </div>
  );
}
export function AddToCartButton({
  product,
  locale,
}: {
  product: Product;
  locale: Locale;
}) {
  const { add } = useCart();
  return (
    <button className="button dark" onClick={() => add(product)}>
      {copy[locale].add} <span>↗</span>
    </button>
  );
}
export function CartBagLink({ locale }: { locale: Locale }) {
  const { count, openDrawer } = useCart();
  return (
    <button className="cart-bag-button" onClick={openDrawer}>
      {copy[locale].bag}
      <span>{count}</span>
    </button>
  );
}
export function CartDrawer({ locale }: { locale: Locale }) {
  const c = copy[locale],
    { items, subtotal, drawerOpen, closeDrawer, setQuantity, remove } =
      useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (drawerOpen) {
      closeRef.current?.focus();
      document.body.style.overflow = "hidden";
    } else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);
  if (!drawerOpen) return null;
  return (
    <div
      className="cart-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) closeDrawer();
      }}
    >
      <aside
        className="cart-drawer"
        role="dialog"
        aria-modal="true"
        aria-label={c.bag}
      >
        <header>
          <h2>{c.bag}</h2>
          <button ref={closeRef} onClick={closeDrawer} aria-label="Close">
            ×
          </button>
        </header>
        <div className="drawer-items">
          {items.length === 0 ? (
            <p>{c.empty}</p>
          ) : (
            items.map((item) => (
              <CartLine
                key={item.variantId}
                item={item}
                locale={locale}
                setQuantity={setQuantity}
                remove={remove}
              />
            ))
          )}
        </div>
        {items.length > 0 && (
          <footer>
            <div>
              <span>{c.subtotal}</span>
              <strong>{formatMoney(subtotal, locale)}</strong>
            </div>
            <small>{c.calculated}</small>
            <a className="button dark" href={`/${locale}/checkout`}>
              {c.checkout} →
            </a>
            <a className="drawer-link" href={`/${locale}/cart`}>
              {c.view}
            </a>
            <button className="drawer-link" onClick={closeDrawer}>
              {c.continue}
            </button>
          </footer>
        )}
      </aside>
    </div>
  );
}
function CartLine({
  item,
  locale,
  setQuantity,
  remove,
}: {
  item: any;
  locale: Locale;
  setQuantity: (p: string, v: string, q: number) => void;
  remove: (p: string, v: string) => void;
}) {
  return (
    <article className="cart-line">
      <div className={`cart-thumb ${item.visualType}`}>F</div>
      <div>
        <h3>{item.name}</h3>
        <p>{item.variant}</p>
        <div className="quantity">
          <button
            onClick={() =>
              setQuantity(item.productId, item.variantId, item.quantity - 1)
            }
            aria-label="Decrease"
          >
            −
          </button>
          <span>{item.quantity}</span>
          <button
            onClick={() =>
              setQuantity(item.productId, item.variantId, item.quantity + 1)
            }
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <button
          className="remove-item"
          onClick={() => remove(item.productId, item.variantId)}
        >
          {copy[locale].remove}
        </button>
      </div>
      <strong>{formatMoney(item.price * item.quantity, locale)}</strong>
    </article>
  );
}
export function CartPage({ locale }: { locale: Locale }) {
  const c = copy[locale],
    { items, subtotal, setQuantity, remove, clear } = useCart();
  return (
    <main className="subpage commerce-page">
      <div className="shell">
        <header className="subpage-head">
          <p className="eyebrow">FIDORIA</p>
          <h1 className="page-title">{c.bag}.</h1>
        </header>
        {items.length === 0 ? (
          <div className="empty-cart">
            <p>{c.empty}</p>
            <a className="button dark" href={`/${locale}/shop`}>
              {c.continue} →
            </a>
          </div>
        ) : (
          <div className="cart-layout">
            <section>
              {items.map((item) => (
                <CartLine
                  key={item.variantId}
                  item={item}
                  locale={locale}
                  setQuantity={setQuantity}
                  remove={remove}
                />
              ))}
              <button className="remove-item" onClick={clear}>
                {c.remove} all
              </button>
            </section>
            <aside className="cart-summary">
              <h2>{c.summary}</h2>
              <div>
                <span>{c.subtotal}</span>
                <strong>{formatMoney(subtotal, locale)}</strong>
              </div>
              <p>{c.calculated}</p>
              <a className="button dark" href={`/${locale}/checkout`}>
                {c.checkout} →
              </a>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}

type CheckoutForm = {
  email: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
};
export function CheckoutPage({ locale }: { locale: Locale }) {
  const c = copy[locale],
    { items, subtotal } = useCart();
  const [form, setForm] = useState<CheckoutForm>({
    email: "",
    firstName: "",
    lastName: "",
    address1: "",
    address2: "",
    city: "",
    region: "",
    postalCode: "",
    country: "",
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    if (new URLSearchParams(location.search).get("cancelled") === "1")
      setError(c.cancelled);
    window.dispatchEvent(
      new CustomEvent("fidoria:begin_checkout", {
        detail: { currency: "USD", itemCount: items.length },
      }),
    );
  }, [c.cancelled, items.length]);
  const update =
    (key: keyof CheckoutForm) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm({ ...form, [key]: e.target.value });
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!items.length) return setError(c.empty);
    setBusy(true);
    try {
      const response = await fetch("/api/commerce/paypal/create-order", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          locale,
          items: items.map(({ productId, variantId, quantity }) => ({
            productId,
            variantId,
            quantity,
          })),
          customer: form,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || c.unavailable);
      if (data.approveUrl) {
        sessionStorage.setItem("fidoria_order_token", data.lookupToken);
        location.assign(data.approveUrl);
      } else throw new Error(c.unavailable);
    } catch (err) {
      setError(err instanceof Error ? err.message : c.unavailable);
      setBusy(false);
    }
  };
  return (
    <main className="checkout-page">
      <form className="checkout-shell" onSubmit={submit}>
        <section className="checkout-form">
          <a className="checkout-logo" href={`/${locale}`}>
            FIDORIA
          </a>
          <fieldset>
            <legend>{c.contact}</legend>
            <label>
              {c.email}
              <input
                required
                type="email"
                autoComplete="email"
                inputMode="email"
                value={form.email}
                onChange={update("email")}
              />
            </label>
          </fieldset>
          <fieldset>
            <legend>{c.shipping}</legend>
            <div className="field-pair">
              <label>
                {c.first}
                <input
                  required
                  autoComplete="given-name"
                  value={form.firstName}
                  onChange={update("firstName")}
                />
              </label>
              <label>
                {c.last}
                <input
                  required
                  autoComplete="family-name"
                  value={form.lastName}
                  onChange={update("lastName")}
                />
              </label>
            </div>
            <label>
              {c.address}
              <input
                required
                autoComplete="shipping street-address"
                value={form.address1}
                onChange={update("address1")}
              />
            </label>
            <label>
              {c.apartment}
              <input
                autoComplete="shipping address-line2"
                value={form.address2}
                onChange={update("address2")}
              />
            </label>
            <div className="field-pair">
              <label>
                {c.city}
                <input
                  required
                  autoComplete="shipping address-level2"
                  value={form.city}
                  onChange={update("city")}
                />
              </label>
              <label>
                {c.region}
                <input
                  required
                  autoComplete="shipping address-level1"
                  value={form.region}
                  onChange={update("region")}
                />
              </label>
            </div>
            <div className="field-pair">
              <label>
                {c.postal}
                <input
                  required
                  autoComplete="shipping postal-code"
                  inputMode="text"
                  value={form.postalCode}
                  onChange={update("postalCode")}
                />
              </label>
              <label>
                {c.country}
                <select
                  required
                  autoComplete="shipping country"
                  value={form.country}
                  onChange={update("country")}
                >
                  <option value="">—</option>
                  {[
                    "US",
                    "CA",
                    "GB",
                    "AU",
                    "CL",
                    "DE",
                    "FR",
                    "ES",
                    "IT",
                    "NL",
                    "BE",
                    "MX",
                    "AR",
                    "BR",
                    "CO",
                    "PE",
                  ].map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>
          <fieldset>
            <legend>{c.delivery}</legend>
            <div className="delivery-option">
              <span>●</span>
              <div>
                <strong>{c.standard}</strong>
                <small>{c.calculated}</small>
              </div>
            </div>
          </fieldset>
          <fieldset>
            <legend>{c.payment}</legend>
            <div className="payment-option">
              <span>PayPal</span>
              <small>Sandbox</small>
            </div>
            <p className="payment-note">{c.secure}</p>
          </fieldset>
          {error && (
            <p className="checkout-error" role="alert">
              {error}
            </p>
          )}
          <button
            className="button dark checkout-submit"
            disabled={busy || !items.length}
          >
            {busy ? c.processing : c.pay}
          </button>
          <a className="back-cart" href={`/${locale}/cart`}>
            ← {c.bag}
          </a>
        </section>
        <OrderSummary locale={locale} items={items} subtotal={subtotal} />
      </form>
    </main>
  );
}
function OrderSummary({
  locale,
  items,
  subtotal,
}: {
  locale: Locale;
  items: any[];
  subtotal: number;
}) {
  const c = copy[locale];
  return (
    <aside className="checkout-summary">
      <h2>{c.summary}</h2>
      {items.map((item) => (
        <div className="summary-line" key={item.variantId}>
          <span className="summary-thumb">
            F<small>{item.quantity}</small>
          </span>
          <div>
            <strong>{item.name}</strong>
            <small>{item.variant}</small>
          </div>
          <b>{formatMoney(item.price * item.quantity, locale)}</b>
        </div>
      ))}
      <div className="summary-total">
        <span>{c.subtotal}</span>
        <strong>{formatMoney(subtotal, locale)}</strong>
      </div>
      <div className="summary-total">
        <span>{c.shipping}</span>
        <small>{c.calculated}</small>
      </div>
      <div className="summary-grand">
        <span>Total · USD</span>
        <strong>{formatMoney(subtotal, locale)}</strong>
      </div>
    </aside>
  );
}

export function OrderPage({
  locale,
  orderNumber,
}: {
  locale: Locale;
  orderNumber: string;
}) {
  const c = copy[locale];
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    const token =
      new URLSearchParams(location.search).get("token") ||
      sessionStorage.getItem("fidoria_order_token") ||
      "";
    fetch(
      `/api/commerce/orders/${encodeURIComponent(orderNumber)}?token=${encodeURIComponent(token)}`,
    )
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setData(d);
        const purchaseKey = `fidoria_purchase_${d.orderNumber}`;
        if (d.paymentStatus === "paid" && !sessionStorage.getItem(purchaseKey)) {
          window.dispatchEvent(
            new CustomEvent("fidoria:purchase", {
              detail: { orderNumber: d.orderNumber, total: d.total, currency: d.currency },
            }),
          );
          sessionStorage.setItem(purchaseKey, "1");
        }
      })
      .catch(() => setError("Order unavailable"));
  }, [orderNumber]);
  if (error)
    return (
      <main className="subpage">
        <div className="shell">
          <h1>{error}</h1>
        </div>
      </main>
    );
  if (!data)
    return (
      <main className="subpage">
        <div className="shell">
          <p>{c.processing}</p>
        </div>
      </main>
    );
  return (
    <main className="order-page">
      <div className="order-card">
        <p className="eyebrow">FIDORIA</p>
        <h1>{c.thank}</h1>
        <p>
          {c.order} <strong>{data.orderNumber}</strong>
        </p>
        <div className={`status-pill ${data.paymentStatus}`}>
          {c.status}: {data.paymentStatus}
        </div>
        <OrderSummary
          locale={locale}
          items={data.items}
          subtotal={data.subtotal}
        />
        <p>{data.customerEmail}</p>
        <p>
          {data.shippingAddress.city}, {data.shippingAddress.country}
        </p>
        <p>{c.next}</p>
        <a className="button dark" href={`/${locale}/shop`}>
          {c.continue} →
        </a>
      </div>
    </main>
  );
}

export function PayPalReturnPage({ locale }: { locale: Locale }) {
  const c = copy[locale],
    { clear } = useCart();
  const [error, setError] = useState("");
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const paypalOrderId = params.get("token") || "",
      lookupToken =
        params.get("lookup") ||
        sessionStorage.getItem("fidoria_order_token") ||
        "";
    if (!paypalOrderId || !lookupToken) {
      setError(c.required);
      return;
    }
    fetch("/api/commerce/paypal/capture", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ paypalOrderId, lookupToken }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || c.unavailable);
        clear();
        sessionStorage.setItem("fidoria_order_token", data.lookupToken);
        location.replace(
          `/${locale}/order/${encodeURIComponent(data.orderNumber)}?token=${encodeURIComponent(data.lookupToken)}`,
        );
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : c.unavailable),
      );
  }, [locale]);
  return (
    <main className="payment-return">
      <div>
        <span className="payment-spinner" />
        <p className="eyebrow">PayPal</p>
        <h1>{error || c.processing}</h1>
        {error && (
          <a className="button dark" href={`/${locale}/checkout`}>
            ← {c.checkout}
          </a>
        )}
      </div>
    </main>
  );
}

export { catalog, ProductVisual };
