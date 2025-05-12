/**
 * Converts a File object to a base64 string
 */
export const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

/**
 * Validates if the provided file is an image and within size limits
 */
export const validateImageFile = (file: File): { valid: boolean; message?: string } => {
  // Check if file is an image
  if (!file.type.startsWith('image/')) {
    return { valid: false, message: 'File must be an image (JPEG, PNG, GIF, etc.)' };
  }
  
  // Check file size (5MB limit)
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes
  if (file.size > MAX_FILE_SIZE) {
    return { valid: false, message: 'Image size must be less than 5MB' };
  }
  
  return { valid: true };
};

/**
 * Resizes an image to specified dimensions while maintaining aspect ratio
 */
export const resizeImage = (
  imageBase64: string, 
  maxWidth: number = 800, 
  maxHeight: number = 800
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageBase64;
    
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions while maintaining aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }
      
      // Create canvas and draw resized image
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Convert canvas to base64
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.85);
      resolve(resizedBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image'));
    };
  });
};

/**
 * Applies a simple filter to an image (brightness, contrast, saturation)
 */
export const applyImageFilter = (
  imageBase64: string,
  filter: 'normal' | 'grayscale' | 'sepia' | 'vintage' | 'bright'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageBase64;
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Apply filter
      switch (filter) {
        case 'grayscale':
          applyGrayscale(ctx, img.width, img.height);
          break;
        case 'sepia':
          applySepia(ctx, img.width, img.height);
          break;
        case 'vintage':
          applyVintage(ctx, img.width, img.height);
          break;
        case 'bright':
          applyBrightness(ctx, img.width, img.height, 30);
          break;
        case 'normal':
        default:
          // No filter
          break;
      }
      
      // Convert canvas to base64
      const filteredBase64 = canvas.toDataURL('image/jpeg', 0.85);
      resolve(filteredBase64);
    };
    
    img.onerror = () => {
      reject(new Error('Error loading image'));
    };
  });
};

// Helper functions for filters
const applyGrayscale = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
    data[i] = avg; // red
    data[i + 1] = avg; // green
    data[i + 2] = avg; // blue
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const applySepia = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, (r * 0.393) + (g * 0.769) + (b * 0.189));
    data[i + 1] = Math.min(255, (r * 0.349) + (g * 0.686) + (b * 0.168));
    data[i + 2] = Math.min(255, (r * 0.272) + (g * 0.534) + (b * 0.131));
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const applyVintage = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    
    data[i] = Math.min(255, (r * 0.9) + 20);
    data[i + 1] = Math.min(255, (g * 0.7) + 20);
    data[i + 2] = Math.min(255, (b * 0.5) + 20);
  }
  
  ctx.putImageData(imageData, 0, 0);
};

const applyBrightness = (ctx: CanvasRenderingContext2D, width: number, height: number, brightness: number) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    data[i] = Math.min(255, data[i] + brightness);
    data[i + 1] = Math.min(255, data[i + 1] + brightness);
    data[i + 2] = Math.min(255, data[i + 2] + brightness);
  }
  
  ctx.putImageData(imageData, 0, 0);
};
