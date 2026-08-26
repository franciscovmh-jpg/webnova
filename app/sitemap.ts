import type{MetadataRoute}from"next";import{locales}from"./i18n/config";
const origin="https://shopfidoria.com";
const paths=["","shop","product/drive-organizer","product/travel-console","product/clean-kit","about","support","contact","shipping","returns","tracking","cart","privacy","terms"];
export default function sitemap():MetadataRoute.Sitemap{
  return paths.flatMap(path=>locales.map(locale=>{
    const suffix=path?`/${path}`:"";
    const languages=Object.fromEntries(locales.map(code=>[code,`${origin}/${code}${suffix}`]));
    const priority=path===""?1:(path==="shop"?0.9:0.7);
    return{url:`${origin}/${locale}${suffix}`,lastModified:new Date(),changeFrequency:path.startsWith("product")?"weekly":"monthly",priority,alternates:{languages:{...languages,"x-default":`${origin}/en${suffix}`}}};
  }));
}
