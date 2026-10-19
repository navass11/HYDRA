/** Enter the reading layout on small screens, preserving the current slide. */
export function enableStudyEntry(options: {
  getCurrent: () => number; group?: string; mode?: string; disabled?: boolean;
}) {
  const link=document.getElementById('study-entry') as HTMLAnchorElement | null;
  if(!link)return;
  const destination=()=>{
    const url=new URL(link.href);
    url.searchParams.set('slide',String(options.getCurrent()));
    url.searchParams.set('grupo',options.group??'principal');
    url.searchParams.set('modo',options.mode??'prepared');
    return url.href;
  };
  link.addEventListener('click',()=>link.href=destination());
  const smallScreen=matchMedia('(max-width: 1100px)').matches ||
    (matchMedia('(pointer: coarse)').matches && matchMedia('(max-width: 1400px)').matches);
  if(!options.disabled && window.self===window.top && smallScreen &&
    new URLSearchParams(location.search).get('vista')!=='presentacion') {
    location.replace(destination());
  }
}
