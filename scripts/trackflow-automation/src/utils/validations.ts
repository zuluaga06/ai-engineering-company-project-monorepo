import type {
  Carrier,
  Contract,
  Country,
  Customer,
  CustomerType,
  Incident,
  Inventory,
  Order,
  Product,
  ReturnRecord,
  Shipment,
  SupportChannel,
  SupportQuery,
  ValidationIssue,
  ValidationResult,
  Warehouse,
} from "../types/models.ts";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCustomerType(value: unknown): value is CustomerType {
  return value === "brand" || value === "recipient";
}

function isCountry(value: unknown): value is Country {
  return value === "United States" || value === "Spain";
}

function isSupportChannel(value: unknown): value is SupportChannel {
  return value === "email" || value === "WhatsApp" || value === "phone";
}

function isNonNegativeNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

function isStock(value: unknown): value is number {
  return isNonNegativeNumber(value) && Number.isSafeInteger(value);
}

function isAnnualDuration(value: unknown): value is 1 {
  return value === 1;
}

function isCountries(value: unknown): value is readonly Country[] {
  if (!Array.isArray(value)) {
    return false;
  }
  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index) || !isCountry(value[index])) {
      return false;
    }
  }
  return true;
}

interface FieldRule<T> {
  check: (value: unknown) => value is T;
  message: string;
  optional?: boolean;
}

type ModelSchema<T> = { [K in keyof T]-?: FieldRule<T[K]> };

const textRule: FieldRule<string> = {
  check: isNonEmptyString,
  message: "Debe ser un texto no vacío.",
};
const countryRule: FieldRule<Country> = {
  check: isCountry,
  message: 'Debe ser "United States" o "Spain", los países documentados.',
};

function matchesSchema<T extends object>(
  value: unknown,
  schema: ModelSchema<T>,
  issues: ValidationIssue[],
): value is T {
  if (!isRecord(value)) {
    issues.push({ field: "", message: "Se esperaba un objeto." });
    return false;
  }
  for (const field in schema) {
    const rule = schema[field];
    if (rule.optional === true && !Object.hasOwn(value, field)) {
      continue;
    }
    if (!rule.check(value[field])) {
      issues.push({ field, message: rule.message });
    }
  }
  return issues.length === 0;
}

function validateModel<T extends object>(
  value: unknown,
  schema: ModelSchema<T>,
): ValidationResult<T> {
  const issues: ValidationIssue[] = [];
  return matchesSchema(value, schema, issues)
    ? { valid: true, value, issues: [] }
    : { valid: false, issues };
}

export function validateCustomer(value: unknown): ValidationResult<Customer> {
  return validateModel<Customer>(value, {
    id: textRule,
    type: {
      check: isCustomerType,
      message: 'Debe ser "brand" o "recipient", los tipos documentados.',
    },
  });
}

export function validateOrder(value: unknown): ValidationResult<Order> {
  return validateModel<Order>(value, { id: textRule, status: textRule });
}

export function validateShipment(value: unknown): ValidationResult<Shipment> {
  return validateModel<Shipment>(value, {
    id: textRule,
    carrier: textRule,
    status: textRule,
    destination: { ...textRule, optional: true },
    urgency: { ...textRule, optional: true },
    country: { ...countryRule, optional: true },
    weight: {
      check: isNonNegativeNumber,
      optional: true,
      message: "El peso debe ser un número finito no negativo.",
    },
  });
}

export function validateReturnRecord(
  value: unknown,
): ValidationResult<ReturnRecord> {
  return validateModel<ReturnRecord>(value, {
    id: textRule,
    status: textRule,
    productSku: { ...textRule, optional: true },
    reason: { ...textRule, optional: true },
    country: { ...countryRule, optional: true },
  });
}

export function validateProduct(value: unknown): ValidationResult<Product> {
  return validateModel<Product>(value, { sku: textRule });
}

export function validateWarehouse(value: unknown): ValidationResult<Warehouse> {
  return validateModel<Warehouse>(value, {
    id: textRule,
    city: textRule,
    country: countryRule,
  });
}

export function validateInventory(value: unknown): ValidationResult<Inventory> {
  return validateModel<Inventory>(value, {
    sku: textRule,
    warehouseId: textRule,
    stock: {
      check: isStock,
      message: "El stock debe ser un entero seguro no negativo.",
    },
  });
}

export function validateCarrier(value: unknown): ValidationResult<Carrier> {
  return validateModel<Carrier>(value, {
    name: textRule,
    countries: {
      check: isCountries,
      message: "Debe ser un array sin huecos de países documentados.",
    },
  });
}

export function validateIncident(value: unknown): ValidationResult<Incident> {
  return validateModel<Incident>(value, {
    id: textRule,
    description: textRule,
  });
}

export function validateSupportQuery(
  value: unknown,
): ValidationResult<SupportQuery> {
  return validateModel<SupportQuery>(value, {
    id: textRule,
    subject: textRule,
    channel: {
      check: isSupportChannel,
      message: 'Debe ser "email", "WhatsApp" o "phone", los canales documentados.',
    },
  });
}

export function validateContract(value: unknown): ValidationResult<Contract> {
  return validateModel<Contract>(value, {
    id: textRule,
    durationYears: {
      check: isAnnualDuration,
      message: "Los contratos documentados son anuales (1 año).",
    },
  });
}

export function validateUniqueIds(value: unknown): ValidationResult<string[]> {
  if (!Array.isArray(value)) {
    return {
      valid: false,
      issues: [{ field: "", message: "Se esperaba una colección." }],
    };
  }

  const issues: ValidationIssue[] = [];
  const seen = new Set<string>();
  const ids: string[] = [];

  for (let index = 0; index < value.length; index += 1) {
    if (!Object.hasOwn(value, index)) {
      issues.push({
        field: `[${index}]`,
        message: "La posición del array está vacía y no contiene un identificador.",
      });
      continue;
    }

    const item: unknown = value[index];
    if (!isRecord(item) || !isNonEmptyString(item.id)) {
      issues.push({
        field: `[${index}].id`,
        message: "Debe ser un texto no vacío.",
      });
      continue;
    }

    if (seen.has(item.id)) {
      issues.push({
        field: `[${index}].id`,
        message: "El identificador técnico está duplicado.",
      });
      continue;
    }

    seen.add(item.id);
    ids.push(item.id);
  }

  return issues.length === 0
    ? { valid: true, value: ids, issues: [] }
    : { valid: false, issues };
}
