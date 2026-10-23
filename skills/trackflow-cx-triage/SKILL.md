---
name: trackflow-cx-triage
description: Clasifica consultas de clientes de TrackFlow sobre seguimiento de paquetes y estado de devoluciones; prepara una respuesta respaldada o un escalado humano cuando faltan datos, hay contradicciones o el caso excede la información disponible.
---

# Triaje de consultas CX de TrackFlow

## Objetivo

Ayudar a clasificar y preparar la respuesta a consultas repetitivas de tracking y devoluciones de TrackFlow. La skill organiza la evidencia recibida; no consulta sistemas externos ni ejecuta acciones.

## Cuándo usarla

Úsala para una consulta de una marca (B2B) o de un destinatario (B2C) sobre el seguimiento de un paquete o el estado de una devolución.

No la uses para aprobar/rechazar devoluciones, cambiar pedidos, emitir etiquetas, asignar transportistas, prometer fechas ni responder sobre políticas no incluidas en las entradas. No sustituye la revisión humana de quejas, reclamos o casos sensibles.

## Entradas

Proporciona lo que esté disponible, sin pedir ni repetir datos personales innecesarios:

- Consulta original y canal, si se conoce.
- Tipo de cliente: marca B2B o destinatario B2C; si no se conoce, indícalo.
- Identificador de pedido, envío o devolución necesario para interpretar el caso; no lo inventes.
- Eventos de tracking/devolución proporcionados, con su fuente, fecha/hora y estado, si existen.
- Política o instrucciones documentadas aplicables, si existen.
- Contexto previo del ticket y prioridad ya asignada, si existen.

La ausencia de un campo es información: no la completes con una suposición.

## Procedimiento

1. Clasifica la intención como seguimiento, devolución, queja/reclamo u otra; no fuerces una categoría si el texto no basta.
2. Determina si se conoce el tipo de cliente y si las entradas incluyen identificadores y evidencia suficientes.
3. Resume sólo los eventos aportados. Atribuye cada estado a su fuente y marca explícitamente la hora cuando esté disponible.
4. Compara eventos entre fuentes; si se contradicen, no elijas uno como correcto.
5. Consulta únicamente la política incluida en las entradas. Si no existe o no cubre el caso, no deduzcas una decisión.
6. Prepara una respuesta breve o declara qué dato falta. Recomienda escalado humano cuando no se pueda responder con evidencia, haya contradicción, el caso sea una queja/reclamo no resuelta o se solicite una acción no autorizada.
7. No afirmes que se creó un ticket, se contactó a una persona o se modificó un sistema: presenta esas acciones como recomendación, salvo que el resultado real se proporcione como entrada.

## Salida

Devuelve estos campos en texto estructurado:

- `tipo_cliente`: B2B, B2C o desconocido.
- `intencion`: seguimiento, devolución, queja/reclamo, otra o incierta.
- `evidencia`: hechos respaldados con fuente/fecha cuando estén disponibles; `sin datos` si no se aportó evidencia.
- `incertidumbres`: identificadores, eventos, políticas o permisos ausentes; contradicciones explícitas.
- `respuesta_borrador`: texto que pueda enviarse al cliente, o `requiere revisión humana` si no es seguro redactarlo.
- `siguiente_paso`: pedir un dato concreto, consultar la fuente humana/sistema autorizado o escalar; nunca describas como hecho una acción no ejecutada.
- `motivo_escalado`: motivo verificable o `no requerido`.

## Criterios de aceptación verificables

- Cada afirmación sobre un estado se puede rastrear a un evento incluido en las entradas; si no, queda marcada como no disponible.
- No se inventan políticas, fechas de entrega, eventos, transportistas, integraciones ni acciones.
- Los eventos contradictorios se exponen con sus fuentes y bloquean una respuesta que elija uno sin justificación.
- La salida identifica el dato mínimo faltante cuando éste impide responder y recomienda escalado en lugar de inferirlo.
- La respuesta distingue B2B/B2C cuando el tipo se conoce y no expone información personal innecesaria.
- Toda decisión operativa no respaldada por una política incluida se deriva a revisión humana.

## Escenarios de validación

### 1. Tracking normal

**Entrada:** consulta de destinatario; un evento proporcionado por el transportista indica “en tránsito” con fuente y hora; no hay eventos contradictorios.

**Esperado:** clasificar como seguimiento, citar el evento y su fuente/hora, redactar una respuesta que diga que el último dato recibido indica “en tránsito” y no prometer fecha de entrega si no se proporcionó.

### 2. Evento faltante

**Entrada:** consulta de tracking con identificador, pero sin eventos ni respuesta de fuente de tracking.

**Esperado:** indicar que no se recibió información de tracking en las entradas; no afirmar que el paquete no se mueve ni inferir retraso; pedir el dato mínimo necesario o recomendar consulta/escalado a la fuente autorizada.

### 3. Eventos contradictorios

**Entrada:** dos eventos aportados para el mismo envío informan estados incompatibles y tienen fuentes u horas distintas.

**Esperado:** presentar la contradicción atribuida a cada fuente/hora, no escoger un estado como definitivo y recomendar verificación/escalado humano.

### 4. Devolución sin estado

**Entrada:** consulta sobre una devolución con identificador, pero sin eventos ni política de devolución.

**Esperado:** declarar que el estado y la decisión de la devolución no están disponibles; no afirmar que está aprobada, rechazada, recogida o pendiente; pedir la información necesaria o recomendar revisión humana.