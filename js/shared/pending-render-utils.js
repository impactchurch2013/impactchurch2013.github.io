export function buildPendingYearViewHtml(unresolvedRowLabel, years){
  let html = `
    <div onclick="closePendingChanges()"
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
      ← Back
    </div>
    <h2 style="text-align:left;">Pending Changes</h2>
  `;

  html += `
    <div onclick="buildUnresolvedList()"
      style="padding:14px;border-bottom:1px solid #e0e0e0;cursor:pointer;font-weight:600;background:#f5f7fa;text-align:left;">
      ${unresolvedRowLabel}
    </div>
  `;

  Object.keys(years)
    .sort((a, b) => b - a)
    .forEach(year => {
      html += `
        <div onclick='buildMonthView(${year})'
          style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;text-align:left;">
          ${year}
        </div>
      `;
    });

  return html;
}

export function buildPendingMonthViewHtml(year, months){
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let html = `<h2 style="text-align:left;">${year}</h2>`;

  Object.keys(months)
    .sort((a, b) => b - a)
    .forEach(month => {
      html += `
        <div onclick='buildDayList(${year}, ${month})'
          style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;text-align:left;">
          ${monthNames[month]}
        </div>
      `;
    });

  return html;
}

export function buildPendingDayListHtml(filtered, getPendingCreatedAtDateFn, year, month){
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const dayCounts = {};

  filtered.forEach(change => {
    const d = getPendingCreatedAtDateFn(change);
    if(!d){
      return;
    }
    const day = d.getDate();
    dayCounts[day] = (dayCounts[day] || 0) + 1;
  });

  let html = `
    <div onclick='buildMonthView(${year})'
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
      ← Back
    </div>
    <h2 style="text-align:left;">${monthNames[month]} ${year}</h2>
  `;

  const days = Object.keys(dayCounts).map(Number).sort((a, b) => b - a);
  if(days.length === 0){
    html += `<p style="padding:14px;">No entries for this month.</p>`;
    return html;
  }

  days.forEach(day => {
    const count = dayCounts[day];
    html += `
      <div onclick='buildPendingDayResults(${year}, ${month}, ${day})'
        style="padding:12px;border-bottom:1px solid #eee;cursor:pointer;text-align:left;">
        <strong>${monthNames[month]} ${day}</strong>
        <div style="font-size:12px;color:#666;margin-top:2px;">${count} entr${count === 1 ? "y" : "ies"}</div>
      </div>
    `;
  });

  return html;
}

export function buildPendingDayResultsHtml(
  filtered,
  year,
  month,
  day,
  getPendingCreatedAtDateFn,
  escapeHtmlFn
){
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  let html = `
    <div onclick='buildDayList(${year}, ${month})'
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
      ← Back
    </div>
    <h2 style="text-align:left;">${monthNames[month]} ${day}, ${year}</h2>
  `;

  if(filtered.length === 0){
    html += `<p style="padding:14px;">No entries for this day.</p>`;
    return html;
  }

  filtered.forEach(change => {
    const d = getPendingCreatedAtDateFn(change);
    const timeLabel = d
      ? d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      : "—";
    const status = String(change && change.status || "pending");
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);

    html += `
      <div onclick="openPendingHistoryDetail('${escapeHtmlFn(change.id || "")}')"
        style="padding:12px;border-bottom:1px solid #eee;cursor:pointer;text-align:left;">
        <strong>${escapeHtmlFn(timeLabel)}</strong>
        <div style="font-size:12px;color:#666;margin-top:2px;">${escapeHtmlFn(statusLabel)}</div>
      </div>
    `;
  });

  return html;
}

export function buildUnresolvedPendingEmptyStateHtml(){
  return `
      <div onclick="restorePendingChangesYearView()"
        style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
        ← Back
      </div>
      <h2>Unresolved</h2>
      <p style="padding:14px;">No pending changes loaded.</p>
    `;
}

export function buildUnresolvedPendingListHtml(filtered, getPendingCreatedAtDateFn, escapeHtmlFn){
  let html = `
    <div onclick="restorePendingChangesYearView()"
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
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
