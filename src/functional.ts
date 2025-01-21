/* const */

export const sb = window.innerWidth <= 500;
export const tb = 501 <= window.innerWidth && window.innerWidth <= 1000;
export const fb = 1001 <= window.innerWidth;
export const sbtb = window.innerWidth <= 1000;
export const tbfb = 501 <= window.innerWidth;

export const mailRegex = `^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$`;

export const NAMESPACE_OF_SVG = "http://www.w3.org/2000/svg";
export const SPACE = " ";

/* fx */

export const eq = (a, b) => a === b;
export const ne = (a, b) => a !== b;
export const gt = (a, b) => a > b;
export const gtEq = (a, b) => a >= b;
export const lt = (a, b) => a < b;
export const ltEq = (a, b) => a <= b;

export const add = (a, b) => a + b;
export const reduce = (a, b) => a - b;
export const times = (a, b) => a * b;
export const divide = (a, b) => a / b;
export const power = (a, b) => a ** b;

export const fst = a => a[0];
export const snd = a => a[1];
export const last = a => a[a.length - 1];

export const min = ([a, b, ...c]) => (fst(c) !== undefined) ? min([(a <= b) ? a : b, ...c]) : (a <= b) ? a : b;
export const max = ([a, b, ...c]) => (fst(c) !== undefined) ? max([(b <= a) ? a : b, ...c]) : (b <= a) ? a : b;

export const and = (a, b) => a && b;
export const or = (a, b) => a || b;
export const xor = (a, b) => (a || b) && !(a && b);
export const not = a => !a;
export const truthy = a => Boolean(a);
export const falsy = a => !truthy(a);

export const apply = fx => arg => fx(arg);
export const rec = fx => fx(fx);

export const filter = <T>(fx: (item: T, index: number) => boolean, arr: NonEmptyArray<T>, i = 0): T[] => (arr[i] !== undefined) ? (fx(arr[i], i)) ? [arr[i], ...filter(fx, arr, i + 1)] : [...filter(fx, arr, i + 1)] : [];
export const map = <T, U>(fx: (item: T, index: number) => U, arr: NonEmptyArray<T>, i = 0): U[] => (arr[i] !== undefined) ? [fx(arr[i], i), ...map(fx, arr, i + 1)] : [];
export const looper = ([a, ...b], fx, i = 0) => (a !== undefined) ? [fx(a, i), ...looper(b, fx, i + 1)] : [];
export const any = ([a, ...b], fx) => (a !== undefined) ? or(fx(a), any(b, fx)) : false;
export const all = ([a, ...b], fx) => (a !== undefined) ? and(fx(a), all(b, fx)) : true;
export const anyIndex = ([a, ...b], fx, i = 0) => (a !== undefined) ? or(fx(a, i), anyIndex(b, fx, i + 1)) : false;
export const allIndex = ([a, ...b], fx, i = 0) => (a !== undefined) ? and(fx(a, i), allIndex(b, fx, i + 1)) : true;
export const countSatisfy = ([a, ...b], fx, i = 0) => (a !== undefined) ? countSatisfy(b, fx, i + (fx(a) ? 1 : 0)) : i;
export const minFx = ([a, b, ...c], fx, eq = true) => (fst(c) !== undefined) ? minFx([((eq) ? ltEq : lt)(fx(a), fx(b)) ? a : b, ...c], fx) : ((eq) ? ltEq : lt)(fx(a), fx(b)) ? a : b;
export const maxFx = ([a, b, ...c], fx, eq = true) => (fst(c) !== undefined) ? maxFx([((eq) ? gtEq : gt)(fx(a), fx(b)) ? a : b, ...c], fx) : ((eq) ? gtEq : gt)(fx(a), fx(b)) ? a : b;
export const reducer = ([a, ...b], fx, fxComprehensive = add) => (a !== undefined && 0 < b.length) ? fxComprehensive(fx(a), reducer(b, fx, fxComprehensive)) : fx(a);

export const getElm = ([a, ...b]) => (a !== undefined) ? [document.getElementById(a), ...getElm(b)] : [];
export const mkElm = ([a, ...b]) => (a !== undefined) ? [document.createElement(a), ...mkElm(b)] : [];
export const mkElmSVG = ([a, ...b]) => (a !== undefined) ? [document.createElementNS(NAMESPACE_OF_SVG, a), ...mkElmSVG(b)] : [];
export const zFill = (n, len) => (Array(len).join("0") + n).slice(-len);
export const URLencodeAssoc = obj => Object.keys(obj).map(key => key + "=" + encodeURIComponent(obj[key])).join("&");
export const between = (a, b) => c => and(a <= c.length, c.length <= b);
export const switcher = (tf, afx, bfx, arg = null) => (tf) ? afx(arg) : bfx(arg);

export const regex = a => b => b.match(a);
export const mailCheck = regex(mailRegex);

export const regexGrouping = (a, b) => a.match(b).groups;

export const removeChildren = parent => (parent.firstChild) ? [parent.removeChild(parent.firstChild), removeChildren(parent)] : [];

export const append = ([a, ...b], parent) => (a !== undefined) ? [parent.appendChild(a), ...append(b, parent)] : [];
export const mkBr = () => document.createElement("br");
export const appendText = ([a, ...b], parent) => (a !== undefined && 1 <= b.length) ? [append([document.createTextNode(a), mkBr()], parent), appendText(b, parent)] : (b.length === 0) ? append([document.createTextNode(a)], parent) : [];
export const push = ([a, ...b], list) => (a !== undefined) ? [list.push(a), ...push(b, list)] : [];

export const doNtimes = (n, fx, i = 0) => (i < n) ? [fx(i), ...doNtimes(n, fx, i + 1)] : [];

export const random = (a, b) => Math.floor(Math.random() * (b + 1 - a) + a);
export const round = n => i => Math.round(i * n) / n;
export const round100 = round(100);

export const NxN = (a, b, c = null) => [new Array(a).fill(new Array(b).fill(c))];
export const NxNfx = (a, b, fx) => [new Array(a).fill(new Array(b).fill(fx()))];

export const fromAtoB = (a, b, step = 1, eq = true, i = 0) => (((eq) ? ltEq : lt)(a + i, b)) ? [a + i, ...fromAtoB(a, b, step, eq, i + step)] : [];

export const flatter = ([a, ...b]) => (a !== undefined) ? (Array.isArray(a)) ? [...flatter(a)] : [a, ...flatter(b)] : []; // ★★★
export const mixupMesh = (a, b, i = 0) =>  (i < a.length * b.length) ? [[a[Math.floor(i / b.length)], b[i % b.length]], ...mixupMesh(a, b, i + 1)] : [];

export const removeClassifiedItems = a => looper(Array.from(document.getElementsByClassName(a)), b => b.classList.remove(a));

/* type */

type NonEmptyArray<T> = [T, ...T[]];
