function openSheetById(documentObj, id){
  const overlay = documentObj.getElementById(id);
  if(!overlay){
    return;
  }

  const sheet = overlay.querySelector(".profile-box");
  if(!sheet){
    return;
  }

  overlay.classList.add("show");

  setTimeout(() => {
    sheet.style.transform = "translateY(0)";
  }, 10);
}

function closeSheetById(documentObj, id){
  const overlay = documentObj.getElementById(id);
  if(!overlay){
    return;
  }

  const sheet = overlay.querySelector(".profile-box");
  if(!sheet){
    return;
  }

  sheet.style.transform = "translateY(100%)";

  setTimeout(() => {
    overlay.classList.remove("show");
  }, 300);
}

export function closePendingChangesSheet(documentObj){
  closeSheetById(documentObj, "pendingChangesSheet");
}

export function openPendingChangesSheet(loadPendingChangesFn){
  loadPendingChangesFn();
}

export function openSheet(documentObj, id){
  openSheetById(documentObj, id);
}

export function closeOnboardingSheet(documentObj){
  closeSheetById(documentObj, "onboardingSheet");
}

export function openMemberSelectSheet(documentObj, renderMemberSelectContentFn){
  renderMemberSelectContentFn();

  openSheetById(documentObj, "memberSelectSheet");
}

export function closeMemberSelectSheet(documentObj){
  closeSheetById(documentObj, "memberSelectSheet");
}

export function closeEditMemberSheet(documentObj, clearEditMemberPhotoStateFn){
  const newImg = documentObj.getElementById("editMemberPhotoNewPreviewImg");
  if(newImg && newImg.dataset.objectUrl){
    URL.revokeObjectURL(newImg.dataset.objectUrl);
  }

  if(clearEditMemberPhotoStateFn){
    clearEditMemberPhotoStateFn();
  }

  closeSheetById(documentObj, "editMemberSheet");
}

export function openEditMemberSheet(documentObj){
  openSheetById(documentObj, "editMemberSheet");
}
