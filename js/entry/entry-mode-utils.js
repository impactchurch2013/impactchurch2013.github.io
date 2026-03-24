function isForceLegacyValue(value){
  const normalized = String(value || "").trim().toLowerCase();
  return normalized === "1" || normalized === "true" || normalized === "yes";
}

export function resolveEntryMode(windowObj, queryParamName, options = {}){
  const url = new URL(windowObj.location.href);
  const defaultMode = options.defaultMode === "standalone" ? "standalone" : "legacy";
  const forceLegacyParam = String(options.forceLegacyParam || "").trim();

  if(forceLegacyParam && isForceLegacyValue(url.searchParams.get(forceLegacyParam))){
    return "legacy";
  }

  const mode = String(url.searchParams.get(queryParamName) || "").trim().toLowerCase();
  return mode === "standalone" ? "standalone" : defaultMode;
}

export function shouldUseLegacyRedirect(entryMode){
  return entryMode !== "standalone";
}
