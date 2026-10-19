/** A visible presentation may ask the browser to prevent screen dimming. */
export function keepPresentationAwake() {
  const buttons=Array.from(document.querySelectorAll<HTMLButtonElement>('[data-screen-awake]'));
  if(!buttons.length || window.self!==window.top)return;
  type Lock={released:boolean;release:()=>Promise<void>;addEventListener:(event:string,listener:()=>void)=>void};
  const api=(navigator as Navigator & {wakeLock?:{request:(type:'screen')=>Promise<Lock>}}).wakeLock;
  let lock:Lock|null=null, enabled=true, pending=false, leaving=false;
  const update=(message:string)=>buttons.forEach(button=>{
    button.textContent=message;button.setAttribute('aria-pressed',String(Boolean(lock&&!lock.released)));
    button.title='Evita que se apague la pantalla mientras esta pestaña esté visible. El navegador puede liberar el bloqueo al cambiar de aplicación.';
  });
  if(!api){buttons.forEach(button=>{button.disabled=true;button.textContent='Pantalla: no disponible';button.title='Este navegador no permite mantener la pantalla encendida. Revisa el bloqueo automático del dispositivo.';});return;}
  async function acquire(){
    if(!enabled||leaving||pending||document.visibilityState!=='visible'||(lock&&!lock.released))return;
    pending=true;
    try{
      const acquired=await api!.request('screen');
      if(!enabled||leaving){await acquired.release();return;}
      lock=acquired;update('Pantalla activa');
      acquired.addEventListener('release',()=>{if(lock===acquired){lock=null;update(enabled?'Activar pantalla':'Pantalla automática');}});
    }catch{update('Activar pantalla');buttons.forEach(button=>button.title='Toca para volver a solicitar el bloqueo de pantalla. Puede no estar disponible por ahorro de batería o por restricciones del navegador.');}
    finally{pending=false;}
  }
  buttons.forEach(button=>button.addEventListener('click',()=>{
    if(lock&&!lock.released){enabled=false;void lock.release();update('Pantalla automática');}
    else{enabled=true;void acquire();}
  }));
  document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible')void acquire();});
  document.addEventListener('pointerup',()=>{if(enabled&&!lock)void acquire();});
  window.addEventListener('pagehide',()=>{leaving=true;void lock?.release();});
  window.addEventListener('pageshow',()=>{leaving=false;void acquire();});
  update('Activar pantalla');void acquire();
}
