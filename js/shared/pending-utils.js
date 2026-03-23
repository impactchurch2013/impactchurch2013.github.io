export function restorePendingChangesYearView(buildYearView, pendingChangesData){
  if(!pendingChangesData){
    return;
  }

  buildYearView(pendingChangesData);
}

export function mapPendingChangesFromSnapshot(snapshot){
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
}

async function fetchPendingChangesSnapshot(db, getDocs, collection){
  return getDocs(collection(db, "pendingChanges"));
}

async function fetchPendingChangesData(db, getDocs, collection){
  const snapshot = await fetchPendingChangesSnapshot(db, getDocs, collection);
  return mapPendingChangesFromSnapshot(snapshot);
}

export async function refreshPendingChangesCache(db, getDocs, collection, setPendingChangesData){
  const changes = await fetchPendingChangesData(db, getDocs, collection);

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

export async function loadPendingChangesData(db, getDocs, collection){
  return fetchPendingChangesData(db, getDocs, collection);
}
