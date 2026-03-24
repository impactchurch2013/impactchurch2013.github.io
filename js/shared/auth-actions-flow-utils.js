export function bindGoogleLoginAction({
  loginBtnEl,
  setLoginFeedbackFn,
  authReadyPromise,
  signInWithPopupFn,
  authObj,
  provider,
  logErrorFn
}){
  if(!loginBtnEl){
    return;
  }

  loginBtnEl.onclick = async () => {
    try {
      setLoginFeedbackFn("");
      await authReadyPromise;
      await signInWithPopupFn(authObj, provider);
    } catch (err){
      logErrorFn("Login error:", err);
      setLoginFeedbackFn("Google sign-in failed. Please try again.", "error");
    }
  };
}

export function bindPasswordLoginAction({
  passwordLoginBtnEl,
  setLoginFeedbackFn,
  getLoginCredentialsFn,
  authReadyPromise,
  signInWithEmailAndPasswordFn,
  authObj,
  normalizeLoginEmailFn,
  getLoginEmailValueFn,
  fetchSignInMethodsForEmailFn,
  warnFn,
  logErrorFn
}){
  if(!passwordLoginBtnEl){
    return;
  }

  passwordLoginBtnEl.onclick = async () => {
    try{
      setLoginFeedbackFn("");
      const { email, password } = getLoginCredentialsFn(true);
      await authReadyPromise;
      await signInWithEmailAndPasswordFn(authObj, email, password);
    }catch(err){
      logErrorFn("Email/password sign-in error:", err);

      if(err && err.message && !err.code){
        setLoginFeedbackFn(err.message, "error");
        return;
      }

      let detail = "Unable to sign in with email/password.";
      const email = normalizeLoginEmailFn(getLoginEmailValueFn());

      if(email){
        try{
          const methods = await fetchSignInMethodsForEmailFn(authObj, email);
          if(methods.includes("google.com") && !methods.includes("password")){
            detail = "This email is set up for Google sign-in. Use the Google button.";
          }else if(err.code === "auth/invalid-credential"){
            detail = "Invalid email or password.";
          }
        }catch(fetchErr){
          warnFn("Could not inspect sign-in methods:", fetchErr);
        }
      }

      if(err.code === "auth/invalid-email"){
        detail = "Please enter a valid email address.";
      }else if(err.code === "auth/too-many-requests"){
        detail = "Too many attempts. Please wait and try again.";
      }

      setLoginFeedbackFn(detail, "error");
    }
  };
}

export function bindCreateAccountAction({
  createAccountBtnEl,
  setLoginFeedbackFn,
  getLoginCredentialsFn,
  authReadyPromise,
  ensureAllowedEmailFn,
  fetchSignInMethodsForEmailFn,
  authObj,
  createUserWithEmailAndPasswordFn,
  logErrorFn
}){
  if(!createAccountBtnEl){
    return;
  }

  createAccountBtnEl.onclick = async () => {
    try{
      setLoginFeedbackFn("");
      const { email, password } = getLoginCredentialsFn(true);

      if(password.length < 8){
        throw new Error("Use at least 8 characters for the password.");
      }

      await authReadyPromise;
      await ensureAllowedEmailFn(email);

      const methods = await fetchSignInMethodsForEmailFn(authObj, email);
      if(methods.includes("password")){
        throw new Error("This account already has a password. Sign in instead.");
      }
      if(methods.includes("google.com")){
        throw new Error("This email already uses Google sign-in. Use the Google button.");
      }

      await createUserWithEmailAndPasswordFn(authObj, email, password);
      setLoginFeedbackFn("Account created. Signing you in now...", "info");
    }catch(err){
      logErrorFn("Create account error:", err);

      if(err && err.message && !err.code){
        setLoginFeedbackFn(err.message, "error");
        return;
      }

      let detail = "Could not create account.";
      if(err.code === "auth/email-already-in-use"){
        detail = "An account already exists for this email. Try signing in.";
      }else if(err.code === "auth/invalid-email"){
        detail = "Please enter a valid email address.";
      }else if(err.code === "auth/weak-password"){
        detail = "Password is too weak. Use at least 8 characters.";
      }else if(err.code === "auth/operation-not-allowed"){
        detail = "Email/password sign-in is not enabled in Firebase Auth yet.";
      }

      setLoginFeedbackFn(detail, "error");
    }
  };
}

export function bindResetPasswordAction({
  resetPasswordBtnEl,
  setLoginFeedbackFn,
  getLoginCredentialsFn,
  authReadyPromise,
  ensureAllowedEmailFn,
  sendPasswordResetEmailFn,
  authObj,
  logErrorFn
}){
  if(!resetPasswordBtnEl){
    return;
  }

  resetPasswordBtnEl.onclick = async () => {
    try{
      setLoginFeedbackFn("");
      const { email } = getLoginCredentialsFn(false);
      await authReadyPromise;
      await ensureAllowedEmailFn(email);
      await sendPasswordResetEmailFn(authObj, email);
      setLoginFeedbackFn("Password reset email sent (if this account exists).", "info");
    }catch(err){
      logErrorFn("Reset password error:", err);

      if(err && err.message && !err.code){
        setLoginFeedbackFn(err.message, "error");
        return;
      }

      let detail = "Could not send reset email.";
      if(err.code === "auth/invalid-email"){
        detail = "Please enter a valid email address.";
      }else if(err.code === "auth/user-not-found"){
        detail = "No account found for that email.";
      }

      setLoginFeedbackFn(detail, "error");
    }
  };
}
