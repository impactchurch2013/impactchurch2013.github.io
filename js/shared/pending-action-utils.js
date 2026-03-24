export function getPendingMemberEmail(changes){
  return String((changes && changes.email) || "").trim();
}

export function getPendingFirstName(changes){
  const firstName = String((changes && changes.firstName) || "").trim();
  return firstName || "there";
}

export function buildApprovedPendingEmailBody(firstName){
  return `Hello ${firstName},\n\n` +
    "The changes you requested for your member profile in the Impact Church Directory have been approved.";
}

export function buildDeniedPendingEmailBody(){
  return "The changes you requested for your member profile in the Impact Church Directory have been denied.\n\n" +
    "<Delete this and enter the reason(s) the request was denied.>";
}

export function buildPendingEmailModalOptions(to, subject, body, title){
  return { to, subject, body, title };
}
