export function createEntryFirestoreLoader(){
  return () => import("https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js");
}

export function createEntryFirebaseClientImporter(){
  return () => import("../firebase/client.js");
}
