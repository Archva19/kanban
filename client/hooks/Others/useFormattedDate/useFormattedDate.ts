const monthsKa = ["იან", "თებ", "მარ", "აპრ", "მაის", "ივნ", "ივლ", "აგვ", "სექტ", "ოქტ", "ნოემ", "დეკ"];
const monthsEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function formatDueDate(dateString?: string | null, locale: string = "ka") {
  if (!dateString) return null;

  const d = new Date(dateString);
  const day = d.getDate();
  const monthIndex = d.getMonth();

  if (locale === "ka") {
    return `${day} ${monthsKa[monthIndex]}`;
  }

  return `${day} ${monthsEn[monthIndex]}`;
}

export function isTaskOverdue(dateString?: string | null, isDone: boolean = false) {
  if (!dateString) return false;

  const rawDateValue = new Date(dateString).toISOString().split("T")[0];
  const today = new Date().toLocaleDateString("sv-SE", {
    timeZone: "Asia/Tbilisi",
  });

  return rawDateValue < today && !isDone;
}