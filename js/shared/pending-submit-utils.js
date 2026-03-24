export function buildPendingChangePayload(memberId, changes, currentUserEmail, omitUndefinedFn, serverTimestampFn){
  return {
    memberId: memberId != null ? memberId : null,
    submittedBy: String(currentUserEmail || "").toLowerCase().trim(),
    status: "pending",
    createdAt: serverTimestampFn(),
    resolvedAt: null,
    resolvedBy: null,
    changes: omitUndefinedFn(changes)
  };
}

export async function submitPendingChangeToFirestore(
  db,
  addDocFn,
  collectionFn,
  payload
){
  await addDocFn(collectionFn(db, "pendingChanges"), payload);
}
