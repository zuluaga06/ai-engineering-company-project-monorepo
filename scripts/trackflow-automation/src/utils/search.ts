import { assertDenseCollection } from "./collections.ts";

export function linearSearch<T>(
  items: readonly T[] | null | undefined,
  predicate: (item: T, index: number) => boolean,
): number {
  if (items == null) {
    return -1;
  }
  assertDenseCollection(items);

  for (let index = 0; index < items.length; index += 1) {
    if (predicate(items[index]!, index)) {
      return index;
    }
  }

  return -1;
}

export function binarySearch<T, K>(
  items: readonly T[] | null | undefined,
  target: K,
  selectKey: (item: T) => K,
  compare: (left: K, right: K) => number,
): number {
  if (items == null) {
    return -1;
  }
  assertDenseCollection(items);

  let low = 0;
  let high = items.length;

  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    const item = items[middle]!;

    if (compare(selectKey(item), target) < 0) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  if (low >= items.length) {
    return -1;
  }

  return compare(selectKey(items[low]!), target) === 0 ? low : -1;
}
