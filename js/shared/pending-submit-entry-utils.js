export function createPendingSubmitFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function submitPendingChangeEntry({
  memberId,
  changes,
  opts = {},
  loadFirestoreFns,
  currentUserEmail,
  omitUndefinedFn,
  buildPendingChangePayloadFn,
  submitPendingChangeToFirestoreFn,
  dbObj,
  onboardingCompleteSuccessMessage,
  profileChangesSubmittedMessage,
  alertFn,
  onErrorFn
}){
  try {
    const { addDoc, collection, serverTimestamp } = await loadFirestoreFns();

    const payload = buildPendingChangePayloadFn(
      memberId,
      changes,
      currentUserEmail,
      omitUndefinedFn,
      serverTimestamp
    );
    await submitPendingChangeToFirestoreFn(dbObj, addDoc, collection, payload);

    if(opts.isOnboarding){
      alertFn(onboardingCompleteSuccessMessage);
    }else{
      alertFn(profileChangesSubmittedMessage);
    }
  }catch(err){
    onErrorFn(err);
    throw err;
  }
}
