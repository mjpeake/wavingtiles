import { noise } from '@chriscourses/perlin-noise';

function DrawTile(canvas: HTMLCanvasElement, x: number, y: number, size: number, colors : string[], step: number) {
    const ctx = canvas.getContext("2d");
    if (!ctx) {
        console.error(`element with id "${canvas.id}" does not contain canvas.`);
        return
    }

    const tileNoise = getNoise(x, y, step);
    const tileSize = size * getScale(tileNoise, colors.length);
    const sizeDelta = size - tileSize;

    ctx.beginPath();
    ctx.rect(x + (size - tileSize) / 2, y + (size - tileSize) / 2, size - sizeDelta, size - sizeDelta);
    ctx.fillStyle = getColour(tileNoise, colors);
    ctx.fill();
    ctx.closePath();
}

function getNoise(x: number, y: number, z: number = 0) {
    const noiseValue = noise(x * 0.001, y * 0.001, z);
    return noiseValue;
}

function getColour(noise: number, colors: string[]) {
    const index = Math.floor(noise * colors.length);
    return colors[index];
}

function getScale(noise: number, colorCount: number, minScale: number = 0.1, maxScale: number = 0.7) {
    const index = Math.floor(noise * colorCount);
    const step = 1 / colorCount;
    const max = step * (index + 1);
    const min = step * index;

    const midpoint = (max + min) / 2;
    const normalizedScale = 1 - (Math.abs(noise - midpoint) / ((max - min) / 2));
    const scale = minScale + normalizedScale * (maxScale - minScale);
    return scale;
}

export default DrawTile;