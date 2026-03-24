export function resolveEntryMode(windowObj, queryParamName){
  const url = new URL(windowObj.location.href);
  const mode = String(url.searchParams.get(queryParamName) || "").trim().toLowerCase();
  return mode === "standalone" ? "standalone" : "legacy";
}

export function shouldUseLegacyRedirect(entryMode){
  return entryMode !== "standalone";
}
