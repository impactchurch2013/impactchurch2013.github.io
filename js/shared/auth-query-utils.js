export async function isUserAllowedByEmail(db, email, getDocFn, docFn){
  const cleanEmail = String(email || "").toLowerCase().trim();
  if(!cleanEmail){
    return false;
  }

  const userDoc = await getDocFn(docFn(db, "allowedUsers", cleanEmail));
  return userDoc.exists();
}

export async function isChurchAdminByEmailQuery(db, email, getDocFn, docFn){
  const cleanEmail = String(email || "").toLowerCase().trim();
  if(!cleanEmail){
    return false;
  }

  const adminDoc = await getDocFn(docFn(db, "admins", cleanEmail));
  return adminDoc.exists();
}

export async function getMemberProfileByEmailQuery(db, email, getDocsFn, collectionFn){
  const cleanEmail = String(email || "").toLowerCase().trim();
  if(!cleanEmail){
    return null;
  }

  const snapshot = await getDocsFn(collectionFn(db, "members"));
  const match = snapshot.docs.find(docSnap => {
    const data = docSnap.data();
    return String(data.email || "").toLowerCase().trim() === cleanEmail;
  });

  return match ? { id: match.id, ...match.data() } : null;
}

export async function hasPendingOnboardingSubmissionQuery(
  db,
  userEmail,
  getDocsFn,
  collectionFn,
  queryFn,
  whereFn
){
  const clean = String(userEmail || "").toLowerCase().trim();
  const variants = [...new Set([clean, userEmail].filter(Boolean))];

  for(const candidate of variants){
    const snapshot = await getDocsFn(queryFn(
      collectionFn(db, "pendingChanges"),
      whereFn("submittedBy", "==", candidate)
    ));

    const found = snapshot.docs.some(docSnap => {
      const data = docSnap.data();
      if(data.status !== "pending"){
        return false;
      }
      const changes = data.changes;
      return !!(changes && changes.onboarding === true);
    });

    if(found){
      return true;
    }
  }

  return false;
}
