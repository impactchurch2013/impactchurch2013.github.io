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

export function bindGlobalWindowHandlersFlow(windowObj, handlers, bindWindowHandlersFn){
  bindWindowHandlersFn(windowObj, handlers);
}
