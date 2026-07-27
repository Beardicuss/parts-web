export const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = Object.freeze({
  'image/jpeg': ['jpg', 'jpeg'],
  'image/png': ['png'],
  'image/webp': ['webp']
});

export class ImageValidationError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'ImageValidationError';
    this.code = code;
  }
}

function extensionOf(filename) {
  return filename.split('.').pop()?.toLowerCase() ?? '';
}

function detectedMimeType(bytes) {
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return 'image/png';
  }
  if (
    String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF' &&
    String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  ) {
    return 'image/webp';
  }
  return null;
}

async function decodeImage(file) {
  if (typeof createImageBitmap === 'function') {
    const bitmap = await createImageBitmap(file);
    const dimensions = { width: bitmap.width, height: bitmap.height };
    bitmap.close();
    return dimensions;
  }

  const objectUrl = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.decoding = 'async';
    image.src = objectUrl;
    await image.decode();
    return { width: image.naturalWidth, height: image.naturalHeight };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

export async function validateImageFile(file, { decode = true } = {}) {
  if (!(file instanceof Blob) || !file.name) {
    throw new ImageValidationError('select', 'Select an image file.');
  }
  if (file.size === 0) throw new ImageValidationError('empty', 'The selected image is empty.');
  if (file.size > MAX_IMAGE_BYTES) {
    throw new ImageValidationError('size', 'The image must be 8 MB or smaller.');
  }

  const extensions = ALLOWED_IMAGE_TYPES[file.type];
  const extension = extensionOf(file.name);
  if (!extensions?.includes(extension)) {
    throw new ImageValidationError(
      'format',
      'Use a JPG, PNG, or WebP image with a matching file extension.'
    );
  }

  const signature = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const actualType = detectedMimeType(signature);
  if (actualType !== file.type) {
    throw new ImageValidationError(
      'signature',
      'The file contents do not match its declared image format.'
    );
  }

  let dimensions = null;
  if (decode) {
    try {
      dimensions = await decodeImage(file);
    } catch {
      throw new ImageValidationError('decode', 'The image is damaged or cannot be decoded.');
    }
    if (!dimensions.width || !dimensions.height) {
      throw new ImageValidationError('dimensions', 'The image has invalid dimensions.');
    }
  }

  return { mimeType: actualType, extension, ...dimensions };
}
