import { openingHours } from "../data";

const DAYS = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"];

const toMinutes = (hhmm) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function getShopStatus(now) {
  const minutes = now.getHours() * 60 + now.getMinutes();
  const today = openingHours[now.getDay()];

  if (today && minutes >= toMinutes(today[0]) && minutes < toMinutes(today[1])) {
    return { open: true, detail: `jusqu'à ${today[1]}` };
  }
  if (today && minutes < toMinutes(today[0])) {
    return { open: false, detail: `ouvre à ${today[0]}` };
  }
  for (let i = 1; i <= 7; i++) {
    const day = (now.getDay() + i) % 7;
    const hours = openingHours[day];
    if (hours) {
      const when = i === 1 ? "demain" : DAYS[day];
      return { open: false, detail: `ouvre ${when} à ${hours[0]}` };
    }
  }
  return { open: false, detail: "" };
}
