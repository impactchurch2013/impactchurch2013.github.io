export function openInviteMemberDialogFlow(
  isChurchAdmin,
  ensureInviteAdminAccessFn,
  adminOnlyMessage,
  alertFn,
  openInviteMemberDialogUiFn,
  documentObj
){
  if(!ensureInviteAdminAccessFn(isChurchAdmin, adminOnlyMessage, alertFn)){
    return false;
  }

  openInviteMemberDialogUiFn(documentObj);
  return true;
}

export function closeInviteMemberDialogFlow(closeInviteMemberDialogUiFn, documentObj){
  closeInviteMemberDialogUiFn(documentObj);
}

export function openAdminEmailModalFlow(openAdminEmailModalUiFn, documentObj, options){
  openAdminEmailModalUiFn(documentObj, options);
}

export function closeAdminEmailModalFlow(closeAdminEmailModalUiFn, documentObj){
  closeAdminEmailModalUiFn(documentObj);
}

export function sendAdminEmailFromModalFlow(
  getAdminEmailModalValuesFn,
  documentObj,
  adminEmailToRequiredMessage,
  alertFn,
  buildMailtoUrlFn,
  navigateToUrlFn
){
  const { to, subject, body } = getAdminEmailModalValuesFn(documentObj);
  if(!to){
    alertFn(adminEmailToRequiredMessage);
    return false;
  }

  const url = buildMailtoUrlFn(to, subject, body);
  navigateToUrlFn(url);
  return true;
}
