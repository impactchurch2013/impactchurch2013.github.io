export async function refreshPendingChangesCacheRuntimeEntry({
  refreshPendingChangesCacheEntryFlowFn,
  refreshPendingChangesCacheFlowFn,
  createPendingChangesFirestoreLoaderFn,
  refreshPendingChangesCacheUtilFn,
  dbObj,
  setPendingChangesDataFn
}){
  return refreshPendingChangesCacheEntryFlowFn({
    refreshPendingChangesCacheFlowFn,
    loadFirestoreFns: createPendingChangesFirestoreLoaderFn(),
    refreshPendingChangesCacheUtilFn,
    dbObj,
    setPendingChangesDataFn
  });
}

export async function loadPendingChangesRuntimeEntry({
  loadPendingChangesEntryFlowFn,
  loadPendingChangesFlowFn,
  createPendingChangesFirestoreLoaderFn,
  loadPendingChangesDataFn,
  dbObj,
  logFn,
  buildYearViewFn
}){
  return loadPendingChangesEntryFlowFn({
    loadPendingChangesFlowFn,
    loadFirestoreFns: createPendingChangesFirestoreLoaderFn(),
    loadPendingChangesDataFn,
    dbObj,
    logFn,
    buildYearViewFn
  });
}

export function openPendingChangesRuntimeEntry({
  openPendingChangesEntryFlowFn,
  openPendingChangesFlowFn,
  openPendingChangesSheetFn,
  loadPendingChangesFn
}){
  openPendingChangesEntryFlowFn(
    openPendingChangesFlowFn,
    openPendingChangesSheetFn,
    loadPendingChangesFn
  );
}

export function closePendingChangesRuntimeEntry({
  closePendingChangesEntryFlowFn,
  closePendingChangesFlowFn,
  closePendingChangesSheetFn,
  documentObj
}){
  closePendingChangesEntryFlowFn(
    closePendingChangesFlowFn,
    closePendingChangesSheetFn,
    documentObj
  );
}
