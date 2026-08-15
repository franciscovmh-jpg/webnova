import { siteConfig } from "../config";
import { Logo } from "./Header";
export default function Footer() {
  return (
    <footer>
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>Diseñamos. Desarrollamos. Renovamos.</p>
        </div>
        <div>
          <b>Explora</b>
          <a href="#servicios">Servicios</a>
          <a href="#proyectos">Proyectos</a>
          <a href="/cotizar">Cotización</a>
        </div>
        <div>
          <b>Servicios</b>
          <a href="/cotizar?servicio=Creaci%C3%B3n%20web">Creación web</a>
          <a href="/cotizar?servicio=Redise%C3%B1o">Rediseño</a>
          <a href="/cotizar?servicio=Mantenimiento">Mantenimiento</a>
        </div>
        <div>
          <b>Conecta</b>
          <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>
          {siteConfig.socials.instagram ? (
            <a
              href={siteConfig.socials.instagram}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram ↗
            </a>
          ) : (
            <span>Instagram · Próximamente</span>
          )}
        </div>
      </div>
      <div className="container footer-bottom">
        <span>
          Copyright © {new Date().getFullYear()} FIDORIA. Todos los derechos reservados.
        </span>
        <span>Hecho con intención en Chile 🇨🇱</span>
      </div>
    </footer>
  );
}
