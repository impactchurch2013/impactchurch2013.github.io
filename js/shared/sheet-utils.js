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

function getSheetByOverlayId(documentObj, overlayId){
  const overlay = documentObj.getElementById(overlayId);
  if(!overlay){
    return null;
  }
  const sheet = overlay.querySelector(".profile-box");
  if(!sheet){
    return null;
  }
  return sheet;
}

export function applySheetDragResistance(sheetEl, diff){
  if(diff > 0){
    const resistance = diff * 0.7;
    sheetEl.style.transform = `translateY(${resistance}px)`;
  }
}

export function shouldCloseSheetFromSwipe(distance, velocity){
  return distance > 120 || velocity > 0.5;
}

export function bindSwipeCloseToOverlay({
  documentObj,
  overlayId,
  closeFn,
  applyDragResistanceFn = applySheetDragResistance,
  shouldCloseFromSwipeFn = shouldCloseSheetFromSwipe
}){
  const sheet = getSheetByOverlayId(documentObj, overlayId);
  if(!sheet || typeof closeFn !== "function"){
    return;
  }

  if(sheet.dataset.swipeCloseBound === "true"){
    return;
  }
  sheet.dataset.swipeCloseBound = "true";

  let startY = 0;
  let currentY = 0;
  let startTime = 0;
  let dragging = false;

  sheet.addEventListener("touchstart", (event) => {
    if(event.touches.length !== 1 || sheet.scrollTop > 0){
      dragging = false;
      return;
    }
    startY = event.touches[0].clientY;
    currentY = startY;
    startTime = Date.now();
    dragging = true;
  }, { passive: true });

  sheet.addEventListener("touchmove", (event) => {
    if(!dragging || event.touches.length !== 1){
      return;
    }
    currentY = event.touches[0].clientY;
    const diff = currentY - startY;
    applyDragResistanceFn(sheet, diff);
  }, { passive: true });

  function resetDrag(){
    dragging = false;
    sheet.style.transform = "translateY(0)";
  }

  function completeDrag(){
    if(!dragging){
      return;
    }
    dragging = false;

    const distance = currentY - startY;
    const elapsed = Date.now() - startTime;
    const velocity = elapsed > 0 ? (distance / elapsed) : 0;

    if(shouldCloseFromSwipeFn(distance, velocity)){
      closeFn();
      return;
    }
    sheet.style.transform = "translateY(0)";
  }

  sheet.addEventListener("touchend", completeDrag, { passive: true });
  sheet.addEventListener("touchcancel", resetDrag, { passive: true });
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
