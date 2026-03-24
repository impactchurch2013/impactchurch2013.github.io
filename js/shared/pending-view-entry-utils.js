export function buildPendingYearViewEntry({
  changes,
  setPendingChangesDataFn,
  renderPendingYearViewFn,
  documentObj,
  groupChangesByYearFn,
  buildPendingYearViewHtmlFn,
  openSheetFn
}){
  setPendingChangesDataFn(changes);
  renderPendingYearViewFn(
    documentObj,
    changes,
    groupChangesByYearFn,
    buildPendingYearViewHtmlFn
  );
  openSheetFn("pendingChangesSheet");
}

export function buildPendingMonthViewEntry({
  year,
  pendingChangesData,
  renderPendingMonthViewFn,
  documentObj,
  groupChangesByMonthFn,
  buildPendingMonthViewHtmlFn
}){
  renderPendingMonthViewFn(
    documentObj,
    pendingChangesData,
    year,
    groupChangesByMonthFn,
    buildPendingMonthViewHtmlFn
  );
}

export function buildPendingDayListEntry({
  year,
  month,
  pendingChangesData,
  renderPendingDayViewFn,
  documentObj,
  filterChangesByMonthFn,
  buildPendingDayListHtmlFn,
  getPendingCreatedAtDateFn
}){
  renderPendingDayViewFn(
    documentObj,
    pendingChangesData,
    year,
    month,
    filterChangesByMonthFn,
    buildPendingDayListHtmlFn,
    getPendingCreatedAtDateFn
  );
}

export function buildUnresolvedPendingListEntry({
  pendingChangesData,
  renderUnresolvedPendingListViewFn,
  documentObj,
  sortPendingChangesByCreatedAtDescFn,
  buildUnresolvedPendingEmptyStateHtmlFn,
  buildUnresolvedPendingListHtmlFn,
  getPendingCreatedAtDateFn,
  escapeHtmlFn
}){
  renderUnresolvedPendingListViewFn(
    documentObj,
    pendingChangesData,
    sortPendingChangesByCreatedAtDescFn,
    buildUnresolvedPendingEmptyStateHtmlFn,
    buildUnresolvedPendingListHtmlFn,
    getPendingCreatedAtDateFn,
    escapeHtmlFn
  );
}
