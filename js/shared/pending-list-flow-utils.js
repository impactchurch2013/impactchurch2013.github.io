export function buildPendingUnresolvedRowLabel(changes){
  const pendingCount = (changes || []).filter(change => change.status === "pending").length;
  return pendingCount === 0 ? "No pending changes" : "Unresolved pending changes";
}

export function renderPendingYearView(
  documentObj,
  changes,
  groupChangesByYearFn,
  buildPendingYearViewHtmlFn
){
  const container = documentObj.getElementById("pendingChangesContent");
  if(!container){
    return;
  }

  const years = groupChangesByYearFn(changes);
  const unresolvedRowLabel = buildPendingUnresolvedRowLabel(changes);
  const html = buildPendingYearViewHtmlFn(unresolvedRowLabel, years);
  container.innerHTML = html;
}

export function renderPendingMonthView(
  documentObj,
  changes,
  year,
  groupChangesByMonthFn,
  buildPendingMonthViewHtmlFn
){
  const container = documentObj.getElementById("pendingChangesContent");
  if(!container){
    return;
  }

  const months = groupChangesByMonthFn(changes, year);
  const html = buildPendingMonthViewHtmlFn(year, months);
  container.innerHTML = html;
}

export function renderPendingDayView(
  documentObj,
  changes,
  year,
  month,
  filterChangesByMonthFn,
  buildPendingDayListHtmlFn,
  getPendingCreatedAtDateFn
){
  const container = documentObj.getElementById("pendingChangesContent");
  if(!container){
    return;
  }

  const filtered = filterChangesByMonthFn(changes, year, month);
  const html = buildPendingDayListHtmlFn(filtered, getPendingCreatedAtDateFn, year, month);
  container.innerHTML = html;
}

export function renderPendingDayResultsView(
  documentObj,
  changes,
  year,
  month,
  day,
  filterChangesByDayFn,
  buildPendingDayResultsHtmlFn,
  getPendingCreatedAtDateFn,
  escapeHtmlFn
){
  const container = documentObj.getElementById("pendingChangesContent");
  if(!container){
    return;
  }

  const filtered = filterChangesByDayFn(changes, year, month, day);
  const html = buildPendingDayResultsHtmlFn(
    filtered,
    year,
    month,
    day,
    getPendingCreatedAtDateFn,
    escapeHtmlFn
  );
  container.innerHTML = html;
}

export function renderUnresolvedPendingListView(
  documentObj,
  changes,
  sortPendingChangesByCreatedAtDescFn,
  buildUnresolvedPendingEmptyStateHtmlFn,
  buildUnresolvedPendingListHtmlFn,
  getPendingCreatedAtDateFn,
  escapeHtmlFn
){
  const container = documentObj.getElementById("pendingChangesContent");
  if(!container){
    return;
  }

  if(!changes){
    container.innerHTML = buildUnresolvedPendingEmptyStateHtmlFn();
    return;
  }

  const filtered = sortPendingChangesByCreatedAtDescFn(
    changes.filter(change => change.status === "pending")
  );
  const html = buildUnresolvedPendingListHtmlFn(
    filtered,
    getPendingCreatedAtDateFn,
    escapeHtmlFn
  );
  container.innerHTML = html;
}
