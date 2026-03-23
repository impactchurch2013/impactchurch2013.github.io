export function openPhotoViewer(documentObj, photo){
  const viewer = documentObj.getElementById("photoViewer");
  const img = documentObj.getElementById("photoViewerImg");
  if(!viewer || !img){
    return;
  }

  img.src = photo;
  viewer.style.display = "flex";
}

export function closePhotoViewer(documentObj){
  const viewer = documentObj.getElementById("photoViewer");
  if(!viewer){
    return;
  }

  viewer.style.display = "none";
}
