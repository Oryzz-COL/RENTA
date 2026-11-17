# RENTA · Residencia en Bogotá

Landing bilingüe (inglés/español) para un apartamento privado en el norte de Bogotá, orientada a estudiantes internacionales y estadías **desde un mes hasta un año**. Primera propuesta visual desarrollada por ORYZZ. El nombre **The Bogotá residence** es provisional.

## Ejecutar

Requiere Node.js 22 o superior. No utiliza paquetes de terceros ni necesita `npm install`.

```sh
npm run dev
# http://127.0.0.1:4173

npm test
npm run build
npm run preview
```

`npm run build` genera `dist/` con el sitio estático. Se puede alojar en cualquier hosting estático con dominio en la raíz. El servidor de desarrollo escucha únicamente en loopback; no es un servidor para producción. Para cambiar el puerto, configurar la variable `PORT`.

## Qué está implementado

- Dirección visual propia: paleta mineral, azul tinta, Newsreader variable y Manrope; fuentes e imágenes locales.
- Diseño adaptable, menú móvil, estados de foco, navegación por teclado y respeto por movimiento reducido.
- Galería modal con filtros, miniaturas, flechas de teclado, cierre con Escape y retorno del foco.
- Selector inglés/español, con preferencia local. El inglés es el idioma inicial por el público objetivo.
- Entorno con pestañas accesibles y esquema ilustrativo, sin ubicación o distancias inventadas.
- Preguntas frecuentes sobre duración, precio, servicios, visitas, mascotas y reservas.
- Formulario con validación, meses de calendario y salida estimada (incluye fines de mes y años bisiestos).
- En muestra: preparación y copia de consulta, sin transmisión de datos ni confirmación de reserva.
- Punto de integración de WhatsApp; no utiliza un número ficticio.
- Modales de términos, privacidad y cookies, identificados como borradores.
- Aviso de privacidad y preferencias sin analítica ni cookies publicitarias.
- Pruebas con el test runner nativo de Node y CI en GitHub Actions.

## Organización

```text
assets/                Imágenes, tipografías, licencias y símbolo
src/config.js          Información y contactos del inmueble
src/content.js         Todos los textos en inglés y español, incluidos borradores legales
src/booking.js         Fechas y composición de consultas
src/app.js             Componentes e interacciones, sin framework
src/styles.css         Sistema visual y adaptación a pantallas
scripts/               Servidor, build y descarga reproducible de referencias
tests/                 Pruebas de reglas de estadía y contenido
docs/                  Dirección de diseño y datos pendientes para publicar
.github/workflows/     Validación automática
```

## Reemplazar datos y diseño

1. Completar el inventario en `docs/CONTENIDO-PENDIENTE.md` con el propietario.
2. Editar `src/config.js` para fotos, contactos y datos confirmados.
3. Ajustar los textos en ambos idiomas en `src/content.js`; no traducir únicamente la portada.
4. Actualizar el nombre en `property.brand`, el logotipo tipográfico de `src/app.js`, los títulos/metadatos de `index.html` y `src/app.js`, y el favicon.
5. Ajustar los tokens de `:root` y los estilos en `src/styles.css` cuando llegue el diseño aprobado.
6. Sustituir las fotos de inspiración por fotos propias y actualizar avisos, textos alternativos y créditos.

## Reservas y WhatsApp

Esta versión **no tiene backend, calendario de disponibilidad, pasarela de pago ni reservas automáticas**. Las solicitudes son consultas sujetas a confirmación por el anfitrión.

La integración de WhatsApp tiene una compuerta en `isLive()` de `src/app.js`: requiere `preview: false`, `whatsapp` de 10–15 dígitos internacionales, `legalOwner` y `privacyEmail`. Cambiar estos campos solamente **no basta para publicar**: primero completar el aviso legal definitivo, revisar el flujo, reemplazar los mensajes de muestra (`bookNotice`, `noSend`, `legalIntro`, `legalSections`) y validar el destino con el propietario. Los campos legales se usan actualmente para bloquear la activación, no para generar avisos definitivos.

Después de completar ese trabajo, el botón del formulario abre `wa.me` con el mensaje codificado; el visitante elige si lo envía. El botón flotante abre el chat. Con la configuración actual, el botón flotante dirige al formulario y explica que el contacto está pendiente.

## Privacidad y preparación para publicar

Los textos legales son borradores de producto, **no una certificación de cumplimiento ni un contrato definitivo**. Deben adaptarse al responsable y a las condiciones reales antes de recibir consultas. Ver la lista de publicación en `docs/CONTENIDO-PENDIENTE.md`.

No se transmiten ni guardan en disco los datos del formulario. Solo se utilizan las claves locales `residence-language` y `residence-privacy`; el sitio funciona si el navegador bloquea ese almacenamiento. No se incluyen scripts analíticos, mapas externos ni llamadas a proveedores de fuentes al cargar la página.

El sitio tiene `noindex, nofollow` por tratarse de una muestra. Al publicar la versión definitiva: revisar metadatos, configurar dominio/canonical, vista previa social y sitemap; retirar `noindex` **solo después** de reemplazar referencias y validar los datos.

## Recursos

Fotografías de referencia descargadas de Unsplash: sus identificadores están en `src/config.js` y se documentan en `assets/CREDITS.md`. No corresponden al apartamento. Los archivos se incluyen para que el sitio no dependa de solicitudes externas. Los derechos y atribuciones de cada recurso deben revisarse para la publicación final.

Newsreader y Manrope se distribuyen bajo SIL Open Font License; las licencias están incluidas en `assets/`. Para refrescar las referencias: `node scripts/fetch-assets.mjs` (requiere conexión). No hace falta ejecutar este script para desarrollar o construir el sitio; las versiones descargadas están guardadas en Git.

## Validación

`npm test` verifica duración mensual, fechas inválidas, fines de mes, años bisiestos, mensajes bilingües, configuración de muestra, integridad de recursos y correspondencia de idiomas. `npm run build` verifica los recursos requeridos y genera el paquete estático.

La comprobación manual cubre galería y filtros, formulario en español, menú móvil, pestañas del entorno y aviso legal. Ver `docs/QA.md` para resultados y alcance.
