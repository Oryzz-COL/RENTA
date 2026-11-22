# Ficha de portafolio · Smart Studio (borrador)

Estado: **borrador, no publicada**. Falta un enlace público propio y la autorización de la socia para mostrar el proyecto.

## Destinos

| Sitio | Fuente | Cómo se publica |
| --- | --- | --- |
| oryzz.com/proyectos | `Oryzz-COL/oryzz`, `proyectos.html` (HTML a mano, con JSON-LD) e imagen en `img/proyectos/smart-studio.webp` | `npx wrangler deploy` desde la raíz (un push no publica) |
| Web personal de Juan Camilo | `salazarlarajuancamilo5-dev/Personal-website`, entrada en `data/projects.json` (grupo `oryzz`) y captura en `assets/img/shots/smart-studio.webp` | `python tools/build.py`, `node tests/smoke.mjs`, commit y push |

## Contenido propuesto

- **id**: `smart-studio`
- **Título**: Smart Studio
- **Resumen**: Landing bilingüe para un estudio amoblado de estadías largas en el norte de Bogotá.
- **Cuerpo**: Diseñamos y desarrollamos la landing de Smart Studio a partir de su dirección de marca: un hero a pantalla completa, el kit de bienvenida como protagonista, una galería 3D del estudio y un mapa 3D de Mapbox con 18 lugares reales del barrio y tiempos a pie. Bilingüe, sin dependencias y con un formulario que prepara la consulta.
- **Rol**: Diseño y desarrollo web (Oryzz)
- **Año**: 2026
- **Lugar**: Bogotá, Colombia
- **url**: pendiente, el dominio o la URL de despliegue del sitio
- **Portada**: captura real del hero publicado, 1600×1000, en webp. Texto alternativo: «Portada de la landing de Smart Studio con el hero y el kit de bienvenida».

## Para publicar

1. Desplegar el sitio (Netlify, Vercel o Cloudflare) con la variable `MAPBOX_TOKEN` y obtener la URL.
2. Confirmar con la socia que se puede mostrar en el portafolio.
3. Tomar la captura del hero en producción y añadir la ficha en los dos sitios.
