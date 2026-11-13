import { assertDenseCollection } from "./collections.ts";
import type { NullableCollection } from "./collections.ts";

function addFiniteNumbers(total: number, value: number): number {
  if (!Number.isFinite(value)) {
    throw new RangeError("La agregación requiere valores numéricos finitos.");
  }

  const result = total + value;
  if (!Number.isFinite(result)) {
    throw new RangeError("El resultado de la agregación excede el rango numérico.");
  }

  return result;
}

export function transformItems<T, U>(
  items: NullableCollection<T>,
  transform: (item: T, index: number) => U,
): U[] {
  assertDenseCollection(items);
  return items == null ? [] : items.map(transform);
}

export function groupBy<T, K>(
  items: NullableCollection<T>,
  selectKey: (item: T) => K,
): Map<K, T[]> {
  assertDenseCollection(items);
  const groups = new Map<K, T[]>();

  if (items == null) {
    return groups;
  }

  for (const item of items) {
    const key = selectKey(item);
    const group = groups.get(key);

    if (group === undefined) {
      groups.set(key, [item]);
    } else {
      group.push(item);
    }
  }

  return groups;
}

export function sumBy<T>(
  items: NullableCollection<T>,
  selectValue: (item: T) => number,
): number {
  assertDenseCollection(items);
  let total = 0;

  if (items == null) {
    return total;
  }

  for (const item of items) {
    total = addFiniteNumbers(total, selectValue(item));
  }

  return total;
}

export function averageBy<T>(
  items: NullableCollection<T>,
  selectValue: (item: T) => number,
): number | null {
  if (items == null || items.length === 0) {
    return null;
  }

  return sumBy(items, selectValue) / items.length;
}

export function aggregateBy<T, K>(
  items: NullableCollection<T>,
  selectKey: (item: T) => K,
  selectValue: (item: T) => number,
): Map<K, number> {
  assertDenseCollection(items);
  const totals = new Map<K, number>();

  if (items == null) {
    return totals;
  }

  for (const item of items) {
    const key = selectKey(item);
    totals.set(key, addFiniteNumbers(totals.get(key) ?? 0, selectValue(item)));
  }

  return totals;
}

export function countBy<T, K>(
  items: NullableCollection<T>,
  selectKey: (item: T) => K,
): Map<K, number> {
  return aggregateBy(items, selectKey, (): number => 1);
}

function extremeBy<T>(
  items: NullableCollection<T>,
  selectValue: (item: T) => number,
  choose: (left: number, right: number) => number,
): number | null {
  assertDenseCollection(items);
  let extreme: number | null = null;
  for (const item of items ?? []) {
    const value = selectValue(item);
    if (!Number.isFinite(value)) {
      throw new RangeError("La agregación requiere valores numéricos finitos.");
    }
    extreme = extreme === null ? value : choose(extreme, value);
  }
  return extreme;
}

export function minBy<T>(
  items: NullableCollection<T>,
  selectValue: (item: T) => number,
): number | null {
  return extremeBy(items, selectValue, Math.min);
}

export function maxBy<T>(
  items: NullableCollection<T>,
  selectValue: (item: T) => number,
): number | null {
  return extremeBy(items, selectValue, Math.max);
}
