export function applyAuthenticatedUiState(
  appEl,
  loginScreenEl,
  logoutBtnEl,
  editorToggleBtnEl,
  isChurchAdmin
){
  if(editorToggleBtnEl){
    editorToggleBtnEl.style.display = isChurchAdmin ? "inline-flex" : "none";
  }
  if(appEl){
    appEl.style.display = "block";
  }
  if(loginScreenEl){
    loginScreenEl.style.display = "none";
  }
  if(logoutBtnEl){
    logoutBtnEl.style.display = "inline-flex";
  }
}

export function applyLoggedOutUiState(
  appEl,
  loginScreenEl,
  logoutBtnEl,
  editorToggleBtnEl,
  pendingChangesCountWrapEl,
  loginPasswordInputEl,
  clearLoginFeedbackFn
){
  if(pendingChangesCountWrapEl){
    pendingChangesCountWrapEl.style.display = "none";
  }
  if(appEl){
    appEl.style.display = "none";
  }
  if(loginScreenEl){
    loginScreenEl.style.display = "block";
  }
  if(logoutBtnEl){
    logoutBtnEl.style.display = "none";
  }
  if(editorToggleBtnEl){
    editorToggleBtnEl.style.display = "none";
  }
  if(loginPasswordInputEl){
    loginPasswordInputEl.value = "";
  }
  clearLoginFeedbackFn();
}

export function toggleEditorModeUi(
  windowObj,
  editorToggleBtnEl,
  showEditorUiFn,
  hideEditorUiFn
){
  windowObj.isEditor = !windowObj.isEditor;

  if(windowObj.isEditor){
    editorToggleBtnEl.textContent = "Disable Editor Mode";
    showEditorUiFn();
  }else{
    editorToggleBtnEl.textContent = "Enable Editor Mode";
    hideEditorUiFn();
  }
}
