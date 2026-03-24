function normalizeProfileEmailForOwnershipCheck(rawEmail){
  return String(rawEmail || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()
    .toLowerCase();
}

function setSubmitButtonState(buttonEl, { disabled, text }){
  if(!buttonEl){
    return;
  }
  buttonEl.disabled = disabled;
  buttonEl.textContent = text;
}

export function openEditMyProfileSheetEntry({
  currentUser,
  lastViewedProfile,
  members,
  alertFn,
  profileEditOwnOnlyMessage,
  profileLoadFailedMessage,
  setEditMyProfileMemberIdFn,
  closeProfileFn,
  openEditMyProfileFormFn,
  setTimeoutFn,
  openDelayMs = 320
}){
  if(!currentUser || !currentUser.email){
    return;
  }

  if(!lastViewedProfile || !lastViewedProfile.id){
    return;
  }

  const currentUserEmail = String(currentUser.email).toLowerCase().trim();
  const profileEmail = normalizeProfileEmailForOwnershipCheck(lastViewedProfile.email);

  if(!profileEmail || profileEmail !== currentUserEmail){
    alertFn(profileEditOwnOnlyMessage);
    return;
  }

  const member = members.find((m) => m.id === lastViewedProfile.id);
  if(!member){
    alertFn(profileLoadFailedMessage);
    return;
  }

  setEditMyProfileMemberIdFn(member.id);
  closeProfileFn();
  setTimeoutFn(() => {
    openEditMyProfileFormFn(member);
  }, openDelayMs);
}

export function openEditMyProfileFormEntry({
  member,
  currentUser,
  clearOnboardingPhotoPreviewStateFn,
  escapeHtmlFn,
  documentObj,
  ministryStringToSelectValueFn,
  submitEditMyProfileFn,
  cancelEditMyProfileFn,
  onOnboardPhotoInputChangeFn,
  openSheetFn
}){
  clearOnboardingPhotoPreviewStateFn();

  const fields = member.fields || {};
  const defaultEmail = (currentUser && currentUser.email)
    ? currentUser.email.replace(/"/g, "&quot;")
    : "";

  const valueFor = (key) => escapeHtmlFn(fields[key] || "");
  const box = documentObj.getElementById("onboardingContent");
  if(!box){
    return;
  }

  box.innerHTML = `
    <h2>Edit my profile</h2>
    <p style="margin:0 0 8px;font-size:14px;color:#555;">Update what you would like to share. Changes are sent for admin approval before they appear in the directory. Email stays tied to your Google account.</p>

    <div style="display:flex;flex-direction:column;gap:10px;">

      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>First name</span>
        <input id="onboardFirstName" placeholder="First name" autocomplete="given-name" value="${valueFor("First Name")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Last name</span>
        <input id="onboardLastName" placeholder="Last name" autocomplete="family-name" value="${valueFor("Last Name")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Ministries and Roles</span>
        <select id="onboardMinistry" style="padding:8px;border-radius:6px;border:1px solid #ccc;">
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
        <span>Email</span>
        <input id="onboardEmail" type="email" placeholder="Email" value="${defaultEmail}" autocomplete="email" readonly style="background:#f5f5f5;">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Phone</span>
        <input id="onboardPhone" type="tel" placeholder="Phone" autocomplete="tel" value="${valueFor("Phone Number")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Address</span>
        <input id="onboardAddress" placeholder="Street address" autocomplete="street-address" value="${valueFor("Address")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>City</span>
        <input id="onboardCity" placeholder="City" autocomplete="address-level2" value="${valueFor("City")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>State</span>
        <input id="onboardState" placeholder="State" autocomplete="address-level1" value="${valueFor("State")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>ZIP</span>
        <input id="onboardZip" placeholder="ZIP code" autocomplete="postal-code" value="${valueFor("Zip Code")}">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Birthday</span>
        <input id="onboardBirthday" type="text" placeholder="e.g. Feb 25" inputmode="text" autocomplete="off" aria-describedby="onboardBirthdayHint" value="${valueFor("Birthday")}">
        <span id="onboardBirthdayHint" style="font-size:12px;color:#666;">Month and day only, short month and no suffix (example: Feb 25).</span>
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Anniversary</span>
        <input id="onboardAnniversary" type="text" placeholder="e.g. Jun 12" inputmode="text" autocomplete="off" aria-describedby="onboardAnniversaryHint" value="${valueFor("Anniversary")}">
        <span id="onboardAnniversaryHint" style="font-size:12px;color:#666;">Month and day only, short month and no suffix (example: Jun 12).</span>
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Profile photo (optional)</span>
        <input id="onboardPhoto" type="file" accept="image/*" style="font-size:14px;">
        <span style="font-size:12px;color:#666;">Upload a new photo to replace your current one, or leave unchanged. Up to 10 MB; images are resized and saved as JPEG before upload.</span>
      </label>
      <div id="onboardPhotoPreview" style="display:none;margin-top:4px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;">Preview (new photo)</p>
        <img id="onboardPhotoPreviewImg" alt="" width="400" height="300" loading="lazy"
          style="max-width:100%;max-height:240px;border-radius:8px;border:1px solid #ddd;object-fit:contain;background:#fafafa;">
      </div>

      <button type="button" id="onboardSubmitBtn"
        style="background:#2b5cff;color:white;padding:10px;border:none;border-radius:8px;">
        Submit changes for approval
      </button>

      <button type="button" id="onboardCancelBtn"
        style="padding:10px;border:1px solid #ccc;background:#fff;border-radius:8px;">
        Cancel
      </button>

    </div>
  `;

  const ministrySelect = documentObj.getElementById("onboardMinistry");
  if(ministrySelect){
    ministrySelect.value = ministryStringToSelectValueFn(fields.Ministry || "");
  }

  const submitBtn = documentObj.getElementById("onboardSubmitBtn");
  if(submitBtn){
    submitBtn.onclick = () => submitEditMyProfileFn();
  }

  const cancelBtn = documentObj.getElementById("onboardCancelBtn");
  if(cancelBtn){
    cancelBtn.onclick = () => cancelEditMyProfileFn();
  }

  const photoEl = documentObj.getElementById("onboardPhoto");
  if(photoEl){
    photoEl.addEventListener("change", onOnboardPhotoInputChangeFn);
  }

  openSheetFn("onboardingSheet");
}

export async function submitEditMyProfileEntry({
  windowObj,
  documentObj,
  members,
  splitMinistryAndRoleFn,
  alertFn,
  profileReferenceMissingMessage,
  profileSigninRequiredMessage,
  profileNameRequiredMessage,
  profileImageTooLargeMessage,
  profileImageProcessFailedMessage,
  profileSubmitChangesFailedMessage,
  profileImageMaxFileBytes,
  compressImageFileToJpegBlobFn,
  refFn,
  storageObj,
  uploadBytesFn,
  getDownloadURLFn,
  submitPendingChangeFn,
  onErrorFn
}){
  const memberId = windowObj.__editMyProfileMemberId;
  if(!memberId){
    alertFn(profileReferenceMissingMessage);
    return;
  }

  const firstName = (documentObj.getElementById("onboardFirstName").value || "").trim();
  const lastName = (documentObj.getElementById("onboardLastName").value || "").trim();
  const { ministry, role } = splitMinistryAndRoleFn(
    documentObj.getElementById("onboardMinistry").value
  );
  const phone = (documentObj.getElementById("onboardPhone").value || "").trim();
  const address = (documentObj.getElementById("onboardAddress").value || "").trim();
  const city = (documentObj.getElementById("onboardCity").value || "").trim();
  const state = (documentObj.getElementById("onboardState").value || "").trim();
  const zip = (documentObj.getElementById("onboardZip").value || "").trim();
  const birthday = (documentObj.getElementById("onboardBirthday").value || "").trim();
  const anniversary = (documentObj.getElementById("onboardAnniversary").value || "").trim();

  const email = (windowObj.currentUser && windowObj.currentUser.email)
    ? windowObj.currentUser.email.toLowerCase().trim()
    : "";
  if(!email){
    alertFn(profileSigninRequiredMessage);
    return;
  }

  if(!firstName || !lastName){
    alertFn(profileNameRequiredMessage);
    return;
  }

  const submitBtn = documentObj.getElementById("onboardSubmitBtn");
  setSubmitButtonState(submitBtn, { disabled: true, text: "Saving…" });

  try{
    const photoInput = documentObj.getElementById("onboardPhoto");
    const file = photoInput && photoInput.files && photoInput.files[0]
      ? photoInput.files[0]
      : null;

    if(file && file.size > profileImageMaxFileBytes){
      alertFn(profileImageTooLargeMessage);
      setSubmitButtonState(submitBtn, { disabled: false, text: "Submit changes for approval" });
      return;
    }

    let photoURL = "";
    let jpegBlob = windowObj.__onboardingPhotoJpegBlob || null;

    if(file && !jpegBlob){
      setSubmitButtonState(submitBtn, { disabled: true, text: "Preparing photo…" });
      try{
        jpegBlob = await compressImageFileToJpegBlobFn(file);
        windowObj.__onboardingPhotoJpegBlob = jpegBlob;
      }catch(compErr){
        onErrorFn(compErr);
        alertFn(profileImageProcessFailedMessage);
        setSubmitButtonState(submitBtn, { disabled: false, text: "Submit changes for approval" });
        return;
      }
    }

    if(jpegBlob){
      setSubmitButtonState(submitBtn, { disabled: true, text: "Uploading photo…" });

      const uid = windowObj.currentUser.uid
        || windowObj.currentUser.email.replace(/[^a-zA-Z0-9]+/g, "_");

      const path = `profilePhotos/pending/${uid}/${Date.now()}_profile.jpg`;
      const storageRef = refFn(storageObj, path);

      await uploadBytesFn(storageRef, jpegBlob, { contentType: "image/jpeg" });
      photoURL = await getDownloadURLFn(storageRef);
    }

    const member = members.find((m) => m.id === memberId);
    const existingPhoto = member && member.fields
      ? (member.fields.Photo || "").trim()
      : "";
    if(!photoURL && existingPhoto){
      photoURL = existingPhoto;
    }

    const pendingPayload = {
      firstName,
      lastName,
      fullName: `${firstName} ${lastName}`,
      ministry,
      role,
      email,
      phone,
      address,
      city,
      state,
      zip,
      birthday,
      anniversary,
      lastUpdated: new Date().toISOString()
    };
    if(photoURL){
      pendingPayload.photoURL = photoURL;
    }

    await submitPendingChangeFn(memberId, pendingPayload, { isOnboarding: false });
    windowObj.__editMyProfileMemberId = null;
    windowObj.location.reload();
  }catch(err){
    onErrorFn(err);
    alertFn(profileSubmitChangesFailedMessage);
    setSubmitButtonState(submitBtn, { disabled: false, text: "Submit changes for approval" });
  }
}
