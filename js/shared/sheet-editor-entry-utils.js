export function openSheetEntryFlow(documentObj, id, openSheetUtilFn){
  openSheetUtilFn(documentObj, id);
}

export function closeOnboardingSheetEntryFlow(documentObj, closeOnboardingSheetUtilFn){
  closeOnboardingSheetUtilFn(documentObj);
}

export function cancelEditMyProfileFlow(
  clearOnboardingPhotoPreviewStateFn,
  setEditMyProfileMemberIdFn,
  closeOnboardingSheetFn
){
  clearOnboardingPhotoPreviewStateFn();
  setEditMyProfileMemberIdFn(null);
  closeOnboardingSheetFn();
}

export function showEditorUiEntryFlow(documentObj, showEditorUIUtilFn){
  showEditorUIUtilFn(documentObj);
}

export function hideEditorUiEntryFlow(documentObj, hideEditorUIUtilFn){
  hideEditorUIUtilFn(documentObj);
}
