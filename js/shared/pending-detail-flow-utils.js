export function findPendingChangeById(pendingChangesData, pendingId){
  const list = pendingChangesData || [];
  return list.find(item => item.id === pendingId) || null;
}

export function buildPendingDetailViewModel(
  item,
  getSafePendingPhotoUrlFn,
  buildPendingDetailRowsFn,
  buildPendingPhotoBlockHtmlFn,
  buildPendingDetailBodyHtmlFn,
  buildPendingActionButtonsHtmlFn,
  isChurchAdmin
){
  const safePhotoUrl = getSafePendingPhotoUrlFn((item && item.changes) || {});
  const rows = buildPendingDetailRowsFn(item);
  const photoBlock = buildPendingPhotoBlockHtmlFn(safePhotoUrl);
  const body = buildPendingDetailBodyHtmlFn(photoBlock, rows);
  const buttons = buildPendingActionButtonsHtmlFn(isChurchAdmin);

  return {
    safePhotoUrl,
    body,
    buttons
  };
}

export function renderPendingDetailView(documentObj, bodyHtml, buttonsHtml){
  const box = documentObj.getElementById("pendingChangesContent");
  if(!box){
    return;
  }

  box.innerHTML = `
    <div onclick="buildUnresolvedList()"
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;">
      ← Back to Unresolved
    </div>
    <h2 style="margin:12px 0;">Review pending change</h2>
    <div style="padding:4px 0 8px;max-height:50vh;overflow-y:auto;">
      ${bodyHtml}
    </div>
    ${buttonsHtml}
  `;
}

export function bindPendingDetailAdminActions(
  documentObj,
  isChurchAdmin,
  pendingId,
  approvePendingChangeFn,
  denyPendingChangeFn
){
  if(!isChurchAdmin){
    return;
  }

  const approveButton = documentObj.getElementById("pendingApproveBtn");
  if(approveButton){
    approveButton.onclick = () => approvePendingChangeFn(pendingId);
  }

  const denyButton = documentObj.getElementById("pendingDenyBtn");
  if(denyButton){
    denyButton.onclick = () => denyPendingChangeFn(pendingId);
  }
}

export function bindPendingDetailPhotoClick(
  documentObj,
  safePhotoUrl,
  openPhotoFn
){
  if(!safePhotoUrl){
    return;
  }

  const pendingImage = documentObj.getElementById("pendingChangePhotoImg");
  if(!pendingImage){
    return;
  }

  pendingImage.onclick = (event) => {
    event.stopPropagation();
    openPhotoFn(safePhotoUrl);
  };
}
