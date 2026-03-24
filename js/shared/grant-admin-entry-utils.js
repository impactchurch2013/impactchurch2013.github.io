function normalizeEmail(email){
  return String(email || "").toLowerCase().trim();
}

export function createGrantAdminFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function grantAdminByEmailEntry({
  dbObj,
  email,
  currentUser,
  loadFirestoreFns
}){
  const cleanEmail = normalizeEmail(email);
  const { setDoc, doc, serverTimestamp } = await loadFirestoreFns();

  await setDoc(doc(dbObj, "admins", cleanEmail), {
    email: cleanEmail,
    grantedBy: normalizeEmail(currentUser && currentUser.email),
    grantedAt: serverTimestamp()
  }, { merge: true });
}

export async function revokeAdminByEmailEntry({
  dbObj,
  email,
  loadFirestoreFns
}){
  const cleanEmail = normalizeEmail(email);
  const { deleteDoc, doc } = await loadFirestoreFns();
  await deleteDoc(doc(dbObj, "admins", cleanEmail));
}
