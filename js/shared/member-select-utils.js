export function buildMemberSelectHtml(
  members,
  escapeHtmlFn,
  onSelectHandlerName = "selectMemberForEdit",
  title = "Select Member"
){
  let html = `<h2>Select Member</h2>`;
  html = `<h2>${escapeHtmlFn(title)}</h2>`;

  members.forEach(member => {
    const name = (member.fields && member.fields["Full Name"]) || "";
    html += `
      <div onclick="${onSelectHandlerName}('${member.id}')"
           style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;">
        ${escapeHtmlFn(name)}
      </div>
    `;
  });

  return html;
}

export function renderMemberSelectContent(documentObj, members, escapeHtmlFn, options = {}){
  const box = documentObj.getElementById("memberSelectContent");
  if(!box){
    return;
  }

  const onSelectHandlerName = options.onSelectHandlerName || "selectMemberForEdit";
  const title = options.title || "Select Member";
  box.innerHTML = buildMemberSelectHtml(members, escapeHtmlFn, onSelectHandlerName, title);
}

export function openMemberSelectFlow(documentObj, openMemberSelectSheetFn, renderMemberSelectContentFn, options = {}){
  openMemberSelectSheetFn(documentObj, () => renderMemberSelectContentFn(options));
}

export function closeMemberSelectFlow(documentObj, closeMemberSelectSheetFn){
  closeMemberSelectSheetFn(documentObj);
}
