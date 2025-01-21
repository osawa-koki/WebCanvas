export type NonEmptyArray<T> = [T, ...T[]];
export type DOMElement = HTMLElement | SVGElement;

const lt = (a: number, b: number): boolean => a < b;
const ltEq = (a: number, b: number): boolean => a <= b;

export const looper = <T, U>(
  arr: NonEmptyArray<T>,
  fx: (item: T, index: number) => U,
  i: number = 0
): U[] => {
  const [first, ...rest] = arr;
  return first !== undefined
    ? [fx(first, i), ...looper(rest as NonEmptyArray<T>, fx, i + 1)]
    : [];
};

export const getElm = (ids: NonEmptyArray<string>): HTMLElement[] => {
  const [first, ...rest] = ids;
  const element = document.getElementById(first);
  if (!element) return [];
  return first !== undefined ? [element, ...getElm(rest as NonEmptyArray<string>)] : [];
};

export const mkElm = (tags: NonEmptyArray<string>): HTMLElement[] => {
  const [first, ...rest] = tags;
  return first !== undefined
    ? [document.createElement(first), ...mkElm(rest as NonEmptyArray<string>)]
    : [];
};

export const append = (
  elements: NonEmptyArray<DOMElement>,
  parent: HTMLElement
): DOMElement[] => {
  const [first, ...rest] = elements;
  return first !== undefined
    ? [parent.appendChild(first), ...append(rest as NonEmptyArray<DOMElement>, parent)]
    : [];
};

export const fromAtoB = (
  start: number,
  end: number,
  step: number = 1,
  includeEnd: boolean = true,
  current: number = 0
): NonEmptyArray<number> => {
  const compare = includeEnd ? ltEq : lt;
  return compare(start + current, end)
    ? [start + current, ...fromAtoB(start, end, step, includeEnd, current + step)]
    : [start + current];
};

export const removeClassifiedItems = (className: string): void[] => {
  const elements = Array.from(document.getElementsByClassName(className));
  return looper(elements as NonEmptyArray<Element>, (element) =>
    element.classList.remove(className)
  );
};
