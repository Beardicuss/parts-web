import { ImageValidationError, MAX_IMAGE_BYTES, validateImageFile } from './validateImageFile.js';

export const MAX_IMAGE_DIMENSION = 1920;
export const THUMBNAIL_DIMENSION = 640;
export const WEBP_QUALITY = 0.82;
export const WEBP_QUALITY_FLOOR = 0.68;

export function calculateContainSize(width, height, maximum = MAX_IMAGE_DIMENSION) {
  const scale = Math.min(1, maximum / width, maximum / height);
  return {
    width: Math.max(1, Math.round(width * scale)),
    height: Math.max(1, Math.round(height * scale))
  };
}

function canvasToBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('The browser could not encode this image as WebP.'));
      },
      'image/webp',
      quality
    );
  });
}

export async function processImageFile(
  file,
  {
    decode = (source) => createImageBitmap(source, { imageOrientation: 'from-image' }),
    createCanvas = () => document.createElement('canvas')
  } = {}
) {
  await validateImageFile(file, { decode: false });

  let bitmap;
  try {
    bitmap = await decode(file);
  } catch {
    throw new ImageValidationError('decode', 'The image is damaged or cannot be decoded.');
  }

  try {
    const dimensions = calculateContainSize(bitmap.width, bitmap.height);
    const canvas = createCanvas();
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;
    const context = canvas.getContext('2d', { alpha: false });
    if (!context) throw new Error('Image processing is unavailable in this browser.');
    context.drawImage(bitmap, 0, 0, dimensions.width, dimensions.height);

    let output = await canvasToBlob(canvas, WEBP_QUALITY);
    if (output.size > 1_500_000) {
      output = await canvasToBlob(canvas, 0.75);
    }
    if (output.size > 1_500_000) {
      output = await canvasToBlob(canvas, WEBP_QUALITY_FLOOR);
    }
    if (output.size > MAX_IMAGE_BYTES) {
      throw new ImageValidationError('processed_size', 'The optimized image is still too large.');
    }

    const baseName = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]+/g, '-');
    const thumbnailDimensions = calculateContainSize(
      bitmap.width,
      bitmap.height,
      THUMBNAIL_DIMENSION
    );
    const thumbnailCanvas = createCanvas();
    thumbnailCanvas.width = thumbnailDimensions.width;
    thumbnailCanvas.height = thumbnailDimensions.height;
    const thumbnailContext = thumbnailCanvas.getContext('2d', { alpha: false });
    if (!thumbnailContext) throw new Error('Image processing is unavailable in this browser.');
    thumbnailContext.drawImage(bitmap, 0, 0, thumbnailDimensions.width, thumbnailDimensions.height);
    const thumbnailBlob = await canvasToBlob(thumbnailCanvas, 0.74);
    const thumbnailFile = new File([thumbnailBlob], `${baseName || 'part-image'}-thumbnail.webp`, {
      type: 'image/webp',
      lastModified: Date.now()
    });

    if (
      file.type === 'image/webp' &&
      dimensions.width === bitmap.width &&
      dimensions.height === bitmap.height &&
      output.size >= file.size
    ) {
      return {
        file,
        width: bitmap.width,
        height: bitmap.height,
        originalBytes: file.size,
        outputBytes: file.size,
        optimized: false,
        thumbnailFile
      };
    }

    const processedFile = new File([output], `${baseName || 'part-image'}.webp`, {
      type: 'image/webp',
      lastModified: Date.now()
    });
    return {
      file: processedFile,
      width: dimensions.width,
      height: dimensions.height,
      originalBytes: file.size,
      outputBytes: processedFile.size,
      optimized: true,
      thumbnailFile
    };
  } finally {
    bitmap.close?.();
  }
}
