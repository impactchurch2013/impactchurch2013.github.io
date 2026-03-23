import { escapeHtml, formatPendingDetailValue } from "./dom.js";

export function getSafePendingPhotoUrl(changes){
  const photoURL = (changes && (changes.photoURL || changes.photo)) || "";
  if(typeof photoURL !== "string"){
    return "";
  }

  const trimmed = photoURL.trim();
  return /^https:\/\//i.test(trimmed) ? trimmed : "";
}

export function buildPendingDetailRows(item){
  const ch = (item && item.changes) || {};
  const created = item && item.createdAt && typeof item.createdAt.toDate === "function"
    ? item.createdAt.toDate().toLocaleString()
    : "—";
  const isOnboarding = ch.onboarding === true;

  return [
    ["Submitted by", (item && item.submittedBy) || "—"],
    ["Submitted at", created],
    ["Type", isOnboarding ? "New member (onboarding)" : "Profile update"],
    ...((item && item.memberId) ? [["Member document ID", item.memberId]] : []),
    ["First name", ch.firstName],
    ["Last name", ch.lastName],
    ["Full name", ch.fullName],
    ["Email", ch.email],
    ["Phone", ch.phone],
    ["Ministry", ch.ministry],
    ["Role", ch.role],
    ["Address", ch.address],
    ["City", ch.city],
    ["State", ch.state],
    ["ZIP", ch.zip != null && ch.zip !== "" ? ch.zip : ch.zipCode],
    ["Birthday", ch.birthday],
    ["Anniversary", ch.anniversary]
  ];
}

export function buildPendingPhotoBlockHtml(safePhotoUrl){
  if(!safePhotoUrl){
    return "";
  }

  return `<div style="margin:12px 0;text-align:center;">
        <p style="margin:0 0 8px;font-size:14px;"><strong>Profile photo</strong></p>
        <p style="margin:0 0 6px;font-size:12px;color:#666;">Click image to enlarge</p>
        <img id="pendingChangePhotoImg" src="${escapeHtml(safePhotoUrl)}" alt="Profile photo" referrerpolicy="no-referrer" loading="lazy"
          title="View full size"
          style="max-width:100%;max-height:240px;border-radius:8px;object-fit:cover;border:1px solid #eee;cursor:pointer;">
      </div>`;
}

export function buildPendingDetailBodyHtml(photoBlock, rows){
  return photoBlock + rows.map(([label, val]) => `
    <p style="margin:0 0 10px;font-size:14px;line-height:1.4;">
      <strong>${escapeHtml(label)}</strong><br>
      <span style="color:#333;">${formatPendingDetailValue(val)}</span>
    </p>
  `).join("");
}

export function buildPendingActionButtonsHtml(admin){
  return admin
    ? `<div style="display:flex;gap:10px;margin-top:16px;padding-top:16px;border-top:1px solid #eee;flex-shrink:0;">
         <button type="button" id="pendingApproveBtn"
           style="flex:1;padding:12px;background:#2b5cff;color:white;border:none;border-radius:8px;font-size:15px;">
           Approve
         </button>
         <button type="button" id="pendingDenyBtn"
           style="flex:1;padding:12px;background:#eee;color:#111;border:none;border-radius:8px;font-size:15px;">
           Deny
         </button>
       </div>`
    : `<p style="color:#666;font-size:13px;margin-top:12px;">Only church admins can approve or deny.</p>`;
}
