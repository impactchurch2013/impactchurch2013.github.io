export function showEditorUI(documentObj){
  const panel = documentObj.getElementById("adminPanel");

  if(panel){
    panel.style.display = "flex";
  }
}

export function hideEditorUI(documentObj){
  const banner = documentObj.getElementById("editorBanner");
  const panel = documentObj.getElementById("adminPanel");

  if(banner){
    banner.style.display = "none";
  }
  if(panel){
    panel.style.display = "none";
  }
}

export function setPendingChangesCountText(documentObj, isChurchAdmin, n){
  const textEl = documentObj.getElementById("pendingChangesCountText");
  const wrap = documentObj.getElementById("pendingChangesCountWrap");

  if(!textEl || !wrap){
    return;
  }

  if(!isChurchAdmin){
    wrap.style.display = "none";
    return;
  }

  if(n === 1){
    textEl.textContent = "There is 1 pending change request.";
  }else{
    textEl.textContent = `There are ${n} pending change requests.`;
  }

  wrap.style.display = "block";
}
