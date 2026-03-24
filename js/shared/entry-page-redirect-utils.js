const TRANSITIONAL_ENTRY_PARAMS = new Set(["entry", "loginMode", "directoryMode"]);

export function buildIndexEntryUrl(windowObj, entryName){
  const sourceUrl = new URL(windowObj.location.href);
  const targetUrl = new URL("index.html", sourceUrl);

  sourceUrl.searchParams.forEach((value, key) => {
    if(TRANSITIONAL_ENTRY_PARAMS.has(key)){
      return;
    }
    targetUrl.searchParams.set(key, value);
  });
  targetUrl.searchParams.set("entry", entryName);

  if(sourceUrl.hash){
    targetUrl.hash = sourceUrl.hash;
  }

  return targetUrl.toString();
}

export function redirectEntryPageToIndex(windowObj, entryName){
  const targetUrl = buildIndexEntryUrl(windowObj, entryName);
  windowObj.location.replace(targetUrl);
}
