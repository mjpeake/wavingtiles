import Draw from "./tiles/draw";

function WavingTiles(id: string = "wavingtiles", colors: string[], backgroundColor: string, density: number = 50): void {
    let container = <HTMLCanvasElement>document.getElementById(id);
    if (!container) {
        console.error(`element with id "${id}" not found.`);
        return;
    }
    let canvas: HTMLCanvasElement;
    if (container instanceof HTMLCanvasElement) {
        canvas = container
    } else {
        canvas = loadCanvas(container);
    }
    Draw(canvas, colors, backgroundColor, density);
}

function loadCanvas(div: HTMLElement): HTMLCanvasElement {
    var canvas = <HTMLCanvasElement>document.createElement('canvas')
    canvas.id = "wavingtiles-canvas";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    div.appendChild(canvas);
    return canvas;
}

export {
    WavingTiles,
};