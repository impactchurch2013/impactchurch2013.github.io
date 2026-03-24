export async function runStandaloneLoginDiagnostics({
  importFirebaseClientFn,
  onAuthStateChangedFn,
  loadFirestoreFns,
  resolveRoleFlagsForEmailFn,
  superAdmins,
  churchAdmins,
  runSignedInParityProbesFn,
  statusController,
  setAllowedStatusFn,
  setProfileStatusFn,
  setOnboardingStatusFn,
  logErrorFn
}){
  try{
    const { auth, authReady, db } = await importFirebaseClientFn();
    await authReady;
    statusController.setAuthReady();

    onAuthStateChangedFn(auth, (user) => {
      if(user){
        statusController.setSignedIn(user.email || "");
        const normalizedEmail = String(user.email || "").toLowerCase().trim();
        const roleFlags = resolveRoleFlagsForEmailFn(
          normalizedEmail,
          superAdmins,
          churchAdmins
        );
        statusController.setRoleFlags(roleFlags);

        runSignedInParityProbesFn({
          dbObj: db,
          normalizedEmail,
          loadFirestoreFns,
          setAllowedStatusFn: (state, detail) => setAllowedStatusFn(state, detail),
          setProfileStatusFn: (state, detail) => setProfileStatusFn(state, detail),
          setOnboardingStatusFn: (state, detail) => setOnboardingStatusFn(state, detail)
        }).catch((err) => {
          logErrorFn("Standalone login parity probes failed:", err);
          statusController.setParityError();
        });
      }else{
        statusController.setSignedOut();
      }
    });
  }catch(err){
    logErrorFn("Standalone login auth bootstrap failed:", err);
    statusController.setBootstrapFailed();
  }
}
