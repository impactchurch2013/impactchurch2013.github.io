export function readEditMemberFormValues(documentObj, splitMinistryAndRoleFn){
  const firstName = (documentObj.getElementById("editFirstName").value || "").trim();
  const lastName = (documentObj.getElementById("editLastName").value || "").trim();
  const { ministry: pendingMinistry, role: pendingRole } = splitMinistryAndRoleFn(
    documentObj.getElementById("editMinistry").value
  );
  const household = (documentObj.getElementById("editHousehold").value || "").trim();
  const phone = (documentObj.getElementById("editPhone").value || "").trim();
  const email = (documentObj.getElementById("editEmail").value || "").trim();
  const address = (documentObj.getElementById("editAddress").value || "").trim();
  const city = (documentObj.getElementById("editCity").value || "").trim();
  const state = (documentObj.getElementById("editState").value || "").trim();
  const zipCode = (documentObj.getElementById("editZip").value || "").trim();
  const birthday = (documentObj.getElementById("editBirthday").value || "").trim();
  const anniversary = (documentObj.getElementById("editAnniversary").value || "").trim();

  const ministryParts = [pendingMinistry, pendingRole].filter(Boolean);
  const ministryField = ministryParts.length ? ministryParts.join(" · ") : "";
  const fullName = `${firstName} ${lastName}`.trim();

  return {
    firstName,
    lastName,
    fullName,
    pendingMinistry,
    pendingRole,
    ministryField,
    household,
    phone,
    email,
    address,
    city,
    state,
    zipCode,
    birthday,
    anniversary
  };
}

export function hasRequiredEditMemberName(formValues){
  return Boolean(formValues.firstName && formValues.lastName);
}

export function getMemberAndExistingPhoto(members, memberId){
  const member = members.find(m => m.id === memberId);
  const existingPhoto = member
    ? String(member.fields.Photo || "").trim()
    : "";

  return { member, existingPhoto };
}

const ONBOARDING_ROLE_OPTIONS = new Set([
  "Admin",
  "Sound",
  "Security",
  "Volunteer"
]);

function parseStoredMinistryAndRole(raw){
  const value = String(raw || "").trim();
  if(!value){
    return { ministry: "", role: "" };
  }

  const parts = value.split(/\s*·\s*/).map(p => p.trim()).filter(Boolean);
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

export function buildPendingOriginalValuesFromMember(member, existingPhoto){
  const fields = (member && member.fields) || {};
  const parsed = parseStoredMinistryAndRole(fields.Ministry || "");

  return {
    firstName: String(fields["First Name"] || "").trim(),
    lastName: String(fields["Last Name"] || "").trim(),
    fullName: String(fields["Full Name"] || "").trim(),
    ministry: parsed.ministry,
    role: parsed.role,
    household: String(fields.Household || "").trim(),
    phone: String(fields["Phone Number"] || "").trim(),
    email: String(fields.Email || "").trim().toLowerCase(),
    address: String(fields.Address || "").trim(),
    city: String(fields.City || "").trim(),
    state: String(fields.State || "").trim(),
    zip: String(fields["Zip Code"] || "").trim(),
    birthday: String(fields.Birthday || "").trim(),
    anniversary: String(fields.Anniversary || "").trim(),
    photoURL: String(existingPhoto || "").trim()
  };
}

export async function resolveAdminEditMemberPhotoUrl(
  existingPhoto,
  memberId,
  removePhoto,
  photoBlob,
  storageObj,
  refFn,
  uploadBytesFn,
  getDownloadURLFn
){
  if(removePhoto){
    return "";
  }

  if(!photoBlob){
    return existingPhoto;
  }

  const path = `profilePhotos/members/${memberId}/${Date.now()}_profile.jpg`;
  const storageRef = refFn(storageObj, path);
  await uploadBytesFn(storageRef, photoBlob, { contentType: "image/jpeg" });
  return getDownloadURLFn(storageRef);
}

export function resolvePendingEditMemberPhotoUploadUserId(currentUser){
  return currentUser.uid || currentUser.email.replace(/[^a-zA-Z0-9]+/g, "_");
}

export async function resolvePendingEditMemberPhotoUrl(
  existingPhoto,
  currentUser,
  removePhoto,
  photoBlob,
  storageObj,
  refFn,
  uploadBytesFn,
  getDownloadURLFn
){
  if(removePhoto){
    return "";
  }

  if(!photoBlob){
    return existingPhoto;
  }

  const uid = resolvePendingEditMemberPhotoUploadUserId(currentUser);
  const path = `profilePhotos/pending/${uid}/${Date.now()}_profile.jpg`;
  const storageRef = refFn(storageObj, path);
  await uploadBytesFn(storageRef, photoBlob, { contentType: "image/jpeg" });
  return getDownloadURLFn(storageRef);
}

export function buildAdminMemberUpdatePayload(formValues, photoUrl, updatedBy){
  return {
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    fullName: formValues.fullName,
    ministry: formValues.ministryField,
    household: formValues.household,
    phone: formValues.phone,
    email: formValues.email,
    address: formValues.address,
    city: formValues.city,
    state: formValues.state,
    zipCode: formValues.zipCode,
    birthday: formValues.birthday,
    anniversary: formValues.anniversary,
    photo: photoUrl,
    lastUpdated: new Date().toISOString(),
    updatedBy: String(updatedBy || "").toLowerCase().trim()
  };
}

export function buildPendingMemberUpdatePayload(formValues, photoURL){
  return {
    firstName: formValues.firstName,
    lastName: formValues.lastName,
    fullName: formValues.fullName,
    ministry: formValues.pendingMinistry,
    role: formValues.pendingRole,
    household: formValues.household,
    phone: formValues.phone,
    email: formValues.email,
    address: formValues.address,
    city: formValues.city,
    state: formValues.state,
    zip: formValues.zipCode,
    birthday: formValues.birthday,
    anniversary: formValues.anniversary,
    lastUpdated: new Date().toISOString(),
    photoURL
  };
}

export function applyAdminLocalMemberUpdate(member, formValues, photoUrl){
  if(!member){
    return;
  }

  member.fields["First Name"] = formValues.firstName;
  member.fields["Last Name"] = formValues.lastName;
  member.fields["Full Name"] = formValues.fullName;
  member.fields["Ministry"] = formValues.ministryField;
  member.fields["Household"] = formValues.household;
  member.fields["Phone Number"] = formValues.phone;
  member.fields["Email"] = formValues.email;
  member.fields["Address"] = formValues.address;
  member.fields["City"] = formValues.city;
  member.fields["State"] = formValues.state;
  member.fields["Zip Code"] = formValues.zipCode;
  member.fields["Birthday"] = formValues.birthday;
  member.fields["Anniversary"] = formValues.anniversary;
  member.fields["Photo"] = photoUrl;
  member.fields["Last Updated"] = new Date().toISOString();
}

export async function saveAdminMemberEdits({
  existingPhoto,
  memberId,
  removePhoto,
  photoBlob,
  storageObj,
  refFn,
  uploadBytesFn,
  getDownloadURLFn,
  updateDocFn,
  docFn,
  dbObj,
  formValues,
  currentUser
}){
  const photoOut = await resolveAdminEditMemberPhotoUrl(
    existingPhoto,
    memberId,
    removePhoto,
    photoBlob,
    storageObj,
    refFn,
    uploadBytesFn,
    getDownloadURLFn
  );

  await updateDocFn(
    docFn(dbObj, "members", memberId),
    buildAdminMemberUpdatePayload(
      formValues,
      photoOut,
      currentUser && currentUser.email
    )
  );

  return photoOut;
}

export async function savePendingMemberEdits({
  member,
  existingPhoto,
  currentUser,
  removePhoto,
  photoBlob,
  storageObj,
  refFn,
  uploadBytesFn,
  getDownloadURLFn,
  memberId,
  submitPendingChangeFn,
  formValues
}){
  const photoURL = await resolvePendingEditMemberPhotoUrl(
    existingPhoto,
    currentUser,
    removePhoto,
    photoBlob,
    storageObj,
    refFn,
    uploadBytesFn,
    getDownloadURLFn
  );

  const pendingPayload = buildPendingMemberUpdatePayload(formValues, photoURL);
  await submitPendingChangeFn(memberId, pendingPayload, {
    isOnboarding: false,
    originalValues: buildPendingOriginalValuesFromMember(member, existingPhoto)
  });
}

export function finalizeEditMemberSaveFlow({
  clearEditMemberPhotoStateFn,
  member,
  isAdmin,
  formValues,
  photoOut,
  buildDirectoryFn,
  getCurrentMemberSearchQueryFn,
  closeEditMemberFn
}){
  clearEditMemberPhotoStateFn();

  if(member && isAdmin){
    applyAdminLocalMemberUpdate(member, formValues, photoOut);
  }

  buildDirectoryFn(getCurrentMemberSearchQueryFn());
  closeEditMemberFn();
}
