export function showFamilyMemberProfileEntryFlow(
  setReturnToFamilyFn,
  showProfileFromMemberFn,
  name,
  householdName,
  showFamilyMemberProfileFlowFn
){
  showFamilyMemberProfileFlowFn(
    setReturnToFamilyFn,
    showProfileFromMemberFn,
    name,
    householdName
  );
}

export function openPhotoEntryFlow(documentObj, photo, openPhotoViewerFn){
  openPhotoViewerFn(documentObj, photo);
}

export function closePhotoEntryFlow(documentObj, closePhotoViewerFn){
  closePhotoViewerFn(documentObj);
}

export function bindWindowHandlers(windowObj, handlers){
  Object.keys(handlers).forEach((key) => {
    windowObj[key] = handlers[key];
  });
}
