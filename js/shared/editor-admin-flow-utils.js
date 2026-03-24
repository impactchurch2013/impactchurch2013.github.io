export function initializeRoleFlags(windowObj, hideEditorUiFn){
  windowObj.isSuperAdmin = false;
  windowObj.isChurchAdmin = false;
  windowObj.isEditor = false;
  hideEditorUiFn();
}

export function bindEditorToggleAction({
  editorToggleBtnEl,
  windowObj,
  toggleEditorModeUiFn,
  showEditorUiFn,
  hideEditorUiFn
}){
  if(!editorToggleBtnEl){
    return;
  }

  editorToggleBtnEl.onclick = () => {
    toggleEditorModeUiFn(windowObj, editorToggleBtnEl, showEditorUiFn, hideEditorUiFn);
  };
}

export function stopPendingChangesCountListenerFlow(
  pendingChangesCountUnsub,
  setPendingChangesCountUnsubFn,
  stopPendingChangesCountListenerUtilFn
){
  stopPendingChangesCountListenerUtilFn(
    pendingChangesCountUnsub,
    setPendingChangesCountUnsubFn
  );
}

export function setPendingChangesCountTextFlow(
  documentObj,
  isChurchAdmin,
  count,
  setPendingChangesCountTextUtilFn
){
  setPendingChangesCountTextUtilFn(documentObj, isChurchAdmin, count);
}

export async function startPendingChangesCountListenerFlow({
  documentObj,
  windowObj,
  dbObj,
  pendingChangesCountUnsub,
  stopPendingChangesCountListenerFn,
  setPendingChangesCountTextFn,
  setPendingChangesCountUnsubFn,
  startPendingChangesCountListenerUtilFn,
  importFirestoreFns,
  onErrorFn
}){
  const wrapEl = documentObj.getElementById("pendingChangesCountWrap");
  const { onSnapshot, collection } = await importFirestoreFns();

  await startPendingChangesCountListenerUtilFn({
    pendingChangesCountUnsub,
    stopPendingChangesCountListenerFn,
    wrapEl,
    isChurchAdmin: windowObj.isChurchAdmin,
    db: dbObj,
    onSnapshotFn: onSnapshot,
    collectionFn: collection,
    setPendingChangesCountTextFn,
    setPendingChangesCountUnsubFn,
    onErrorFn
  });
}
