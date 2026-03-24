export function createAdminLogsFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function loadAdminLogsData(dbObj, getDocsFn, collectionFn){
  const snapshot = await getDocsFn(collectionFn(dbObj, "adminLogs"));
  return snapshot.docs.map((docSnap) => ({
    id: docSnap.id,
    ...docSnap.data()
  }));
}

export function getAdminLogCreatedAtDate(log){
  if(!log || !log.createdAt || typeof log.createdAt.toDate !== "function"){
    return null;
  }
  return log.createdAt.toDate();
}

export function sortAdminLogsByCreatedAtDesc(logs){
  return [...(Array.isArray(logs) ? logs : [])].sort((a, b) => {
    const aDate = getAdminLogCreatedAtDate(a);
    const bDate = getAdminLogCreatedAtDate(b);
    const aTime = aDate ? aDate.getTime() : 0;
    const bTime = bDate ? bDate.getTime() : 0;
    return bTime - aTime;
  });
}

export function groupAdminLogsByYear(logs){
  const years = {};
  sortAdminLogsByCreatedAtDesc(logs).forEach((log) => {
    const createdAt = getAdminLogCreatedAtDate(log);
    if(!createdAt){
      return;
    }
    const year = createdAt.getFullYear();
    if(!years[year]){
      years[year] = [];
    }
    years[year].push(log);
  });
  return years;
}

export function groupAdminLogsByMonth(logs, year){
  const months = {};
  sortAdminLogsByCreatedAtDesc(logs).forEach((log) => {
    const createdAt = getAdminLogCreatedAtDate(log);
    if(!createdAt || createdAt.getFullYear() !== year){
      return;
    }
    const month = createdAt.getMonth();
    if(!months[month]){
      months[month] = [];
    }
    months[month].push(log);
  });
  return months;
}

export function groupAdminLogsByDay(logs, year, month){
  const days = {};
  sortAdminLogsByCreatedAtDesc(logs).forEach((log) => {
    const createdAt = getAdminLogCreatedAtDate(log);
    if(
      !createdAt
      || createdAt.getFullYear() !== year
      || createdAt.getMonth() !== month
    ){
      return;
    }
    const day = createdAt.getDate();
    if(!days[day]){
      days[day] = [];
    }
    days[day].push(log);
  });
  return days;
}

export function filterAdminLogsByDay(logs, year, month, day){
  return sortAdminLogsByCreatedAtDesc(logs).filter((log) => {
    const createdAt = getAdminLogCreatedAtDate(log);
    return Boolean(
      createdAt
      && createdAt.getFullYear() === year
      && createdAt.getMonth() === month
      && createdAt.getDate() === day
    );
  });
}
