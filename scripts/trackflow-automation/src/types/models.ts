export type EntityId = string;

export type CustomerType = "brand" | "recipient";
export type Country = "United States" | "Spain";
export type SupportChannel = "email" | "WhatsApp" | "phone";

export interface Customer {
  id: EntityId;
  type: CustomerType;
}

export interface Order {
  id: EntityId;
  status: string;
}

export interface Shipment {
  id: EntityId;
  carrier: string;
  status: string;
  destination?: string;
  weight?: number;
  urgency?: string;
  country?: Country;
}

export interface ReturnRecord {
  id: EntityId;
  status: string;
  productSku?: string;
  reason?: string;
  country?: Country;
}

export interface Product {
  sku: string;
}

export interface Warehouse {
  id: EntityId;
  city: string;
  country: Country;
}

export interface Inventory {
  sku: string;
  warehouseId: EntityId;
  stock: number;
}

export interface Carrier {
  name: string;
  countries: readonly Country[];
}

export interface Incident {
  id: EntityId;
  description: string;
}

export interface SupportQuery {
  id: EntityId;
  channel: SupportChannel;
  subject: string;
}

export interface Contract {
  id: EntityId;
  durationYears: 1;
}

export type TrackFlowEntity =
  | Customer
  | Order
  | Shipment
  | ReturnRecord
  | Product
  | Warehouse
  | Inventory
  | Carrier
  | Incident
  | SupportQuery
  | Contract;

export interface ValidationIssue {
  field: string;
  message: string;
}

export type ValidationResult<T> =
  | { valid: true; value: T; issues: [] }
  | { valid: false; issues: ValidationIssue[] };
