"use client";
import { FormEvent, useEffect, useState } from "react";
import { brandConfig, prices } from "../config";

const offer = {
  name: "Descuento primera web",
  price: "25% OFF",
  features: [
    "Diseño moderno y profesional",
    "Responsive en todos los dispositivos",
    "Secciones principales",
    "Integración con WhatsApp",
    "Enlaces a redes sociales",
    "Formulario de contacto",
    "SEO básico",
    "Configuración y publicación",
    "Ajustes finales",
  ],
};
const steps = ["Beneficio", "Tipo de proyecto", "Cotización"];
const planDetails: Record<
  string,
  { summary: string; ideal: string; notes: string }
> = {
  "Landing page": {
    summary:
      "Una página única, clara y enfocada en presentar tu negocio, servicio o campaña y convertir visitas en contactos.",
    ideal:
      "Emprendimientos, profesionales o campañas que necesitan comenzar rápidamente con una presencia digital sólida.",
    notes:
      "El contenido se organiza en bloques dentro de una sola página. Funciones especiales se cotizan por separado.",
  },
  "Web básica": {
    summary:
      "Un sitio con varias páginas o secciones para explicar mejor tu empresa, servicios y propuesta de valor.",
    ideal:
      "Negocios que necesitan más espacio para organizar información, captar consultas y proyectar una imagen profesional.",
    notes:
      "La cantidad final de secciones e integraciones se confirma al revisar el contenido y los objetivos del proyecto.",
  },
  "Web profesional": {
    summary:
      "Una solución de mayor alcance, con estructura, diseño y experiencia personalizados para objetivos comerciales más exigentes.",
    ideal:
      "Empresas con varios servicios, públicos distintos o necesidades específicas de posicionamiento y conversión.",
    notes:
      "Puede incorporar integraciones y funciones avanzadas. El alcance definitivo se define antes de comenzar.",
  },
  Rediseño: {
    summary:
      "Renovamos un sitio existente para mejorar su apariencia, estructura, navegación, adaptación móvil y rendimiento.",
    ideal:
      "Negocios cuya página quedó desactualizada, no representa bien la marca o dificulta encontrar la información.",
    notes:
      "Primero revisamos el sitio actual. El valor depende de su tecnología, estado y cantidad de contenido reutilizable.",
  },
  "Mantenimiento básico": {
    summary:
      "Acompañamiento mensual para conservar la información actualizada y resolver pequeños ajustes del sitio.",
    ideal:
      "Páginas que requieren cambios ocasionales de textos, imágenes y correcciones menores.",
    notes:
      "No contempla rediseños completos, nuevas funcionalidades ni secciones de gran tamaño.",
  },
  "Mantenimiento avanzado": {
    summary:
      "Soporte continuo para sitios que cambian con frecuencia y necesitan mejoras, optimizaciones y nuevas piezas pequeñas.",
    ideal:
      "Negocios activos que publican contenido, ajustan servicios o necesitan atención recurrente durante el mes.",
    notes:
      "Las solicitudes se priorizan según complejidad. Desarrollos de gran alcance se cotizan como proyectos independientes.",
  },
};

export default function QuoteFlow() {
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  const [activeInfo, setActiveInfo] = useState("");
  useEffect(() => {
    const incoming = new URLSearchParams(window.location.search).get(
      "servicio",
    );
    if (incoming) setSelected(incoming);
  }, []);
  useEffect(() => {
    if (!activeInfo) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setActiveInfo("");
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", close);
    };
  }, [activeInfo]);
  const chooseOffer = () => {
    setSelected("Primera web / 25% de descuento");
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const next = () => {
    if (!selected) return;
    setStep(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setSending(true);
    setSendError("");
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch("/api/cotizacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("send_failed");
      setSent(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSendError(
        "No pudimos enviar la solicitud. Inténtalo nuevamente o escríbenos a Fidoria@hotmail.com.",
      );
    } finally {
      setSending(false);
    }
  };
  return (
    <main className="quote-page">
      <header className="quote-header">
        <a
          className="quote-logo"
          href="/"
          aria-label={`Volver al inicio de ${brandConfig.name}`}
        >
          <img src={brandConfig.logo} alt={brandConfig.name} />
        </a>
        <a href="/">← Volver al sitio</a>
      </header>
      <nav className="quote-progress" aria-label="Progreso de la cotización">
        {steps.map((label, i) => (
          <div
            className={i === step ? "active" : i < step ? "done" : ""}
            key={label}
          >
            <span>{i < step ? "✓" : i + 1}</span>
            <b>{label}</b>
          </div>
        ))}
      </nav>
      {step === 0 && (
        <section className="quote-stage offer-stage">
          <div className="quote-offer">
            <div className="quote-offer-copy">
              <span className="offer-label">
                Beneficio de bienvenida FIDORIA
              </span>
              <h1>
                Obtén un <em>25% de descuento</em> en tu primera web
              </h1>
              <p>
                Da el primer paso con una página profesional creada para tu
                negocio. Aplicamos el descuento al valor acordado de tu primer
                proyecto web con Fidoria.
              </p>
              <div className="quote-actions">
                <button className="btn" onClick={chooseOffer}>
                  Quiero mi 25% de descuento ↗
                </button>
                <button
                  className="quote-text-button"
                  onClick={() => setStep(1)}
                >
                  Prefiero ver otras opciones →
                </button>
              </div>
            </div>
            <div className="quote-offer-panel">
              <small>BENEFICIO PRIMERA WEB</small>
              <div className="quote-price">
                25% <sup>OFF</sup>
              </div>
              <p>
                Aplicable a tu primer proyecto de creación web contratado con
                Fidoria.
              </p>
              <div>
                {offer.features.map((x) => (
                  <span key={x}>✓ {x}</span>
                ))}
              </div>
            </div>
            <small className="quote-legal">
              Descuento válido para clientes nuevos en su primer proyecto de
              creación web con Fidoria. Se aplica sobre el valor acordado según
              el alcance del proyecto. No acumulable con otras promociones ni
              aplicable a mantenimiento, rediseño o servicios adicionales.
            </small>
          </div>
        </section>
      )}
      {step === 1 && (
        <section className="quote-stage plans-stage">
          <div className="quote-stage-head">
            <span className="kicker">Elige el punto de partida</span>
            <h1>¿Qué tipo de proyecto necesitas?</h1>
            <p>
              Selecciona la alternativa más cercana a tu idea. Confirmaremos
              contigo el alcance y el valor definitivo.
            </p>
          </div>
          <div className="quote-plans">
            {prices.map((p) => (
              <article
                className={selected === p.name ? "selected" : ""}
                key={p.name}
              >
                <button
                  className="plan-select"
                  onClick={() => setSelected(p.name)}
                  aria-pressed={selected === p.name}
                >
                  <span>{selected === p.name ? "✓" : ""}</span>
                  <h2>{p.name}</h2>
                  <strong>{p.price}</strong>
                  <ul>
                    {p.features.map((x) => (
                      <li key={x}>✓ {x}</li>
                    ))}
                  </ul>
                </button>
                <button
                  className="plan-info"
                  onClick={() => setActiveInfo(p.name)}
                  aria-label={`Más información sobre ${p.name}`}
                >
                  Más información <span aria-hidden="true">＋</span>
                </button>
              </article>
            ))}
          </div>
          <div className="quote-stage-actions">
            <button className="quote-back" onClick={() => setStep(0)}>
              ← Volver a la oferta
            </button>
            <button className="btn" disabled={!selected} onClick={next}>
              Continuar con {selected || "mi selección"} →
            </button>
          </div>
        </section>
      )}
      {activeInfo &&
        (() => {
          const plan = prices.find((p) => p.name === activeInfo);
          const detail = planDetails[activeInfo];
          return plan && detail ? (
            <div
              className="plan-modal-backdrop"
              role="presentation"
              onMouseDown={(e) => {
                if (e.target === e.currentTarget) setActiveInfo("");
              }}
            >
              <section
                className="plan-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="plan-modal-title"
              >
                <button
                  className="plan-modal-close"
                  onClick={() => setActiveInfo("")}
                  aria-label="Cerrar información"
                >
                  ×
                </button>
                <span className="kicker">Detalles del servicio</span>
                <h2 id="plan-modal-title">{plan.name}</h2>
                <strong className="plan-modal-price">{plan.price}</strong>
                <p>{detail.summary}</p>
                <div className="plan-modal-grid">
                  <div>
                    <h3>Incluye</h3>
                    <ul>
                      {plan.features.map((item) => (
                        <li key={item}>✓ {item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3>Ideal para</h3>
                    <p>{detail.ideal}</p>
                  </div>
                </div>
                <small>{detail.notes}</small>
                <button
                  className="btn"
                  onClick={() => {
                    setSelected(plan.name);
                    setActiveInfo("");
                  }}
                >
                  Elegir {plan.name} →
                </button>
              </section>
            </div>
          ) : null;
        })()}
      {step === 2 && (
        <section className="quote-stage form-stage">
          {sent ? (
            <div className="quote-success" role="status">
              <img src="/brand/fidoria-mark.png" alt="FIDORIA" />
              <span>Solicitud enviada</span>
              <h1>Gracias por contarnos sobre tu proyecto.</h1>
              <p>
                Recibimos correctamente tu solicitud en Fidoria. Revisaremos
                los detalles y nos pondremos en contacto contigo.
              </p>
              <a className="btn" href="/">
                Volver al inicio
              </a>
            </div>
          ) : (
            <div className="quote-contact">
              <div className="quote-contact-copy">
                <span className="kicker">Hablemos de tu proyecto</span>
                <h1>Tu próxima web comienza con una conversación</h1>
                <p>
                  Elegiste:{" "}
                  <strong>{selected || "Proyecto por definir"}</strong>.
                  Completa tus datos para preparar una propuesta acorde a tus
                  objetivos.
                </p>
                <div>
                  <span>
                    <i>01</i>Respuesta clara y cercana
                  </span>
                  <span>
                    <i>02</i>Cotización según tu proyecto
                  </span>
                  <span>
                    <i>03</i>Sin compromisos
                  </span>
                </div>
                <button className="quote-back" onClick={() => setStep(1)}>
                  ← Cambiar selección
                </button>
              </div>
              <form onSubmit={submit}>
                <label className="form-honeypot" aria-hidden="true">
                  Sitio web
                  <input name="website" tabIndex={-1} autoComplete="off" />
                </label>
                <div className="form-head">
                  <h2>Solicita tu cotización</h2>
                  <p>Completa los datos y te contactaremos.</p>
                </div>
                <div className="fields">
                  <label>
                    Nombre *
                    <input
                      name="name"
                      required
                      autoComplete="name"
                      placeholder="Tu nombre"
                    />
                  </label>
                  <label>
                    Nombre del negocio
                    <input
                      name="business"
                      autoComplete="organization"
                      placeholder="Tu negocio"
                    />
                  </label>
                  <label>
                    Correo *
                    <input
                      name="email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="nombre@correo.cl"
                    />
                  </label>
                  <label>
                    Teléfono / WhatsApp *
                    <input
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+56 9..."
                    />
                  </label>
                  <label className="full">
                    Tipo de proyecto
                    <input name="service" value={selected} readOnly />
                  </label>
                  <label>
                    ¿Ya posee página web? *
                    <select name="hasWeb" required defaultValue="">
                      <option value="" disabled>
                        Selecciona
                      </option>
                      <option>Sí</option>
                      <option>No</option>
                    </select>
                  </label>
                  <label>
                    Presupuesto aproximado
                    <select name="budget" defaultValue="">
                      <option value="">Prefiero conversarlo</option>
                      <option>$150.000 – $250.000</option>
                      <option>$250.000 – $400.000</option>
                      <option>Más de $400.000</option>
                    </select>
                  </label>
                  <label className="full">
                    URL actual (opcional)
                    <input name="url" type="url" placeholder="https://..." />
                  </label>
                  <label className="full">
                    Descripción del proyecto *
                    <textarea
                      name="description"
                      required
                      rows={5}
                      placeholder="Cuéntanos sobre tu negocio y lo que necesitas..."
                    />
                  </label>
                  <label className="consent">
                    <input type="checkbox" required />
                    <span>
                      Acepto ser contactado/a por Fidoria sobre esta solicitud y
                      declaro haber leído la <a href="/privacidad">política de privacidad</a>
                      {" "}y los <a href="/terminos">términos del servicio</a>.
                    </span>
                  </label>
                </div>
                {sendError && (
                  <p className="form-error" role="alert">
                    {sendError}
                  </p>
                )}
                <button
                  className="btn submit"
                  type="submit"
                  disabled={sending}
                >
                  {sending ? "Enviando solicitud…" : "Enviar cotización ↗"}
                </button>
              </form>
            </div>
          )}
        </section>
      )}
    </main>
  );
}
