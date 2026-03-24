function getMemberName(member){
  if(!member || !member.fields){
    return "";
  }
  return String(
    member.fields["Full Name"]
    || `${member.fields["First Name"] || ""} ${member.fields["Last Name"] || ""}`.trim()
    || ""
  );
}

function getMemberEmail(member){
  return String(member && member.fields ? (member.fields.Email || "") : "").toLowerCase().trim();
}

function ensureAdminActionAccess(isChurchAdmin, alertFn){
  if(isChurchAdmin){
    return true;
  }
  alertFn("Only admins can manage admin access.");
  return false;
}

export function openGrantAdminFlow({
  isChurchAdmin,
  alertFn,
  openMemberSelectFn,
  setAdminActionTargetFn,
  setAdminActionModeFn
}){
  if(!ensureAdminActionAccess(isChurchAdmin, alertFn)){
    return;
  }
  setAdminActionModeFn("grant");
  setAdminActionTargetFn(null);
  openMemberSelectFn({
    title: "Select Member For Admin Access",
    onSelectHandlerName: "selectMemberForGrantAdmin"
  });
}

export function openRevokeAdminFlow({
  isChurchAdmin,
  alertFn,
  openMemberSelectFn,
  setAdminActionTargetFn,
  setAdminActionModeFn
}){
  if(!ensureAdminActionAccess(isChurchAdmin, alertFn)){
    return;
  }
  setAdminActionModeFn("revoke");
  setAdminActionTargetFn(null);
  openMemberSelectFn({
    title: "Select Admin To Revoke",
    onSelectHandlerName: "selectMemberForRevokeAdmin"
  });
}

function selectMemberForAdminActionFlow({
  members,
  memberId,
  alertFn,
  setAdminActionTargetFn,
  renderAdminActionConfirmFn,
  closeMemberSelectFn,
  openAdminActionSheetFn
}){
  const member = (Array.isArray(members) ? members : []).find((item) => item.id === memberId);
  if(!member){
    alertFn("Member not found.");
    return;
  }

  const email = getMemberEmail(member);
  if(!email){
    alertFn("Selected member does not have an email address.");
    return;
  }

  const name = getMemberName(member) || email;
  const target = { id: memberId, name, email };
  setAdminActionTargetFn(target);
  closeMemberSelectFn();
  renderAdminActionConfirmFn(target);
  openAdminActionSheetFn();
}

export function selectMemberForGrantAdminFlow(args){
  selectMemberForAdminActionFlow(args);
}

export function selectMemberForRevokeAdminFlow(args){
  selectMemberForAdminActionFlow(args);
}

export function buildAdminActionConfirmHtml(mode, target, escapeHtmlFn){
  const safeName = escapeHtmlFn(target && target.name ? target.name : "");
  const safeEmail = escapeHtmlFn(target && target.email ? target.email : "");
  const isRevoke = mode === "revoke";
  const title = isRevoke ? "Revoke Admin" : "Grant Admin";
  const prompt = isRevoke
    ? `Revoke admin status from <strong>${safeName}</strong> (${safeEmail})?`
    : `Grant admin status to <strong>${safeName}</strong> (${safeEmail})?`;
  const confirmHandler = isRevoke ? "confirmRevokeAdmin()" : "confirmGrantAdmin()";

  return `
    <h2>${title}</h2>
    <p style="padding:0 0 14px 0;line-height:1.45;">
      ${prompt}
    </p>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
      <button type="button" onclick="${confirmHandler}">Confirm</button>
      <button type="button" onclick="closeGrantAdminSheet()">Cancel</button>
    </div>
  `;
}

export async function confirmGrantAdminFlow({
  isChurchAdmin,
  alertFn,
  getAdminActionTargetFn,
  grantAdminByEmailFn,
  dbObj,
  currentUser,
  loadFirestoreFns,
  appendAdminLogEntryFn,
  closeGrantAdminSheetFn,
  clearAdminActionTargetFn
}){
  if(!ensureAdminActionAccess(isChurchAdmin, alertFn)){
    return;
  }

  const target = getAdminActionTargetFn();
  if(!target || !target.email){
    alertFn("No member selected for admin access.");
    return;
  }

  try{
    await grantAdminByEmailFn({
      dbObj,
      email: target.email,
      currentUser,
      loadFirestoreFns
    });
    await appendAdminLogEntryFn({
      dbObj,
      action: "grant_admin",
      targetEmail: target.email,
      targetName: target.name,
      performedBy: currentUser && currentUser.email,
      loadFirestoreFns
    });
    alertFn(`${target.name} now has admin access.`);
    clearAdminActionTargetFn();
    closeGrantAdminSheetFn();
  }catch(error){
    console.error("Grant admin failed:", error);
    alertFn("Could not grant admin access. Please try again.");
  }
}

export async function confirmRevokeAdminFlow({
  isChurchAdmin,
  alertFn,
  getAdminActionTargetFn,
  revokeAdminByEmailFn,
  dbObj,
  currentUser,
  loadFirestoreFns,
  appendAdminLogEntryFn,
  closeGrantAdminSheetFn,
  clearAdminActionTargetFn,
  superAdmins = []
}){
  if(!ensureAdminActionAccess(isChurchAdmin, alertFn)){
    return;
  }

  const target = getAdminActionTargetFn();
  if(!target || !target.email){
    alertFn("No member selected for admin revoke.");
    return;
  }

  if((superAdmins || []).includes(target.email)){
    alertFn("Super admin access cannot be revoked here.");
    return;
  }

  try{
    await revokeAdminByEmailFn({
      dbObj,
      email: target.email,
      loadFirestoreFns
    });
    await appendAdminLogEntryFn({
      dbObj,
      action: "revoke_admin",
      targetEmail: target.email,
      targetName: target.name,
      performedBy: currentUser && currentUser.email,
      loadFirestoreFns
    });
    alertFn(`${target.name} no longer has admin access.`);
    clearAdminActionTargetFn();
    closeGrantAdminSheetFn();
  }catch(error){
    console.error("Revoke admin failed:", error);
    alertFn("Could not revoke admin access. Please try again.");
  }
}
