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
5. **Mapa 3D del barrio** con 18 puntos reales (supermercados, universidad, salud, parques, comida, compras, transporte), filtros por categoría, anillos de 5 y 10 minutos a pie, línea al punto elegido y recorrido aéreo alrededor de la cuadra.
6. **Alexander, el anfitrión** y el conductor opcional.
7. **Guía de Bogotá**.
8. **Tarifa propuesta**, inclusiones y preguntas frecuentes.
9. **Consulta**: valida datos, calcula la salida estimada y copia el mensaje (o lo abre en WhatsApp cuando se active).

Barra fija con tarifa y botón de disponibilidad después del hero. Selector EN/ES con preferencia local.

## Mapa: cómo funciona y cómo configurarlo

- Motor: **MapLibre GL JS 4.7.1**, alojado en `assets/vendor/maplibre/` (licencia BSD incluida).
- Teselas: **OpenFreeMap** (estilo *positron*, datos de OpenStreetMap). **No requiere cuenta, token ni tarjeta**; por eso no se usó Mapbox.
- La librería y las teselas solo se cargan cuando el visitante se acerca a la sección del barrio. La lista de lugares funciona aunque el mapa falle.
- **Ubicación del estudio**: `property.location` en `src/config.js`. Es aproximada (Cra. 11 con Calle 134); hay que confirmarla en sitio y ajustar latitud y longitud.
- **Puntos de interés**: arreglo `places` en `src/config.js` (nombre, categoría, coordenadas y descripción EN/ES). Las distancias y los minutos a pie se calculan solos en `src/geo.js` (línea recta × 1,3 a 80 m/min).
- Colores del mapa: tokens `--map-*` y `--c-*` en `src/styles.css`.

Si más adelante se prefiere Mapbox (por ejemplo, para vista satelital), hay que crear una cuenta en mapbox.com, generar un token público restringido al dominio y cambiar `STYLE_URL` en `src/map.js`.

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

Al navegar, el sitio solo contacta a OpenFreeMap para las teselas del mapa y guarda únicamente la clave local `smart-studio-language`. Tiene `noindex, nofollow` por ser una vista conceptual; hay que retirarlo al publicar la versión aprobada.

## Recursos

Fotografías de referencia de Unsplash (ver `assets/CREDITS.md`). Newsreader y Manrope bajo SIL OFL. MapLibre GL JS bajo licencia BSD-3. Datos del mapa © colaboradores de OpenStreetMap.
