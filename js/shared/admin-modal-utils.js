export function openInviteMemberDialogUI(documentObj){
  const input = documentObj.getElementById("inviteMemberEmail");
  if(input){
    input.value = "";
  }

  const modal = documentObj.getElementById("inviteMemberModal");
  if(modal){
    modal.classList.add("show");
    modal.style.display = "flex";
  }

  if(input){
    input.focus();
  }
}

export function closeInviteMemberDialogUI(documentObj){
  const modal = documentObj.getElementById("inviteMemberModal");
  if(modal){
    modal.classList.remove("show");
    modal.style.display = "none";
  }
}

export function getInviteEmailInputValue(documentObj){
  return String((documentObj.getElementById("inviteMemberEmail")?.value) || "").trim();
}

export function normalizeInviteEmail(raw){
  return String(raw || "").trim().toLowerCase();
}

export function isValidInviteEmail(email){
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || ""));
}

export function buildMailtoUrl(to, subject, body){
  return `mailto:${encodeURIComponent(to)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export function openAdminEmailModalUI(documentObj, opts){
  const { to, subject, body, title } = opts;

  const modal = documentObj.getElementById("adminEmailModal");
  const titleEl = documentObj.getElementById("adminEmailModalTitle");

  documentObj.getElementById("adminEmailTo").value = (to || "").trim();
  documentObj.getElementById("adminEmailSubject").value = subject || "";
  documentObj.getElementById("adminEmailBody").value = body || "";

  if(titleEl){
    titleEl.textContent = title || "Email the member";
  }

  if(modal){
    modal.classList.add("show");
    modal.style.display = "flex";
  }
}

export function closeAdminEmailModalUI(documentObj){
  const modal = documentObj.getElementById("adminEmailModal");
  if(modal){
    modal.classList.remove("show");
    modal.style.display = "none";
  }
}

export function getAdminEmailModalValues(documentObj){
  return {
    to: documentObj.getElementById("adminEmailTo").value.trim(),
    subject: documentObj.getElementById("adminEmailSubject").value,
    body: documentObj.getElementById("adminEmailBody").value
  };
}
