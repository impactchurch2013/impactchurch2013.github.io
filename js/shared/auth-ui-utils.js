export function applyAuthenticatedUiState(
  appEl,
  loginScreenEl,
  logoutBtnEl,
  searchToggleBtnEl,
  searchBarEl,
  editorToggleBtnEl,
  isChurchAdmin
){
  const isAdmin = Boolean(isChurchAdmin);

  if(editorToggleBtnEl && editorToggleBtnEl.style){
    editorToggleBtnEl.style.display = isAdmin ? "inline-flex" : "none";
  }
  if(appEl && appEl.style){
    appEl.style.display = "block";
  }
  if(loginScreenEl && loginScreenEl.style){
    loginScreenEl.style.display = "none";
  }
  if(logoutBtnEl && logoutBtnEl.style){
    logoutBtnEl.style.display = "inline-flex";
  }
  if(searchToggleBtnEl && searchToggleBtnEl.style){
    searchToggleBtnEl.style.display = "inline-flex";
    searchToggleBtnEl.style.order = isAdmin ? "2" : "1";
    searchToggleBtnEl.textContent = "Search";
  }
  if(searchBarEl && searchBarEl.classList){
    searchBarEl.classList.remove("is-open");
  }
  if(logoutBtnEl && logoutBtnEl.style){
    logoutBtnEl.style.order = isAdmin ? "1" : "2";
  }
  if(editorToggleBtnEl && editorToggleBtnEl.style){
    editorToggleBtnEl.style.order = "3";
  }
}

export function applyLoggedOutUiState(
  appEl,
  loginScreenEl,
  logoutBtnEl,
  searchToggleBtnEl,
  searchBarEl,
  editorToggleBtnEl,
  pendingChangesCountWrapEl,
  memberSearchInputEl,
  loginPasswordInputEl,
  clearLoginFeedbackFn
){
  if(pendingChangesCountWrapEl && pendingChangesCountWrapEl.style){
    pendingChangesCountWrapEl.style.display = "none";
  }
  if(appEl && appEl.style){
    appEl.style.display = "none";
  }
  if(loginScreenEl && loginScreenEl.style){
    loginScreenEl.style.display = "block";
  }
  if(logoutBtnEl && logoutBtnEl.style){
    logoutBtnEl.style.display = "none";
  }
  if(searchToggleBtnEl && searchToggleBtnEl.style){
    searchToggleBtnEl.style.display = "none";
    searchToggleBtnEl.textContent = "Search";
  }
  if(searchBarEl && searchBarEl.classList){
    searchBarEl.classList.remove("is-open");
  }
  if(editorToggleBtnEl && editorToggleBtnEl.style){
    editorToggleBtnEl.style.display = "none";
  }
  if(memberSearchInputEl){
    memberSearchInputEl.value = "";
  }
  if(loginPasswordInputEl){
    loginPasswordInputEl.value = "";
  }
  if(typeof clearLoginFeedbackFn === "function"){
    clearLoginFeedbackFn();
  }
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
