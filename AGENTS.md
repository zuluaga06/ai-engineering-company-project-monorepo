# Instrucciones para agentes

## Lectura obligatoria al comenzar

Antes de analizar o modificar el repositorio, lee en este orden:

1. `memory-bank/projectbrief.md`, `memory-bank/techContext.md` y `memory-bank/progress.md`.
2. `CONTEXT.md` y `company-choice.md`. Si difieren, conserva la discrepancia y consulta antes de decidir qué versión es válida.
3. `README.es.md` para las convenciones generales del monorepo.
4. `.agents/rules/trackflow-context.md` para la regla global del proyecto.
5. El README de cada área afectada; para interfaz o backend, incluye `uis/README.es.md` o `services/README.es.md`, respectivamente.
6. La documentación de cualquier skill, agente o paquete que vayas a modificar.

## Estructura del proyecto

- Coloca la presencia web pública en `uis/website/` y las herramientas internas en `uis/backoffice/` cuando se implementen. No crees aplicaciones bajo árboles alternativos.
- Coloca APIs y workers centrales en `services/`. La guía recomienda una API centralizada; no dividas en servicios separados sin una necesidad documentada.
- Coloca capacidades reutilizables de agentes en `skills/`. No dupliques el catálogo bajo `.agents/skills/`.
- Documenta cada aplicación, servicio, agente, pipeline o skill en su ubicación y README/catálogo correspondiente.
- Trata las rutas anteriores como destinos arquitectónicos documentados, no como evidencia de que ya existan aplicaciones o servicios.

## Protección de contexto y materiales de negocio

No modifiques `CONTEXT.md` ni `company-choice.md` para resolver discrepancias sin confirmación explícita del usuario. Tampoco alteres briefings, políticas logísticas, contratos, datos fuente o decisiones de negocio para hacer que encajen con una implementación. Registra la contradicción y solicita confirmación. No inventes políticas, estados de envío, fechas, integraciones, endpoints ni datos de clientes.

## Comprobaciones obligatorias antes de cada commit

Antes de cada commit, completa y comprueba estos pasos:

1. Revisa `git status` y el diff completo; confirma que cada archivo pertenece al alcance aprobado y preserva cambios ajenos.
2. Relee los documentos de memoria, la regla global y los README pertinentes a los archivos cambiados.
3. Ejecuta las pruebas y validaciones enfocadas disponibles para el cambio; registra cualquier gate no disponible o resultado fallido.
4. Inspecciona el diff en busca de secretos, datos personales innecesarios, archivos generados, enlaces rotos y cambios fuera de alcance.
5. Actualiza `memory-bank/progress.md` con el resultado verificable y vuelve a comprobar `git status`.

No crees commits, hagas push ni abras PR sin autorización explícita del usuario.
