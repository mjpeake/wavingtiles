import DrawTile from './tile';

function Draw(canvas: HTMLCanvasElement, colors: string[], backgroundColor: string, density: number): void {
    (async () => {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            console.error(`element with id "${canvas.id}" does not contain canvas.`);
            return
        }

        let step = 0;
        const speed = 0.0025;
        let run = function() {
            ctx.canvas.width = canvas.offsetWidth;
            ctx.canvas.height = canvas.offsetHeight;
            step += speed;
            drawTiles(canvas, density, colors, backgroundColor, step);
            requestAnimationFrame(run);
        }
        requestAnimationFrame(run);
    })();
}

function drawTiles(canvas: HTMLCanvasElement, density: number, colors: string[], backgroundColor: string, step: number) {
    drawBackground(canvas, backgroundColor);

    const tileSize = Math.floor(canvas.height / density);
    const offsetX = Math.floor((canvas.width - (Math.floor(canvas.width / tileSize) * tileSize)) / 2);
    const offsetY = Math.floor((canvas.height - (Math.floor(canvas.height / tileSize) * tileSize)) / 2);
    for (let i = 0; i < Math.floor(canvas.width / tileSize); i++) {
        for (let j = 0; j < Math.floor(canvas.height / tileSize); j++) {
            const x = (i * tileSize) + offsetX;
            const y = (j * tileSize) + offsetY;
            DrawTile(canvas, x, y, tileSize, colors, step);
        }
    }
}

function drawBackground(canvas: HTMLCanvasElement, color : string) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error(`element with id "${canvas.id}" does not contain canvas.`);
        return
    }
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.rect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
    ctx.fill();
}

export default Draw;