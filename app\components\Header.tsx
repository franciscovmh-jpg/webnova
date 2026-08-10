"use client";
import { useEffect, useState } from "react";

const links = [["Inicio","inicio"],["Servicios","servicios"],["Proyectos","proyectos"],["Nosotros","nosotros"],["Contacto","contacto"]];
export function Logo(){return <a className="logo" href="#inicio" aria-label="Austral Web, inicio"><span>AUSTRAL</span><strong>WEB</strong></a>}
export function selectService(service:string){window.dispatchEvent(new CustomEvent("austral-web:service",{detail:service}))}
export default function Header(){
 const [open,setOpen]=useState(false); const [scrolled,setScrolled]=useState(false); const [active,setActive]=useState("inicio");
 useEffect(()=>{document.body.classList.toggle("menu-open",open);return()=>document.body.classList.remove("menu-open")},[open]);
 useEffect(()=>{const onScroll=()=>setScrolled(window.scrollY>18);onScroll();window.addEventListener("scroll",onScroll,{passive:true});const ids=links.map(x=>x[1]);const observer=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting)setActive(e.target.id)}),{rootMargin:"-35% 0px -55%"});ids.forEach(id=>{const el=document.getElementById(id);if(el)observer.observe(el)});return()=>{window.removeEventListener("scroll",onScroll);observer.disconnect()}},[]);
 return <>
  <div className="promo">🚀 Oferta de lanzamiento: crea tu página web desde $150.000 CLP <span>— por tiempo limitado</span></div>
  <header className={`header ${scrolled?"scrolled":""}`}><div className="nav-wrap"><Logo/><button className={`menu ${open?"active":""}`} aria-label={open?"Cerrar menú":"Abrir menú"} aria-expanded={open} aria-controls="main-navigation" onClick={()=>setOpen(!open)}><i/><i/><i/></button>
   <nav id="main-navigation" className={open?"nav open":"nav"} aria-label="Navegación principal">{links.map(([label,id])=><a className={active===id?"active":""} aria-current={active===id?"page":undefined} key={id} href={`#${id}`} onClick={()=>setOpen(false)}>{label}</a>)}<a className="btn small" href="#contacto" onClick={()=>{selectService("Creación web");setOpen(false)}}>Solicitar cotización</a></nav>
  </div></header>
 </>
}
