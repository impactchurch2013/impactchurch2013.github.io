export function getPendingCreatedAtDate(change){
  if(!change || !change.createdAt || typeof change.createdAt.toDate !== "function"){
    return null;
  }

  return change.createdAt.toDate();
}

export function groupChangesByYear(changes){
  const years = {};

  changes.forEach(change => {
    const d = getPendingCreatedAtDate(change);
    if(!d){
      return;
    }

    const year = d.getFullYear();
    if(!years[year]){
      years[year] = [];
    }
    years[year].push(change);
  });

  return years;
}

export function groupChangesByMonth(changes, year){
  const months = {};

  changes.forEach(change => {
    const d = getPendingCreatedAtDate(change);
    if(!d || d.getFullYear() !== year){
      return;
    }

    const month = d.getMonth();
    if(!months[month]){
      months[month] = [];
    }
    months[month].push(change);
  });

  return months;
}

export function filterChangesByMonth(changes, year, month){
  return changes
    .filter(change => {
      const d = getPendingCreatedAtDate(change);
      return !!d && d.getFullYear() === year && d.getMonth() === month;
    })
    .sort((a, b) => {
      const da = getPendingCreatedAtDate(a);
      const db = getPendingCreatedAtDate(b);
      const ta = da ? da.getTime() : 0;
      const tb = db ? db.getTime() : 0;
      return tb - ta;
    });
}

export function sortPendingChangesByCreatedAtDesc(changes){
  return [...changes].sort((a, b) => {
    const da = getPendingCreatedAtDate(a);
    const db = getPendingCreatedAtDate(b);
    const ta = da ? da.getTime() : 0;
    const tb = db ? db.getTime() : 0;
    return tb - ta;
  });
}
