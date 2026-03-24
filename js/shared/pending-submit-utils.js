export function buildPendingChangePayload(memberId, changes, currentUserEmail, omitUndefinedFn, serverTimestampFn, opts = {}){
  const payload = {
    memberId: memberId != null ? memberId : null,
    submittedBy: String(currentUserEmail || "").toLowerCase().trim(),
    status: "pending",
    createdAt: serverTimestampFn(),
    resolvedAt: null,
    resolvedBy: null,
    changes: omitUndefinedFn(changes)
  };

  const originalValues = opts && typeof opts.originalValues === "object"
    ? omitUndefinedFn(opts.originalValues)
    : null;
  if(originalValues && Object.keys(originalValues).length > 0){
    payload.originalValues = originalValues;
  }

  return payload;
}

export async function submitPendingChangeToFirestore(
  db,
  addDocFn,
  collectionFn,
  payload
){
  await addDocFn(collectionFn(db, "pendingChanges"), payload);
}
