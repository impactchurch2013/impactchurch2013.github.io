function setSubmitButtonState(buttonEl, { disabled, text }){
  if(!buttonEl){
    return;
  }
  buttonEl.disabled = disabled;
  buttonEl.textContent = text;
}

export function openOnboardingEntry({
  windowObj,
  clearOnboardingPhotoPreviewStateFn,
  documentObj,
  submitOnboardingFn,
  onOnboardPhotoInputChangeFn,
  openSheetFn
}){
  windowObj.__editMyProfileMemberId = null;
  clearOnboardingPhotoPreviewStateFn();

  const box = documentObj.getElementById("onboardingContent");
  if(!box){
    return;
  }

  const defaultEmail = (windowObj.currentUser && windowObj.currentUser.email)
    ? windowObj.currentUser.email.replace(/"/g, "&quot;")
    : "";

  box.innerHTML = `
    <h2>Complete Your Profile</h2>
    <p style="margin:0 0 8px;font-size:14px;color:#555;">Fill in what you would like to share. Optional fields can be left blank. Email is taken from your Google account.</p>

    <div style="display:flex;flex-direction:column;gap:10px;">

      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>First name</span>
        <input id="onboardFirstName" placeholder="First name" autocomplete="given-name">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Last name</span>
        <input id="onboardLastName" placeholder="Last name" autocomplete="family-name">
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
        <input id="onboardPhone" type="tel" placeholder="Phone" autocomplete="tel">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Address</span>
        <input id="onboardAddress" placeholder="Street address" autocomplete="street-address">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>City</span>
        <input id="onboardCity" placeholder="City" autocomplete="address-level2">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>State</span>
        <input id="onboardState" placeholder="State" autocomplete="address-level1">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>ZIP</span>
        <input id="onboardZip" placeholder="ZIP code" autocomplete="postal-code">
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Birthday</span>
        <input id="onboardBirthday" type="text" placeholder="e.g. Feb 25" inputmode="text" autocomplete="off" aria-describedby="onboardBirthdayHint">
        <span id="onboardBirthdayHint" style="font-size:12px;color:#666;">Month and day only, short month and no suffix (example: Feb 25).</span>
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Anniversary</span>
        <input id="onboardAnniversary" type="text" placeholder="e.g. Jun 12" inputmode="text" autocomplete="off" aria-describedby="onboardAnniversaryHint">
        <span id="onboardAnniversaryHint" style="font-size:12px;color:#666;">Month and day only, short month and no suffix (example: Jun 12).</span>
      </label>
      <label style="display:flex;flex-direction:column;gap:4px;font-size:13px;">
        <span>Profile photo (optional)</span>
        <div class="profile-photo-examples" aria-hidden="true">
          <div class="profile-photo-examples-row">
            <div class="profile-photo-examples-cell profile-photo-examples-cell--portrait">
              <img src="images/portrait2.jpg" alt="" loading="lazy" decoding="async">
            </div>
            <div class="profile-photo-examples-cell profile-photo-examples-cell--landscape">
              <img src="images/landscape2.jpg" alt="" loading="lazy" decoding="async">
            </div>
          </div>
          <p class="profile-photo-examples-hint">Centered subjects work best in directory images.</p>
        </div>
        <input id="onboardPhoto" type="file" accept="image/*" style="font-size:14px;">
        <span style="font-size:12px;color:#666;">Up to 10 MB. Images are resized (max width 800px), converted to JPEG, and compressed before upload. Only a link is stored in Firestore.</span>
      </label>
      <div id="onboardPhotoPreview" style="display:none;margin-top:4px;">
        <p style="margin:0 0 6px;font-size:13px;font-weight:600;">Preview (how it will look)</p>
        <img id="onboardPhotoPreviewImg" alt="" width="400" height="300" loading="lazy"
          style="max-width:100%;max-height:240px;border-radius:8px;border:1px solid #ddd;object-fit:contain;background:#fafafa;">
      </div>

      <button type="button" id="onboardSubmitBtn"
        style="background:#2b5cff;color:white;padding:10px;border:none;border-radius:8px;">
        Submit profile
      </button>

    </div>
  `;

  const submitBtn = documentObj.getElementById("onboardSubmitBtn");
  if(submitBtn){
    submitBtn.onclick = () => submitOnboardingFn();
  }

  const photoEl = documentObj.getElementById("onboardPhoto");
  if(photoEl){
    photoEl.addEventListener("change", onOnboardPhotoInputChangeFn);
  }

  openSheetFn("onboardingSheet");
}

export async function submitOnboardingEntry({
  windowObj,
  documentObj,
  splitMinistryAndRoleFn,
  alertFn,
  profileSigninRequiredSaveMessage,
  profileNameRequiredMessage,
  profileImageTooLargeMessage,
  profileImageProcessFailedMessage,
  profileSubmitOnboardingFailedMessage,
  profileImageMaxFileBytes,
  compressImageFileToJpegBlobFn,
  refFn,
  storageObj,
  uploadBytesFn,
  getDownloadURLFn,
  submitPendingChangeFn,
  onErrorFn
}){
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
    alertFn(profileSigninRequiredSaveMessage);
    return;
  }

  if(!firstName || !lastName){
    alertFn(profileNameRequiredMessage);
    return;
  }

  const submitBtn = documentObj.getElementById("onboardSubmitBtn");
  setSubmitButtonState(submitBtn, { disabled: true, text: "Saving…" });

  try {
    const photoInput = documentObj.getElementById("onboardPhoto");
    const file = photoInput && photoInput.files && photoInput.files[0]
      ? photoInput.files[0]
      : null;

    if(file && file.size > profileImageMaxFileBytes){
      alertFn(profileImageTooLargeMessage);
      setSubmitButtonState(submitBtn, { disabled: false, text: "Submit profile" });
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
        setSubmitButtonState(submitBtn, { disabled: false, text: "Submit profile" });
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
      onboarding: true
    };
    if(photoURL){
      pendingPayload.photoURL = photoURL;
    }

    await submitPendingChangeFn(null, pendingPayload, { isOnboarding: true });
    windowObj.location.reload();
  }catch(err){
    onErrorFn(err);
    alertFn(profileSubmitOnboardingFailedMessage);
    setSubmitButtonState(submitBtn, { disabled: false, text: "Submit profile" });
  }
}
