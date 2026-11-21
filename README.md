# Smart Studio · Bogotá

Landing bilingüe (inglés/español) para **Smart Studio**, un estudio amoblado de unos 25 m² en Torre Medina, Calle 134, norte de Bogotá, para estadías de **30 noches o más**. Reconstruida a partir de la landing conceptual de la socia y del documento *Smart Studio · Dirección conceptual de marca y experiencia* (v1.0, 20 nov 2026).

> Feel at home in Bogotá. From day one.

## Ejecutar

Requiere Node.js 22 o superior. No hay dependencias que instalar.

```sh
npm run dev      # http://127.0.0.1:4173
npm test
npm run build    # genera dist/
npm run preview
```

`dist/` es un sitio estático; se puede publicar en Netlify, Vercel o cualquier hosting estático con el dominio en la raíz.

## Secciones

1. **Hero** con la promesa de marca y la tarjeta del *Welcome Kit* sobre la foto (firma visual).
2. **Welcome Kit**: recogida en aeropuerto, primer desayuno y café colombiano, contados como el recorrido del huésped.
3. **El estudio en 3D**: anillo de fotos que se arrastra, desliza o recorre con flechas; clic para ampliar.
4. **Incluido y funciones inteligentes**: limpieza semanal, agua filtrada, streaming; acceso, voz, espacio flexible, WiFi.
5. **Mapa 3D del barrio (Mapbox)** con 18 puntos reales (supermercados, universidad, salud, parques, comida, compras, transporte), filtros por categoría, anillos de 5 y 10 minutos a pie, línea al punto elegido y recorrido aéreo alrededor de la cuadra.
6. **Alexander, el anfitrión** y el conductor opcional.
7. **Guía de Bogotá**.
8. **Tarifa propuesta**, inclusiones y preguntas frecuentes.
9. **Consulta**: valida datos, calcula la salida estimada y copia el mensaje (o lo abre en WhatsApp cuando se active).

Barra fija con tarifa y botón de disponibilidad después del hero. Selector EN/ES con preferencia local.

## Mapa: cómo funciona y cómo configurarlo

- Motor principal: **Mapbox GL JS 3.8** con el estilo **Mapbox Standard**: edificios reales en 3D, árboles, monumentos e iluminación. Se carga desde `api.mapbox.com` solo cuando el visitante se acerca a la sección del barrio.
- Token: **no se guarda en Git**. Va en la variable de entorno `MAPBOX_TOKEN` (en local, en un archivo `.env` ignorado por Git; ver `.env.example`; en Netlify/Vercel, en las variables de entorno del proyecto). `npm run dev` y `npm run build` lo inyectan en `src/config.js`. Es el **token público** (`pk.`); antes de publicar, **restringirlo a las URL del sitio** en console.mapbox.com → Tokens → *URL restrictions*. Un token secreto (`sk.`) se rechaza.
- Cuenta sin método de pago: Mapbox limita el uso (unas 5.000 cargas de mapa web al mes) y **bloquea las imágenes satelitales**. Al añadir un método de pago se mantiene el nivel gratuito (50.000 cargas al mes) y se puede activar la vista satélite con `mapboxSatellite: true`.
- Sin `MAPBOX_TOKEN`, el sitio usa la alternativa sin cuenta: **MapLibre GL** alojado en `assets/vendor/maplibre/` con teselas de **OpenFreeMap**.
- **Ubicación del estudio**: `property.location`, tomada de la geocodificación de Mapbox para «Carrera 11 134-27». Es una dirección interpolada: confirmarla en sitio.
- **Puntos de interés**: arreglo `places` en `src/config.js` (nombre, categoría, coordenadas de OpenStreetMap y descripción EN/ES). Las distancias y los minutos a pie se calculan solos en `src/geo.js` (línea recta × 1,3 a 80 m/min).

## Galería 3D y fotografía

`src/gallery3d.js` monta un anillo 3D con CSS, sin librerías. Las fotos se definen en `property.photos` (`src/config.js`); se ve mejor con 6 a 10 fotos. Las actuales son **referencias de Unsplash**, no el estudio real. La lista de tomas está en `docs/CONTENIDO-PENDIENTE.md`.

## Organización

```text
assets/                 Fotos, fuentes, favicon y MapLibre (vendor/)
src/config.js           Datos del inmueble, fotos, ubicación y puntos del mapa
src/content.js          Todos los textos en inglés y español
src/app.js              Página e interacciones
src/map.js              Mapa 3D del barrio
src/gallery3d.js        Galería en anillo 3D
src/geo.js              Distancias y tiempos a pie
src/booking.js          Fechas y mensaje de consulta
src/icons.js            Iconos de línea y monograma
src/styles.css          Sistema visual (tokens en :root)
tests/                  Pruebas con el runner nativo de Node
docs/                   Dirección de diseño y datos pendientes
```

## Reservas, WhatsApp y privacidad

No hay backend, pagos ni reservas automáticas: el formulario **prepara una consulta** y la copia. WhatsApp se activa con `isLive()` en `src/app.js` cuando `preview` es `false` y están `whatsapp`, `legalOwner` y `privacyEmail` en `src/config.js`, después de completar los avisos legales.

Al navegar, el sitio solo contacta al proveedor del mapa (Mapbox, u OpenFreeMap sin token) cuando el visitante llega al barrio, y guarda únicamente la clave local `smart-studio-language`. Tiene `noindex, nofollow` por ser una vista conceptual; hay que retirarlo al publicar la versión aprobada.

## Recursos

Fotografías de referencia de Unsplash (ver `assets/CREDITS.md`). Newsreader y Manrope bajo SIL OFL. Mapa © Mapbox y © colaboradores de OpenStreetMap; MapLibre GL JS bajo licencia BSD-3.
