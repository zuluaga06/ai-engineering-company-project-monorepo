export type NullableCollection<T> = readonly T[] | null | undefined;
export type Comparator<T> = (left: T, right: T) => number;
export type SortDirection = "ascending" | "descending";

export interface SortCriterion<T> {
  compare: Comparator<T>;
  direction: SortDirection;
}

export function assertDenseCollection<T>(items: NullableCollection<T>): void {
  if (items == null) {
    return;
  }
  for (let index = 0; index < items.length; index += 1) {
    if (!Object.hasOwn(items, index)) {
      throw new TypeError(`La posición [${index}] del array está vacía.`);
    }
  }
}

export function filterItems<T>(
  items: NullableCollection<T>,
  predicate: (item: T, index: number) => boolean,
): T[] {
  assertDenseCollection(items);
  return items == null ? [] : items.filter(predicate);
}

export function filterByCriteria<T>(
  items: NullableCollection<T>,
  criteria: readonly ((item: T) => boolean)[],
): T[] {
  assertDenseCollection(criteria);
  return filterItems(items, (item: T): boolean =>
    criteria.every((criterion: (item: T) => boolean): boolean => criterion(item)),
  );
}

export function sortItems<T>(
  items: NullableCollection<T>,
  compare: Comparator<T>,
): T[] {
  assertDenseCollection(items);
  // El envoltorio evita que Array.sort omita el comparador para valores undefined.
  return items == null
    ? []
    : items
        .map((item: T): { item: T } => ({ item }))
        .sort((left: { item: T }, right: { item: T }): number => {
          const comparison = compare(left.item, right.item);
          if (!Number.isFinite(comparison)) {
            throw new RangeError("El comparador debe devolver un número finito.");
          }
          return comparison;
        })
        .map((entry: { item: T }): T => entry.item);
}

export function sortByCriteria<T>(
  items: NullableCollection<T>,
  criteria: readonly SortCriterion<T>[],
): T[] {
  assertDenseCollection(criteria);
  return sortItems(items, (left: T, right: T): number => {
    for (const criterion of criteria) {
      const comparison = criterion.compare(left, right);
      if (!Number.isFinite(comparison)) {
        throw new RangeError("El comparador debe devolver un número finito.");
      }
      if (comparison !== 0) {
        return criterion.direction === "ascending" ? comparison : -comparison;
      }
    }
    return 0;
  });
}
