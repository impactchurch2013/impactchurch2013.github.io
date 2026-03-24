export function clearOnboardingPhotoPreviewStateEntry(windowObj, urlObj){
  if(windowObj.__onboardingPreviewUrl){
    urlObj.revokeObjectURL(windowObj.__onboardingPreviewUrl);
    windowObj.__onboardingPreviewUrl = null;
  }

  windowObj.__onboardingPhotoJpegBlob = null;
}

export function clearEditMemberPhotoStateEntry(windowObj){
  windowObj.__editMemberPhotoJpegBlob = null;
  windowObj.__editMemberRemovePhoto = false;
}

export async function handleEditMemberPhotoInputChangeEntry({
  documentObj,
  windowObj,
  urlObj,
  profileImageMaxFileBytes,
  alertFn,
  imageTooLargeMessage,
  compressImageFileToJpegBlobFn,
  profileImagePreviewProcessFailedMessage,
  onErrorFn
}){
  const input = documentObj.getElementById("editMemberPhoto");
  const preview = documentObj.getElementById("editMemberPhotoNewPreview");
  const previewImg = documentObj.getElementById("editMemberPhotoNewPreviewImg");

  if(!input || !preview || !previewImg){
    return;
  }

  const prevUrl = previewImg.dataset.objectUrl;
  if(prevUrl){
    urlObj.revokeObjectURL(prevUrl);
    delete previewImg.dataset.objectUrl;
  }

  windowObj.__editMemberPhotoJpegBlob = null;
  windowObj.__editMemberRemovePhoto = false;

  const removedNote = documentObj.getElementById("editMemberPhotoRemovedNote");
  if(removedNote){
    removedNote.style.display = "none";
  }

  const currentPhotoWrap = documentObj.getElementById("editMemberCurrentPhotoWrap");
  if(currentPhotoWrap){
    currentPhotoWrap.style.display = "";
  }

  const file = input.files && input.files[0] ? input.files[0] : null;
  if(!file){
    preview.style.display = "none";
    previewImg.removeAttribute("src");
    return;
  }

  if(file.size > profileImageMaxFileBytes){
    alertFn(imageTooLargeMessage);
    input.value = "";
    return;
  }

  try{
    const blob = await compressImageFileToJpegBlobFn(file);
    windowObj.__editMemberPhotoJpegBlob = blob;

    const objectUrl = urlObj.createObjectURL(blob);
    previewImg.dataset.objectUrl = objectUrl;
    previewImg.src = objectUrl;
    previewImg.alt = "New profile photo preview";
    preview.style.display = "block";
  }catch(err){
    onErrorFn(err);
    alertFn(profileImagePreviewProcessFailedMessage);
    input.value = "";
  }
}

export async function handleOnboardingPhotoInputChangeEntry({
  documentObj,
  windowObj,
  urlObj,
  clearOnboardingPhotoPreviewStateFn,
  profileImageMaxFileBytes,
  alertFn,
  imageTooLargeMessage,
  compressImageFileToJpegBlobFn,
  profileImagePreviewProcessFailedMessage,
  onErrorFn
}){
  const input = documentObj.getElementById("onboardPhoto");
  const preview = documentObj.getElementById("onboardPhotoPreview");
  const previewImg = documentObj.getElementById("onboardPhotoPreviewImg");

  clearOnboardingPhotoPreviewStateFn();

  if(!input || !preview || !previewImg){
    return;
  }

  const file = input.files && input.files[0] ? input.files[0] : null;
  if(!file){
    preview.style.display = "none";
    previewImg.removeAttribute("src");
    return;
  }

  if(file.size > profileImageMaxFileBytes){
    alertFn(imageTooLargeMessage);
    input.value = "";
    return;
  }

  try{
    const blob = await compressImageFileToJpegBlobFn(file);
    windowObj.__onboardingPhotoJpegBlob = blob;

    const objectUrl = urlObj.createObjectURL(blob);
    windowObj.__onboardingPreviewUrl = objectUrl;

    previewImg.src = objectUrl;
    previewImg.alt = "Compressed profile photo preview";
    preview.style.display = "block";
  }catch(err){
    onErrorFn(err);
    alertFn(profileImagePreviewProcessFailedMessage);
    input.value = "";
  }
}
