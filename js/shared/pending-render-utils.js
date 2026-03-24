export function buildPendingYearViewHtml(unresolvedRowLabel, years){
  let html = `<h2>Pending Changes</h2>`;

  html += `
    <div onclick="buildUnresolvedList()"
      style="padding:14px;border-bottom:1px solid #e0e0e0;cursor:pointer;font-weight:600;background:#f5f7fa;">
      ${unresolvedRowLabel}
    </div>
  `;

  Object.keys(years)
    .sort((a, b) => b - a)
    .forEach(year => {
      html += `
        <div onclick='buildMonthView(${year})'
          style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;">
          ${year}
        </div>
      `;
    });

  return html;
}

export function buildPendingMonthViewHtml(year, months){
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let html = `<h2>${year}</h2>`;

  Object.keys(months)
    .sort((a, b) => b - a)
    .forEach(month => {
      html += `
        <div onclick='buildDayList(${year}, ${month})'
          style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;">
          ${monthNames[month]}
        </div>
      `;
    });

  return html;
}

export function buildPendingDayListHtml(filtered, getPendingCreatedAtDateFn){
  let html = `<h2>Changes</h2>`;

  filtered.forEach(change => {
    const d = getPendingCreatedAtDateFn(change);
    if(!d){
      return;
    }

    const label = d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric"
    });

    html += `
      <div style="padding:12px;border-bottom:1px solid #eee;">
        <strong>${label}</strong><br>
        ${change.submittedBy}
      </div>
    `;
  });

  return html;
}

export function buildUnresolvedPendingEmptyStateHtml(){
  return `
      <div onclick="restorePendingChangesYearView()"
        style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;">
        ← Back
      </div>
      <h2>Unresolved</h2>
      <p style="padding:14px;">No pending changes loaded.</p>
    `;
}

export function buildUnresolvedPendingListHtml(filtered, getPendingCreatedAtDateFn, escapeHtmlFn){
  let html = `
    <div onclick="restorePendingChangesYearView()"
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;">
      ← Back
    </div>
    <h2>Unresolved</h2>
  `;

  if(filtered.length === 0){
    html += `<p style="padding:14px;">No unresolved items — nothing is pending.</p>`;
    return html;
  }

  filtered.forEach(change => {
    const d = getPendingCreatedAtDateFn(change);
    const label = d
      ? d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
      })
      : "—";

    html += `
      <div onclick="openUnresolvedPendingDetail('${change.id}')"
        style="padding:12px;border-bottom:1px solid #eee;cursor:pointer;">
        <strong>${escapeHtmlFn(label)}</strong><br>
        ${escapeHtmlFn(change.submittedBy || "")}
      </div>
    `;
  });

  return html;
}
