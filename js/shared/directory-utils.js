export function getMemberNameParts(record){
  const f = record.fields || {};

  return {
    first: String(f["First Name"] || "").trim().toLowerCase(),
    last: String(f["Last Name"] || "").trim().toLowerCase()
  };
}

export function memberMatchesNamePrefix(record, q){
  if(!q) return true;

  const { first, last } = getMemberNameParts(record);
  return first.startsWith(q) || last.startsWith(q);
}

export function compareMembersDefaultSort(a, b){
  const aLast = a.fields["Last Name"] || "";
  const bLast = b.fields["Last Name"] || "";

  const aFirst = a.fields["First Name"] || "";
  const bFirst = b.fields["First Name"] || "";

  if(aLast < bLast) return -1;
  if(aLast > bLast) return 1;

  return aFirst.localeCompare(bFirst);
}

export function compareMembersSearchSort(a, b, q){
  const A = getMemberNameParts(a);
  const B = getMemberNameParts(b);

  const aFirstHit = A.first.startsWith(q);
  const bFirstHit = B.first.startsWith(q);

  if(aFirstHit !== bFirstHit) return aFirstHit ? -1 : 1;

  const c1 = A.first.localeCompare(B.first);
  if(c1 !== 0) return c1;

  return A.last.localeCompare(B.last);
}
