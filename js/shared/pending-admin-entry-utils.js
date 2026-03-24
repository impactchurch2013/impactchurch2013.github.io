export function createInviteAllowlistFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export function executeOpenUnresolvedPendingDetailEntry({
  pendingId,
  pendingChangesData,
  members,
  findPendingChangeByIdFn,
  alertFn,
  pendingEntryNotFoundMessage,
  isChurchAdmin,
  buildPendingDetailViewModelFn,
  getSafePendingPhotoUrlFn,
  buildPendingDetailRowsFn,
  buildPendingPhotoBlockHtmlFn,
  buildPendingDetailBodyHtmlFn,
  buildPendingActionButtonsHtmlFn,
  renderPendingDetailViewFn,
  documentObj,
  bindPendingDetailAdminActionsFn,
  approvePendingChangeFn,
  denyPendingChangeFn,
  bindPendingDetailPhotoClickFn,
  openPhotoFn
}){
  const item = findPendingChangeByIdFn(pendingChangesData, pendingId);
  if(!item){
    alertFn(pendingEntryNotFoundMessage);
    return;
  }

  const admin = isChurchAdmin;
  const viewModel = buildPendingDetailViewModelFn(
    item,
    members,
    getSafePendingPhotoUrlFn,
    buildPendingDetailRowsFn,
    buildPendingPhotoBlockHtmlFn,
    buildPendingDetailBodyHtmlFn,
    buildPendingActionButtonsHtmlFn,
    admin
  );

  renderPendingDetailViewFn(documentObj, viewModel.body, viewModel.buttons);
  bindPendingDetailAdminActionsFn(
    documentObj,
    admin,
    pendingId,
    approvePendingChangeFn,
    denyPendingChangeFn
  );
  bindPendingDetailPhotoClickFn(documentObj, viewModel.safePhotoUrl, openPhotoFn);
}

export async function executeSubmitInviteMemberEntry({
  isChurchAdmin,
  ensureInviteAdminAccessFn,
  inviteAdminOnlyMessage,
  alertFn,
  getInviteEmailInputValueFn,
  documentObj,
  validateInviteEmailForSubmissionFn,
  normalizeInviteEmailFn,
  isValidInviteEmailFn,
  inviteEmailRequiredMessage,
  inviteEmailInvalidMessage,
  loadFirestoreFns,
  upsertInviteAllowlistEntryFn,
  dbObj,
  currentUser,
  handleInviteAllowlistWriteErrorFn,
  consoleObj,
  inviteAllowlistWriteFailedMessage,
  buildMailtoUrlFn,
  inviteMemberSubject,
  inviteMemberBody,
  closeInviteMemberDialogFn,
  redirectToUrlFn
}){
  if(!ensureInviteAdminAccessFn(isChurchAdmin, inviteAdminOnlyMessage, alertFn)){
    return;
  }

  const raw = getInviteEmailInputValueFn(documentObj);
  const validated = validateInviteEmailForSubmissionFn(
    raw,
    normalizeInviteEmailFn,
    isValidInviteEmailFn
  );
  if(!validated.ok){
    if(validated.reason === "required"){
      alertFn(inviteEmailRequiredMessage);
    }else{
      alertFn(inviteEmailInvalidMessage);
    }
    return;
  }
  const email = validated.email;

  const { setDoc, doc, serverTimestamp } = await loadFirestoreFns();

  try{
    await upsertInviteAllowlistEntryFn(
      setDoc,
      doc,
      serverTimestamp,
      dbObj,
      email,
      currentUser
    );
  }catch(err){
    handleInviteAllowlistWriteErrorFn(
      err,
      consoleObj,
      alertFn,
      inviteAllowlistWriteFailedMessage
    );
    return;
  }

  const mailUrl = buildMailtoUrlFn(email, inviteMemberSubject, inviteMemberBody);
  closeInviteMemberDialogFn();
  redirectToUrlFn(mailUrl);
}
