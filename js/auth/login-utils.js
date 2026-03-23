export function normalizeLoginEmail(value){
  return (value || "").trim().toLowerCase();
}

export function getLoginCredentials(loginEmailInput, loginPasswordInput, requirePassword = true){
  const email = normalizeLoginEmail(loginEmailInput ? loginEmailInput.value : "");
  const password = loginPasswordInput ? loginPasswordInput.value : "";

  if(!email){
    throw new Error("Please enter your email.");
  }

  if(requirePassword && !password){
    throw new Error("Please enter your password.");
  }

  return { email, password };
}

export function setLoginFeedback(loginFeedbackEl, message, tone = "info"){
  if(!loginFeedbackEl){
    return;
  }

  loginFeedbackEl.textContent = message || "";
  loginFeedbackEl.className = `login-feedback ${tone}`;
}

export async function ensureAllowedEmail(email, isUserAllowedFn){
  const allowed = await isUserAllowedFn(email);
  if(!allowed){
    throw new Error("This email is not invited for directory access.");
  }
}

export function createGoogleProvider(GoogleAuthProvider){
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({ prompt: "select_account" });
  return provider;
}
