export function initializeEditorAdminBootFlow({
  documentObj,
  windowObj,
  hideEditorUiFn,
  initializeRoleFlagsFn,
  bindEditorToggleActionFn,
  toggleEditorModeUiFn,
  showEditorUiFn
}){
  initializeRoleFlagsFn(windowObj, hideEditorUiFn);

  const editorToggleBtnEl = documentObj.getElementById("editorToggleBtn");
  bindEditorToggleActionFn({
    editorToggleBtnEl,
    windowObj,
    toggleEditorModeUiFn,
    showEditorUiFn,
    hideEditorUiFn
  });
}

export function initializeProfileSwipeCloseFlow({
  documentObj,
  closeProfileFn,
  setupProfileSheetSwipeCloseFn,
  applyProfileDragResistanceFn,
  shouldCloseProfileFromSwipeFn
}){
  setupProfileSheetSwipeCloseFn(
    documentObj,
    closeProfileFn,
    applyProfileDragResistanceFn,
    shouldCloseProfileFromSwipeFn
  );
}

export function initializeSheetSwipeCloseFlow({
  sheetSwipeBindings,
  bindSwipeCloseToOverlayFn,
  documentObj
}){
  if(!Array.isArray(sheetSwipeBindings) || typeof bindSwipeCloseToOverlayFn !== "function"){
    return;
  }

  sheetSwipeBindings.forEach((binding) => {
    if(!binding || !binding.overlayId || typeof binding.closeFn !== "function"){
      return;
    }

    bindSwipeCloseToOverlayFn({
      documentObj,
      overlayId: binding.overlayId,
      closeFn: binding.closeFn
    });
  });
}

export function bindGlobalWindowHandlersFlow(windowObj, handlers, bindWindowHandlersFn){
  bindWindowHandlersFn(windowObj, handlers);
}
