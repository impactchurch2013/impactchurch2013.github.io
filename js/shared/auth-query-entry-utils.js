export function createAuthAllowlistFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export function createAuthMemberProfileFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export function createAuthPendingOnboardingFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export function createAuthAdminRoleFirestoreLoader(){
  return async () => import(
    "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js"
  );
}

export async function isUserAllowedEntry({
  dbObj,
  email,
  loadFirestoreFns,
  isUserAllowedByEmailFn
}){
  const { getDoc, doc } = await loadFirestoreFns();
  return isUserAllowedByEmailFn(dbObj, email, getDoc, doc);
}

export async function getMemberProfileByEmailEntry({
  dbObj,
  email,
  loadFirestoreFns,
  getMemberProfileByEmailQueryFn
}){
  const { getDocs, collection } = await loadFirestoreFns();
  return getMemberProfileByEmailQueryFn(dbObj, email, getDocs, collection);
}

export async function hasPendingOnboardingSubmissionEntry({
  dbObj,
  userEmail,
  loadFirestoreFns,
  hasPendingOnboardingSubmissionQueryFn
}){
  const { getDocs, collection, query, where } = await loadFirestoreFns();
  return hasPendingOnboardingSubmissionQueryFn(
    dbObj,
    userEmail,
    getDocs,
    collection,
    query,
    where
  );
}

export async function isChurchAdminByEmailEntry({
  dbObj,
  email,
  loadFirestoreFns,
  isChurchAdminByEmailQueryFn
}){
  const { getDoc, doc } = await loadFirestoreFns();
  return isChurchAdminByEmailQueryFn(dbObj, email, getDoc, doc);
}
