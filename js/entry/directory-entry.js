import { redirectEntryPageToIndex } from "../shared/entry-page-redirect-utils.js";
import { SUPER_ADMINS, CHURCH_ADMINS, resolveRoleFlagsForEmail } from "../shared/auth-role-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { runMembersCountProbe, runSignedInParityProbes, setStandalonePreviewContainerText } from "./directory-standalone-probes.js";
import { runMembersPreviewProbe, renderStandaloneDirectoryPreview } from "./directory-standalone-preview.js";
import { createStandaloneStatusController } from "./directory-standalone-status.js";
import { runStandaloneDirectoryDiagnostics } from "./directory-standalone-diagnostics.js";
import {
  resolveDirectoryEntryMode,
  shouldFallbackToIndex,
  mountStandaloneDirectoryShell,
  setStandaloneAuthStatus,
  setStandaloneMembersProbeStatus,
  setStandaloneAllowedProbeStatus,
  setStandaloneProfileProbeStatus,
  setStandaloneOnboardingProbeStatus,
  setStandaloneRoleProbeStatus,
  setStandalonePreviewProbeStatus
} from "./directory-runtime-init.js";

const loadFirestoreFns = () => import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
const importFirebaseClientFns = () => import("../firebase/client.js");

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
    setRoleStatusFn: setStandaloneRoleProbeStatus,
    setPreviewStatusFn: setStandalonePreviewProbeStatus,
    setPreviewTextFn: setStandalonePreviewContainerText
  });
  await runStandaloneDirectoryDiagnostics({
    documentObj: document,
    windowObj: window,
    onAuthStateChangedFn: onAuthStateChanged,
    importFirebaseClientFn: importFirebaseClientFns,
    loadFirestoreFns,
    superAdmins: SUPER_ADMINS,
    churchAdmins: CHURCH_ADMINS,
    resolveRoleFlagsForEmailFn: resolveRoleFlagsForEmail,
    runSignedInParityProbesFn: runSignedInParityProbes,
    runMembersCountProbeFn: runMembersCountProbe,
    runMembersPreviewProbeFn: runMembersPreviewProbe,
    renderPreviewFn: renderStandaloneDirectoryPreview,
    statusController: status,
    setMembersStatusFn: setStandaloneMembersProbeStatus,
    setAllowedStatusFn: setStandaloneAllowedProbeStatus,
    setProfileStatusFn: setStandaloneProfileProbeStatus,
    setOnboardingStatusFn: setStandaloneOnboardingProbeStatus,
    logErrorFn: (...args) => console.error(...args)
  });
}
