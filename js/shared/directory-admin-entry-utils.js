function getDeleteMemberLabel(member){
  if(!member || !member.fields){
    return "this member";
  }

  return member.fields["Full Name"]
    || `${member.fields["First Name"] || ""} ${member.fields["Last Name"] || ""}`.trim()
    || "this member";
}

async function refreshMemberSelectIfOpen(documentObj, renderMemberSelectContentFn){
  const memberSelectSheet = documentObj.getElementById("memberSelectSheet");
  if(memberSelectSheet && memberSelectSheet.classList.contains("show")){
    renderMemberSelectContentFn();
  }
}

export function createDirectoryAdminFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function deleteMemberFromDirectoryEntry({
  memberId,
  isChurchAdmin,
  removeMemberAdminOnlyMessage,
  alertFn,
  members,
  confirmFn,
  loadFirestoreFns,
  dbObj,
  closeEditMemberFn,
  loadMembersFn,
  documentObj,
  renderMemberSelectContentFn,
  removeMemberAccessCleanupFailedMessage,
  removeMemberSuccessMessage,
  removeMemberFailedMessage,
  onWarnFn,
  onErrorFn
}){
  if(!isChurchAdmin){
    alertFn(removeMemberAdminOnlyMessage);
    return;
  }

  const member = members.find((m) => m.id === memberId);
  const label = getDeleteMemberLabel(member);
  if(!confirmFn(`Remove "${label}" from the directory?\n\nThis cannot be undone.`)){
    return;
  }

  try{
    const { deleteDoc, doc } = await loadFirestoreFns();

    const rawEmail = member && member.fields
      ? String(member.fields["Email"] || "").trim()
      : "";
    const allowUserId = rawEmail.toLowerCase();

    await deleteDoc(doc(dbObj, "members", memberId));

    if(allowUserId){
      try{
        await deleteDoc(doc(dbObj, "allowedUsers", allowUserId));
      }catch(allowErr){
        onWarnFn("Could not remove directory access (allowedUsers):", allowErr);
        alertFn(removeMemberAccessCleanupFailedMessage);
        closeEditMemberFn();
        await loadMembersFn();
        await refreshMemberSelectIfOpen(documentObj, renderMemberSelectContentFn);
        return;
      }
    }

    alertFn(removeMemberSuccessMessage);
    closeEditMemberFn();
    await loadMembersFn();
    await refreshMemberSelectIfOpen(documentObj, renderMemberSelectContentFn);
  }catch(err){
    onErrorFn("Delete member failed:", err);
    alertFn(removeMemberFailedMessage);
  }
}
