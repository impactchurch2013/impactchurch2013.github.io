export const SUPER_ADMINS = [
  "impactchurch2013@gmail.com"
];

export const CHURCH_ADMINS = [
  "admin1@church.com",
  "admin2@church.com"
];

export function resolveRoleFlagsForEmail(email, superAdmins = SUPER_ADMINS, churchAdmins = CHURCH_ADMINS){
  const cleanEmail = String(email || "").toLowerCase().trim();
  const isSuperAdmin = superAdmins.includes(cleanEmail);
  const isChurchAdmin = isSuperAdmin || churchAdmins.includes(cleanEmail);

  return {
    isSuperAdmin,
    isChurchAdmin
  };
}
