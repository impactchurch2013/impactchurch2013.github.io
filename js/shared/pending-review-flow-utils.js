export function ensurePendingReviewAdminAccess(isChurchAdmin, adminOnlyMessage, alertFn){
  if(isChurchAdmin){
    return true;
  }

  alertFn(adminOnlyMessage);
  return false;
}

export function ensurePendingReviewConfirmed(confirmMessage, confirmFn){
  return Boolean(confirmFn(confirmMessage));
}

export async function handleMissingPendingReviewSnapshot(
  snapshot,
  isPendingSnapshotMissingFn,
  missingMessage,
  alertFn,
  refreshAndRebuildUnresolvedFn
){
  if(!isPendingSnapshotMissingFn(snapshot)){
    return false;
  }

  alertFn(missingMessage);
  await refreshAndRebuildUnresolvedFn();
  return true;
}

export async function runApprovePendingPostAction(
  refreshAndRebuildUnresolvedFn,
  loadMembersFn,
  successMessage,
  alertFn
){
  await refreshAndRebuildUnresolvedFn();
  await loadMembersFn();
  alertFn(successMessage);
}

export async function runDenyPendingPostAction(
  refreshAndRebuildUnresolvedFn,
  successMessage,
  alertFn
){
  await refreshAndRebuildUnresolvedFn();
  alertFn(successMessage);
}

export function maybeOpenPendingReviewEmailModal(
  memberEmail,
  buildPendingEmailModalOptionsFn,
  subject,
  emailBody,
  modalTitle,
  openAdminEmailModalFn
){
  if(!memberEmail){
    return;
  }

  openAdminEmailModalFn(
    buildPendingEmailModalOptionsFn(
      memberEmail,
      subject,
      emailBody,
      modalTitle
    )
  );
}
