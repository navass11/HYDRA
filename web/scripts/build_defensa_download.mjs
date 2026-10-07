import { readFile, writeFile, mkdir, cp, mkdtemp, rm, stat } from 'node:fs/promises';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { build } from 'esbuild';
const root=resolve(import.meta.dirname,'..'), dist=join(root,'dist');
const temporary=await mkdtemp(join(tmpdir(),'hydra-defensa-')), bundle=join(temporary,'HYDRA-defensa');
const routes=new Map([['defensa-offline','presentacion.html'],['defensa-anexos','anexos.html'],['defensa-respaldo','respaldo.html'],['defensa','INICIO.html']]);
const assets=new Set();
const normalize=url=>url.replace(/^\/HYDRA\//,'/');
const local=url=>join(dist,normalize(url).replace(/^\//,''));
function rewrite(url){
 if(!url.startsWith('/')||url.startsWith('//'))return url;
 const normalized=normalize(url), match=normalized.match(/^([^?#]*)(.*)$/), path=match[1], suffix=match[2];
 const route=routes.get(path.replace(/^\/|\/$/g,''));
 if(route)return route+suffix;
 if(path==='/defensa/hydra-defensa-sin-conexion.zip'||! /\.[a-z0-9]+$/i.test(path))return 'INICIO.html';
 assets.add(path);return `assets${path}${suffix}`;
}
// Keep URLs unquoted: this also processes CSS inside double-quoted HTML style
// attributes, where inserting another double quote would break the markup.
const css=text=>text.replace(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g,(_,q,url)=>`url(${rewrite(url)})`);
try{
 await mkdir(bundle,{recursive:true});
 for(const [route,name] of routes){
  if(route==='defensa')continue;
  let html=await readFile(join(dist,route,'index.html'),'utf8');
  for(const m of [...html.matchAll(/<script\b[^>]*\bsrc="([^"]+)"[^>]*><\/script>/g)]){
   const result=await build({entryPoints:[local(m[1])],bundle:true,write:false,format:'iife',target:'es2020',minify:true});
   html=html.replace(m[0],()=>`<script type="module">${result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script')}</script>`);
  }
  for(const m of [...html.matchAll(/<link\b[^>]*href="([^"]+)"[^>]*>/g)]){
   if(/rel="stylesheet"/.test(m[0])){
    const stylesheet=m[1].startsWith('/')?css(await readFile(local(m[1]),'utf8')):'';
    html=html.replace(m[0],()=>`<style>${stylesheet}</style>`);
   }
   else if(/rel="(?:preconnect|modulepreload)"/.test(m[0]))html=html.replace(m[0],'');
  }
  html=html.replace(/\b(src|href)="([^"]+)"/g,(_,attr,url)=>`${attr}="${rewrite(url)}"`);
  html=css(html).replace(/>Descargar<\/a>/g,'>Inicio</a>');
  await writeFile(join(bundle,name),html);
 }
 for(const asset of assets){
  const destination=join(bundle,'assets',asset.slice(1));
  await mkdir(dirname(destination),{recursive:true});
  await cp(local(asset),destination); // Missing assets fail the build.
 }
 await writeFile(join(bundle,'LEEME.txt'),'Descomprime toda la carpeta HYDRA-defensa y abre INICIO.html en el navegador. No necesitas Internet ni servidor. Conserva assets junto a los HTML. Las demos son capturas preparadas. Los enlaces externos requieren Internet. Las notas se abren con P.\n');
 await writeFile(join(bundle,'INICIO.html'),`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>HYDRA · Defensa sin conexión</title><style>body{margin:0;background:#123b4a;color:#eef5f2;font:18px/1.6 system-ui,sans-serif}main{max-width:760px;margin:8vh auto;padding:24px}h1{line-height:1.15}a{color:#b8e2d9}nav{display:flex;flex-wrap:wrap;gap:20px;margin:32px 0}a:focus-visible{outline:3px solid #e1a184;outline-offset:5px}</style><main><h1>Defensa de tesis · HYDRA</h1><p>Copia completa para usar sin conexión. Presentación, figuras, demos preparadas guardadas en tu ordenador.</p><nav><a href="presentacion.html">Abrir presentación</a><a href="anexos.html">Abrir anexos</a></nav><p>Usa las flechas para cambiar de diapositiva, P para ver las notas y F para activar pantalla completa.</p><p>Las herramientas en vivo y los enlaces externos requieren Internet.</p></main></html>`);
 const output=join(dist,'defensa/hydra-defensa-sin-conexion.zip');await mkdir(dirname(output),{recursive:true});
 execFileSync('python3',['-c','import pathlib,sys,zipfile\nroot=pathlib.Path(sys.argv[1])\nwith zipfile.ZipFile(sys.argv[2],"w",zipfile.ZIP_DEFLATED) as z:\n for p in sorted(root.rglob("*")):\n  if p.is_file(): z.write(p,p.relative_to(root.parent))',bundle,output]);
 console.log(`Offline defense: ${Math.round((await stat(output)).size/1024/1024)} MB`);
}finally{await rm(temporary,{recursive:true,force:true});}
