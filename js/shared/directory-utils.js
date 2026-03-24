function getRecordFields(record){
  return record && record.fields ? record.fields : {};
}

function getFieldString(record, fieldName){
  return String(getRecordFields(record)[fieldName] || "");
}

function normalizeNamePart(value){
  return String(value || "").trim().toLowerCase();
}

export function getMemberNameParts(record){
  const firstRaw = getFieldString(record, "First Name");
  const lastRaw = getFieldString(record, "Last Name");

  return {
    first: normalizeNamePart(firstRaw),
    last: normalizeNamePart(lastRaw)
  };
}

export function memberMatchesNamePrefix(record, q){
  if(!q) return true;

  const { first, last } = getMemberNameParts(record);
  return first.startsWith(q) || last.startsWith(q);
}

export function compareMembersDefaultSort(a, b){
  const aLast = getFieldString(a, "Last Name");
  const bLast = getFieldString(b, "Last Name");

  const aFirst = getFieldString(a, "First Name");
  const bFirst = getFieldString(b, "First Name");

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

export function getVisibleDirectoryMembers(members, query){
  const list = Array.isArray(members) ? members.slice() : [];
  const q = String(query || "").trim().toLowerCase();

  if(q){
    return list
      .filter(member => memberMatchesNamePrefix(member, q))
      .sort((a, b) => compareMembersSearchSort(a, b, q));
  }

  return list.sort(compareMembersDefaultSort);
}

export function getCurrentMemberSearchQuery(){
  const el = document.getElementById("memberSearch");
  return el ? el.value.trim().toLowerCase() : "";
}

export function runDirectorySearch(buildDirectory){
  buildDirectory(getCurrentMemberSearchQuery());
}

export function filterMembers(buildDirectory){
  runDirectorySearch(buildDirectory);
}

export function mapFirestoreMemberDoc(doc){
  const data = doc.data();

  return {
    id: doc.id,
    fields: {
      "Full Name": data.fullName || "",
      "First Name": data.firstName || "",
      "Last Name": data.lastName || "",
      "Email": data.email || "",
      "Phone Number": data.phone || "",
      "Ministry": data.ministry || "",
      "Household": data.household || "",
      "Address": data.address || "",
      "City": data.city || "",
      "State": data.state || "",
      "Zip Code": data.zipCode || "",
      "Birthday": data.birthday || "",
      "Anniversary": data.anniversary || "",
      "Last Updated": data.lastUpdated || "",
      "Photo": data.photo || ""
    }
  };
}
