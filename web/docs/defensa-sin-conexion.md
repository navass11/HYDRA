# Presentación sin conexión

En `/defensa`, el botón «Descargar para usar sin conexión» descarga un ZIP con la presentación de demos preparadas, los anexos, las figuras, las notas de las diapositivas.

1. Descarga el ZIP mientras tienes Internet.
2. Descomprime toda la carpeta `HYDRA-defensa` en el ordenador de la defensa.
3. Abre `INICIO.html` con tu navegador y selecciona la presentación o los anexos.
4. Conserva los HTML y la carpeta `assets` juntos cuando copies el paquete a otro ordenador.

No requiere API, servidor local ni instalación. Las demos muestran resultados preparados. Los enlaces a páginas externas y las herramientas en vivo necesitan Internet. El documento completo del guion es interno y no se incluye en la descarga pública. Las notas de cada diapositiva se abren con P.

## Generación

`npm run build` genera `dist/defensa/hydra-defensa-sin-conexion.zip`. La imagen Docker genera el mismo paquete. `npm run defensa:download` permite regenerarlo después de una compilación Astro.

El empaquetador reúne el JavaScript de cada presentación e inserta el código y los estilos en los HTML para que puedan abrirse mediante `file://`. Copia las imágenes necesarias y cambia la navegación entre presentación, anexos e inicio a archivos locales. Si falta un recurso, la compilación falla.

La ruta histórica `/defensa-offline` se conserva; su nombre visible es «Demos preparadas». Abrir esa URL en Azure sigue requiriendo Internet. La copia descargada funciona sin conexión.
