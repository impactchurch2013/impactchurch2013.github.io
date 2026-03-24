export function createPendingReviewFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function executeApprovePendingChangeEntry({
  pendingId,
  isChurchAdmin,
  ensurePendingReviewAdminAccessFn,
  ensurePendingReviewConfirmedFn,
  approveAdminOnlyMessage,
  approveConfirmMessage,
  alertFn,
  confirmFn,
  loadFirestoreFns,
  dbObj,
  createPendingChangeRefFn,
  getPendingChangeSnapshotFn,
  handleMissingPendingReviewSnapshotFn,
  isPendingSnapshotMissingFn,
  pendingChangeMissingMessage,
  refreshAndRebuildUnresolvedFn,
  extractPendingRowAndChangesFn,
  mapChangesToMemberFn,
  applyPendingApprovalToMembersFn,
  approveMissingMemberReferenceMessage,
  resolvePendingChangeStatusFn,
  currentUser,
  getPendingMemberEmailFn,
  getPendingFirstNameFn,
  buildApprovedPendingEmailBodyFn,
  runApprovePendingPostActionFn,
  loadMembersFn,
  approveSuccessMessage,
  maybeOpenPendingReviewEmailModalFn,
  buildPendingEmailModalOptionsFn,
  approvedEmailSubject,
  approvedNotifyTitle,
  openAdminEmailModalFn,
  approveFailedMessage,
  onErrorFn
}){
  if(!ensurePendingReviewAdminAccessFn(isChurchAdmin, approveAdminOnlyMessage, alertFn)){
    return;
  }

  if(!ensurePendingReviewConfirmedFn(approveConfirmMessage, confirmFn)){
    return;
  }

  try {
    const { doc, getDoc, updateDoc, addDoc, collection, serverTimestamp } = await loadFirestoreFns();

    const changeRef = createPendingChangeRefFn(doc, dbObj, pendingId);
    const snap = await getPendingChangeSnapshotFn(getDoc, changeRef);

    if(await handleMissingPendingReviewSnapshotFn(
      snap,
      isPendingSnapshotMissingFn,
      pendingChangeMissingMessage,
      alertFn,
      refreshAndRebuildUnresolvedFn
    )){
      return;
    }

    const { row, changes } = extractPendingRowAndChangesFn(snap);
    const memberPayload = mapChangesToMemberFn(changes);

    const approvalResult = await applyPendingApprovalToMembersFn(
      row,
      memberPayload,
      currentUser && currentUser.email,
      dbObj,
      doc,
      updateDoc,
      addDoc,
      collection
    );
    if(!approvalResult.ok){
      alertFn(approveMissingMemberReferenceMessage);
      return;
    }

    await resolvePendingChangeStatusFn(
      updateDoc,
      serverTimestamp,
      changeRef,
      "approved",
      currentUser && currentUser.email
    );

    const memberEmail = getPendingMemberEmailFn(changes);
    const firstName = getPendingFirstNameFn(changes);
    const emailBody = buildApprovedPendingEmailBodyFn(firstName);

    await runApprovePendingPostActionFn(
      refreshAndRebuildUnresolvedFn,
      loadMembersFn,
      approveSuccessMessage,
      alertFn
    );

    maybeOpenPendingReviewEmailModalFn(
      memberEmail,
      buildPendingEmailModalOptionsFn,
      approvedEmailSubject,
      emailBody,
      approvedNotifyTitle,
      openAdminEmailModalFn
    );
  }catch(err){
    onErrorFn(err);
    alertFn(approveFailedMessage);
  }
}

export async function executeDenyPendingChangeEntry({
  pendingId,
  isChurchAdmin,
  ensurePendingReviewAdminAccessFn,
  ensurePendingReviewConfirmedFn,
  denyAdminOnlyMessage,
  denyConfirmMessage,
  alertFn,
  confirmFn,
  loadFirestoreFns,
  dbObj,
  createPendingChangeRefFn,
  getPendingChangeSnapshotFn,
  handleMissingPendingReviewSnapshotFn,
  isPendingSnapshotMissingFn,
  pendingChangeMissingMessage,
  refreshAndRebuildUnresolvedFn,
  extractPendingRowAndChangesFn,
  resolvePendingChangeStatusFn,
  currentUser,
  getPendingMemberEmailFn,
  buildDeniedPendingEmailBodyFn,
  runDenyPendingPostActionFn,
  denySuccessMessage,
  maybeOpenPendingReviewEmailModalFn,
  buildPendingEmailModalOptionsFn,
  deniedEmailSubject,
  deniedNotifyTitle,
  openAdminEmailModalFn,
  denyFailedMessage,
  onErrorFn
}){
  if(!ensurePendingReviewAdminAccessFn(isChurchAdmin, denyAdminOnlyMessage, alertFn)){
    return;
  }

  if(!ensurePendingReviewConfirmedFn(denyConfirmMessage, confirmFn)){
    return;
  }

  try{
    const { doc, getDoc, updateDoc, serverTimestamp } = await loadFirestoreFns();

    const changeRef = createPendingChangeRefFn(doc, dbObj, pendingId);
    const snap = await getPendingChangeSnapshotFn(getDoc, changeRef);

    if(await handleMissingPendingReviewSnapshotFn(
      snap,
      isPendingSnapshotMissingFn,
      pendingChangeMissingMessage,
      alertFn,
      refreshAndRebuildUnresolvedFn
    )){
      return;
    }

    const { changes } = extractPendingRowAndChangesFn(snap);
    const memberEmail = getPendingMemberEmailFn(changes);

    await resolvePendingChangeStatusFn(
      updateDoc,
      serverTimestamp,
      changeRef,
      "denied",
      currentUser && currentUser.email
    );

    const emailBody = buildDeniedPendingEmailBodyFn();

    await runDenyPendingPostActionFn(
      refreshAndRebuildUnresolvedFn,
      denySuccessMessage,
      alertFn
    );

    maybeOpenPendingReviewEmailModalFn(
      memberEmail,
      buildPendingEmailModalOptionsFn,
      deniedEmailSubject,
      emailBody,
      deniedNotifyTitle,
      openAdminEmailModalFn
    );
  }catch(err){
    onErrorFn(err);
    alertFn(denyFailedMessage);
  }
}
