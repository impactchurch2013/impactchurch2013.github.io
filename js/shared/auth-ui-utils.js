export function applyAuthenticatedUiState(
  appEl,
  loginScreenEl,
  logoutBtnEl,
  searchToggleBtnEl,
  searchBarEl,
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
  if(searchToggleBtnEl){
    searchToggleBtnEl.style.display = "inline-flex";
    searchToggleBtnEl.style.order = isChurchAdmin ? "2" : "1";
    searchToggleBtnEl.textContent = "Search";
  }
  if(searchBarEl){
    searchBarEl.classList.remove("is-open");
  }
  if(logoutBtnEl){
    logoutBtnEl.style.order = isChurchAdmin ? "1" : "2";
  }
  if(editorToggleBtnEl){
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
  if(searchToggleBtnEl){
    searchToggleBtnEl.style.display = "none";
    searchToggleBtnEl.textContent = "Search";
  }
  if(searchBarEl){
    searchBarEl.classList.remove("is-open");
  }
  if(editorToggleBtnEl){
    editorToggleBtnEl.style.display = "none";
  }
  if(memberSearchInputEl){
    memberSearchInputEl.value = "";
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
