const DEFAULT_CONTAINER_ID = "adminLogsContent";

function getContainer(documentObj, containerId = DEFAULT_CONTAINER_ID){
  return documentObj.getElementById(containerId);
}

export function renderAdminLogsYearView(
  documentObj,
  logs,
  groupAdminLogsByYearFn,
  buildAdminLogsYearViewHtmlFn,
  containerId = DEFAULT_CONTAINER_ID
){
  const container = getContainer(documentObj, containerId);
  if(!container){
    return;
  }
  const years = groupAdminLogsByYearFn(logs);
  container.innerHTML = buildAdminLogsYearViewHtmlFn(years);
}

export function renderAdminLogsMonthView(
  documentObj,
  logs,
  year,
  groupAdminLogsByMonthFn,
  buildAdminLogsMonthViewHtmlFn,
  containerId = DEFAULT_CONTAINER_ID
){
  const container = getContainer(documentObj, containerId);
  if(!container){
    return;
  }
  const months = groupAdminLogsByMonthFn(logs, year);
  container.innerHTML = buildAdminLogsMonthViewHtmlFn(year, months);
}

export function renderAdminLogsDayListView(
  documentObj,
  logs,
  year,
  month,
  groupAdminLogsByDayFn,
  buildAdminLogsDayListHtmlFn,
  containerId = DEFAULT_CONTAINER_ID
){
  const container = getContainer(documentObj, containerId);
  if(!container){
    return;
  }
  const days = groupAdminLogsByDayFn(logs, year, month);
  container.innerHTML = buildAdminLogsDayListHtmlFn(year, month, days);
}

export function renderAdminLogsResultsView(
  documentObj,
  logs,
  year,
  month,
  day,
  filterAdminLogsByDayFn,
  buildAdminLogsResultsHtmlFn,
  getAdminLogCreatedAtDateFn,
  escapeHtmlFn,
  containerId = DEFAULT_CONTAINER_ID
){
  const container = getContainer(documentObj, containerId);
  if(!container){
    return;
  }
  const filtered = filterAdminLogsByDayFn(logs, year, month, day);
  container.innerHTML = buildAdminLogsResultsHtmlFn(
    year,
    month,
    day,
    filtered,
    getAdminLogCreatedAtDateFn,
    escapeHtmlFn
  );
}
