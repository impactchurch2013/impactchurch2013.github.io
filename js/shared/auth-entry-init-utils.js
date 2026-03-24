import {
  bindGoogleLoginAction,
  bindPasswordLoginAction,
  bindCreateAccountAction,
  bindResetPasswordAction
} from "./auth-actions-flow-utils.js";
import {
  getAuthUiElements,
  bindPasswordEnterToSubmit,
  bindLogoutButton,
  handleAuthStateChangeFlow,
  startAuthStateListener
} from "./auth-bootstrap-flow-utils.js";

function getLoginElements(documentObj){
  return {
    loginBtnEl: documentObj.getElementById("loginBtn"),
    passwordLoginBtnEl: documentObj.getElementById("passwordLoginBtn"),
    createAccountBtnEl: documentObj.getElementById("createAccountBtn"),
    resetPasswordBtnEl: documentObj.getElementById("resetPasswordBtn"),
    loginEmailInputEl: documentObj.getElementById("loginEmail"),
    loginPasswordInputEl: documentObj.getElementById("loginPassword"),
    loginFeedbackEl: documentObj.getElementById("loginFeedback"),
    logoutBtnEl: documentObj.getElementById("logoutBtn")
  };
}

export async function initAuthEntryFlow({
  documentObj,
  windowObj,
  authReadyPromise,
  authObj,
  provider,
  authFns,
  loginUtils,
  sessionFns,
  roleConfig,
  messages,
  deps
}){
  const loginElements = getLoginElements(documentObj);
  const setLoginFeedback = (message, tone = "info") =>
    loginUtils.setLoginFeedbackUtilFn(loginElements.loginFeedbackEl, message, tone);
  const getLoginCredentials = (requirePassword = true) =>
    loginUtils.getLoginCredentialsUtilFn(
      loginElements.loginEmailInputEl,
      loginElements.loginPasswordInputEl,
      requirePassword
    );
  const ensureAllowedEmail = (email) =>
    loginUtils.ensureAllowedEmailUtilFn(email, sessionFns.isUserAllowedFn);

  bindGoogleLoginAction({
    loginBtnEl: loginElements.loginBtnEl,
    setLoginFeedbackFn: setLoginFeedback,
    authReadyPromise,
    signInWithPopupFn: authFns.signInWithPopupFn,
    authObj,
    provider,
    logErrorFn: deps.logErrorFn
  });

  bindPasswordLoginAction({
    passwordLoginBtnEl: loginElements.passwordLoginBtnEl,
    setLoginFeedbackFn: setLoginFeedback,
    getLoginCredentialsFn: getLoginCredentials,
    authReadyPromise,
    signInWithEmailAndPasswordFn: authFns.signInWithEmailAndPasswordFn,
    authObj,
    normalizeLoginEmailFn: loginUtils.normalizeLoginEmailFn,
    getLoginEmailValueFn: () =>
      (loginElements.loginEmailInputEl ? loginElements.loginEmailInputEl.value : ""),
    fetchSignInMethodsForEmailFn: authFns.fetchSignInMethodsForEmailFn,
    warnFn: deps.warnFn,
    logErrorFn: deps.logErrorFn
  });

  bindCreateAccountAction({
    createAccountBtnEl: loginElements.createAccountBtnEl,
    setLoginFeedbackFn: setLoginFeedback,
    getLoginCredentialsFn: getLoginCredentials,
    authReadyPromise,
    ensureAllowedEmailFn: ensureAllowedEmail,
    fetchSignInMethodsForEmailFn: authFns.fetchSignInMethodsForEmailFn,
    authObj,
    createUserWithEmailAndPasswordFn: authFns.createUserWithEmailAndPasswordFn,
    logErrorFn: deps.logErrorFn
  });

  bindResetPasswordAction({
    resetPasswordBtnEl: loginElements.resetPasswordBtnEl,
    setLoginFeedbackFn: setLoginFeedback,
    getLoginCredentialsFn: getLoginCredentials,
    authReadyPromise,
    ensureAllowedEmailFn: ensureAllowedEmail,
    sendPasswordResetEmailFn: authFns.sendPasswordResetEmailFn,
    authObj,
    logErrorFn: deps.logErrorFn
  });

  bindPasswordEnterToSubmit(
    loginElements.loginPasswordInputEl,
    () => loginElements.passwordLoginBtnEl.click()
  );
  bindLogoutButton(loginElements.logoutBtnEl, authFns.signOutFn, authObj);

  await authReadyPromise;

  startAuthStateListener(authFns.onAuthStateChangedFn, authObj, async (user) => {
    if(typeof deps.onAuthStateResolvedFn === "function"){
      deps.onAuthStateResolvedFn(Boolean(user));
    }

    await handleAuthStateChangeFlow({
      user,
      windowObj,
      authObj,
      signOutFn: authFns.signOutFn,
      isUserAllowedFn: sessionFns.isUserAllowedFn,
      getMemberProfileByEmailFn: sessionFns.getMemberProfileByEmailFn,
      hasPendingOnboardingSubmissionFn: sessionFns.hasPendingOnboardingSubmissionFn,
      superAdmins: roleConfig.superAdmins,
      churchAdmins: roleConfig.churchAdmins,
      applyAuthenticatedUiStateFn: sessionFns.applyAuthenticatedUiStateFn,
      applyLoggedOutUiStateFn: sessionFns.applyLoggedOutUiStateFn,
      startPendingChangesCountListenerFn: sessionFns.startPendingChangesCountListenerFn,
      stopPendingChangesCountListenerFn: sessionFns.stopPendingChangesCountListenerFn,
      openOnboardingFn: sessionFns.openOnboardingFn,
      loadMembersFn: sessionFns.loadMembersFn,
      unauthorizedMessage: messages.unauthorizedMessage,
      loginPasswordInputEl: loginElements.loginPasswordInputEl,
      clearLoginFeedbackFn: () => setLoginFeedback(""),
      handleAuthenticatedSessionFn: sessionFns.handleAuthenticatedSessionFn,
      handleLoggedOutSessionFn: sessionFns.handleLoggedOutSessionFn,
      alertFn: deps.alertFn,
      logFn: deps.logFn,
      uiElements: getAuthUiElements(documentObj)
    });
  });
}
