# Sitio web público de TrackFlow

Sitio estático construido con HTML semántico, Tailwind CSS por CDN y JavaScript vanilla. No requiere instalación ni backend.

## Abrir en Codespaces

Abre `index.html` en el navegador para ver la landing. El formulario está en `application.html`; se puede abrir directamente o desde el botón «Solicitar información». El envío se simula localmente y muestra la confirmación definida para TrackFlow.

Para servir el directorio localmente, desde la raíz del repositorio ejecuta:

```sh
python3 -m http.server 8000 --directory uis/website
```

Después abre `http://localhost:8000`.
