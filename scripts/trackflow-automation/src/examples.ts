import type {
  Inventory,
  Shipment,
  ValidationResult,
} from "./types/models.ts";
import {
  filterByCriteria,
  filterItems,
  sortByCriteria,
  sortItems,
} from "./utils/collections.ts";
import type { SortCriterion } from "./utils/collections.ts";
import { linearSearch, binarySearch } from "./utils/search.ts";
import {
  aggregateBy,
  averageBy,
  countBy,
  groupBy,
  maxBy,
  minBy,
  sumBy,
  transformItems,
} from "./utils/transformations.ts";
import {
  validateCarrier,
  validateContract,
  validateCustomer,
  validateIncident,
  validateInventory,
  validateOrder,
  validateProduct,
  validateReturnRecord,
  validateShipment,
  validateSupportQuery,
  validateUniqueIds,
  validateWarehouse,
} from "./utils/validations.ts";

let checks = 0;

function assert(condition: boolean, description: string): void {
  if (!condition) {
    throw new Error(`Falló el ejemplo: ${description}`);
  }
  checks += 1;
}

function assertThrows(
  operation: () => unknown,
  errorType: typeof TypeError | typeof RangeError,
  description: string,
): void {
  try {
    operation();
  } catch (error: unknown) {
    assert(error instanceof errorType, description);
    return;
  }
  throw new Error(`Falló el ejemplo: ${description}; no se lanzó el error esperado.`);
}

const shipments: Shipment[] = [
  { id: "demo-3", carrier: "carrier-demo-b", status: "source-status-b", weight: 5 },
  { id: "demo-1", carrier: "carrier-demo-a", status: "source-status-a", weight: 2 },
  { id: "demo-2", carrier: "carrier-demo-a", status: "source-status-a", weight: 7 },
];
const inventory: Inventory[] = [
  { sku: "demo-sku-1", warehouseId: "warehouse-demo-a", stock: 8 },
  { sku: "demo-sku-2", warehouseId: "warehouse-demo-a", stock: 0 },
  { sku: "demo-sku-1", warehouseId: "warehouse-demo-b", stock: 12 },
];

for (const shipment of shipments) {
  const validation = validateShipment(shipment);
  if (!validation.valid) {
    throw new Error(JSON.stringify(validation.issues));
  }
}
for (const entry of inventory) {
  const validation = validateInventory(entry);
  if (!validation.valid) {
    throw new Error(JSON.stringify(validation.issues));
  }
}
assert(validateUniqueIds(shipments).valid, "IDs de envíos únicos antes de procesar");

function shipmentId(shipment: Shipment): string {
  return shipment.id;
}

function shipmentStatus(shipment: Shipment): string {
  return shipment.status;
}

function compareIds(left: Shipment, right: Shipment): number {
  return left.id.localeCompare(right.id);
}

function compareCarriers(left: Shipment, right: Shipment): number {
  return left.carrier.localeCompare(right.carrier);
}

function compareWeights(left: Shipment, right: Shipment): number {
  if (left.weight === undefined || right.weight === undefined) {
    throw new TypeError("Este reporte requiere pesos conocidos en ambos envíos.");
  }
  return left.weight - right.weight;
}

function stock(entry: Inventory): number {
  return entry.stock;
}

function warehouseId(entry: Inventory): string {
  return entry.warehouseId;
}

function identity(value: number): number {
  return value;
}

const filtered = filterItems(
  shipments,
  (shipment: Shipment): boolean => shipment.carrier === "carrier-demo-a",
);
assert(filtered.map(shipmentId).join(",") === "demo-1,demo-2", "filtrado por transportista");
const combined = filterByCriteria(shipments, [
  (shipment: Shipment): boolean => shipment.status === "source-status-a",
  (shipment: Shipment): boolean =>
    shipment.weight !== undefined && shipment.weight >= 3 && shipment.weight <= 8,
]);
assert(combined.map(shipmentId).join(",") === "demo-2", "filtrado por estado y rango de peso");
assert(filterByCriteria(shipments, []).length === 3, "sin criterios se conservan los datos");

const ascending = sortByCriteria(shipments, [{ compare: compareIds, direction: "ascending" }]);
const descending = sortByCriteria(shipments, [{ compare: compareIds, direction: "descending" }]);
const multiple = sortByCriteria(shipments, [
  { compare: compareCarriers, direction: "ascending" },
  { compare: compareWeights, direction: "descending" },
]);
assert(ascending.map(shipmentId).join(",") === "demo-1,demo-2,demo-3", "orden ascendente");
assert(descending.map(shipmentId).join(",") === "demo-3,demo-2,demo-1", "orden descendente");
assert(multiple.map(shipmentId).join(",") === "demo-2,demo-1,demo-3", "orden multicampo");
assert(shipments.map(shipmentId).join(",") === "demo-3,demo-1,demo-2", "origen sin mutaciones");
assert(sortItems(shipments, compareIds).map(shipmentId).join(",") === ascending.map(shipmentId).join(","), "ordenación genérica conservada");
assert(
  sortByCriteria(shipments, [{ compare: (): number => 0, direction: "ascending" }])
    .map(shipmentId).join(",") === "demo-3,demo-1,demo-2",
  "los empates conservan el orden original",
);

assert(linearSearch(shipments, (shipment: Shipment): boolean => shipment.id === "demo-2") === 2, "búsqueda lineal desordenada");
assert(linearSearch(shipments, (shipment: Shipment): boolean => shipment.id === "missing") === -1, "búsqueda lineal sin coincidencia");
const compareStrings = (left: string, right: string): number => left.localeCompare(right);
assert(binarySearch(ascending, "demo-2", shipmentId, compareStrings) === 1, "búsqueda binaria");
assert(binarySearch(ascending, "demo-1", shipmentId, compareStrings) === 0, "primer elemento");
assert(binarySearch(ascending, "demo-3", shipmentId, compareStrings) === 2, "último elemento");
assert(binarySearch(ascending, "aaa", shipmentId, compareStrings) === -1, "objetivo anterior al rango");
assert(binarySearch(ascending, "zzz", shipmentId, compareStrings) === -1, "objetivo posterior al rango");

const optionalNumbers: (number | undefined)[] = [undefined, undefined, 1, 2];
function optionalIdentity(value: number | undefined): number | undefined {
  return value;
}
function compareOptionalNumbers(
  left: number | undefined,
  right: number | undefined,
): number {
  if (left === undefined) {
    return right === undefined ? 0 : -1;
  }
  if (right === undefined) {
    return 1;
  }
  return left - right;
}
assert(linearSearch(optionalNumbers, (value: number | undefined): boolean => value === undefined) === 0, "lineal con undefined");
assert(binarySearch(optionalNumbers, undefined, optionalIdentity, compareOptionalNumbers) === 0, "binaria con undefined y duplicados");
assert(binarySearch([undefined], undefined, optionalIdentity, compareOptionalNumbers) === 0, "único elemento undefined");
assert(binarySearch(optionalNumbers, 2, optionalIdentity, compareOptionalNumbers) === 3, "binaria tras elementos undefined");
const compareOptionalDescending = (left: number | undefined, right: number | undefined): number =>
  -compareOptionalNumbers(left, right);
const optionalDescending = sortItems(optionalNumbers, compareOptionalDescending);
assert(optionalDescending[0] === 2 && optionalDescending[2] === undefined, "ordenación de elementos undefined con comparador");
assert(binarySearch(optionalDescending, undefined, optionalIdentity, compareOptionalDescending) === 2, "binaria con comparador descendente");
const nullableValues: (number | null | undefined)[] = [null, undefined, 1];
assert(
  transformItems(
    nullableValues,
    (value: number | null | undefined): string => String(value),
  ).join(",") === "null,undefined,1",
  "transformación distingue elementos nulos y undefined",
);
assert(
  groupBy(
    nullableValues,
    (value: number | null | undefined): number | null | undefined => value,
  ).get(undefined)?.length === 1,
  "agrupación conserva elementos undefined",
);

const summaries = transformItems(
  shipments,
  (shipment: Shipment): string => `${shipment.id}:${shipment.status}`,
);
assert(summaries.join(",") === "demo-3:source-status-b,demo-1:source-status-a,demo-2:source-status-a", "transformación exacta");
assert(groupBy(shipments, shipmentStatus).get("source-status-a")?.length === 2, "agrupación por estado");
assert(countBy(shipments, shipmentStatus).get("source-status-a") === 2, "conteo por estado");
assert(countBy(inventory, warehouseId).get("warehouse-demo-a") === 2, "conteo por almacén");
assert(sumBy(inventory, stock) === 20, "total de unidades de stock");
assert(averageBy(inventory, stock) === 20 / 3, "stock promedio por registro");
assert(minBy(inventory, stock) === 0, "stock mínimo incluido cero");
assert(maxBy(inventory, stock) === 12, "stock máximo");
const totals = aggregateBy(inventory, warehouseId, stock);
assert(totals.get("warehouse-demo-a") === 8 && totals.get("warehouse-demo-b") === 12, "totales por almacén");
assert(minBy([-3, -1], identity) === -3 && maxBy([-3, -1], identity) === -1, "extremos genéricos negativos");
assert(maxBy([4], identity) === 4, "extremo de un solo elemento");

for (const empty of [[], null, undefined] as const) {
  assert(filterItems<number>(empty, (value: number): boolean => value > 0).length === 0, "filtrado vacío/nulo");
  assert(sortItems<number>(empty, (left: number, right: number): number => left - right).length === 0, "ordenación vacía/nula");
  assert(linearSearch<number>(empty, (value: number): boolean => value === 1) === -1, "lineal vacía/nula");
  assert(binarySearch<number, number>(empty, 1, identity, (left: number, right: number): number => left - right) === -1, "binaria vacía/nula");
  assert(transformItems(empty, identity).length === 0, "transformación vacía/nula");
  assert(groupBy(empty, identity).size === 0, "agrupación vacía/nula");
  assert(countBy(empty, identity).size === 0, "conteo vacío/nulo");
  assert(sumBy(empty, identity) === 0, "suma vacía/nula");
  assert(averageBy(empty, identity) === null, "promedio vacío/nulo");
  assert(minBy(empty, identity) === null && maxBy(empty, identity) === null, "extremos vacíos/nulos");
  assert(aggregateBy(empty, identity, identity).size === 0, "agregación vacía/nula");
}

const sparseNumbers: number[] = new Array<number>(3);
sparseNumbers[1] = 1;
const sparseOperations: readonly (() => unknown)[] = [
  (): unknown => filterItems(sparseNumbers, (value: number): boolean => value > 0),
  (): unknown => sortItems(sparseNumbers, (left: number, right: number): number => left - right),
  (): unknown => linearSearch(sparseNumbers, (value: number): boolean => value === 1),
  (): unknown => binarySearch(sparseNumbers, 1, identity, (left: number, right: number): number => left - right),
  (): unknown => transformItems(sparseNumbers, identity),
  (): unknown => groupBy(sparseNumbers, identity),
  (): unknown => sumBy(sparseNumbers, identity),
  (): unknown => averageBy(sparseNumbers, identity),
  (): unknown => countBy(sparseNumbers, identity),
  (): unknown => aggregateBy(sparseNumbers, identity, identity),
  (): unknown => minBy(sparseNumbers, identity),
  (): unknown => maxBy(sparseNumbers, identity),
];
for (const operation of sparseOperations) {
  assertThrows(operation, TypeError, "huecos rechazados explícitamente");
}
assertThrows(
  (): number[] => filterByCriteria([1], new Array<(item: number) => boolean>(1)),
  TypeError,
  "criterios de filtrado con huecos",
);
assertThrows(
  (): number[] => sortByCriteria([1], new Array<SortCriterion<number>>(1)),
  TypeError,
  "criterios de ordenación con huecos",
);
assertThrows(
  (): number[] => sortItems([1, 2], (): number => NaN),
  RangeError,
  "comparador no finito",
);
const sparseEntities: { id: string }[] = new Array<{ id: string }>(3);
sparseEntities[1] = { id: "present" };
const sparseValidation = validateUniqueIds(sparseEntities);
assert(
  !sparseValidation.valid &&
    sparseValidation.issues.map((issue: { field: string }): string => issue.field).join(",") === "[0],[2]",
  "validación identifica todas las posiciones vacías",
);
assert(!validateUniqueIds([undefined]).valid, "undefined presente no es un ID");
assert(!validateUniqueIds([{ id: "same" }, { id: "same" }]).valid, "IDs duplicados");
assert(validateUniqueIds([]).valid, "array vacío de IDs válido");
assert(!validateUniqueIds(null).valid && !validateUniqueIds(undefined).valid, "IDs en colección nula inválidos");

const validModels: readonly [
  (value: unknown) => ValidationResult<object>,
  unknown,
][] = [
  [validateCustomer, { id: "demo", type: "brand" }],
  [validateCustomer, { id: "demo", type: "recipient" }],
  [validateOrder, { id: "demo", status: "source-status" }],
  [validateShipment, shipments[0]],
  [validateReturnRecord, { id: "demo", status: "source-status", reason: "source-reason" }],
  [validateProduct, { sku: "demo-sku" }],
  [validateWarehouse, { id: "demo", city: "Zaragoza", country: "Spain" }],
  [validateInventory, inventory[0]],
  [validateCarrier, { name: "carrier-demo", countries: ["Spain"] }],
  [validateIncident, { id: "demo", description: "source-description" }],
  [validateSupportQuery, { id: "demo", subject: "source-subject", channel: "email" }],
  [validateContract, { id: "demo", durationYears: 1 }],
];
for (const [validate, model] of validModels) {
  assert(validate(model).valid, "modelo válido");
  for (const invalid of [null, undefined, [], {}]) {
    assert(!validate(invalid).valid, "modelo inválido");
  }
}
assert(!validateCustomer({ id: "demo", type: "other" }).valid, "tipo de cliente no documentado");
assert(!validateWarehouse({ id: "demo", city: "demo", country: "other" }).valid, "país no documentado");
assert(!validateContract({ id: "demo", durationYears: 2 }).valid, "contrato no anual");
assert(!validateSupportQuery({ id: "demo", subject: "demo", channel: "other" }).valid, "canal no documentado");
assert(!validateShipment({ id: "demo", carrier: "demo", status: " ", weight: -1 }).valid, "estado vacío y peso inválido");
assert(!validateShipment({ id: "demo", carrier: "demo", status: "source", weight: undefined }).valid, "campo opcional undefined explícito inválido");
assert(!validateReturnRecord({ id: "demo", status: null }).valid, "estado nulo inválido");
assert(!validateInventory({ sku: "demo", warehouseId: "demo", stock: 1.5 }).valid, "stock fraccionario inválido");
assert(!validateInventory({ sku: "demo", warehouseId: "demo", stock: NaN }).valid, "stock no finito");
assert(!validateCarrier({ name: "demo", countries: new Array<unknown>(1) }).valid, "países con huecos");
assertThrows((): number => sumBy([NaN], identity), RangeError, "suma no finita");
assertThrows((): number | null => minBy([Infinity], identity), RangeError, "mínimo no finito");
assertThrows((): number | null => maxBy([NaN], identity), RangeError, "máximo no finito");
assertThrows((): number => sumBy([Number.MAX_VALUE, Number.MAX_VALUE], identity), RangeError, "desbordamiento de suma");

console.log(JSON.stringify({
  inventoryReport: {
    totalStock: sumBy(inventory, stock),
    averageStock: averageBy(inventory, stock),
    minimumStock: minBy(inventory, stock),
    maximumStock: maxBy(inventory, stock),
    stockByWarehouse: Object.fromEntries(totals),
  },
  shipmentCountByStatus: Object.fromEntries(countBy(shipments, shipmentStatus)),
}, null, 2));
console.log(`${checks} comprobaciones y ejemplos completados correctamente.`);
