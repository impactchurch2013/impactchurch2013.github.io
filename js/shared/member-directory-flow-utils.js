export function renderDirectoryCards({
  documentObj,
  members,
  searchQuery,
  directoryElementId,
  getVisibleDirectoryMembersFn,
  buildDirectoryProfileViewModelFn,
  buildDirectoryCardHtmlFn,
  createDirectoryCardElementFn,
  formatPhoneFn,
  buildAddressHtmlFromFieldsFn,
  formatMonthDayFn,
  formatDateFn,
  createProfileViewModelFn,
  showProfileFromViewModelFn,
  showProfileFn,
  onDirectoryCardClickFn
}){
  const directory = documentObj.getElementById(directoryElementId);
  if(!directory){
    return;
  }

  directory.innerHTML = "";

  const normalizedQuery = String(searchQuery || "").trim().toLowerCase();
  const list = getVisibleDirectoryMembersFn(members, normalizedQuery);

  list.forEach((record) => {
    const profileViewModel = buildDirectoryProfileViewModelFn(
      record,
      formatPhoneFn,
      buildAddressHtmlFromFieldsFn,
      formatMonthDayFn,
      formatDateFn,
      createProfileViewModelFn
    );

    const cardHtml = buildDirectoryCardHtmlFn(
      profileViewModel.photo,
      profileViewModel.displayName,
      profileViewModel.ministry
    );

    const card = createDirectoryCardElementFn(
      documentObj,
      cardHtml,
      () => {
        if(typeof onDirectoryCardClickFn === "function"){
          onDirectoryCardClickFn();
        }
        showProfileFromViewModelFn(profileViewModel, showProfileFn);
      }
    );

    directory.appendChild(card);
  });
}

export async function loadMembersFromFirestore({
  getDocsFn,
  collectionFn,
  dbObj,
  mapFirestoreMemberDocFn
}){
  const querySnapshot = await getDocsFn(collectionFn(dbObj, "members"));
  return querySnapshot.docs.map(mapFirestoreMemberDocFn);
}

export async function loadMembersFlow({
  getDocsFn,
  collectionFn,
  dbObj,
  mapFirestoreMemberDocFn,
  setMembersFn,
  logFn,
  getCurrentMemberSearchQueryFn,
  buildDirectoryFn,
  onErrorFn
}){
  try {
    const loadedMembers = await loadMembersFromFirestore({
      getDocsFn,
      collectionFn,
      dbObj,
      mapFirestoreMemberDocFn
    });

    setMembersFn(loadedMembers);
    if(logFn){
      logFn("Loaded members from Firestore:", loadedMembers);
    }
    buildDirectoryFn(getCurrentMemberSearchQueryFn());
  } catch (error){
    if(onErrorFn){
      onErrorFn(error);
    }
  }
}
