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
