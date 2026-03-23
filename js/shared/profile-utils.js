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

  return {
    id: member.id,
    displayName: f["Full Name"] || "",
    photo: f.Photo || "",
    ministry: f.Ministry || "",
    phone: formatPhoneFn(f["Phone Number"]),
    email: f.Email || "",
    address: buildAddressHtmlFromFields(f),
    birthday: formatMonthDayFn(f.Birthday),
    anniversary: formatMonthDayFn(f.Anniversary),
    household: f.Household || "",
    updated: formatDateFn(f["Last Updated"])
  };
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

  showProfileFromViewModel(
    {
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
    },
    showProfileFn
  );
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
