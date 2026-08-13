import { brandConfig, siteConfig } from "../config";
export default function Hero() {
  return (
    <section className="hero section" id="inicio">
      <div className="container hero-grid">
        <div className="hero-copy">
          <a
            className="hero-instagram"
            href={siteConfig.socials.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Seguir a Fidoria en Instagram"
          >
            <span className="instagram-mark" aria-hidden="true">
              <i />
            </span>
            <span>
              <small>Síguenos en Instagram</small>
              <b>@fidoriaweb</b>
            </span>
            <em aria-hidden="true">↗</em>
          </a>
          <h1>
            Creamos páginas web que <em>impulsan tu negocio.</em>
          </h1>
          <div className="eyebrow">
            <span /> Soluciones web para negocios que avanzan
          </div>
          <p>
            Diseñamos sitios modernos, rápidos y adaptados a todos los
            dispositivos. Creamos, renovamos y mantenemos tu presencia digital
            para que tu negocio se vea profesional.
          </p>
          <div className="actions">
            <a className="btn" href="/cotizar">
              Solicitar cotización <b>↗</b>
            </a>
            <a className="btn ghost" href="#servicios">
              Ver servicios <b>→</b>
            </a>
          </div>
          <div className="trust">
            <span>
              <i aria-hidden="true">✓</i> Diseño a medida
            </span>
            <span>
              <i aria-hidden="true">✓</i> Responsive
            </span>
            <span>
              <i aria-hidden="true">✓</i> Soporte cercano
            </span>
          </div>
        </div>
        <div
          className="visual"
          aria-label="Vista conceptual de una página web en computador y celular"
        >
          <img className="hero-brand-mark" src={brandConfig.mark} alt="" />
          <div className="orbit one" />
          <div className="orbit two" />
          <div className="browser">
            <div className="browser-top">
              <i />
              <i />
              <i />
              <small>{brandConfig.legacyDomain}</small>
            </div>
            <div className="browser-body">
              <div className="mock-nav" />
              <div className="mock-grid">
                <div>
                  <span className="mock-pill" />
                  <b />
                  <b />
                  <small />
                  <button />
                </div>
                <div className="mock-card">
                  <i />
                  <i />
                  <i />
                </div>
              </div>
              <div className="mock-row">
                <i />
                <i />
                <i />
              </div>
            </div>
          </div>
          <div className="phone">
            <div className="notch" />
            <img className="phone-logo" src={brandConfig.mark} alt="" />
            <b />
            <b />
            <div />
            <button />
          </div>
          <div className="float-card">
            <span>↗</span>
            <div>
              <small>Sitios que conectan</small>
              <b>Diseño + estrategia</b>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
