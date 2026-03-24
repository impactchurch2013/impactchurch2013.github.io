import { escapeHtml, formatPendingDetailValue } from "./dom.js";

const ONBOARDING_ROLE_OPTIONS = new Set([
  "Admin",
  "Sound",
  "Security",
  "Volunteer"
]);

function normalizeValue(value){
  return String(value == null ? "" : value).trim();
}

function parseStoredMinistryAndRole(raw){
  const value = normalizeValue(raw);
  if(!value){
    return { ministry: "", role: "" };
  }

  const parts = value.split(/\s*·\s*/).map(part => part.trim()).filter(Boolean);
  if(parts.length === 0){
    return { ministry: "", role: "" };
  }
  if(parts.length === 1){
    const only = parts[0];
    return ONBOARDING_ROLE_OPTIONS.has(only)
      ? { ministry: "", role: only }
      : { ministry: only, role: "" };
  }

  const first = parts[0];
  const second = parts[1];
  if(ONBOARDING_ROLE_OPTIONS.has(second)){
    return { ministry: first, role: second };
  }
  if(ONBOARDING_ROLE_OPTIONS.has(first)){
    return { ministry: second, role: first };
  }

  return { ministry: first, role: second };
}

function resolveCurrentMemberForPendingItem(item, members){
  const list = Array.isArray(members) ? members : [];
  if(list.length === 0){
    return null;
  }

  const memberId = normalizeValue(item && item.memberId);
  if(memberId){
    const byId = list.find(member => normalizeValue(member && member.id) === memberId);
    if(byId){
      return byId;
    }
  }

  const pendingEmail = normalizeValue(item && item.changes && item.changes.email).toLowerCase();
  if(!pendingEmail){
    return null;
  }

  return list.find(member => {
    const fields = (member && member.fields) || {};
    const memberEmail = normalizeValue(fields.Email).toLowerCase();
    return memberEmail && memberEmail === pendingEmail;
  }) || null;
}

function createPendingDetailRow(label, value, beforeValue, isOnboarding){
  const next = normalizeValue(value);
  const prev = normalizeValue(beforeValue);
  const isChanged = isOnboarding
    ? next !== ""
    : next !== prev;

  return {
    label,
    value,
    isChanged
  };
}

export function getSafePendingPhotoUrl(changes){
  const photoURL = (changes && (changes.photoURL || changes.photo)) || "";
  if(typeof photoURL !== "string"){
    return "";
  }

  const trimmed = photoURL.trim();
  return /^https:\/\//i.test(trimmed) ? trimmed : "";
}

export function buildPendingDetailRows(item, members){
  const ch = (item && item.changes) || {};
  const created = item && item.createdAt && typeof item.createdAt.toDate === "function"
    ? item.createdAt.toDate().toLocaleString()
    : "—";
  const isOnboarding = ch.onboarding === true;
  const member = resolveCurrentMemberForPendingItem(item, members);
  const memberFields = (member && member.fields) || {};
  const parsed = parseStoredMinistryAndRole(memberFields.Ministry);

  const rows = [
    { label: "Submitted by", value: (item && item.submittedBy) || "—", isChanged: false },
    { label: "Submitted at", value: created, isChanged: false },
    { label: "Type", value: isOnboarding ? "New member (onboarding)" : "Profile update", isChanged: false },
    createPendingDetailRow("First name", ch.firstName, memberFields["First Name"], isOnboarding),
    createPendingDetailRow("Last name", ch.lastName, memberFields["Last Name"], isOnboarding),
    createPendingDetailRow("Full name", ch.fullName, memberFields["Full Name"], isOnboarding),
    createPendingDetailRow("Email", ch.email, memberFields.Email, isOnboarding),
    createPendingDetailRow("Phone", ch.phone, memberFields["Phone Number"], isOnboarding),
    createPendingDetailRow("Ministry", ch.ministry, parsed.ministry, isOnboarding),
    createPendingDetailRow("Role", ch.role, parsed.role, isOnboarding),
    createPendingDetailRow("Address", ch.address, memberFields.Address, isOnboarding),
    createPendingDetailRow("City", ch.city, memberFields.City, isOnboarding),
    createPendingDetailRow("State", ch.state, memberFields.State, isOnboarding),
    createPendingDetailRow(
      "ZIP",
      ch.zip != null && ch.zip !== "" ? ch.zip : ch.zipCode,
      memberFields["Zip Code"],
      isOnboarding
    ),
    createPendingDetailRow("Birthday", ch.birthday, memberFields.Birthday, isOnboarding),
    createPendingDetailRow("Anniversary", ch.anniversary, memberFields.Anniversary, isOnboarding)
  ];

  return rows;
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
  return photoBlock + rows.map(({ label, value, isChanged }) => `
    <p style="margin:0 0 10px;font-size:14px;line-height:1.4;">
      <strong style="color:${isChanged ? "#c10000" : "inherit"};">${escapeHtml(label)}</strong><br>
      <span style="color:#333;">${formatPendingDetailValue(value)}</span>
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

function toTimestampLabel(value){
  if(value && typeof value.toDate === "function"){
    return value.toDate().toLocaleString();
  }
  if(typeof value === "string" && value.trim()){
    return value;
  }
  return "—";
}

function hasOwn(obj, key){
  return !!obj && Object.prototype.hasOwnProperty.call(obj, key);
}

function normalizeNullable(value){
  const text = String(value == null ? "" : value).trim();
  return text;
}

const HISTORY_FIELD_DEFS = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "phone", label: "Phone" },
  { key: "ministry", label: "Ministry" },
  { key: "role", label: "Role" },
  { key: "address", label: "Address" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zip", label: "ZIP" },
  { key: "birthday", label: "Birthday" },
  { key: "anniversary", label: "Anniversary" },
  { key: "household", label: "Household" }
];

export function buildPendingHistoryRows(item){
  const changes = (item && item.changes) || {};
  const originalValues = (item && item.originalValues) || {};
  const hasOriginalValues = Object.keys(originalValues).length > 0;

  const rows = [];
  HISTORY_FIELD_DEFS.forEach(({ key, label }) => {
    if(!hasOwn(changes, key)){
      return;
    }

    const before = normalizeNullable(originalValues[key]);
    const after = normalizeNullable(changes[key]);
    if(hasOriginalValues && before === after){
      return;
    }
    if(!hasOriginalValues && after === ""){
      return;
    }

    rows.push({
      label,
      before: hasOriginalValues ? (before || "—") : "—",
      after: after || "—"
    });
  });

  const photoAfter = hasOwn(changes, "photoURL")
    ? normalizeNullable(changes.photoURL)
    : (hasOwn(changes, "photo") ? normalizeNullable(changes.photo) : "");
  const photoBefore = hasOwn(originalValues, "photoURL")
    ? normalizeNullable(originalValues.photoURL)
    : (hasOwn(originalValues, "photo") ? normalizeNullable(originalValues.photo) : "");
  const photoChanged = hasOriginalValues
    ? photoBefore !== photoAfter
    : photoAfter !== "";
  if(photoChanged){
    rows.push({
      label: "Photo",
      before: hasOriginalValues ? (photoBefore ? "Has photo" : "No photo") : "—",
      after: photoAfter ? "Photo changed" : "Photo removed"
    });
  }

  return rows;
}

export function buildPendingHistoryDetailBodyHtml(item, rows){
  const statusRaw = String((item && item.status) || "pending").trim().toLowerCase();
  const statusLabel = statusRaw ? statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1) : "Pending";
  const resolvedAt = toTimestampLabel(item && item.resolvedAt);
  const resolvedBy = normalizeNullable(item && item.resolvedBy) || "—";

  const rowsHtml = rows.length === 0
    ? `<p style="margin:0 0 12px;font-size:14px;color:#666;">No field changes captured for this entry.</p>`
    : rows.map((row) => `
        <div style="margin:0 0 12px;padding:10px;border:1px solid #eee;border-radius:8px;background:#fafafa;">
          <p style="margin:0 0 8px;font-size:14px;line-height:1.35;">
            <strong style="color:#c10000;">${escapeHtml(row.label)}</strong>
          </p>
          <p style="margin:0;font-size:13px;color:#333;line-height:1.4;">
            <strong>Before:</strong> ${formatPendingDetailValue(row.before)}<br>
            <strong>After:</strong> ${formatPendingDetailValue(row.after)}
          </p>
        </div>
      `).join("");

  return `
    <div style="padding:2px 0 8px;">
      ${rowsHtml}
      <div style="margin-top:8px;padding-top:10px;border-top:1px solid #eee;">
        <p style="margin:0 0 8px;font-size:14px;line-height:1.35;"><strong>Status</strong><br>${escapeHtml(statusLabel)}</p>
        <p style="margin:0 0 8px;font-size:14px;line-height:1.35;"><strong>Resolved at</strong><br>${escapeHtml(resolvedAt)}</p>
        <p style="margin:0;font-size:14px;line-height:1.35;"><strong>Resolved by</strong><br>${escapeHtml(resolvedBy)}</p>
      </div>
    </div>
  `;
}
