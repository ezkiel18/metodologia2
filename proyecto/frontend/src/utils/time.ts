import dayjs from "../lib/dayjs";

export function buildSlots(
  fechaISO: string,
  desde = "08:00",
  hasta = "23:00",
  minutos = 90
) {
  const day = dayjs(fechaISO).startOf("day");
  let t = day.hour(parseInt(desde.split(":")[0])).minute(parseInt(desde.split(":")[1]));
  const end = day
    .hour(parseInt(hasta.split(":")[0]))
    .minute(parseInt(hasta.split(":")[1]));
  const slots: string[] = [];
  while (t.add(minutos, "minute").isSameOrBefore(end)) {
    slots.push(t.toISOString());
    t = t.add(minutos, "minute");
  }
  return slots;
}