export function showProfileFlow({
  id,
  name,
  photo,
  ministry,
  phone,
  email,
  address,
  birthday,
  anniversary,
  household,
  updated,
  currentUser,
  documentObj,
  windowObj,
  formatShortDateFn,
  normalizeProfileDatesFn,
  buildLastViewedProfileStateFn,
  setProfileWindowStateFn,
  isOwnProfileForCurrentUserFn,
  buildProfileHtmlFn,
  getWindowScrollYFn,
  openProfileOverlayFn,
  setSavedScrollPositionFn
}){
  const rawPhone = phone ? phone.replace(/\D/g, "") : "";
  const normalizedDates = normalizeProfileDatesFn(birthday, anniversary, formatShortDateFn);

  const profileState = buildLastViewedProfileStateFn(
    id,
    name,
    photo,
    ministry,
    phone,
    email,
    address,
    normalizedDates.birthday,
    normalizedDates.anniversary,
    household,
    updated
  );
  setProfileWindowStateFn(windowObj, profileState, name);

  const isOwnProfile = isOwnProfileForCurrentUserFn(currentUser, email);
  const profileContent = documentObj.getElementById("profileContent");
  if(profileContent){
    profileContent.innerHTML = buildProfileHtmlFn(
      {
        name,
        photo,
        ministry,
        phone,
        email,
        address,
        birthday: normalizedDates.birthday,
        anniversary: normalizedDates.anniversary,
        household,
        updated
      },
      rawPhone,
      isOwnProfile
    );
  }

  setSavedScrollPositionFn(getWindowScrollYFn(windowObj));
  openProfileOverlayFn(documentObj);
}

export function closeProfileFlow({
  returnToFamily,
  setReturnToFamilyFn,
  showHouseholdFn,
  consumeReturnToFamilyFlowFn,
  closeProfileOverlayFn,
  resetProfilePageStateFn,
  documentObj,
  windowObj,
  savedScrollPosition
}){
  if(consumeReturnToFamilyFlowFn(
    returnToFamily,
    setReturnToFamilyFn,
    showHouseholdFn
  )){
    return;
  }

  closeProfileOverlayFn(documentObj);
  resetProfilePageStateFn(documentObj, windowObj, savedScrollPosition);
}

export function showHouseholdEntryFlow(documentObj, members, householdName, showHouseholdFlowFn){
  showHouseholdFlowFn(documentObj, members, householdName);
}

export function goBackToProfileEntryFlow(lastViewedProfile, showProfileFn, goBackToProfileFlowFn){
  goBackToProfileFlowFn(lastViewedProfile, showProfileFn);
}

export function showProfileFromMemberEntryFlow({
  members,
  name,
  formatPhoneFn,
  formatMonthDayFn,
  formatDateFn,
  showProfileFn,
  showProfileFromMemberFlowFn
}){
  showProfileFromMemberFlowFn(
    members,
    name,
    formatPhoneFn,
    formatMonthDayFn,
    formatDateFn,
    showProfileFn
  );
}
