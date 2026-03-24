import { SUPER_ADMINS, CHURCH_ADMINS, resolveRoleFlagsForEmail } from "../shared/auth-role-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { runMembersCountProbe, runSignedInParityProbes, setStandalonePreviewContainerText } from "./directory-standalone-probes.js";
import { runMembersPreviewProbe, renderStandaloneDirectoryPreview } from "./directory-standalone-preview.js";
import { createStandaloneStatusController } from "./directory-standalone-status.js";
import { runStandaloneDirectoryDiagnostics } from "./directory-standalone-diagnostics.js";
import { runStandaloneEntryDiagnostics } from "./entry-activation-utils.js";
import { createEntryFirestoreLoader, createEntryFirebaseClientImporter } from "./entry-loader-utils.js";
import {
  mountStandaloneDirectoryShell,
  setStandaloneAuthStatus,
  setStandaloneMembersProbeStatus,
  setStandaloneAllowedProbeStatus,
  setStandaloneProfileProbeStatus,
  setStandaloneOnboardingProbeStatus,
  setStandaloneRoleProbeStatus,
  setStandalonePreviewProbeStatus
} from "./directory-runtime-init.js";

const loadFirestoreFns = createEntryFirestoreLoader();
const importFirebaseClientFns = createEntryFirebaseClientImporter();

await runStandaloneEntryDiagnostics({
  documentObj: document,
  windowObj: window,
  mountStandaloneShellFn: mountStandaloneDirectoryShell,
  createStatusControllerFn: createStandaloneStatusController,
  createStatusControllerArgs: {
    documentObj: document,
    setAuthStatusFn: setStandaloneAuthStatus,
    setMembersStatusFn: setStandaloneMembersProbeStatus,
    setAllowedStatusFn: setStandaloneAllowedProbeStatus,
    setProfileStatusFn: setStandaloneProfileProbeStatus,
    setOnboardingStatusFn: setStandaloneOnboardingProbeStatus,
    setRoleStatusFn: setStandaloneRoleProbeStatus,
    setPreviewStatusFn: setStandalonePreviewProbeStatus,
    setPreviewTextFn: setStandalonePreviewContainerText
  },
  runDiagnosticsFn: runStandaloneDirectoryDiagnostics,
  diagnosticsArgs: {
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
    setMembersStatusFn: setStandaloneMembersProbeStatus,
    setAllowedStatusFn: setStandaloneAllowedProbeStatus,
    setProfileStatusFn: setStandaloneProfileProbeStatus,
    setOnboardingStatusFn: setStandaloneOnboardingProbeStatus,
    logErrorFn: (...args) => console.error(...args)
  }
});
