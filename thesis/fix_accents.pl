#!/usr/bin/env perl
use strict;
use warnings;
use utf8;
binmode(STDIN,  ':encoding(UTF-8)');
binmode(STDOUT, ':encoding(UTF-8)');
binmode(STDERR, ':encoding(UTF-8)');

# ============================================================
# TYPOS (wrong letters, not just missing accent)
# ============================================================
s/correcccion/corrección/g;
s/decici[oó]n/decisión/g;
s/revici[oó]n/revisión/g;
s/verci[oó]n/versión/g;

# ============================================================
# USER'S EXPLICIT LIST
# ============================================================
s/\bfilosofia\b/filosofía/g;    s/\bFilosofia\b/Filosofía/g;
s/\btuneles\b/túneles/g;        s/\bTuneles\b/Túneles/g;
s/\bpaises\b/países/g;          s/\bPaises\b/Países/g;
s/\bgeoestadistica\b/geoestadística/g; s/\bGeoestadistica\b/Geoestadística/g;
s/\bgeoestadistico\b/geoestadístico/g;
s/\bespecificacion\b/especificación/g; s/\bEspecificacion\b/Especificación/g;
s/\bSintesis\b/Síntesis/g;      s/\bsintesis\b/síntesis/g;
s/\brapidas\b/rápidas/g;
s/\brapida\b/rápida/g;
s/\brapidos\b/rápidos/g;
s/\brapido\b/rápido/g;
s/\bRapida\b/Rápida/g;          s/\bRapidas\b/Rápidas/g;
s/\bminimas\b/mínimas/g;        s/\bminima\b/mínima/g;
s/\bminimos\b/mínimos/g;        s/\bminimo\b/mínimo/g;
s/\bMinimos\b/Mínimos/g;        s/\bMinimo\b/Mínimo/g;
s/\bhidrofisica\b/hidrofísica/g; s/\bHidrofisica\b/Hidrofísica/g;
s/\bhidrofisico\b/hidrofísico/g;
s/\bincorporacion\b/incorporación/g; s/\bIncorporacion\b/Incorporación/g;
s/\bunicamente\b/únicamente/g;
s/\bcatalogos\b/catálogos/g;    s/\bcatalogo\b/catálogo/g;
s/\bCatalogo\b/Catálogo/g;
# valida/valido used as ADJECTIVE (not as 3rd-person-singular verb)
# Safe context: "versión válida", "datos válidos" but we must avoid "esto valida"
# Solution: replace with trailing adjective contexts only
# Actually too risky to do globally — skip valida/valido for now
s/\bValidas\b/Válidas/g;        s/\bValidos\b/Válidos/g;

# ============================================================
# SECTION / SUBSECTION TITLES (these are unambiguous)
# ============================================================
s/\\section\{Motivacion\b/\\section{Motivación/g;
s/\\section\{Vision general\}/\\section{Visión general}/g;
s/\\section\{Sintesis de la validaci/\\section{Síntesis de la validaci/g;
s/\\subsection\{Conexion con HYDRA\}/\\subsection{Conexión con HYDRA}/g;
s/\\subsection\{Notebooks como especificacion/\\subsection{Notebooks como especificación/g;
s/\\subsection\{Interpolaci[oó]n geoestadistica\}/\\subsection{Interpolación geoestadística}/g;
s/\\section\{Metadatos minimos\}/\\section{Metadatos mínimos}/g;
s/\\chapter\{Referencia rapida/\\chapter{Referencia rápida/g;
s/\\paragraph\{Sintesis\./\\paragraph{Síntesis./g;
s/\\paragraph\{Conexion\b/\\paragraph{Conexión/g;
s|\\section\{An.lisis de frecuencia regional y geoestadistica\}|\\section{Análisis de frecuencia regional y geoestadística}|g;

# Also fix inline vision/conexion/sintesis/motivacion in body text (title-case context)
s/\bConexion\b/Conexión/g;      s/\bconexion\b/conexión/g;
s/\bMotivacion\b/Motivación/g;  s/\bmotivacion\b/motivación/g;
s/\bVision\b/Visión/g;          s/\bvision\b/visión/g;

# ============================================================
# -CION → -CIÓN (singular nominal forms — unambiguous)
# ============================================================
s/\bestacion\b/estación/g;      s/\bEstacion\b/Estación/g;
s/\bprecipitacion\b/precipitación/g;  s/\bPrecipitacion\b/Precipitación/g;
s/\bgeneracion\b/generación/g;  s/\bGeneracion\b/Generación/g;
s/\belevacion\b/elevación/g;    s/\bElevacion\b/Elevación/g;
s/\bagrupacion\b/agrupación/g;  s/\bAgrupacion\b/Agrupación/g;
s/\bSimulacion\b/Simulación/g;  s/\bsimulacion\b/simulación/g;
s/\binundacion\b/inundación/g;  s/\bInundacion\b/Inundación/g;
s/\bevaluacion\b/evaluación/g;  s/\bEvaluacion\b/Evaluación/g;
s/\bseleccion\b/selección/g;    s/\bSeleccion\b/Selección/g;
s/\baplicacion\b/aplicación/g;  s/\bAplicacion\b/Aplicación/g;
s/\bcondicion\b/condición/g;    s/\bCondicion\b/Condición/g;
s/\bformulacion\b/formulación/g; s/\bFormulacion\b/Formulación/g;
s/\bestimacion\b/estimación/g;  s/\bEstimacion\b/Estimación/g;
s/\bcomparacion\b/comparación/g; s/\bComparacion\b/Comparación/g;
s/\bpresentacion\b/presentación/g; s/\bPresentacion\b/Presentación/g;
s/\brelacion\b/relación/g;      s/\bRelacion\b/Relación/g;
s/\binformacion\b/información/g; s/\bInformacion\b/Información/g;
s/\bimplementacion\b/implementación/g; s/\bImplementacion\b/Implementación/g;
s/\bconfiguracion\b/configuración/g; s/\bConfiguracion\b/Configuración/g;
s/\bautenticacion\b/autenticación/g; s/\bAutenticacion\b/Autenticación/g;
s/\borquestacion\b/orquestación/g; s/\bOrquestacion\b/Orquestación/g;
s/\bvalidacion\b/validación/g;  s/\bValidacion\b/Validación/g;
s/\brealizacion\b/realización/g; s/\bRealizacion\b/Realización/g;
s/\bposicion\b/posición/g;      s/\bPosicion\b/Posición/g;
s/\bpublicacion\b/publicación/g; s/\bPublicacion\b/Publicación/g;
s/\bextraccion\b/extracción/g;  s/\bExtraccion\b/Extracción/g;
s/\binstalacion\b/instalación/g; s/\bInstalacion\b/Instalación/g;
s/\bejecucion\b/ejecución/g;    s/\bEjecucion\b/Ejecución/g;
s/\breduccion\b/reducción/g;    s/\bReduccion\b/Reducción/g;
s/\bobtencion\b/obtención/g;    s/\bObtencion\b/Obtención/g;
s/\btransformacion\b/transformación/g; s/\bTransformacion\b/Transformación/g;
s/\bcontribucion\b/contribución/g; s/\bContribucion\b/Contribución/g;
s/\binvestigacion\b/investigación/g; s/\bInvestigacion\b/Investigación/g;
s/\bmedicion\b/medición/g;      s/\bMedicion\b/Medición/g;
s/\bproteccion\b/protección/g;  s/\bProteccion\b/Protección/g;
s/\bdisminucion\b/disminución/g; s/\bDisminucion\b/Disminución/g;
s/\bclasificacion\b/clasificación/g; s/\bClasificacion\b/Clasificación/g;
s/\bnormalizacion\b/normalización/g; s/\bNormalizacion\b/Normalización/g;
s/\bparametrizacion\b/parametrización/g;
s/\brepresentacion\b/representación/g; s/\bRepresentacion\b/Representación/g;
s/\biteracion\b/iteración/g;    s/\bIteracion\b/Iteración/g;
s/\bcomunicacion\b/comunicación/g; s/\bComunicacion\b/Comunicación/g;
s/\badaptacion\b/adaptación/g;  s/\bAdaptacion\b/Adaptación/g;
s/\baportacion\b/aportación/g;  s/\bAportacion\b/Aportación/g;
s/\boptimizacion\b/optimización/g; s/\bOptimizacion\b/Optimización/g;
s/\bmodelizacion\b/modelización/g; s/\bModelizacion\b/Modelización/g;
s/\blocalizacion\b/localización/g; s/\bLocalizacion\b/Localización/g;
s/\bdesagregacion\b/desagregación/g;
s/\bconsolidacion\b/consolidación/g;
s/\bemulacion\b/emulación/g;    s/\bEmulacion\b/Emulación/g;
s/\bregulacion\b/regulación/g;  s/\bRegulacion\b/Regulación/g;
s/\binstruccion\b/instrucción/g; s/\bInstruccion\b/Instrucción/g;
s/\bconstruccion\b/construcción/g; s/\bConstruccion\b/Construcción/g;
s/\bpuntuacion\b/puntuación/g;  s/\bPuntuacion\b/Puntuación/g;
s/\bprediccion\b/predicción/g;  s/\bPrediccion\b/Predicción/g;
s/\bvisualizacion\b/visualización/g; s/\bVisualizacion\b/Visualización/g;
s/\bvariacion\b/variación/g;    s/\bVariacion\b/Variación/g;
s/\binterpolacion\b/interpolación/g; s/\bInterpolacion\b/Interpolación/g;
s/\bexplicacion\b/explicación/g; s/\bExplicacion\b/Explicación/g;
s/\bsituacion\b/situación/g;    s/\bSituacion\b/Situación/g;
s/\bcorrelacion\b/correlación/g; s/\bCorrelacion\b/Correlación/g;
s/\bautomatizacion\b/automatización/g; s/\bAutomatizacion\b/Automatización/g;
s/\bedicion\b/edición/g;        s/\bEdicion\b/Edición/g;
s/\borganizacion\b/organización/g; s/\bOrganizacion\b/Organización/g;
s/\bintegracion\b/integración/g; s/\bIntegracion\b/Integración/g;
s/\boperacion\b/operación/g;    s/\bOperacion\b/Operación/g;
s/\bcalibracion\b/calibración/g; s/\bCalibracion\b/Calibración/g;
s/\bautorizacion\b/autorización/g;
s/\bdefinicion\b/definición/g;  s/\bDefinicion\b/Definición/g;
s/\bpoblacion\b/población/g;    s/\bPoblacion\b/Población/g;
s/\bcombinacion\b/combinación/g; s/\bCombinacion\b/Combinación/g;
s/\bponderacion\b/ponderación/g; s/\bPonderacion\b/Ponderación/g;
s/\basignacion\b/asignación/g;  s/\bAsignacion\b/Asignación/g;
s/\btransicion\b/transición/g;  s/\bTransicion\b/Transición/g;
s/\binteraccion\b/interacción/g; s/\bInteraccion\b/Interacción/g;
s/\belaboracion\b/elaboración/g; s/\bElaboracion\b/Elaboración/g;
s/\bnotacion\b/notación/g;      s/\bNotacion\b/Notación/g;
s/\bdocumentacion\b/documentación/g; s/\bDocumentacion\b/Documentación/g;
s/\bdescomposicion\b/descomposición/g;
s/\bdescomposicion\b/descomposición/g;
s/\bcorreccion\b/corrección/g;  s/\bCorreccion\b/Corrección/g;
s/\bpropagacion\b/propagación/g;
s/\bidentificacion\b/identificación/g; s/\bIdentificacion\b/Identificación/g;
s/\bdemarcacion\b/demarcación/g;
s/\bdiscretizacion\b/discretización/g;
s/\bdesagregacion\b/desagregación/g;
s/\bcomputacion\b/computación/g; s/\bComputacion\b/Computación/g;

# ============================================================
# ADJECTIVES WITH MISSING ACCENT (-ico/-ica)
# ============================================================
s/\bestadistico\b/estadístico/g; s/\bEstadistico\b/Estadístico/g;
s/\bestadistica\b/estadística/g; s/\bEstadistica\b/Estadística/g;
s/\bestadisticos\b/estadísticos/g;
s/\bestadisticas\b/estadísticas/g;
s/\bpluviometrica\b/pluviométrica/g;
s/\bpluviometricas\b/pluviométricas/g;
s/\bpluviometrico\b/pluviométrico/g;
s/\bpluviometricos\b/pluviométricos/g;
s/\bpluviometro\b/pluviómetro/g; s/\bPluviometro\b/Pluviómetro/g;
s/\bpluviometros\b/pluviómetros/g;
s/\bhidrica\b/hídrica/g;        s/\bhidrico\b/hídrico/g;
s/\bhidricas\b/hídricas/g;      s/\bhidricos\b/hídricos/g;
s/\bhidroelectrica\b/hidroeléctrica/g;
s/\bhidroelectrico\b/hidroeléctrico/g;
s/\bhidroelectrica\b/hidroel\x{e9}ctrica/g;
s/\bhidroelectrico\b/hidroel\x{e9}ctrico/g;
s/\bhidroelectricas\b/hidroel\x{e9}ctricas/g;
s/\bhidroelectricos\b/hidroel\x{e9}ctricos/g;
s/\beliptica\b/elíptica/g;      s/\beliptico\b/elíptico/g;
s/\belipticas\b/elípticas/g;    s/\belipticos\b/elípticos/g;
s/\basimetrica\b/asimétrica/g;  s/\basimetrico\b/asimétrico/g;
s/\basimetricas\b/asimétricas/g; s/\basimetricos\b/asimétricos/g;
s/\btematica\b/temática/g;      s/\bTematica\b/Temática/g;
s/\btematico\b/temático/g;      s/\bTematico\b/Temático/g;
s/\btematicas\b/temáticas/g;    s/\btematicos\b/temáticos/g;
s/\bprobabilistico\b/probabilístico/g;
s/\bprobabilistica\b/probabilística/g;
s/\bprobabilisticos\b/probabilísticos/g;
s/\bprobabilisticas\b/probabilísticas/g;
s/\bperiodico\b/periódico/g;    s/\bperiodica\b/periódica/g;
s/\bperiodicos\b/periódicos/g;  s/\bperiodicas\b/periódicas/g;
s/\btopografica\b/topográfica/g; s/\bTopografica\b/Topográfica/g;
s/\btopograficas\b/topográficas/g;
s/\btopografico\b/topográfico/g; s/\btopograficos\b/topográficos/g;
s/\borografica\b/orográfica/g;  s/\borograficas\b/orográficas/g;
s/\borografico\b/orográfico/g;
s/\bgeografico\b/geográfico/g;  s/\bgeografica\b/geográfica/g;
s/\bgeograficos\b/geográficos/g; s/\bgeograficas\b/geográficas/g;
s/\bteorica\b/teórica/g;        s/\bteorico\b/teórico/g;
s/\bteoricos\b/teóricos/g;      s/\bteorico\b/teórico/g;
s/\bteoricos\b/teóricos/g;
s/\bmatematica\b/matemática/g;  s/\bmatematico\b/matemático/g;
s/\bmatematicos\b/matemáticos/g; s/\bmatematicas\b/matemáticas/g;
s/\bsistematica\b/sistemática/g; s/\bsistematico\b/sistemático/g;
s/\bsistematicos\b/sistemáticos/g; s/\bsistematicas\b/sistemáticas/g;
s/\bbasico\b/básico/g;          s/\bbasica\b/básica/g;
s/\bbasicos\b/básicos/g;        s/\bbasicas\b/básicas/g;
s/\bBasico\b/Básico/g;          s/\bBasica\b/Básica/g;
s/\bfisico\b/físico/g;          s/\bFisico\b/Físico/g;
s/\bfisica\b/física/g;          s/\bFisica\b/Física/g;
s/\bfisicos\b/físicos/g;        s/\bfisicas\b/físicas/g;
s/\bpractico\b/práctico/g;      s/\bPractico\b/Práctico/g;
s/\bpractica\b/práctica/g;      s/\bPractica\b/Práctica/g;
s/\bpracticos\b/prácticos/g;    s/\bpracticas\b/prácticas/g;
s/\bcritico\b/crítico/g;        s/\bCritico\b/Crítico/g;
s/\bcritica\b/crítica/g;        s/\bCritica\b/Crítica/g;
s/\bcriticos\b/críticos/g;      s/\bcriticas\b/críticas/g;
s/\blogico\b/lógico/g;          s/\bLogico\b/Lógico/g;
s/\blogica\b/lógica/g;          s/\bLogica\b/Lógica/g;
s/\blogicos\b/lógicos/g;        s/\blogicas\b/lógicas/g;
s/\bautomatico\b/automático/g;  s/\bAutomatico\b/Automático/g;
s/\bautomatica\b/automática/g;
s/\bautomaticos\b/automáticos/g; s/\bautomaticas\b/automáticas/g;
s/\bunico\b/único/g;            s/\bUnico\b/Único/g;
s/\bunica\b/única/g;
s/\bunicos\b/únicos/g;          s/\bunicas\b/únicas/g;
s/\bultima\b/última/g;          s/\bUltima\b/Última/g;
s/\bultimas\b/últimas/g;
s/\bultimos\b/últimos/g;        s/\bultimo\b/último/g;
s/\bUltimo\b/Último/g;
s/\bdinamico\b/dinámico/g;      s/\bdinamica\b/dinámica/g;
s/\bdinamicos\b/dinámicos/g;    s/\bdinamicas\b/dinámicas/g;
s/\bespecifico\b/específico/g;  s/\bEspecifico\b/Específico/g;
s/\bespecifica\b/específica/g;
s/\bespecificos\b/específicos/g; s/\bespecificas\b/específicas/g;
s/\bsimbolico\b/simbólico/g;    s/\bsimbolica\b/simbólica/g;
s/\bgenerico\b/genérico/g;      s/\bgenerica\b/genérica/g;
s/\bgenericos\b/genéricos/g;    s/\bgenericas\b/genéricas/g;

# ============================================================
# OTHER COMMON MISSING ACCENTS
# ============================================================
s/\borografia\b/orografía/g;    s/\bOrografia\b/Orografía/g;
s/\bhistorico\b/histórico/g;    s/\bHistorico\b/Histórico/g;
s/\bhistorica\b/histórica/g;    s/\bHistorica\b/Histórica/g;
s/\bhistoricos\b/históricos/g;
s/\bhistoricas\b/históricas/g;
s/\bperiodo\b/período/g;        s/\bPeriodo\b/Período/g;
s/\bperiodos\b/períodos/g;      s/\bPeriodos\b/Períodos/g;
s/\bparametro\b/parámetro/g;    s/\bParametro\b/Parámetro/g;
s/\bparametros\b/parámetros/g;  s/\bParametros\b/Parámetros/g;
s/\bproposito\b/propósito/g;    s/\bProposito\b/Propósito/g;
s/\bpropositos\b/propósitos/g;
s/\bsistematicamente\b/sistemáticamente/g;
s/\bpracticamente\b/prácticamente/g;
s/\bsegun\b/según/g;            s/\bSegun\b/Según/g;
s/\btambien\b/también/g;        s/\bTambien\b/También/g;
s/\bademas\b/además/g;          s/\bAdemas\b/Además/g;
s/\bnumero\b/número/g;          s/\bNumero\b/Número/g;
s/\bnumeros\b/números/g;        s/\bNumeros\b/Números/g;
s/\butil\b/útil/g;              s/\bUtil\b/Útil/g;
s/\butiles\b/útiles/g;
s/\bfacil\b/fácil/g;            s/\bFacil\b/Fácil/g;
s/\bdificil\b/difícil/g;        s/\bDificil\b/Difícil/g;
s/\bdificiles\b/difíciles/g;
s/\bInteres\b/Interés/g;        s/\binteres\b/interés/g;

1;
