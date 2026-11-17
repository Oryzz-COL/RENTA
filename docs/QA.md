# Validación de la primera versión

Fecha: 17 de noviembre de 2026.

## Automatizada

- 11 pruebas aprobadas con `npm test`.
- `npm run build` completado y recursos requeridos presentes.
- Sintaxis de módulos de aplicación y textos verificada con `node --check`.

## En navegador local

- Portada en escritorio y pantalla móvil: composición visible, tipografías cargadas e imágenes sin errores.
- Pantalla móvil de aproximadamente 390 px: sin desbordamiento horizontal (ancho útil medido: 375 px).
- Galería: apertura, filtro de descanso con resultado único y cierre.
- Cambio a español: etiquetas y contenido traducidos.
- Formulario: nombre y correo de prueba, llegada 31/01/2027, duración un mes, aceptación del aviso y preparación de mensaje con salida 28/02/2027.
- El mensaje explica que no confirma una reserva y no fue enviado a servicios externos.
- Menú móvil: apertura y cierre al navegar al entorno.
- Pestaña «Vive»: panel y selección actualizados.
- Aviso de privacidad: modal con contenido en español y cierre.
- Consola: sin errores ni advertencias en la sesión revisada.

Capturas: `previews/desktop.jpg` y `previews/mobile.jpg`. El contenido y las fotografías son referencias.

## Alcance pendiente

No se ha probado una conversación real de WhatsApp porque falta el número del anfitrión. No hay disponibilidad en tiempo real, envío a servidor ni cobro. La revisión manual no sustituye una auditoría de accesibilidad completa ni la revisión legal. Repetir la revisión cuando se reciban fotografías, datos y diseño definitivos.
