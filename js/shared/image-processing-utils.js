const PROFILE_IMAGE_MAX_WIDTH = 800;
const PROFILE_IMAGE_JPEG_QUALITY = 0.7;

export function fileToDataUrl(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export function loadHtmlImage(src){
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not load image"));
    image.src = src;
  });
}

export async function compressImageFileToJpegBlob(file, options = {}){
  const maxWidth = options.maxWidth ?? PROFILE_IMAGE_MAX_WIDTH;
  const quality = options.quality ?? PROFILE_IMAGE_JPEG_QUALITY;

  let source;
  let bitmap = null;

  if(typeof createImageBitmap === "function"){
    try{
      bitmap = await createImageBitmap(file);
      source = bitmap;
    }catch{
      const dataUrl = await fileToDataUrl(file);
      source = await loadHtmlImage(dataUrl);
    }
  }else{
    const dataUrl = await fileToDataUrl(file);
    source = await loadHtmlImage(dataUrl);
  }

  const sourceWidth = source.width || source.naturalWidth;
  const sourceHeight = source.height || source.naturalHeight;

  let targetWidth = sourceWidth;
  let targetHeight = sourceHeight;
  if(sourceWidth > maxWidth){
    targetWidth = maxWidth;
    targetHeight = Math.round((sourceHeight * maxWidth) / sourceWidth);
  }

  const canvas = document.createElement("canvas");
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const context = canvas.getContext("2d");
  context.drawImage(source, 0, 0, targetWidth, targetHeight);

  if(bitmap && bitmap.close){
    bitmap.close();
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if(blob){
          resolve(blob);
        }else{
          reject(new Error("Could not compress image"));
        }
      },
      "image/jpeg",
      quality
    );
  });
}
