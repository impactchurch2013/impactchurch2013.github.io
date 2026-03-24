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

export function ensureGrantAdminAccess(isChurchAdmin, alertFn){
  if(isChurchAdmin){
    return true;
  }
  alertFn("Only admins can grant admin access.");
  return false;
}

export function openGrantAdminFlow({
  isChurchAdmin,
  alertFn,
  openMemberSelectFn,
  setGrantAdminTargetFn
}){
  if(!ensureGrantAdminAccess(isChurchAdmin, alertFn)){
    return;
  }
  setGrantAdminTargetFn(null);
  openMemberSelectFn({
    title: "Select Member For Admin Access",
    onSelectHandlerName: "selectMemberForGrantAdmin"
  });
}

export function selectMemberForGrantAdminFlow({
  members,
  memberId,
  alertFn,
  setGrantAdminTargetFn,
  renderGrantAdminConfirmFn,
  closeMemberSelectFn,
  openGrantAdminSheetFn
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
  setGrantAdminTargetFn(target);
  closeMemberSelectFn();
  renderGrantAdminConfirmFn(target);
  openGrantAdminSheetFn();
}

export function buildGrantAdminConfirmHtml(target, escapeHtmlFn){
  const safeName = escapeHtmlFn(target && target.name ? target.name : "");
  const safeEmail = escapeHtmlFn(target && target.email ? target.email : "");

  return `
    <h2>Grant Admin</h2>
    <p style="padding:0 0 14px 0;line-height:1.45;">
      Grant admin status to <strong>${safeName}</strong> (${safeEmail})?
    </p>
    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
      <button type="button" onclick="confirmGrantAdmin()">Confirm</button>
      <button type="button" onclick="closeGrantAdminSheet()">Cancel</button>
    </div>
  `;
}

export async function confirmGrantAdminFlow({
  isChurchAdmin,
  alertFn,
  getGrantAdminTargetFn,
  grantAdminByEmailFn,
  dbObj,
  currentUser,
  loadFirestoreFns,
  closeGrantAdminSheetFn,
  clearGrantAdminTargetFn
}){
  if(!ensureGrantAdminAccess(isChurchAdmin, alertFn)){
    return;
  }

  const target = getGrantAdminTargetFn();
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
    alertFn(`${target.name} now has admin access.`);
    clearGrantAdminTargetFn();
    closeGrantAdminSheetFn();
  }catch(error){
    console.error("Grant admin failed:", error);
    alertFn("Could not grant admin access. Please try again.");
  }
}
