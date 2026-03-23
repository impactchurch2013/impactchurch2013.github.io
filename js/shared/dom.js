export function escapeHtml(s){
  if(s == null || s === "") return "";

  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// Parses full dates (e.g. ISO) or month-day text without a year (e.g. "Feb 25").
export function parseMonthDayOrFullDate(dateString){
  if(!dateString) return null;

  const t = String(dateString).trim();
  if(!t) return null;

  if(/^\d{4}-\d{2}-\d{2}/.test(t)){
    const d = new Date(t.length === 10 ? t + "T12:00:00" : t);
    return isNaN(d.getTime()) ? null : d;
  }

  let d = new Date(t);
  if(!isNaN(d.getTime())) return d;

  d = new Date(t + (/,/.test(t) ? "" : ", 2000"));
  return isNaN(d.getTime()) ? null : d;
}

export function formatShortDate(dateString){
  if(!dateString) return "";

  const d = parseMonthDayOrFullDate(dateString);
  if(!d) return String(dateString).trim();

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  return months[d.getMonth()] + " " + d.getDate();
}

export function formatPhone(phone){
  if(!phone) return "";

  const digits = phone.replace(/\D/g, "");
  if(digits.length !== 10) return phone;

  return `(${digits.slice(0,3)}) ${digits.slice(3,6)}-${digits.slice(6)}`;
}

export function formatDate(dateString){
  if(!dateString) return "";

  const d = new Date(dateString);

  return d.toLocaleDateString("en-US",{
    year:"numeric",
    month:"long",
    day:"numeric"
  });
}

export function formatMonthDay(dateString){
  if(!dateString) return "";

  const d = parseMonthDayOrFullDate(dateString);
  if(!d) return String(dateString).trim();

  return d.toLocaleDateString("en-US",{
    month:"short",
    day:"numeric"
  });
}

export function formatPendingDetailValue(v){
  if(v == null || v === "") return "—";
  return escapeHtml(v);
}
