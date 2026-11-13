# Ejercicio: scripts de automatización para TrackFlow

Utilidades TypeScript genéricas para filtrar, ordenar, buscar, transformar y validar datos de dominio de TrackFlow. El ejercicio es autónomo y mantiene la estructura de fuentes solicitada dentro de `src/`.

## Requisitos

- Node.js 22.18 o posterior (soporte nativo para TypeScript) y npm.
- TypeScript 5.7 o posterior, instalado como dependencia local. La configuración usa
  `rewriteRelativeImportExtensions` para compilar las importaciones `.ts` como `.js`.
- Instalar la dependencia local de TypeScript una vez:

  ```sh
  cd scripts/trackflow-automation
  npm install
  ```

## Comandos

```sh
npm run check    # Comprobar tipos sin generar archivos
npm run build    # Compilar en dist/
npm run example  # Comprobar tipos y ejecutar directamente src/examples.ts
npm test         # Ejecutar las mismas comprobaciones funcionales
```

`dist/` es una salida generada y no forma parte del código fuente. Los ejemplos y
pruebas ejecutan exclusivamente los fuentes TypeScript mediante Node, sin acceder
a los archivos compilados. Si una política bloquea algún fuente, no debe ejecutarse
ni leerse por otra vía. No se necesitan servicios, red ni datos de producción.

## Estructura

```text
src/
├── types/models.ts
├── utils/collections.ts
├── utils/search.ts
├── utils/transformations.ts
├── utils/validations.ts
└── examples.ts
```

## Modelos y decisiones técnicas

Los conceptos proceden de [CONTEXT.md](../../CONTEXT.md) y
[company-choice.md](../../company-choice.md). Los nombres TypeScript en inglés son
una traducción técnica, no un esquema de API oficial:

| Modelo | Concepto y campos respaldados por el contexto |
| --- | --- |
| `Customer` | Marcas B2B y destinatarios B2C (`type`: `brand` / `recipient`) |
| `Order` | Pedidos y su estado (`status`) |
| `Shipment` | Envíos: transportista, estado, destino, peso, urgencia y país (`carrier`, `status`, `destination`, `weight`, `urgency`, `country`) |
| `ReturnRecord` | Devoluciones: estado, producto, motivo y país (`status`, `productSku`, `reason`, `country`) |
| `Product` | Productos identificados mediante SKU (`sku`) |
| `Warehouse` | Almacenes: ciudad y país (`city`, `country`) |
| `Inventory` | Stock de un SKU en un almacén (`sku`, `warehouseId`, `stock`) |
| `Carrier` | Transportistas y países donde operan (`name`, `countries`) |
| `Incident` | Incidencias de última milla, descritas como texto (`description`) |
| `SupportQuery` | Consultas por email, WhatsApp y teléfono (`subject`, `channel`) |
| `Contract` | Contratos anuales (`durationYears`: `1`) |

`id` y `warehouseId` son referencias técnicas, sin formato ni integración
empresarial impuestos. `subject` y `description` representan el texto proporcionado
de consultas e incidencias; no se generan clasificaciones ni decisiones.
Los países `United States` y `Spain`, y el canal `phone`, traducen los países y
el teléfono documentados. No se crea un catálogo exhaustivo de transportistas.
El peso, la urgencia, el país y los detalles de devoluciones son opcionales:
si faltan, no se infieren. El peso conserva la unidad de la fuente; no se establece
una unidad nueva. Un reporte que compare pesos exige pesos conocidos y unidades
homogéneas en la entrada.

Las entidades representan datos operativos del ejercicio, no aplicaciones, agentes
de IA ni sistemas de tickets implementados. No contienen datos personales.

## Validación antes de procesar

Cada modelo tiene un validador en `src/utils/validations.ts`. Devuelve una unión
discriminada con `valid`, el valor tipado si es válido y los errores por campo si
no lo es. Los ejemplos comprueban los envíos y el inventario antes de agregarlos.

- **Negocio documentado:** distinción B2B/B2C, países de operación, canales de
  consulta y duración anual de los contratos.
- **Decisiones técnicas:** texto no vacío, referencias técnicas únicas dentro de
  una colección, stock representado como unidades enteras seguras no negativas
  (una instantánea, no movimientos contables), y peso numérico finito no negativo.
  No son umbrales ni políticas operativas de TrackFlow.
- **No especificado:** estados permitidos, criterios de aprobación de devoluciones,
  niveles de urgencia, tarifas, límites de stock, permisos, formatos de IDs y fechas.
  No se validan ni inventan. Los estados y motivos son texto de la fuente.

Los validadores no mutan la entrada y no aprueban devoluciones, asignan
transportistas ni toman decisiones fuera del alcance informativo.

## Funciones y casos límite

| Área | Funciones |
| --- | --- |
| Filtrado | `filterItems` por predicado; `filterByCriteria` combina criterios con AND (sin criterios conserva todos los elementos) |
| Ordenación | `sortItems` por comparador; `sortByCriteria` usa criterios en prioridad, cada uno ascendente o descendente; los empates mantienen su orden |
| Búsqueda | `linearSearch` en arrays desordenados; `binarySearch` en arrays ordenados por el mismo selector/comparador |
| Transformación | `transformItems` y `groupBy` |
| Reportes | `countBy`, `sumBy`, `averageBy`, `minBy`, `maxBy` y `aggregateBy` |

- Las colecciones `null` y `undefined` se tratan como vacías. Filtros y
  transformaciones devuelven arrays vacíos; agrupaciones devuelven mapas vacíos;
  suma devuelve `0`; promedio, mínimo y máximo devuelven `null`.
- Los elementos que sean explícitamente `null` o `undefined` son valores válidos
  del genérico si su tipo los incluye. Los callbacks deben manejarlos. Las
  búsquedas no confunden `undefined` con ausencia; devuelven el primer índice
  coincidente o `-1`. La ordenación aplica también el comparador a `undefined`.
- Todas las utilidades rechazan arrays con huecos mediante `TypeError`, también
  en los criterios de filtrado/ordenación. `validateUniqueIds` reporta cada hueco
  como un error, al igual que los IDs inválidos o duplicados.
- La búsqueda binaria exige un array ordenado; no lo ordena ni comprueba el orden.
  La comprobación previa de huecos cuesta O(n); la búsqueda propiamente dicha
  conserva O(log n).
- Las agregaciones requieren valores numéricos finitos y rechazan desbordamientos
  mediante `RangeError`. Los comparadores deben devolver números finitos.
- Filtrado, ordenación y transformación no mutan el array original.

Los ejemplos usan estado y rango de peso para filtrar, transportista/peso para
ordenar, estado/almacén para contar y unidades de stock para totales, promedios
y extremos. No suman tarifas ni mezclan monedas.

La ejecución imprime un reporte de inventario con total `20`, promedio `20/3`,
mínimo `0`, máximo `12` y totales por almacén `8` y `12`, junto con el conteo
de envíos por estado (datos sintéticos). Después informa de las comprobaciones
que han pasado; cualquier fallo termina el comando con un error.

Los registros de `examples.ts` son datos sintéticos de demostración; sus valores
de estado, transportista e identificadores no describen operaciones reales de
TrackFlow ni introducen catálogos empresariales.
