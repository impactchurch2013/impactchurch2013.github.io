export function closePendingChangesSheet(documentObj){
  const overlay = documentObj.getElementById("pendingChangesSheet");
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

export function openPendingChangesSheet(loadPendingChangesFn){
  loadPendingChangesFn();
}

export function openSheet(documentObj, id){
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

export function closeOnboardingSheet(documentObj){
  const overlay = documentObj.getElementById("onboardingSheet");
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

export function openMemberSelectSheet(documentObj, renderMemberSelectContentFn){
  renderMemberSelectContentFn();

  const overlay = documentObj.getElementById("memberSelectSheet");
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

export function closeMemberSelectSheet(documentObj){
  const overlay = documentObj.getElementById("memberSelectSheet");
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

export function closeEditMemberSheet(documentObj, clearEditMemberPhotoStateFn){
  const newImg = documentObj.getElementById("editMemberPhotoNewPreviewImg");
  if(newImg && newImg.dataset.objectUrl){
    URL.revokeObjectURL(newImg.dataset.objectUrl);
  }

  if(clearEditMemberPhotoStateFn){
    clearEditMemberPhotoStateFn();
  }

  const overlay = documentObj.getElementById("editMemberSheet");
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
