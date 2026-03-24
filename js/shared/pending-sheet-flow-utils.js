export async function refreshPendingChangesCacheFlow({
  loadFirestoreFns,
  refreshPendingChangesCacheUtilFn,
  dbObj,
  setPendingChangesDataFn
}){
  const { getDocs, collection } = await loadFirestoreFns();
  return refreshPendingChangesCacheUtilFn(
    dbObj,
    getDocs,
    collection,
    setPendingChangesDataFn
  );
}

export async function loadPendingChangesFlow({
  loadFirestoreFns,
  loadPendingChangesDataFn,
  dbObj,
  logFn,
  buildYearViewFn
}){
  const { getDocs, collection } = await loadFirestoreFns();
  const changes = await loadPendingChangesDataFn(dbObj, getDocs, collection);

  if(logFn){
    logFn("Pending changes:", changes);
  }

  buildYearViewFn(changes);
}

export function openPendingChangesFlow(openPendingChangesSheetFn, loadPendingChangesFn){
  openPendingChangesSheetFn(loadPendingChangesFn);
}

export function closePendingChangesFlow(closePendingChangesSheetFn, documentObj){
  closePendingChangesSheetFn(documentObj);
}
