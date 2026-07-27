import { describe, expect, it, vi } from 'vitest';
import { calculateContainSize, processImageFile } from './processImageFile.js';

function webpFile(size = 100) {
  const signature = [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50];
  return new File([new Uint8Array([...signature, ...new Array(size).fill(0)])], 'part.webp', {
    type: 'image/webp'
  });
}

function canvasThatReturns(blob) {
  return {
    width: 0,
    height: 0,
    getContext: () => ({ drawImage: vi.fn() }),
    toBlob: (callback) => callback(blob)
  };
}

describe('processImageFile', () => {
  it('calculates a non-upscaled contain size', () => {
    expect(calculateContainSize(4000, 2000)).toEqual({ width: 1920, height: 960 });
    expect(calculateContainSize(800, 600)).toEqual({ width: 800, height: 600 });
  });

  it('resizes a large source and returns WebP output', async () => {
    const source = webpFile(300);
    const bitmap = { width: 4000, height: 2000, close: vi.fn() };
    const output = new Blob([new Uint8Array(50)], { type: 'image/webp' });
    const result = await processImageFile(source, {
      decode: async () => bitmap,
      createCanvas: () => canvasThatReturns(output)
    });

    expect(result.file.type).toBe('image/webp');
    expect(result.width).toBe(1920);
    expect(result.height).toBe(960);
    expect(result.outputBytes).toBe(50);
    expect(result.thumbnailFile.type).toBe('image/webp');
    expect(bitmap.close).toHaveBeenCalled();
  });

  it('keeps an already-small WebP when re-encoding would make it larger', async () => {
    const source = webpFile(20);
    const output = new Blob([new Uint8Array(source.size + 10)], { type: 'image/webp' });
    const result = await processImageFile(source, {
      decode: async () => ({ width: 640, height: 480, close: vi.fn() }),
      createCanvas: () => canvasThatReturns(output)
    });

    expect(result.file).toBe(source);
    expect(result.optimized).toBe(false);
  });
});
