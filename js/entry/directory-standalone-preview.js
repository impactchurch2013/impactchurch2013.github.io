function getMemberDisplayName(data){
  const fullName = String(data.fullName || "").trim();
  if(fullName){
    return fullName;
  }

  const firstName = String(data.firstName || "").trim();
  const lastName = String(data.lastName || "").trim();
  return `${firstName} ${lastName}`.trim() || "(Unnamed member)";
}

function getMemberMinistry(data){
  return String(data.ministry || "").trim();
}

function escapeHtml(value){
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildPreviewListHtml(rows){
  if(rows.length === 0){
    return "No members available for preview.";
  }

  const items = rows.map((row) => {
    const name = escapeHtml(row.name);
    const ministry = escapeHtml(row.ministry);
    const ministryText = ministry ? ` <span style="color:#6b7280;">- ${ministry}</span>` : "";
    return `<li style="margin:0 0 6px;">${name}${ministryText}</li>`;
  }).join("");

  return `<ul style="margin:0;padding-left:18px;">${items}</ul>`;
}

export function renderStandaloneDirectoryPreview(documentObj, memberRows, totalMembers){
  const container = documentObj.getElementById("standalonePreviewList");
  if(!container){
    return;
  }

  const listHtml = buildPreviewListHtml(memberRows);
  container.innerHTML = `
    <div style="margin:0 0 8px;color:#111;font-weight:600;">Showing ${memberRows.length} of ${totalMembers} members (read-only preview)</div>
    ${listHtml}
  `;
}

export async function runMembersPreviewProbe({
  dbObj,
  loadFirestoreFns,
  renderPreviewFn,
  documentObj,
  previewLimit = 12
}){
  const { getDocs, collection } = await loadFirestoreFns();
  const snapshot = await getDocs(collection(dbObj, "members"));
  const allRows = snapshot.docs.map((docSnap) => {
    const data = docSnap.data() || {};
    return {
      name: getMemberDisplayName(data),
      ministry: getMemberMinistry(data)
    };
  });

  allRows.sort((a, b) => a.name.localeCompare(b.name));
  const previewRows = allRows.slice(0, previewLimit);
  renderPreviewFn(documentObj, previewRows, allRows.length);

  return {
    totalMembers: allRows.length,
    renderedMembers: previewRows.length
  };
}
