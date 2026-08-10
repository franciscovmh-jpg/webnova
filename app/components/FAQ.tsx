"use client";
import { useState } from "react";
const faqs=[
 ["¿Cuánto demora desarrollar una página?","Depende del tamaño del sitio, la disponibilidad del contenido y las funcionalidades necesarias. Al cotizar, definimos un alcance y una estimación clara para tu proyecto."],
 ["¿La página funciona en celulares?","Sí. Todos los sitios se diseñan para adaptarse a computadores, tablets y celulares."],
 ["¿Puedo modificar mi página posteriormente?","Sí. Podemos evaluar nuevas secciones, contenidos o funcionalidades cuando tu negocio lo necesite."],
 ["¿Fidoria puede renovar una página existente?","Sí. Revisamos el sitio actual y proponemos mejoras visuales, de estructura, experiencia y rendimiento."],
 ["¿Puedo utilizar mi propio dominio?","Sí. Si ya tienes uno, puede conectarse al publicar. Si todavía no, te orientaremos cuando llegue el momento, sin comprarlo durante esta etapa local."],
 ["¿Qué incluye la oferta de $150.000?","Incluye una página web seleccionada de alcance definido con diseño moderno, adaptación móvil, secciones principales, contacto, SEO básico, configuración y ajustes finales. El alcance exacto se confirma antes de comenzar."]
];
export default function FAQ(){const [open,setOpen]=useState(0);return <section className="section" id="faq"><div className="container faq-layout"><div><span className="kicker">Preguntas frecuentes</span><h2>Resolvemos tus dudas</h2><p>Si no encuentras lo que buscas, cuéntanos sobre tu proyecto.</p><a className="text-link" href="/cotizar">Hacer otra pregunta →</a></div><div className="accordion">{faqs.map(([q,a],i)=>{const panel=`faq-panel-${i}`,button=`faq-button-${i}`;return <article key={q} className={open===i?"active":""}><button id={button} onClick={()=>setOpen(open===i?-1:i)} aria-expanded={open===i} aria-controls={panel}><span>{q}</span><b aria-hidden="true">{open===i?"−":"+"}</b></button><div id={panel} role="region" aria-labelledby={button} className="answer" aria-hidden={open!==i}><p>{a}</p></div></article>})}</div></div></section>}
