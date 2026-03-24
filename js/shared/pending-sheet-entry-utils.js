export function createPendingChangesFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function refreshPendingChangesCacheEntryFlow({
  refreshPendingChangesCacheFlowFn,
  loadFirestoreFns,
  refreshPendingChangesCacheUtilFn,
  dbObj,
  setPendingChangesDataFn
}){
  return refreshPendingChangesCacheFlowFn({
    loadFirestoreFns,
    refreshPendingChangesCacheUtilFn,
    dbObj,
    setPendingChangesDataFn
  });
}

export async function loadPendingChangesEntryFlow({
  loadPendingChangesFlowFn,
  loadFirestoreFns,
  loadPendingChangesDataFn,
  dbObj,
  logFn,
  buildYearViewFn
}){
  return loadPendingChangesFlowFn({
    loadFirestoreFns,
    loadPendingChangesDataFn,
    dbObj,
    logFn,
    buildYearViewFn
  });
}

export function openPendingChangesEntryFlow(
  openPendingChangesFlowFn,
  openPendingChangesSheetFn,
  loadPendingChangesFn
){
  openPendingChangesFlowFn(openPendingChangesSheetFn, loadPendingChangesFn);
}

export function closePendingChangesEntryFlow(
  closePendingChangesFlowFn,
  closePendingChangesSheetFn,
  documentObj
){
  closePendingChangesFlowFn(closePendingChangesSheetFn, documentObj);
}
