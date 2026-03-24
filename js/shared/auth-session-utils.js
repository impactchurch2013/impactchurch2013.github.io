export async function handleAuthenticatedSession({
  user,
  auth,
  signOutFn,
  isUserAllowedFn,
  onAllowedCheckedFn,
  getMemberProfileByEmailFn,
  hasPendingOnboardingSubmissionFn,
  superAdmins,
  churchAdmins,
  setCurrentUserFn,
  setAdminFlagsFn,
  applyAuthenticatedUiStateFn,
  appEl,
  loginScreenEl,
  logoutBtnEl,
  editorToggleBtnEl,
  startPendingChangesCountListenerFn,
  openOnboardingFn,
  loadMembersFn,
  unauthorizedMessage,
  alertFn
}){
  const email = (user && user.email ? user.email : "").toLowerCase().trim();
  const allowed = await isUserAllowedFn(email);
  if(typeof onAllowedCheckedFn === "function"){
    onAllowedCheckedFn(allowed);
  }

  if(!allowed){
    alertFn(unauthorizedMessage);
    await signOutFn(auth);
    return;
  }

  setCurrentUserFn(user);

  const profile = await getMemberProfileByEmailFn(email);
  const onboardingPending = await hasPendingOnboardingSubmissionFn(user.email);

  const isSuperAdmin = superAdmins.includes(email);
  const isChurchAdmin = churchAdmins.includes(email) || isSuperAdmin;
  setAdminFlagsFn(isSuperAdmin, isChurchAdmin);

  applyAuthenticatedUiStateFn(
    appEl,
    loginScreenEl,
    logoutBtnEl,
    editorToggleBtnEl,
    isChurchAdmin
  );

  await startPendingChangesCountListenerFn();

  if(!profile && !onboardingPending){
    openOnboardingFn();
  }

  loadMembersFn();
}

export function handleLoggedOutSession({
  setCurrentUserFn,
  stopPendingChangesCountListenerFn,
  applyLoggedOutUiStateFn,
  appEl,
  loginScreenEl,
  logoutBtnEl,
  editorToggleBtnEl,
  pendingChangesCountWrapEl,
  loginPasswordInputEl,
  clearLoginFeedbackFn
}){
  setCurrentUserFn(null);
  stopPendingChangesCountListenerFn();
  applyLoggedOutUiStateFn(
    appEl,
    loginScreenEl,
    logoutBtnEl,
    editorToggleBtnEl,
    pendingChangesCountWrapEl,
    loginPasswordInputEl,
    clearLoginFeedbackFn
  );
}
