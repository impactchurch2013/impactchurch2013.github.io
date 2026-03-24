import { redirectEntryPageToIndex } from "../shared/entry-page-redirect-utils.js";
import { SUPER_ADMINS, CHURCH_ADMINS, resolveRoleFlagsForEmail } from "../shared/auth-role-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { runMembersCountProbe, runSignedInParityProbes } from "./directory-standalone-probes.js";
import { createStandaloneStatusController } from "./directory-standalone-status.js";
import {
  resolveDirectoryEntryMode,
  shouldFallbackToIndex,
  mountStandaloneDirectoryShell,
  setStandaloneAuthStatus,
  setStandaloneMembersProbeStatus,
  setStandaloneAllowedProbeStatus,
  setStandaloneProfileProbeStatus,
  setStandaloneOnboardingProbeStatus,
  setStandaloneRoleProbeStatus
} from "./directory-runtime-init.js";

const loadFirestoreFns = () => import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");

const entryMode = resolveDirectoryEntryMode(window);
if(shouldFallbackToIndex(entryMode)){
  redirectEntryPageToIndex(window, "directory");
}else{
  mountStandaloneDirectoryShell(document, window);
  const status = createStandaloneStatusController({
    documentObj: document,
    setAuthStatusFn: setStandaloneAuthStatus,
    setMembersStatusFn: setStandaloneMembersProbeStatus,
    setAllowedStatusFn: setStandaloneAllowedProbeStatus,
    setProfileStatusFn: setStandaloneProfileProbeStatus,
    setOnboardingStatusFn: setStandaloneOnboardingProbeStatus,
    setRoleStatusFn: setStandaloneRoleProbeStatus
  });

  try{
    const { auth, authReady } = await import("../firebase/client.js");
    await authReady;
    status.setAuthReady();

    onAuthStateChanged(auth, (user) => {
      if(user){
        status.setSignedIn(user.email || "");
        const normalizedEmail = String(user.email || "").toLowerCase().trim();
        const roleFlags = resolveRoleFlagsForEmail(
          normalizedEmail,
          SUPER_ADMINS,
          CHURCH_ADMINS
        );
        status.setRoleFlags(roleFlags);

        runSignedInParityProbes({
          dbObj: window.firebase.db,
          normalizedEmail,
          loadFirestoreFns,
          setAllowedStatusFn: (state, detail) => setStandaloneAllowedProbeStatus(document, state, detail),
          setProfileStatusFn: (state, detail) => setStandaloneProfileProbeStatus(document, state, detail),
          setOnboardingStatusFn: (state, detail) => setStandaloneOnboardingProbeStatus(document, state, detail)
        }).catch((err) => {
          console.error("Standalone parity probes failed:", err);
          status.setParityError();
        });
      }else{
        status.setSignedOut();
      }
    });

    status.setMembersLoading();
    await runMembersCountProbe({
      dbObj: window.firebase.db,
      loadFirestoreFns,
      onLoadingFn: (state, detail) => setStandaloneMembersProbeStatus(document, state, detail),
      onSuccessFn: (state, detail) => setStandaloneMembersProbeStatus(document, state, detail),
      onErrorFn: (err) => {
        console.error("Standalone directory members probe failed:", err);
        status.setMembersError();
      }
    });
  }catch(err){
    console.error("Standalone directory auth bootstrap failed:", err);
    status.setBootstrapFailed();
  }
}
