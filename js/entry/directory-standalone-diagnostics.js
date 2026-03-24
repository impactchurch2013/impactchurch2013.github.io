export async function runStandaloneDirectoryDiagnostics({
  documentObj,
  windowObj,
  onAuthStateChangedFn,
  importFirebaseClientFn,
  loadFirestoreFns,
  superAdmins,
  churchAdmins,
  resolveRoleFlagsForEmailFn,
  runSignedInParityProbesFn,
  runMembersCountProbeFn,
  runMembersPreviewProbeFn,
  renderPreviewFn,
  statusController,
  setMembersStatusFn,
  setAllowedStatusFn,
  setProfileStatusFn,
  setOnboardingStatusFn,
  logErrorFn
}){
  try{
    const { auth, authReady } = await importFirebaseClientFn();
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

        if(!normalizedEmail){
          statusController.setUnknownForMissingEmail();
          return;
        }

        runSignedInParityProbesFn({
          dbObj: windowObj.firebase.db,
          normalizedEmail,
          loadFirestoreFns,
          setAllowedStatusFn: (state, detail) => setAllowedStatusFn(documentObj, state, detail),
          setProfileStatusFn: (state, detail) => setProfileStatusFn(documentObj, state, detail),
          setOnboardingStatusFn: (state, detail) => setOnboardingStatusFn(documentObj, state, detail)
        }).catch((err) => {
          logErrorFn("Standalone parity probes failed:", err);
          statusController.setParityError();
        });
      }else{
        statusController.setSignedOut();
      }
    });

    await runMembersCountProbeFn({
      dbObj: windowObj.firebase.db,
      loadFirestoreFns,
      onLoadingFn: (state, detail) => setMembersStatusFn(documentObj, state, detail),
      onSuccessFn: (state, detail) => setMembersStatusFn(documentObj, state, detail),
      onErrorFn: (err) => {
        logErrorFn("Standalone directory members probe failed:", err);
        statusController.setMembersError();
      }
    });

    statusController.setPreviewLoading();
    try{
      const previewResult = await runMembersPreviewProbeFn({
        dbObj: windowObj.firebase.db,
        loadFirestoreFns,
        renderPreviewFn,
        documentObj
      });
      statusController.setPreviewReady(
        previewResult.renderedMembers,
        previewResult.totalMembers
      );
    }catch(err){
      logErrorFn("Standalone directory preview probe failed:", err);
      statusController.setPreviewError();
    }
  }catch(err){
    logErrorFn("Standalone directory auth bootstrap failed:", err);
    statusController.setBootstrapFailed();
  }
}
