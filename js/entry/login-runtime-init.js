import { buildIndexEntryUrl } from "../shared/entry-page-redirect-utils.js";
import { resolveEntryMode, shouldUseLegacyRedirect } from "./entry-mode-utils.js";

export function resolveLoginEntryMode(windowObj){
  return resolveEntryMode(windowObj, "loginMode");
}

export function shouldFallbackLoginToIndex(entryMode){
  return shouldUseLegacyRedirect(entryMode);
}

export function buildStandaloneLoginShellHtml(indexHref){
  return `
    <main style="max-width:720px;margin:40px auto;padding:24px;border-radius:12px;background:#fff;box-shadow:0 8px 30px rgba(0,0,0,.12);font-family:Arial,sans-serif;">
      <h1 style="margin:0 0 12px;color:#0d4e6a;">Login Standalone Test Mode</h1>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        This is a safe test shell for the upcoming multi-page login entry.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Firebase auth status: <strong id="standaloneLoginAuthState">initializing...</strong>
      </p>
      <p id="standaloneLoginAuthDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for Firebase bootstrap.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Allowed users probe: <strong id="standaloneLoginAllowedState">initializing...</strong>
      </p>
      <p id="standaloneLoginAllowedDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before checking allowlist.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Profile lookup probe: <strong id="standaloneLoginProfileState">initializing...</strong>
      </p>
      <p id="standaloneLoginProfileDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before querying members by email.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Pending onboarding probe: <strong id="standaloneLoginOnboardingState">initializing...</strong>
      </p>
      <p id="standaloneLoginOnboardingDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before checking pending onboarding.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Role flags probe: <strong id="standaloneLoginRoleState">initializing...</strong>
      </p>
      <p id="standaloneLoginRoleDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before resolving role flags.
      </p>
      <p style="margin:0 0 18px;line-height:1.5;color:#333;">
        Production behavior is unchanged. Use the button below to open the current app runtime.
      </p>
      <a href="${indexHref}" style="display:inline-block;background:#2b5cff;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;">
        Open current app runtime
      </a>
    </main>
  `;
}

export function mountStandaloneLoginShell(documentObj, windowObj){
  const indexHref = buildIndexEntryUrl(windowObj, "login");
  documentObj.body.innerHTML = buildStandaloneLoginShellHtml(indexHref);
}

export function setStandaloneLoginAuthStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standaloneLoginAuthState");
  const detailEl = documentObj.getElementById("standaloneLoginAuthDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

function setStandaloneLoginProbeStatus(documentObj, stateId, detailId, stateText, detailText){
  const stateEl = documentObj.getElementById(stateId);
  const detailEl = documentObj.getElementById(detailId);

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

export function setStandaloneLoginAllowedStatus(documentObj, stateText, detailText){
  setStandaloneLoginProbeStatus(
    documentObj,
    "standaloneLoginAllowedState",
    "standaloneLoginAllowedDetail",
    stateText,
    detailText
  );
}

export function setStandaloneLoginProfileStatus(documentObj, stateText, detailText){
  setStandaloneLoginProbeStatus(
    documentObj,
    "standaloneLoginProfileState",
    "standaloneLoginProfileDetail",
    stateText,
    detailText
  );
}

export function setStandaloneLoginOnboardingStatus(documentObj, stateText, detailText){
  setStandaloneLoginProbeStatus(
    documentObj,
    "standaloneLoginOnboardingState",
    "standaloneLoginOnboardingDetail",
    stateText,
    detailText
  );
}

export function setStandaloneLoginRoleStatus(documentObj, stateText, detailText){
  setStandaloneLoginProbeStatus(
    documentObj,
    "standaloneLoginRoleState",
    "standaloneLoginRoleDetail",
    stateText,
    detailText
  );
}
