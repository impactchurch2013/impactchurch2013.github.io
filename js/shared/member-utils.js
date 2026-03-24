const ONBOARDING_ROLE_OPTIONS = new Set([
  "Admin",
  "Sound",
  "Security",
  "Volunteer"
]);

export function splitMinistryAndRole(selectedValue){
  const v = (selectedValue || "").trim();

  if(!v){
    return { ministry: "", role: "" };
  }

  if(ONBOARDING_ROLE_OPTIONS.has(v)){
    return { ministry: "", role: v };
  }

  return { ministry: v, role: "" };
}

export function ministryStringToSelectValue(stored){
  const raw = (stored || "").trim();

  if(!raw){
    return "";
  }

  const parts = raw.split(/\s*·\s*/).map(p => p.trim()).filter(Boolean);

  if(parts.length === 2){
    const [a, b] = parts;

    if(ONBOARDING_ROLE_OPTIONS.has(b)){
      return b;
    }

    if(ONBOARDING_ROLE_OPTIONS.has(a)){
      return a;
    }

    return a;
  }

  if(parts.length === 1){
    return parts[0];
  }

  return raw;
}

const ROLE_DISPLAY_NAMES = ["Admin", "Sound", "Security", "Volunteer"];

function normalizeMinistryDisplaySegment(segment){
  const t = String(segment || "").trim();
  if(!t){
    return "";
  }

  for(const role of ROLE_DISPLAY_NAMES){
    if(t.toLowerCase() === role.toLowerCase()){
      return role;
    }
    if(t.toLowerCase() === `${role.toLowerCase()} ministry`){
      return role;
    }
  }

  return t;
}

/**
 * Profile / cards: show role tokens without a spurious "Ministry" suffix (fixes legacy "Admin Ministry").
 * Combined values use " · "; each segment is normalized separately.
 */
export function formatMinistryFieldForDisplay(raw){
  const s = String(raw || "").trim();
  if(!s){
    return "";
  }

  if(!/\s·\s/.test(s)){
    return normalizeMinistryDisplaySegment(s);
  }

  return s
    .split(/\s*·\s*/)
    .map(normalizeMinistryDisplaySegment)
    .filter(Boolean)
    .join(" · ");
}

export function omitUndefined(obj){
  return Object.fromEntries(
    Object.entries(obj).filter(([, val]) => val !== undefined)
  );
}

export function mapChangesToMember(ch){
  const zipVal = ch.zip != null && ch.zip !== ""
    ? ch.zip
    : (ch.zipCode != null ? ch.zipCode : "");

  const ministryParts = [ch.ministry, ch.role].filter(Boolean);
  const ministry = ministryParts.length ? ministryParts.join(" · ") : "";

  const first = (ch.firstName || "").trim();
  const last = (ch.lastName || "").trim();

  const hasPhotoURL = Object.prototype.hasOwnProperty.call(ch, "photoURL");
  const hasPhoto = Object.prototype.hasOwnProperty.call(ch, "photo");
  const photoVal = hasPhotoURL
    ? (ch.photoURL ?? "")
    : (hasPhoto ? (ch.photo ?? "") : "");

  return {
    firstName: first,
    lastName: last,
    fullName: ch.fullName || `${first} ${last}`.trim(),
    email: ch.email || "",
    phone: ch.phone || "",
    ministry,
    address: ch.address || "",
    city: ch.city || "",
    state: ch.state || "",
    zipCode: zipVal,
    birthday: ch.birthday || "",
    anniversary: ch.anniversary || "",
    household: ch.household || "",
    photo: photoVal,
    lastUpdated: new Date().toISOString()
  };
}
