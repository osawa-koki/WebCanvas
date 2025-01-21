import { NonEmptyArray, getElm, looper, append, removeClassifiedItems, mkElm, fromAtoB } from "./functional.js";

interface Log {
  currentPosition: number;
  images: Blob[];
}

interface Environment {
  color: string;
  bold: number;
  isClicking: boolean;
  pointsTracer: [number, number][];
}

const [canvas, colorBoxes, redo, undo, eraseAll, boldChanger, boldSample] = getElm([
  "canvas",
  "colorBoxes",
  "redo",
  "undo",
  "eraseAll",
  "boldChanger",
  "boldSample"
]) as [
    HTMLCanvasElement,
    HTMLElement,
    HTMLElement,
    HTMLElement,
    HTMLElement,
    HTMLInputElement,
    HTMLElement
  ];

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

const log: Log = {
  currentPosition: 0,
  images: [],
};

const env: Environment = {
  color: "red",
  bold: 5,
  isClicking: false,
  pointsTracer: [],
};

const defaultBold = 10;
const defaultColor = (() => {
  const [onBlack, onWhite] = mkElm(["div", "div"]);
  onBlack.style.backgroundColor = "black";
  onWhite.style.backgroundColor = "white";
  const elms = [onBlack, onWhite] as [HTMLElement, HTMLElement];
  looper(elms, (elm: HTMLElement) => elm.addEventListener("click", setColor));
  append(elms, colorBoxes);
  return onBlack;
})();

looper(fromAtoB(0, 340, 15, false), (i: number) => {
  const [colorElm] = mkElm(["div"]);
  colorElm.style.backgroundColor = `hsla(${i}, 100%, 50%, 1)`;
  colorElm.addEventListener("click", setColor);
  colorBoxes.appendChild(colorElm);
});

function setColor(this: HTMLElement): void {
  removeClassifiedItems("selected");
  this.classList.add("selected");
  env.color = this.style.backgroundColor;
}

function moveStart(): void {
  env.isClicking = true;
  ctx.fillStyle = env.color;
}

function moveEnd(): void {
  if (!env.isClicking) return;
  log.images.splice(log.currentPosition);
  drawLine();
  env.isClicking = false;
}

function drawLine(): void {
  ctx.beginPath();
  ctx.lineWidth = env.bold;
  ctx.strokeStyle = env.color;
  looper(env.pointsTracer as NonEmptyArray<[number, number]>, (points) => {
    ctx.lineTo(points[0], points[1]);
  });
  env.pointsTracer.splice(0);
  ctx.stroke();
  canvas.toBlob((blob: Blob | null) => {
    if (blob) {
      log.images.push(blob);
      log.currentPosition++;
      undo.classList.remove("disabled");
    }
  });
}

canvas.addEventListener("mousedown", moveStart);
canvas.addEventListener("mouseup", moveEnd);
canvas.addEventListener("mouseleave", moveEnd);

canvas.addEventListener("mousemove", function (event: MouseEvent): void {
  if (!env.isClicking) return;

  const clickX = event.pageX;
  const clickY = event.pageY;

  const clientRect = this.getBoundingClientRect();
  const positionX = clientRect.left + window.scrollX;
  const positionY = clientRect.top + window.scrollY;

  const x = clickX - positionX;
  const y = clickY - positionY;

  env.pointsTracer.push([x, y]);
  drawPoint(x, y);
});

function drawPoint(x: number, y: number): void {
  ctx.beginPath();
  ctx.arc(x, y, env.bold / 2, 0, 2 * Math.PI, false);
  ctx.fill();
}

function boldChanged(this: HTMLInputElement): void {
  boldSample.style.width = `${this.value}px`;
  boldSample.style.height = `${this.value}px`;
  env.bold = Number(this.value);
}

boldChanger.addEventListener("change", boldChanged);
boldChanger.addEventListener("input", boldChanged);

eraseAll.addEventListener("click", function (): void {
  if (!window.confirm("削除しますか???")) return;
  log.currentPosition = 0;
  log.images.splice(0);
  looper([undo, redo] as [HTMLElement, HTMLElement], item => item.classList.add("disabled"));
  eraser();
});

function eraser(): void {
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
}

undo.addEventListener("click", function (this: HTMLElement): void {
  if (log.currentPosition < 1) {
    undo.classList.add("disabled");
    return;
  }
  if (this.classList.contains("disabled")) return;
  redo.classList.remove("disabled");
  eraser();
  log.currentPosition--;
  const prevBlob = log.images[log.currentPosition - 1];
  blobOnCanvas(prevBlob);
});

redo.addEventListener("click", function (this: HTMLElement): void {
  if (this.classList.contains("disabled")) return;
  if (log.images.length - 1 < log.currentPosition) {
    redo.classList.add("disabled");
    return;
  }
  eraser();
  log.currentPosition++;
  const nextBlob = log.images[log.currentPosition - 1];
  blobOnCanvas(nextBlob);
});

async function blobOnCanvas(blob: Blob | undefined): Promise<void> {
  if (blob === undefined) return;
  const bitmap = await createImageBitmap(blob);
  ctx.drawImage(bitmap, 0, 0);
}

(() => {
  defaultColor.click();
  boldChanger.value = String(defaultBold);
  boldChanger.dispatchEvent(new Event("input"));
})();
