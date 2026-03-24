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

export function countPendingChangesInSnapshot(snapshot){
  let count = 0;
  snapshot.forEach((docSnap) => {
    if(docSnap.data().status === "pending"){
      count++;
    }
  });
  return count;
}

export async function startPendingChangesCountListener({
  pendingChangesCountUnsub,
  stopPendingChangesCountListenerFn,
  wrapEl,
  isChurchAdmin,
  db,
  onSnapshotFn,
  collectionFn,
  setPendingChangesCountTextFn,
  setPendingChangesCountUnsubFn,
  onErrorFn
}){
  if(typeof pendingChangesCountUnsub === "function"){
    stopPendingChangesCountListenerFn();
  }

  if(!wrapEl){
    return null;
  }

  if(!isChurchAdmin){
    wrapEl.style.display = "none";
    return null;
  }

  const unsub = onSnapshotFn(
    collectionFn(db, "pendingChanges"),
    (snapshot) => {
      setPendingChangesCountTextFn(countPendingChangesInSnapshot(snapshot));
    },
    (err) => {
      if(onErrorFn){
        onErrorFn(err);
      }
    }
  );

  if(setPendingChangesCountUnsubFn){
    setPendingChangesCountUnsubFn(unsub);
  }

  return unsub;
}

export async function loadPendingChangesData(db, getDocs, collection){
  return fetchPendingChangesData(db, getDocs, collection);
}
