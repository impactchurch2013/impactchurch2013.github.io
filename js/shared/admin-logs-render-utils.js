export function buildAdminLogsYearViewHtml(years){
  let html = "<h2>Admin Logs</h2>";

  const sortedYears = Object.keys(years).sort((a, b) => Number(b) - Number(a));
  if(sortedYears.length === 0){
    return `${html}<p style="padding:14px;">No admin log entries yet.</p>`;
  }

  sortedYears.forEach((year) => {
    html += `
      <div onclick="buildAdminLogsMonthView(${year})"
        style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;">
        ${year}
      </div>
    `;
  });
  return html;
}

export function buildAdminLogsMonthViewHtml(year, months){
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  let html = `
    <div onclick="restoreAdminLogsYearView()"
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
      ← Back
    </div>
    <h2>${year}</h2>
  `;

  const sortedMonths = Object.keys(months).sort((a, b) => Number(b) - Number(a));
  if(sortedMonths.length === 0){
    return `${html}<p style="padding:14px;">No admin log entries for this year.</p>`;
  }

  sortedMonths.forEach((month) => {
    html += `
      <div onclick="buildAdminLogsDayList(${year}, ${month})"
        style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;">
        ${monthNames[Number(month)]}
      </div>
    `;
  });
  return html;
}

export function buildAdminLogsDayListHtml(year, month, days){
  let html = `
    <div onclick="buildAdminLogsMonthView(${year})"
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
      ← Back
    </div>
  `;

  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric"
  });
  html += `<h2>${monthLabel}</h2>`;

  const sortedDays = Object.keys(days).sort((a, b) => Number(b) - Number(a));
  if(sortedDays.length === 0){
    return `${html}<p style="padding:14px;">No admin log entries for this month.</p>`;
  }

  sortedDays.forEach((day) => {
    html += `
      <div onclick="buildAdminLogsResults(${year}, ${month}, ${day})"
        style="padding:14px;border-bottom:1px solid #eee;cursor:pointer;">
        ${day}
      </div>
    `;
  });
  return html;
}

function getActionLabel(action){
  if(action === "grant_admin"){
    return "Granted admin";
  }
  if(action === "revoke_admin"){
    return "Revoked admin";
  }
  return "Admin action";
}

export function buildAdminLogsResultsHtml(
  year,
  month,
  day,
  logs,
  getAdminLogCreatedAtDateFn,
  escapeHtmlFn
){
  const dayLabel = new Date(year, month, day).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  let html = `
    <div onclick="buildAdminLogsDayList(${year}, ${month})"
      style="padding:12px;cursor:pointer;color:#2b5cff;border-bottom:1px solid #eee;text-align:left;">
      ← Back
    </div>
    <h2>${dayLabel}</h2>
  `;

  if(!Array.isArray(logs) || logs.length === 0){
    return `${html}<p style="padding:14px;">No admin log entries for this day.</p>`;
  }

  logs.forEach((log) => {
    const createdAt = getAdminLogCreatedAtDateFn(log);
    const timeLabel = createdAt
      ? createdAt.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })
      : "—";
    const actionLabel = getActionLabel(log.action);
    const targetName = escapeHtmlFn(log.targetName || "");
    const targetEmail = escapeHtmlFn(log.targetEmail || "");
    const performedBy = escapeHtmlFn(log.performedBy || "");

    html += `
      <div style="padding:12px;border-bottom:1px solid #eee;">
        <strong>${escapeHtmlFn(actionLabel)}</strong> • ${escapeHtmlFn(timeLabel)}<br>
        ${targetName ? `${targetName} (${targetEmail})` : targetEmail}<br>
        <span style="font-size:12px;color:#666;">by ${performedBy}</span>
      </div>
    `;
  });

  return html;
}
