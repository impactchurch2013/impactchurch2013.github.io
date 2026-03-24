export function getAuthUiElements(documentObj){
  return {
    appEl: documentObj.getElementById("app"),
    loginScreenEl: documentObj.getElementById("loginScreen"),
    logoutBtnEl: documentObj.getElementById("logoutBtn"),
    searchToggleBtnEl: documentObj.getElementById("searchToggleBtn"),
    searchBarEl: documentObj.querySelector(".search-bar"),
    editorToggleBtnEl: documentObj.getElementById("editorToggleBtn"),
    pendingChangesCountWrapEl: documentObj.getElementById("pendingChangesCountWrap"),
    memberSearchInputEl: documentObj.getElementById("memberSearch")
  };
}

export function bindPasswordEnterToSubmit(loginPasswordInputEl, submitFn){
  if(!loginPasswordInputEl){
    return;
  }

  loginPasswordInputEl.addEventListener("keydown", (event) => {
    if(event.key === "Enter"){
      submitFn();
    }
  });
}

export function bindLogoutButton(logoutBtnEl, signOutFn, authObj){
  if(!logoutBtnEl){
    return;
  }

  logoutBtnEl.onclick = async () => {
    await signOutFn(authObj);
  };
}

export async function handleAuthStateChangeFlow({
  user,
  windowObj,
  authObj,
  signOutFn,
  isUserAllowedFn,
  isChurchAdminByEmailFn,
  getMemberProfileByEmailFn,
  hasPendingOnboardingSubmissionFn,
  superAdmins,
  churchAdmins,
  applyAuthenticatedUiStateFn,
  applyLoggedOutUiStateFn,
  startPendingChangesCountListenerFn,
  stopPendingChangesCountListenerFn,
  openOnboardingFn,
  loadMembersFn,
  unauthorizedMessage,
  loginPasswordInputEl,
  clearLoginFeedbackFn,
  handleAuthenticatedSessionFn,
  handleLoggedOutSessionFn,
  alertFn,
  logFn,
  uiElements
}){
  if(user){
    logFn("User logged in:", user.email);
    logFn("Checking allowedUsers doc for:", user.email.toLowerCase().trim());

    await handleAuthenticatedSessionFn({
      user,
      auth: authObj,
      signOutFn,
      isUserAllowedFn,
      isChurchAdminByEmailFn,
      onAllowedCheckedFn: (allowed) => {
        logFn("Allowed check result:", allowed);
      },
      getMemberProfileByEmailFn,
      hasPendingOnboardingSubmissionFn,
      superAdmins,
      churchAdmins,
      setCurrentUserFn: (nextUser) => {
        windowObj.currentUser = nextUser;
      },
      setAdminFlagsFn: (isSuperAdmin, isChurchAdmin) => {
        windowObj.isSuperAdmin = isSuperAdmin;
        windowObj.isChurchAdmin = isChurchAdmin;
      },
      applyAuthenticatedUiStateFn,
      appEl: uiElements.appEl,
      loginScreenEl: uiElements.loginScreenEl,
      logoutBtnEl: uiElements.logoutBtnEl,
      searchToggleBtnEl: uiElements.searchToggleBtnEl,
      searchBarEl: uiElements.searchBarEl,
      editorToggleBtnEl: uiElements.editorToggleBtnEl,
      startPendingChangesCountListenerFn,
      openOnboardingFn,
      loadMembersFn,
      unauthorizedMessage,
      alertFn
    });
    return;
  }

  logFn("User logged out");
  handleLoggedOutSessionFn({
    setCurrentUserFn: (nextUser) => {
      windowObj.currentUser = nextUser;
    },
    stopPendingChangesCountListenerFn,
    applyLoggedOutUiStateFn,
    appEl: uiElements.appEl,
    loginScreenEl: uiElements.loginScreenEl,
    logoutBtnEl: uiElements.logoutBtnEl,
    searchToggleBtnEl: uiElements.searchToggleBtnEl,
    searchBarEl: uiElements.searchBarEl,
    editorToggleBtnEl: uiElements.editorToggleBtnEl,
    pendingChangesCountWrapEl: uiElements.pendingChangesCountWrapEl,
    memberSearchInputEl: uiElements.memberSearchInputEl,
    loginPasswordInputEl,
    clearLoginFeedbackFn
  });
}

export function startAuthStateListener(
  onAuthStateChangedFn,
  authObj,
  onAuthStateChangeFn
){
  onAuthStateChangedFn(authObj, onAuthStateChangeFn);
}
