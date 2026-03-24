export function createEditMemberFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export function openEditMemberEntry({
  member,
  clearEditMemberPhotoStateFn,
  buildEditMemberEntryContextFn,
  escapeHtmlFn,
  documentObj,
  isChurchAdmin,
  buildEditMemberModeHintHtmlFn,
  buildEditMemberPhotoSectionHtmlFn,
  buildEditMemberDeleteButtonHtmlFn,
  applyEditMemberMinistrySelectionFn,
  ministryStringToSelectValueFn,
  attachEditMemberPhotoInputChangeHandlerFn,
  onEditMemberPhotoInputChangeFn,
  attachEditMemberRemovePhotoHandlerFn,
  setEditMemberRemovePhotoFn,
  setEditMemberPhotoJpegBlobFn,
  openEditMemberSheetFn,
  attachEditMemberDeleteButtonHandlerFn,
  deleteMemberFromDirectoryFn
}){
  clearEditMemberPhotoStateFn();

  const {
    fields,
    valueForField,
    currentPhoto,
    showCurrentPhoto
  } = buildEditMemberEntryContextFn(member, escapeHtmlFn);

  const box = documentObj.getElementById("editMemberContent");
  if(!box){
    return;
  }

  box.innerHTML = `
    <h2>Edit Member</h2>
    ${buildEditMemberModeHintHtmlFn(isChurchAdmin)}

    <div style="display:flex;flex-direction:column;gap:10px;">

      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>First name</span>
        <input id="editFirstName" placeholder="First name" autocomplete="given-name" value="${valueForField("First Name")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Last name</span>
        <input id="editLastName" placeholder="Last name" autocomplete="family-name" value="${valueForField("Last Name")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Ministries and Roles</span>
        <select id="editMinistry" style="padding:8px;border-radius:6px;border:1px solid #ccc;">
          <option value="">— Optional —</option>
          <optgroup label="Ministries">
            <option value="Children's Ministry">Children's Ministry</option>
            <option value="Hospitality Ministry">Hospitality Ministry</option>
            <option value="Men's Ministry">Men's Ministry</option>
            <option value="Outreach Ministry">Outreach Ministry</option>
            <option value="Pastor Ministry">Pastor Ministry</option>
            <option value="Prayer Ministry">Prayer Ministry</option>
            <option value="Teaching Ministry">Teaching Ministry</option>
            <option value="Women's Ministry">Women's Ministry</option>
            <option value="Worship Ministry">Worship Ministry</option>
            <option value="Youth Ministry">Youth Ministry</option>
          </optgroup>
          <optgroup label="Roles">
            <option value="Admin">Admin</option>
            <option value="Sound">Sound</option>
            <option value="Security">Security</option>
            <option value="Volunteer">Volunteer</option>
          </optgroup>
        </select>
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Household</span>
        <input id="editHousehold" placeholder="Household (optional)" value="${valueForField("Household")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Email</span>
        <input id="editEmail" type="email" placeholder="Email" autocomplete="email" value="${valueForField("Email")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Phone</span>
        <input id="editPhone" type="tel" placeholder="Phone" autocomplete="tel" value="${valueForField("Phone Number")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Address</span>
        <input id="editAddress" placeholder="Street address" autocomplete="street-address" value="${valueForField("Address")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>City</span>
        <input id="editCity" placeholder="City" autocomplete="address-level2" value="${valueForField("City")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>State</span>
        <input id="editState" placeholder="State" autocomplete="address-level1" value="${valueForField("State")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>ZIP</span>
        <input id="editZip" placeholder="ZIP code" autocomplete="postal-code" value="${valueForField("Zip Code")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Birthday</span>
        <input id="editBirthday" type="text" placeholder="e.g. Feb 25" value="${valueForField("Birthday")}">
        <span style="font-size:12px;color:#666;">Month and day (example: Feb 25).</span>
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Anniversary</span>
        <input id="editAnniversary" type="text" placeholder="e.g. Jun 12" value="${valueForField("Anniversary")}">
        <span style="font-size:12px;color:#666;">Month and day (example: Jun 12).</span>
      </label>

      ${buildEditMemberPhotoSectionHtmlFn(showCurrentPhoto, currentPhoto, escapeHtmlFn)}

      <button type="button" onclick="saveMemberChanges('${member.id}')"
        style="background:#2b5cff;color:white;padding:10px;border:none;border-radius:8px;">
        Save Changes
      </button>

      <button type="button" onclick="closeEditMember()">
        Cancel
      </button>

      ${buildEditMemberDeleteButtonHtmlFn(isChurchAdmin)}

    </div>
  `;

  applyEditMemberMinistrySelectionFn(
    documentObj,
    ministryStringToSelectValueFn,
    fields.Ministry || ""
  );
  attachEditMemberPhotoInputChangeHandlerFn(documentObj, onEditMemberPhotoInputChangeFn);

  attachEditMemberRemovePhotoHandlerFn(
    documentObj,
    setEditMemberRemovePhotoFn,
    setEditMemberPhotoJpegBlobFn
  );

  openEditMemberSheetFn(documentObj);

  attachEditMemberDeleteButtonHandlerFn(
    documentObj,
    () => deleteMemberFromDirectoryFn(member.id)
  );
}

export async function saveMemberChangesEntry({
  memberId,
  documentObj,
  splitMinistryAndRoleFn,
  readEditMemberFormValuesFn,
  hasRequiredEditMemberNameFn,
  alertFn,
  editMemberNameRequiredMessage,
  getMemberAndExistingPhotoFn,
  members,
  loadFirestoreFns,
  isChurchAdmin,
  editMemberRemovePhoto,
  editMemberPhotoJpegBlob,
  saveAdminMemberEditsFn,
  storageObj,
  refFn,
  uploadBytesFn,
  getDownloadURLFn,
  dbObj,
  profileUpdatedMessage,
  savePendingMemberEditsFn,
  currentUser,
  submitPendingChangeFn,
  logFn,
  finalizeEditMemberSaveFlowFn,
  clearEditMemberPhotoStateFn,
  buildDirectoryFn,
  getCurrentMemberSearchQueryFn,
  closeEditMemberFn,
  onErrorFn,
  updateMemberFailedMessage
}){
  const values = readEditMemberFormValuesFn(documentObj, splitMinistryAndRoleFn);
  if(!hasRequiredEditMemberNameFn(values)){
    alertFn(editMemberNameRequiredMessage);
    return;
  }

  const { member, existingPhoto } = getMemberAndExistingPhotoFn(members, memberId);

  try {
    const { updateDoc, doc } = await loadFirestoreFns();

    const isAdmin = isChurchAdmin;
    const removePhoto = editMemberRemovePhoto;
    const photoBlob = editMemberPhotoJpegBlob;
    let photoOut = existingPhoto;

    if(isAdmin){
      photoOut = await saveAdminMemberEditsFn({
        existingPhoto,
        memberId,
        removePhoto,
        photoBlob,
        storageObj,
        refFn,
        uploadBytesFn,
        getDownloadURLFn,
        updateDocFn: updateDoc,
        docFn: doc,
        dbObj,
        formValues: values
      });

      alertFn(profileUpdatedMessage);
    }else{
      await savePendingMemberEditsFn({
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
        formValues: values
      });
    }

    logFn("Member updated!");

    finalizeEditMemberSaveFlowFn({
      clearEditMemberPhotoStateFn,
      member,
      isAdmin,
      formValues: values,
      photoOut,
      buildDirectoryFn,
      getCurrentMemberSearchQueryFn,
      closeEditMemberFn
    });
  }catch(err){
    onErrorFn("Update failed:", err);
    alertFn(updateMemberFailedMessage);
  }
}
