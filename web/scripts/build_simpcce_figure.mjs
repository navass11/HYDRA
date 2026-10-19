// Replot published numerical values, never digitize or smooth a screenshot.
import fs from 'node:fs';
const root=new URL('../',import.meta.url);
const rows=fs.readFileSync(new URL('public/defensa/data/simpcce-embalse2-tabla25.csv',root),'utf8').trim().split(/\r?\n/).slice(1).map(line=>line.split(',').map(Number));
const months=['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
const ink='#193b45',grid='#d8e3e1',historical='#65777b',teal='#187c82',orange='#bc542a';
const esc=s=>String(s).replaceAll('&','&amp;').replaceAll('<','&lt;');
const x=(i,left)=>left+25+i*58, y=v=>625-v/20*365, pct=(v,h)=>(v/h-1)*100, yp=v=>240+(50-v)/140*385;
let svg=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 80 1750 740" role="img" aria-labelledby="title desc"><title id="title">SIMPCCe: el cambio depende del mes</title><desc id="desc">Embalse 2, valores de la tabla 25 de la guía de Fundación Canal de 2022, página 118. Izquierda: aportaciones medias mensuales históricas y de 2071–2100, en hm³/mes. Derecha: cambios porcentuales calculados respecto a la columna histórica de esa misma tabla. No representa los cuantiles ni la incertidumbre intermodelo.</desc><metadata>${esc(JSON.stringify({source:'https://www.fundacioncanal.com/docs/guia_embalses_cbio_climatico_FundCanal_2022.pdf',table:25,page:118,rows,percentage:'100 * (future / historical - 1)'}))}</metadata><rect width="1750" height="820" rx="12" fill="#fff"/><g font-family="Arial, sans-serif" fill="${ink}"><text x="65" y="57" font-size="35" font-weight="700">SIMPCCe: el cambio depende del mes</text><text x="65" y="110" font-size="25">Embalse 2 de la guía · proyecciones 2071–2100 · medias del conjunto de modelos</text>`;
for(const [cx,color,label,dash]of[[70,historical,'Referencia histórica',true],[460,teal,'RCP 4.5',false],[720,orange,'RCP 8.5',false]])svg+=`<path d="M${cx} 149h48" fill="none" stroke="${color}" stroke-width="5" ${dash?'stroke-dasharray="9 5"':''}/><text x="${cx+62}" y="157" font-size="24">${label}</text>`;
svg+='<text x="100" y="202" font-size="28" font-weight="700">Aportaciones medias mensuales</text><text x="100" y="232" font-size="22">hm³/mes</text><text x="970" y="202" font-size="28" font-weight="700">Cambio respecto a la referencia histórica</text><text x="970" y="232" font-size="22">% · cero significa sin cambio</text>';
for(const v of [0,5,10,15,20])svg+=`<path d="M100 ${y(v)}H805" stroke="${grid}"/><text x="82" y="${y(v)+8}" text-anchor="end" font-size="23">${v}</text>`;
for(const v of [-80,-40,0,40])svg+=`<path d="M970 ${yp(v)}H1675" stroke="${v===0?historical:grid}" stroke-width="${v===0?2:1}"/><text x="950" y="${yp(v)+8}" text-anchor="end" font-size="23">${v>0?'+':''}${v}</text>`;
for(const[col,color,dash]of[[1,historical,true],[2,teal,false],[3,orange,false]]){
 svg+=`<polyline points="${rows.map((r,i)=>`${x(i,100)},${y(r[col])}`).join(' ')}" fill="none" stroke="${color}" stroke-width="4" ${dash?'stroke-dasharray="9 5"':''}/>`;
 rows.forEach((r,i)=>svg+=`<circle cx="${x(i,100)}" cy="${y(r[col])}" r="5" fill="${color}"/>`);
}
rows.forEach((r,i)=>{
 for(const[col,color,offset]of[[2,teal,-16],[3,orange,4]]){const v=pct(r[col],r[1]),yy=yp(v),zero=yp(0);svg+=`<rect x="${x(i,970)+offset}" y="${Math.min(yy,zero)}" width="18" height="${Math.abs(yy-zero)}" fill="${color}"/>`;}
 for(const left of[100,970])svg+=`<text x="${x(i,left)}" y="666" font-size="23" text-anchor="middle">${months[i]}</text>`;
});
svg+='<path d="M65 703H1685" stroke="#d8e3e1"/><text x="65" y="744" font-size="26" font-weight="700">Julio · RCP 8.5: 0,56 → 0,13 hm³/mes (−77 % respecto a la referencia histórica)</text><text x="65" y="789" font-size="21">Fuente: Fundación Canal (2022), tabla 25, p. 118. Elaboración gráfica a partir de los valores publicados.</text></g></svg>';
fs.writeFileSync(new URL('public/defensa/figures/fig_simpcce_regimen_mensual.svg',root),svg);
console.log('SIMPCCe: figura SVG generada con 36 valores publicados.');
