"use client";
import {useEffect} from "react";

export default function ScrollMotion(){
  useEffect(()=>{
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches)return;
    const sectionTargets=[...document.querySelectorAll<HTMLElement>("main > section:not(.hero-campaign), footer")];
    const itemTargets=[...document.querySelectorAll<HTMLElement>(".product-card,.proof-grid article,.content-grid article,.faq-list details")];
    [...sectionTargets,...itemTargets].forEach((element,index)=>{
      element.dataset.reveal="";
      if(itemTargets.includes(element))element.style.setProperty("--reveal-delay",`${(index%4)*70}ms`);
    });
    document.documentElement.classList.add("scroll-motion-ready");
    const observer=new IntersectionObserver(entries=>{
      entries.forEach(entry=>{
        if(!entry.isIntersecting)return;
        (entry.target as HTMLElement).dataset.visible="";
        observer.unobserve(entry.target);
      });
    },{rootMargin:"0px 0px -8% 0px",threshold:.08});
    [...sectionTargets,...itemTargets].forEach(element=>observer.observe(element));
    return()=>observer.disconnect();
  },[]);
  return null;
}
