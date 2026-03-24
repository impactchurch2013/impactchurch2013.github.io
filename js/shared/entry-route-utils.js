function buildAliasUrl(windowObj, aliasPage){
  const currentUrl = new URL(windowObj.location.href);
  const targetUrl = new URL(aliasPage, currentUrl);

  currentUrl.searchParams.forEach((value, key) => {
    if(key === "entry"){
      return;
    }
    targetUrl.searchParams.set(key, value);
  });

  if(currentUrl.hash){
    targetUrl.hash = currentUrl.hash;
  }

  return targetUrl;
}

export function getRequestedEntry(windowObj){
  const currentUrl = new URL(windowObj.location.href);
  const raw = String(currentUrl.searchParams.get("entry") || "").trim().toLowerCase();
  return raw === "login" || raw === "directory" ? raw : "";
}

export function syncUrlForAuthState(windowObj, isAuthenticated){
  const aliasPage = isAuthenticated ? "directory.html" : "login.html";
  const targetUrl = buildAliasUrl(windowObj, aliasPage);
  const nextHref = targetUrl.toString();
  const currentHref = windowObj.location.href;

  if(nextHref === currentHref){
    return;
  }

  windowObj.history.replaceState(null, "", nextHref);
}
