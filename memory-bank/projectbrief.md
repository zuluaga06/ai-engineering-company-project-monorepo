# Project Brief: TrackFlow

## Propósito

TrackFlow es una empresa de logística de última milla, almacenamiento y gestión de devoluciones. La selección del proyecto y del reto de automatización consta en `company-choice.md`; el contexto empresarial detallado está en `CONTEXT.md`.

La iniciativa seleccionada es un agente de experiencia del cliente (CX) de primera línea que ayude a responder consultas repetitivas sobre seguimiento de paquetes y estado de devoluciones, y derive a una persona cuando la información disponible no permita resolverlas.

## Usuarios y problema

- TrackFlow atiende a marcas que contratan sus servicios (B2B) y a consumidores finales que reciben paquetes (B2C).
- Según `CONTEXT.md`, el equipo de 15 agentes gestiona consultas por email, WhatsApp y teléfono, sin un sistema unificado de tickets ni una base de conocimiento; el documento indica que el 80% de las consultas podría automatizarse y que no hay cobertura fuera del horario de oficina.
- `company-choice.md` destaca seguimiento, devoluciones, quejas, reclamos, estado del pedido y creación de una conversación con una persona cuando el chat no pueda resolver el caso.

## Alcance funcional inicial

- Clasificar una consulta de seguimiento o devolución usando exclusivamente los datos y políticas que se proporcionen.
- Preparar una respuesta clara, con el estado respaldado por evidencia disponible.
- Identificar datos faltantes, contradicciones y casos que requieren intervención humana.
- Proponer el escalado a un agente humano cuando la consulta no pueda resolverse con la información disponible.

Este alcance describe el trabajo de la skill interna de triaje y el objetivo del agente; no afirma que haya integraciones, APIs, sistema de tickets o automatizaciones implementadas. No autoriza aprobar/rechazar devoluciones, emitir etiquetas, cambiar pedidos ni comunicarse con transportistas.

## Criterios de comportamiento

- Diferenciar consultas de marcas B2B y destinatarios B2C; no asumir que ambos pueden acceder a los mismos datos.
- No inventar estados, fechas, políticas, identificadores, acciones ejecutadas ni integraciones.
- Informar de forma explícita cuando falten datos o haya eventos contradictorios.
- Escalar decisiones fuera de la evidencia o política documentada y casos de queja/reclamo que no puedan resolverse con seguridad.
- Limitar los datos personales incluidos en la respuesta a los estrictamente necesarios para el caso.

## Decisiones de contexto pendientes

1. Dirección ejecutiva: `CONTEXT.md` presenta a Thomas Harry como fundador y CEO, pero más adelante identifica a Daniel Espinoza como CEO y creador de TrackFlow Tech.

No resolver esta discrepancia por inferencia ni modificar `CONTEXT.md` o `company-choice.md` sin confirmación explícita. Mantener atribuidas ambas referencias a sus secciones de origen hasta recibir confirmación.

## Fuentes

- `company-choice.md`: empresa seleccionada e idea de agente.
- `CONTEXT.md`: briefing detallado disponible en el repositorio.
- `README.es.md`: estructura y convenciones generales del monorepo.
