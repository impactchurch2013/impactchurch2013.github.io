export function buildMemberSelectHtml(members, escapeHtmlFn){
  let html = `<h2>Select Member</h2>`;

  members.forEach(member => {
    const name = (member.fields && member.fields["Full Name"]) || "";
    html += `
      <div onclick="selectMemberForEdit('${member.id}')"
           style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;">
        ${escapeHtmlFn(name)}
      </div>
    `;
  });

  return html;
}

export function renderMemberSelectContent(documentObj, members, escapeHtmlFn){
  const box = documentObj.getElementById("memberSelectContent");
  if(!box){
    return;
  }

  box.innerHTML = buildMemberSelectHtml(members, escapeHtmlFn);
}

export function openMemberSelectFlow(documentObj, openMemberSelectSheetFn, renderMemberSelectContentFn){
  openMemberSelectSheetFn(documentObj, renderMemberSelectContentFn);
}

export function closeMemberSelectFlow(documentObj, closeMemberSelectSheetFn){
  closeMemberSelectSheetFn(documentObj);
}
