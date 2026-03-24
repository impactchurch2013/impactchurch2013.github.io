export function ensureInviteAdminAccess(isChurchAdmin, adminOnlyMessage, alertFn){
  if(isChurchAdmin){
    return true;
  }

  alertFn(adminOnlyMessage);
  return false;
}

export function validateInviteEmailForSubmission(rawEmail, normalizeInviteEmailFn, isValidInviteEmailFn){
  if(!rawEmail){
    return { ok: false, reason: "required", email: "" };
  }

  const email = normalizeInviteEmailFn(rawEmail);
  if(!isValidInviteEmailFn(email)){
    return { ok: false, reason: "invalid", email };
  }

  return { ok: true, reason: "", email };
}

export function getInvitedByEmailForAllowlist(currentUser){
  if(!currentUser || !currentUser.email){
    return "";
  }

  return String(currentUser.email).toLowerCase().trim();
}

export async function upsertInviteAllowlistEntry(
  setDocFn,
  docFn,
  serverTimestampFn,
  dbObj,
  email,
  currentUser
){
  await setDocFn(
    docFn(dbObj, "allowedUsers", email),
    {
      invitedAt: serverTimestampFn(),
      invitedBy: getInvitedByEmailForAllowlist(currentUser)
    },
    { merge: true }
  );
}

export function handleInviteAllowlistWriteError(error, consoleObj, alertFn, failedMessage){
  consoleObj.error("Invite allowlist write failed:", error);
  alertFn(failedMessage);
}
