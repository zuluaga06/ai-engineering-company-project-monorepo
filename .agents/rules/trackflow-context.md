---
description: Regla global de contexto, estructura y fidelidad factual para TrackFlow.
applyTo: "**"
---

# Regla global de TrackFlow

**Ámbito: global y siempre activo en todo el repositorio.** `AGENTS.md` exige leer esta regla al comienzo de cada tarea; aplícala aunque la tarea no mencione explícitamente TrackFlow.

- Usa `memory-bank/projectbrief.md`, `memory-bank/techContext.md`, `CONTEXT.md` como contexto empresarial oficial y los README como fuentes. Si hay contradicciones internas, conserva la atribución a cada sección y solicita confirmación; no elijas una versión por intuición.
- No inventes estados de paquetes/devoluciones, políticas por cliente, métricas, endpoints, integraciones, herramientas disponibles ni acciones ya realizadas.
- Distingue marcas B2B de destinatarios B2C y no presupongas que tienen los mismos permisos o datos.
- Mantén las interfaces públicas en `uis/website/`, las herramientas internas en `uis/backoffice/` y los backends en `services/`. Mantén las skills compartidas en `skills/`; no crees árboles de aplicación ni catálogos paralelos.
- Trata consultas CX como informativas hasta que una política y una integración aprobadas permitan actuar. Si faltan datos, hay estados contradictorios o la decisión excede la evidencia, explica la incertidumbre y deriva el caso a una persona.
- Minimiza los datos personales en prompts, respuestas, ejemplos y documentación.
- No cambies `CONTEXT.md`, `company-choice.md` ni otros materiales de negocio para resolver discrepancias sin confirmación explícita.