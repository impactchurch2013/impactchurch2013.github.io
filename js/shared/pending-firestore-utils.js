export function createPendingChangeRef(docFn, db, pendingId){
  return docFn(db, "pendingChanges", pendingId);
}

export async function getPendingChangeSnapshot(getDocFn, changeRef){
  return getDocFn(changeRef);
}

export function isPendingSnapshotMissing(snapshot){
  return !snapshot || typeof snapshot.exists !== "function" || !snapshot.exists();
}

export function extractPendingRowAndChanges(snapshot){
  const row = snapshot.data();
  return {
    row,
    changes: (row && row.changes) || {}
  };
}

export async function applyPendingApprovalToMembers(
  row,
  memberPayload,
  db,
  docFn,
  updateDocFn,
  addDocFn,
  collectionFn
){
  const ch = (row && row.changes) || {};

  if(ch.onboarding){
    await addDocFn(collectionFn(db, "members"), {
      ...memberPayload,
      createdAt: new Date().toISOString()
    });
    return { ok: true };
  }

  if(row && row.memberId){
    await updateDocFn(docFn(db, "members", row.memberId), memberPayload);
    return { ok: true };
  }

  return { ok: false, reason: "missing_member_reference" };
}

export async function removePendingChange(deleteDocFn, changeRef){
  await deleteDocFn(changeRef);
}
