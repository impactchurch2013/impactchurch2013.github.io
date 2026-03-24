export function createStandaloneStatusController({
  documentObj,
  setAuthStatusFn,
  setMembersStatusFn,
  setAllowedStatusFn,
  setProfileStatusFn,
  setOnboardingStatusFn,
  setRoleStatusFn
}){
  return {
    setAuthReady(){
      setAuthStatusFn(documentObj, "ready", "Firebase initialized. Waiting for auth state.");
    },

    setSignedIn(email){
      setAuthStatusFn(documentObj, "signed in", `Authenticated as ${email || "unknown user"}.`);
    },

    setSignedOut(){
      setAuthStatusFn(documentObj, "signed out", "No active authenticated user.");
      setAllowedStatusFn(documentObj, "skipped", "Sign in required before running allowlist probe.");
      setProfileStatusFn(documentObj, "skipped", "Sign in required before running member profile lookup.");
      setOnboardingStatusFn(documentObj, "skipped", "Sign in required before running pending onboarding lookup.");
      setRoleStatusFn(documentObj, "skipped", "Sign in required before resolving role flags.");
    },

    setRoleFlags(roleFlags){
      setRoleStatusFn(
        documentObj,
        roleFlags.isChurchAdmin ? "admin" : "member",
        `isSuperAdmin=${String(roleFlags.isSuperAdmin)}, isChurchAdmin=${String(roleFlags.isChurchAdmin)}`
      );
    },

    setUnknownForMissingEmail(){
      setAllowedStatusFn(documentObj, "unknown", "Signed in user has no email value to query against allowlist.");
      setProfileStatusFn(documentObj, "unknown", "Signed in user has no email value for member profile lookup.");
      setOnboardingStatusFn(documentObj, "unknown", "Signed in user has no email value for pending onboarding lookup.");
    },

    setParityLoading(email){
      setAllowedStatusFn(documentObj, "loading", `Checking allowedUsers/${email} ...`);
      setProfileStatusFn(documentObj, "loading", `Querying members where email == ${email} ...`);
      setOnboardingStatusFn(documentObj, "loading", `Checking pending onboarding submissions for ${email} ...`);
    },

    setParityError(){
      setAllowedStatusFn(documentObj, "error", "Could not query allowlist document in standalone test mode.");
      setProfileStatusFn(documentObj, "error", "Could not run member profile lookup in standalone test mode.");
      setOnboardingStatusFn(documentObj, "error", "Could not run pending onboarding lookup in standalone test mode.");
    },

    setMembersLoading(){
      setMembersStatusFn(documentObj, "loading", "Querying members collection...");
    },

    setMembersError(){
      setMembersStatusFn(documentObj, "error", "Could not read members collection in standalone test mode.");
    },

    setBootstrapFailed(){
      setAuthStatusFn(documentObj, "error", "Could not initialize Firebase auth in standalone test mode.");
      setMembersStatusFn(documentObj, "skipped", "Firestore probe skipped because auth bootstrap failed.");
      setAllowedStatusFn(documentObj, "skipped", "Allowlist probe skipped because auth bootstrap failed.");
      setProfileStatusFn(documentObj, "skipped", "Profile lookup probe skipped because auth bootstrap failed.");
      setOnboardingStatusFn(documentObj, "skipped", "Pending onboarding probe skipped because auth bootstrap failed.");
      setRoleStatusFn(documentObj, "skipped", "Role probe skipped because auth bootstrap failed.");
    }
  };
}
