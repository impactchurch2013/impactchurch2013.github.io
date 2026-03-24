import { redirectEntryPageToIndex } from "../shared/entry-page-redirect-utils.js";
import { SUPER_ADMINS, CHURCH_ADMINS, resolveRoleFlagsForEmail } from "../shared/auth-role-config.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { runSignedInParityProbes } from "./directory-standalone-probes.js";
import { runStandaloneLoginDiagnostics } from "./login-standalone-diagnostics.js";
import { createStandaloneLoginStatusController } from "./login-standalone-status.js";
import { runEntryActivation, runStandaloneEntryDiagnostics } from "./entry-activation-utils.js";
import { createEntryFirestoreLoader, createEntryFirebaseClientImporter } from "./entry-loader-utils.js";
import {
  resolveLoginEntryMode,
  shouldFallbackLoginToIndex,
  mountStandaloneLoginShell,
  setStandaloneLoginAuthStatus,
  setStandaloneLoginAllowedStatus,
  setStandaloneLoginProfileStatus,
  setStandaloneLoginOnboardingStatus,
  setStandaloneLoginRoleStatus
} from "./login-runtime-init.js";

const loadFirestoreFns = createEntryFirestoreLoader();
const importFirebaseClientFn = createEntryFirebaseClientImporter();

await runEntryActivation({
  windowObj: window,
  resolveEntryModeFn: resolveLoginEntryMode,
  shouldFallbackToIndexFn: shouldFallbackLoginToIndex,
  onFallbackFn: () => {
    redirectEntryPageToIndex(window, "login");
  },
  onStandaloneFn: async () => {
    await runStandaloneEntryDiagnostics({
      documentObj: document,
      windowObj: window,
      mountStandaloneShellFn: mountStandaloneLoginShell,
      createStatusControllerFn: createStandaloneLoginStatusController,
      createStatusControllerArgs: {
        documentObj: document,
        setAuthStatusFn: setStandaloneLoginAuthStatus,
        setAllowedStatusFn: setStandaloneLoginAllowedStatus,
        setProfileStatusFn: setStandaloneLoginProfileStatus,
        setOnboardingStatusFn: setStandaloneLoginOnboardingStatus,
        setRoleStatusFn: setStandaloneLoginRoleStatus
      },
      runDiagnosticsFn: runStandaloneLoginDiagnostics,
      diagnosticsArgs: {
        importFirebaseClientFn,
        onAuthStateChangedFn: onAuthStateChanged,
        loadFirestoreFns,
        resolveRoleFlagsForEmailFn: resolveRoleFlagsForEmail,
        superAdmins: SUPER_ADMINS,
        churchAdmins: CHURCH_ADMINS,
        runSignedInParityProbesFn: runSignedInParityProbes,
        setAllowedStatusFn: (state, detail) => setStandaloneLoginAllowedStatus(document, state, detail),
        setProfileStatusFn: (state, detail) => setStandaloneLoginProfileStatus(document, state, detail),
        setOnboardingStatusFn: (state, detail) => setStandaloneLoginOnboardingStatus(document, state, detail),
        logErrorFn: (...args) => console.error(...args)
      }
    });
  }
});
