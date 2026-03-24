export async function runMembersCountProbe({
  dbObj,
  loadFirestoreFns,
  onLoadingFn,
  onSuccessFn,
  onErrorFn
}){
  onLoadingFn("loading", "Querying members collection...");

  try{
    const { getDocs, collection } = await loadFirestoreFns();
    const snapshot = await getDocs(collection(dbObj, "members"));
    onSuccessFn("ok", `Loaded ${snapshot.size} member record(s) from Firestore.`);
  }catch(err){
    onErrorFn(err);
  }
}

export async function runSignedInParityProbes({
  dbObj,
  normalizedEmail,
  loadFirestoreFns,
  setAllowedStatusFn,
  setProfileStatusFn,
  setOnboardingStatusFn
}){
  if(!normalizedEmail){
    setAllowedStatusFn("unknown", "Signed in user has no email value to query against allowlist.");
    setProfileStatusFn("unknown", "Signed in user has no email value for member profile lookup.");
    setOnboardingStatusFn("unknown", "Signed in user has no email value for pending onboarding lookup.");
    return;
  }

  setAllowedStatusFn("loading", `Checking allowedUsers/${normalizedEmail} ...`);
  setProfileStatusFn("loading", `Querying members where email == ${normalizedEmail} ...`);
  setOnboardingStatusFn("loading", `Checking pending onboarding submissions for ${normalizedEmail} ...`);

  try{
    const { doc, getDoc, collection, query, where, limit, getDocs } = await loadFirestoreFns();

    const allowedSnap = await getDoc(doc(dbObj, "allowedUsers", normalizedEmail));
    if(allowedSnap.exists()){
      setAllowedStatusFn("allowed", `Allowlist entry found for ${normalizedEmail}.`);
    }else{
      setAllowedStatusFn("not found", `No allowlist entry found for ${normalizedEmail}.`);
    }

    const profileQuery = query(
      collection(dbObj, "members"),
      where("email", "==", normalizedEmail),
      limit(5)
    );
    const profileSnap = await getDocs(profileQuery);
    if(profileSnap.empty){
      setProfileStatusFn("not found", `No members documents found for ${normalizedEmail}.`);
    }else{
      setProfileStatusFn("found", `Found ${profileSnap.size} member profile match(es) for ${normalizedEmail}.`);
    }

    const pendingQuery = query(
      collection(dbObj, "pendingChanges"),
      where("submittedBy", "==", normalizedEmail)
    );
    const pendingSnap = await getDocs(pendingQuery);
    const hasPendingOnboarding = pendingSnap.docs.some((docSnap) => {
      const data = docSnap.data();
      return data.status === "pending"
        && data.changes
        && data.changes.onboarding === true;
    });

    if(hasPendingOnboarding){
      setOnboardingStatusFn("pending found", `Found pending onboarding submission for ${normalizedEmail}.`);
    }else{
      setOnboardingStatusFn("none", `No pending onboarding submissions found for ${normalizedEmail}.`);
    }
  }catch(err){
    throw err;
  }
}
