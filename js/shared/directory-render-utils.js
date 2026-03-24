import { formatMinistryFieldForDisplay } from "./member-utils.js";

export function buildDirectoryProfileViewModel(
  record,
  formatPhoneFn,
  buildAddressHtmlFromFieldsFn,
  formatMonthDayFn,
  formatDateFn,
  createProfileViewModelFn
){
  const fields = (record && record.fields) || {};
  const photo = fields.Photo || "images/default.jpg";
  const displayName = fields["Full Name"] || "";

  return createProfileViewModelFn({
    id: record.id,
    displayName,
    photo,
    ministry: formatMinistryFieldForDisplay(fields.Ministry || ""),
    phone: formatPhoneFn(fields["Phone Number"]),
    email: fields.Email || "",
    address: buildAddressHtmlFromFieldsFn(fields),
    birthday: formatMonthDayFn(fields.Birthday),
    anniversary: formatMonthDayFn(fields.Anniversary),
    household: fields.Household || "",
    updated: formatDateFn(fields["Last Updated"])
  });
}

export function buildDirectoryCardHtml(photo, displayName, ministry){
  return `
<img src="${photo}" loading="lazy" width="260" height="260" alt="">
<div class="card-info">
<h3>${displayName}</h3>
${ministry ? `<p>${ministry}</p>` : ""}
</div>
`;
}

export function createDirectoryCardElement(documentObj, cardHtml, onClick){
  const card = documentObj.createElement("div");
  card.className = "card";
  card.innerHTML = cardHtml;
  card.onclick = onClick;
  return card;
}
