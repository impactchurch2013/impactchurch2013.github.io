export function createProfileSaveFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function saveProfileChangesEntry({
  documentObj,
  members,
  lastViewedProfile,
  loadFirestoreFns,
  dbObj,
  setLastViewedProfilePhoneFn,
  setLastViewedProfileEmailFn,
  goBackToProfileFn
}){
  const phone = documentObj.getElementById("editPhone").value;
  const email = documentObj.getElementById("editEmail").value;

  const member = members.find((m) => m.id === lastViewedProfile.id);
  const { updateDoc, doc } = await loadFirestoreFns();

  await updateDoc(doc(dbObj, "members", member.id), {
    phone,
    email
  });

  setLastViewedProfilePhoneFn(phone);
  setLastViewedProfileEmailFn(email);
  goBackToProfileFn();
}
