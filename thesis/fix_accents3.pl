#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
binmode(STDIN,  ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');
binmode(STDERR, ':encoding(UTF-8)');

# === "mas" adverb (always "más" in this thesis context) ===
s/\bmas de /más de /g;
s/\bmas del /más del /g;
s/\bmas que /más que /g;
s/\bmas alla\b/más allá/g;
s/\bmas bien\b/más bien/g;
# numeric: "mas de 0,9 m" etc.
s/\bmas (\d)/más $1/g;
s/\bMas de /Más de /g;
s/\bMas del /Más del /g;
s/\bMas que /Más que /g;

# === "área" singular (only plural was in pass 2) ===
s/\barea\b/área/g;
s/\bArea\b/Área/g;

# === "están" (always needs accent) ===
s/\bestan\b/están/g;
s/\bEstan\b/Están/g;

# === Past-tense verb forms (unambiguous in this text) ===
s/\bcauso\b/causó/g;          s/\bCauso\b/Causó/g;
s/\bdepresion\b/depresión/g;  s/\bDepresion\b/Depresión/g;
s/\bemision\b/emisión/g;      s/\bEmision\b/Emisión/g;
s/\bemisiones\b/emisiones/g;

# === Other missing accents ===
s/\bvictimas\b/víctimas/g;    s/\bvictima\b/víctima/g;
s/\bDemocratica\b/Democrática/g;  s/\bdemocrática\b/democrática/g;
s/\bDemocratico\b/Democrático/g;  s/\bdemocratico\b/democrático/g;
s/\bsolidos\b/sólidos/g;      s/\bsolido\b/sólido/g;
s/\bsolida\b/sólida/g;        s/\bsolidas\b/sólidas/g;
s/\bmetodologicamente\b/metodológicamente/g;
s/\bPublicas\b/Públicas/g;    s/\bpublicas\b/públicas/g;
s/\bPublicos\b/Públicos/g;    s/\bpublicos\b/públicos/g;
s/\brecord\b/récord/g;
s/\bvolumenes\b/volúmenes/g;
s/\bvolumen\b/volumen/g;
s/\btraves\b/través/g;        s/\bTraves\b/Través/g;
s/\batraves\b/través/g;
s/\bexito\b/éxito/g;          s/\bExito\b/Éxito/g;
s/\benfoque\b/enfoque/g;
s/\bhectarea\b/hectárea/g;    s/\bhectareas\b/hectáreas/g;
s/\bkilometro\b/kilómetro/g;  s/\bkilometros\b/kilómetros/g;
s/\bKilometro\b/Kilómetro/g;  s/\bKilometros\b/Kilómetros/g;
s/\bcoruna\b/Coruña/g;        s/\bCoruna\b/Coruña/g;
s/\bEspa.a\b/España/g;
s/\bRepu.blica\b/República/g;
s/\bsignificativamente\b/significativamente/g;
s/\bfacilmente\b/fácilmente/g;
s/\bfisicamente\b/físicamente/g;
s/\bobviamente\b/obviamente/g;
s/\bsecuencia\b/secuencia/g;
s/\bfuera\b/fuera/g;
s/\bcontiene\b/contiene/g;
s/\bcontienen\b/contienen/g;
s/\bpermiten\b/permiten/g;
s/\bproviene\b/proviene/g;
s/\bprovienen\b/provienen/g;
s/\btemporada\b/temporada/g;
s/\binterfaz\b/interfaz/g;
s/\binterfaces\b/interfaces/g;
s/\bseccion\b/sección/g;      s/\bSeccion\b/Sección/g;
s/\banalisis\b/análisis/g;    s/\bAnalisis\b/Análisis/g;
s/\bsolidos\b/sólidos/g;
s/\bpractico\b/práctico/g;    s/\bpractica\b/práctica/g;
s/\bpracticos\b/prácticos/g;  s/\bpracticas\b/prácticas/g;
s/\bResu.men\b/Resumen/g;
s/\bmetadatos\b/metadatos/g;
s/\bocupacion\b/ocupación/g;  s/\bOcupacion\b/Ocupación/g;
s/\bextension\b/extensión/g;  s/\bExtension\b/Extensión/g;
s/\bescenario\b/escenario/g;
s/\bhumedos\b/húmedos/g;      s/\bhúmedas\b/húmedas/g;
s/\bhumedo\b/húmedo/g;        s/\bhúmeda\b/húmeda/g;
s/\bhumedas\b/húmedas/g;
s/\bhumeda\b/húmeda/g;
s/\bsecos\b/secos/g;
s/\bregimenes\b/regímenes/g;  s/\bregimen\b/régimen/g;
s/\bRegimenón\b/Régimen/g;    s/\bRegimen\b/Régimen/g;
s/\bastro\b/astro/g;
s/\borografico\b/orográfico/g;
s/\bflujo\b/flujo/g;
s/\btecnica\b/técnica/g;      s/\btecnicas\b/técnicas/g;
s/\btecnico\b/técnico/g;      s/\btecnicos\b/técnicos/g;
s/\bTecnica\b/Técnica/g;      s/\bTecnicas\b/Técnicas/g;
s/\bTecnico\b/Técnico/g;      s/\bTecnicos\b/Técnicos/g;
s/\bordenacion\b/ordenación/g;
s/\bconexion\b/conexión/g;    s/\bConexion\b/Conexión/g;
s/\bpuncion\b/punción/g;
s/\bvarianza\b/varianza/g;

1;
