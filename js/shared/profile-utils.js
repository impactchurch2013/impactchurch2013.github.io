import { formatMinistryFieldForDisplay } from "./member-utils.js";

export function showFamilyMemberProfileFlow(
  setReturnToFamilyFn,
  showProfileFromMemberFn,
  name,
  householdName
){
  setReturnToFamilyFn(householdName);
  showProfileFromMemberFn(name);
}

export function buildAddressHtmlFromFields(fields){
  return `${fields.Address || ""}<br>${fields.City || ""}, ${fields.State || ""} ${fields["Zip Code"] || ""}`;
}

export function getFamilyMembersByHousehold(members, householdName){
  return members.filter(m => (m.fields.Household || "") === householdName);
}

export function buildFamilyMemberCardHtml(member, householdName){
  const f = member.fields || {};
  const name = f["Full Name"] || "";
  const photo = f.Photo || "images/default.jpg";

  return `
<div class="family-member" onclick="showFamilyMemberProfile('${name}','${householdName}')">

<img src="${photo}" loading="lazy" width="200" height="200" alt="">

<div class="family-member-name">${name}</div>

</div>
`;
}

export function buildHouseholdHtml(familyMembers, householdName){
  let html = `
        <h2 class="family-title">${householdName} Family</h2>
        <div class="family-grid">
    `;

  familyMembers.forEach(member => {
    html += buildFamilyMemberCardHtml(member, householdName);
  });

  html += `
</div>
`;

  return html;
}

export function showHouseholdFlow(documentObj, members, householdName){
  const familyMembers = getFamilyMembersByHousehold(members, householdName);
  const box = documentObj.getElementById("profileContent");
  if(!box){
    return;
  }

  box.innerHTML = buildHouseholdHtml(familyMembers, householdName);

  const overlay = documentObj.getElementById("profile");
  if(overlay){
    overlay.classList.add("show");
  }
}

export function findMemberByIdOrFullName(members, name){
  return members.find(m => m.id === name)
    || members.find(m => (m.fields["Full Name"] || "") === name)
    || null;
}

export function createProfileViewModel({
  id,
  displayName,
  photo,
  ministry,
  phone,
  email,
  address,
  birthday,
  anniversary,
  household,
  updated
}){
  return {
    id,
    displayName,
    photo,
    ministry,
    phone,
    email,
    address,
    birthday,
    anniversary,
    household,
    updated
  };
}

export function buildProfileViewModelFromMemberFields(
  member,
  formatPhoneFn,
  formatMonthDayFn,
  formatDateFn
){
  if(!member){
    return null;
  }

  const f = member.fields;

  return createProfileViewModel({
    id: member.id,
    displayName: f["Full Name"] || "",
    photo: f.Photo || "",
    ministry: formatMinistryFieldForDisplay(f.Ministry || ""),
    phone: formatPhoneFn(f["Phone Number"]),
    email: f.Email || "",
    address: buildAddressHtmlFromFields(f),
    birthday: formatMonthDayFn(f.Birthday),
    anniversary: formatMonthDayFn(f.Anniversary),
    household: f.Household || "",
    updated: formatDateFn(f["Last Updated"])
  });
}

export function showProfileFromViewModel(viewModel, showProfileFn){
  if(!viewModel){
    return;
  }

  showProfileFn(
    viewModel.id,
    viewModel.displayName,
    viewModel.photo,
    viewModel.ministry,
    viewModel.phone,
    viewModel.email,
    viewModel.address,
    viewModel.birthday,
    viewModel.anniversary,
    viewModel.household,
    viewModel.updated
  );
}

export function goBackToProfileFlow(lastViewedProfile, showProfileFn){
  if(!lastViewedProfile){
    return;
  }

  showProfileFromViewModel(createProfileViewModel({
    id: lastViewedProfile.id,
    displayName: lastViewedProfile.name,
    photo: lastViewedProfile.photo,
    ministry: lastViewedProfile.ministry,
    phone: lastViewedProfile.phone,
    email: lastViewedProfile.email,
    address: lastViewedProfile.address,
    birthday: lastViewedProfile.birthday,
    anniversary: lastViewedProfile.anniversary,
    household: lastViewedProfile.household,
    updated: lastViewedProfile.updated
  }), showProfileFn);
}

export function showProfileFromMemberFlow(
  members,
  name,
  formatPhoneFn,
  formatMonthDayFn,
  formatDateFn,
  showProfileFn
){
  const member = findMemberByIdOrFullName(members, name);

  if(!member){
    return;
  }

  const viewModel = buildProfileViewModelFromMemberFields(
    member,
    formatPhoneFn,
    formatMonthDayFn,
    formatDateFn
  );

  showProfileFromViewModel(viewModel, showProfileFn);
}

export function consumeReturnToFamilyFlow(returnToFamily, setReturnToFamilyFn, showHouseholdFn){
  if(!returnToFamily){
    return false;
  }

  const family = returnToFamily;
  setReturnToFamilyFn(null);
  showHouseholdFn(family);
  return true;
}

export function closeProfileOverlay(documentObj){
  const overlay = documentObj.getElementById("profile");
  if(!overlay){
    return;
  }

  const sheet = overlay.querySelector(".profile-box");
  if(!sheet){
    return;
  }

  sheet.style.transform = "translateY(100%)";

  setTimeout(() => {
    overlay.classList.remove("show");
  }, 300);
}

export function resetProfilePageState(documentObj, windowObj, savedScrollPosition){
  documentObj.body.classList.remove("profile-open");
  documentObj.body.style.overflow = "";
  windowObj.scrollTo(0, savedScrollPosition);
}

export function applyProfileDragResistance(sheet, diff){
  if(diff > 0){
    const resistance = diff * 0.7;
    sheet.style.transform = `translateY(${resistance}px)`;
  }
}

export function shouldCloseProfileFromSwipe(distance, velocity){
  return distance > 120 || velocity > 0.5;
}

export function normalizeProfileEmail(email){
  return String(email || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .trim()
    .toLowerCase();
}

export function isOwnProfileForCurrentUser(currentUser, profileEmail){
  const currentEmail = (currentUser && currentUser.email)
    ? currentUser.email.toLowerCase().trim()
    : "";
  const emailPlain = normalizeProfileEmail(profileEmail);
  return !!(currentEmail && emailPlain && currentEmail === emailPlain);
}

export function buildProfileHtml(
  profile,
  rawPhone,
  isOwnProfile
){
  const {
    name,
    photo,
    ministry,
    phone,
    email,
    address,
    birthday,
    anniversary,
    household,
    updated
  } = profile;

  return `

${isOwnProfile ? `<div class="profile-own-edit-link" style="width:100%;padding:8px 12px 0 12px;margin:0;box-sizing:border-box;font-size:13px;line-height:1.35;text-align:left;"><a href="#" onclick="openEditMyProfileSheet();return false;" style="color:#2b5cff;">Edit my profile</a></div>` : ""}

<div style="position:relative; display:inline-block;">
  
  <img 
    id="profilePhoto"
    src="${photo}" 
    loading="lazy"
    decoding="async"
    alt=""
    onclick="openPhoto('${photo}')"
    style="cursor:pointer">

</div>

<div class="profile-info-group">
<h2>${name}</h2>

<div class="profile-details">
${ministry ? `<p><strong>${ministry}</strong></p>${(phone || email || address) ? `<div class="profile-divider"></div>` : ""}` : ""}

<p><a href="tel:${rawPhone}">${phone}</a></p>
<p><a href="mailto:${email}">${email}</a></p>

<p>
<a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.replace(/<br>/g,' '))}" target="_blank">
${address}
</a>
</p>

${(birthday || anniversary || household) ? `<div class="profile-divider"></div>` : ""}

${birthday ? `<p><strong>Birthday:</strong> ${birthday}</p>` : ""}
${anniversary ? `<p><strong>Anniversary:</strong> ${anniversary}</p>` : ""}
${household ? `<p><strong>Family:</strong> 
<a href="#" onclick="showHousehold('${household}');return false;">${household}</a>
</p>` : ""}

${updated ? `<p style="font-size:12px;color:#777;margin-top:12px">Updated ${updated}</p>` : ""}
</div>
</div>

`;
}

export function openProfileOverlay(documentObj){
  documentObj.body.classList.add("profile-open");
  documentObj.body.style.overflow = "hidden";

  const overlay = documentObj.getElementById("profile");
  if(!overlay){
    return;
  }

  const sheet = overlay.querySelector(".profile-box");
  if(!sheet){
    return;
  }

  overlay.classList.add("show");

  setTimeout(() => {
    sheet.style.transform = "translateY(0)";
  }, 10);
}

export function setupProfileSheetSwipeClose(
  documentObj,
  closeProfileFn,
  applyProfileDragResistanceFn,
  shouldCloseProfileFromSwipeFn
){
  const sheet = documentObj.querySelector(".profile-box");
  if(!sheet){
    return;
  }

  let startY = 0;
  let currentY = 0;
  let startTime = 0;
  let dragging = false;

  sheet.addEventListener("touchstart", (e) => {
    // Only allow swipe-to-close when sheet content is at top.
    if(sheet.scrollTop > 0){
      dragging = false;
      return;
    }

    startY = e.touches[0].clientY;
    startTime = Date.now();
    dragging = true;
  });

  sheet.addEventListener("touchmove", (e) => {
    if(!dragging){
      return;
    }

    currentY = e.touches[0].clientY;
    const diff = currentY - startY;
    applyProfileDragResistanceFn(sheet, diff);
  });

  sheet.addEventListener("touchend", () => {
    dragging = false;

    const distance = currentY - startY;
    const time = Date.now() - startTime;
    const velocity = distance / time;

    if(shouldCloseProfileFromSwipeFn(distance, velocity)){
      closeProfileFn();
    }else{
      sheet.style.transform = "translateY(0)";
    }
  });
}

export function normalizeProfileDates(birthday, anniversary, formatShortDateFn){
  return {
    birthday: formatShortDateFn(birthday),
    anniversary: formatShortDateFn(anniversary)
  };
}

export function buildLastViewedProfileState(
  id,
  name,
  photo,
  ministry,
  phone,
  email,
  address,
  birthday,
  anniversary,
  household,
  updated
){
  return { id, name, photo, ministry, phone, email, address, birthday, anniversary, household, updated };
}

export function setProfileWindowState(windowObj, lastViewedProfile, selectedMemberName){
  windowObj.lastViewedProfile = lastViewedProfile;
  windowObj.selectedMemberName = selectedMemberName;
}

export function getWindowScrollY(windowObj){
  return windowObj.scrollY;
}
