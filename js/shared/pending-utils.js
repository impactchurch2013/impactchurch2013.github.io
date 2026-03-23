export function restorePendingChangesYearView(buildYearView, pendingChangesData){
  if(!pendingChangesData){
    return;
  }

  buildYearView(pendingChangesData);
}

export async function refreshPendingChangesCache(db, getDocs, collection, setPendingChangesData){
  const snapshot = await getDocs(collection(db, "pendingChanges"));

  const changes = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  if(setPendingChangesData){
    setPendingChangesData(changes);
  }

  return changes;
}

export async function refreshAndRebuildUnresolved(
  refreshPendingChangesCacheFn,
  buildUnresolvedListFn
){
  await refreshPendingChangesCacheFn();
  buildUnresolvedListFn();
}

export function stopPendingChangesCountListener(pendingChangesCountUnsub, setPendingChangesCountUnsub){
  if(typeof pendingChangesCountUnsub === "function"){
    pendingChangesCountUnsub();
    if(setPendingChangesCountUnsub){
      setPendingChangesCountUnsub(null);
    }
  }
}
