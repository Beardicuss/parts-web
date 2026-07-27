import { describe, expect, it } from 'vitest';
import { MAX_IMAGE_BYTES, validateImageFile } from './validateImageFile.js';

const signatures = {
  jpeg: [0xff, 0xd8, 0xff, 0xe0],
  png: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 0],
  webp: [0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]
};

function imageFile(bytes, name, type) {
  return new File([new Uint8Array(bytes)], name, { type });
}

describe('validateImageFile', () => {
  it.each([
    [signatures.jpeg, 'part.jpg', 'image/jpeg'],
    [signatures.png, 'part.png', 'image/png'],
    [signatures.webp, 'part.webp', 'image/webp']
  ])('accepts a matching approved format', async (bytes, name, type) => {
    await expect(
      validateImageFile(imageFile(bytes, name, type), { decode: false })
    ).resolves.toEqual(expect.objectContaining({ mimeType: type }));
  });

  it('rejects a renamed unsupported file', async () => {
    const spoofed = imageFile([0x3c, 0x73, 0x76, 0x67], 'malicious.png', 'image/png');
    await expect(validateImageFile(spoofed, { decode: false })).rejects.toThrow(
      'contents do not match'
    );
  });

  it('rejects empty and oversized files', async () => {
    await expect(
      validateImageFile(imageFile([], 'empty.png', 'image/png'), { decode: false })
    ).rejects.toThrow('empty');

    const oversized = new File([new Uint8Array(MAX_IMAGE_BYTES + 1)], 'large.jpg', {
      type: 'image/jpeg'
    });
    await expect(validateImageFile(oversized, { decode: false })).rejects.toThrow(
      '8 MB or smaller'
    );
  });

  it('rejects a file that has an image signature but cannot be decoded', async () => {
    const originalCreateImageBitmap = globalThis.createImageBitmap;
    globalThis.createImageBitmap = () => Promise.reject(new Error('decoder rejected file'));
    try {
      await expect(
        validateImageFile(imageFile(signatures.png, 'damaged.png', 'image/png'))
      ).rejects.toThrow('damaged or cannot be decoded');
    } finally {
      globalThis.createImageBitmap = originalCreateImageBitmap;
    }
  });
});
