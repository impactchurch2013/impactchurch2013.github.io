import { buildIndexEntryUrl } from "../shared/entry-page-redirect-utils.js";

export function initializeDirectoryPreAuthBoot({
  documentObj,
  windowObj,
  initializeEditorAdminBootFlowFn,
  hideEditorUiFn,
  initializeRoleFlagsFn,
  bindEditorToggleActionFn,
  toggleEditorModeUiFn,
  showEditorUiFn
}){
  initializeEditorAdminBootFlowFn({
    documentObj,
    windowObj,
    hideEditorUiFn,
    initializeRoleFlagsFn,
    bindEditorToggleActionFn,
    toggleEditorModeUiFn,
    showEditorUiFn
  });
}

export function initializeDirectoryProfileSwipeBoot({
  documentObj,
  initializeProfileSwipeCloseFlowFn,
  closeProfileFn,
  setupProfileSheetSwipeCloseFn,
  applyProfileDragResistanceFn,
  shouldCloseProfileFromSwipeFn
}){
  initializeProfileSwipeCloseFlowFn({
    documentObj,
    closeProfileFn,
    setupProfileSheetSwipeCloseFn,
    applyProfileDragResistanceFn,
    shouldCloseProfileFromSwipeFn
  });
}

export function initializeDirectoryGlobalHandlersBoot({
  windowObj,
  bindGlobalWindowHandlersFlowFn,
  handlers,
  bindWindowHandlersFn,
  logFn,
  firebaseObj
}){
  logFn("From main script:", firebaseObj);
  bindGlobalWindowHandlersFlowFn(windowObj, handlers, bindWindowHandlersFn);
}

export function buildStandaloneDirectoryShellHtml(indexHref){
  return `
    <main style="max-width:720px;margin:40px auto;padding:24px;border-radius:12px;background:#fff;box-shadow:0 8px 30px rgba(0,0,0,.12);font-family:Arial,sans-serif;">
      <h1 style="margin:0 0 12px;color:#0d4e6a;">Directory Standalone Test Mode</h1>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        This is a safe test shell for the upcoming multi-page directory entry.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Firebase auth status: <strong id="standaloneAuthState">initializing...</strong>
      </p>
      <p id="standaloneAuthDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for Firebase bootstrap.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Members collection probe: <strong id="standaloneMembersProbeState">initializing...</strong>
      </p>
      <p id="standaloneMembersProbeDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for Firestore probe.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Allowed users probe: <strong id="standaloneAllowedProbeState">initializing...</strong>
      </p>
      <p id="standaloneAllowedProbeDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before checking allowlist.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Profile lookup probe: <strong id="standaloneProfileProbeState">initializing...</strong>
      </p>
      <p id="standaloneProfileProbeDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before querying members by email.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Pending onboarding probe: <strong id="standaloneOnboardingProbeState">initializing...</strong>
      </p>
      <p id="standaloneOnboardingProbeDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before checking pending onboarding.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Role flags probe: <strong id="standaloneRoleProbeState">initializing...</strong>
      </p>
      <p id="standaloneRoleProbeDetail" style="margin:0 0 18px;line-height:1.5;color:#555;">
        Waiting for auth state before resolving role flags.
      </p>
      <p style="margin:0 0 10px;line-height:1.5;color:#333;">
        Directory preview probe: <strong id="standalonePreviewProbeState">initializing...</strong>
      </p>
      <p id="standalonePreviewProbeDetail" style="margin:0 0 12px;line-height:1.5;color:#555;">
        Waiting for members preview render.
      </p>
      <div id="standalonePreviewList" style="margin:0 0 18px;padding:10px 12px;border:1px solid #e5e7eb;border-radius:8px;background:#fafafa;color:#444;font-size:14px;">
        Preview list not rendered yet.
      </div>
      <p style="margin:0 0 18px;line-height:1.5;color:#333;">
        This is the primary directory entry runtime. Use the button below to open the compatibility `index.html` path.
      </p>
      <a href="${indexHref}" style="display:inline-block;background:#2b5cff;color:#fff;text-decoration:none;padding:10px 14px;border-radius:8px;">
        Open compatibility runtime (index.html)
      </a>
    </main>
  `;
}

export function mountStandaloneDirectoryShell(documentObj, windowObj){
  const indexHref = buildIndexEntryUrl(windowObj, "directory");
  documentObj.body.innerHTML = buildStandaloneDirectoryShellHtml(indexHref);
}

export function setStandaloneAuthStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standaloneAuthState");
  const detailEl = documentObj.getElementById("standaloneAuthDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

export function setStandaloneMembersProbeStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standaloneMembersProbeState");
  const detailEl = documentObj.getElementById("standaloneMembersProbeDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

export function setStandaloneAllowedProbeStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standaloneAllowedProbeState");
  const detailEl = documentObj.getElementById("standaloneAllowedProbeDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

export function setStandaloneProfileProbeStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standaloneProfileProbeState");
  const detailEl = documentObj.getElementById("standaloneProfileProbeDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

export function setStandaloneOnboardingProbeStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standaloneOnboardingProbeState");
  const detailEl = documentObj.getElementById("standaloneOnboardingProbeDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

export function setStandaloneRoleProbeStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standaloneRoleProbeState");
  const detailEl = documentObj.getElementById("standaloneRoleProbeDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}

export function setStandalonePreviewProbeStatus(documentObj, stateText, detailText){
  const stateEl = documentObj.getElementById("standalonePreviewProbeState");
  const detailEl = documentObj.getElementById("standalonePreviewProbeDetail");

  if(stateEl){
    stateEl.textContent = stateText;
  }
  if(detailEl){
    detailEl.textContent = detailText;
  }
}
