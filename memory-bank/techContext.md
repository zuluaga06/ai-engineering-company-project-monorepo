# Contexto técnico

## Estado comprobado del repositorio

Este repositorio es una plantilla de monorepo con documentación y esqueletos; no es todavía una aplicación TrackFlow ejecutable. La guía raíz recomienda ubicar las interfaces en `uis/`, los backends en `services/`, los datos en `data/`, los agentes en `agents/` y las capacidades reutilizables en `skills/`.

- El contenedor de desarrollo configura Python 3.12, Node.js 22, Docker y GitHub CLI. Son herramientas disponibles en el entorno, no prueba de que una app use esas tecnologías.
- `packages/shared/package.json` declara el paquete privado `@repo/shared-types`; contiene tipos TypeScript básicos. No existe configuración de workspaces en la raíz.
- Hay un ejemplo Python con pandas en `skills/data-analysis/`.
- No se encontró implementación de aplicación web, servicio backend, sistema de tickets, integración de transportistas, base de conocimiento RAG ni workflow de negocio.
- La documentación recomienda una API centralizada FastAPI y menciona n8n como ejemplo de orquestación. Son recomendaciones, no decisiones implementadas.

## Ubicaciones del producto

### `/uis/website`

Ubicación prevista para la presencia web pública de TrackFlow. El briefing identifica como necesidad un portal público de seguimiento para destinatarios; podría documentarse o desarrollarse aquí cuando se apruebe el alcance. Actualmente no existe esta subcarpeta ni una aplicación implementada. No colocar esta interfaz en una estructura alternativa.

### `/uis/backoffice`

Ubicación prevista para herramientas internas. En el contexto del reto CX, es un destino posible para operaciones de agentes, revisión de casos o tickets si esos requisitos se concretan. El README de `uis/` describe `backoffice` como aplicación interna, pero hoy sólo están los README de `uis/`; no existe esta subcarpeta ni una app. No asumir funcionalidades específicas no confirmadas.

### `/services`

Ubicación prevista para APIs y workers centrales. El README raíz recomienda una API FastAPI centralizada para la empresa; el briefing menciona necesidades como tracking unificado y sistema de tickets, pero no define contratos técnicos ni integraciones. Actualmente `services/` contiene documentación, no un servicio. No crear microservicios ni inventar endpoints sin requisitos confirmados.

## Contexto de agentes y skills

- La plantilla sitúa agentes concretos bajo `agents/`; la documentación compartida y capacidades reusables viven en `skills/`.
- La skill de triaje CX se documentará en `skills/trackflow-cx-triage/SKILL.md`, siguiendo la estructura existente; no se creará un catálogo paralelo en `.agents/skills/`.
- `.agents/rules/` se reserva para la regla de contexto solicitada. `AGENTS.md` deberá exigir la lectura de esa regla al iniciar, además de declarar su alcance global/siempre activo.
- `CONTEXT.md` describe la operación en Estados Unidos y España. Dentro del mismo briefing hay una discrepancia de liderazgo; no se resolverá por inferencia hasta recibir confirmación.

## Fuentes de arquitectura

- `README.es.md`: límites y recomendaciones del monorepo.
- `uis/README.es.md`: propósito de `website` y `backoffice`.
- `services/README.es.md`: propósito de APIs y workers.
- `CONTEXT.md`: contexto empresarial oficial; conserva una discrepancia interna sobre quién ocupa el cargo de CEO.