export function zonedDateTimeToUtc(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number,
  timeZone: string
) {
  let result = new Date(Date.UTC(year, month - 1, day, hour, minute))
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  })

  for (let i = 0; i < 2; i += 1) {
    const parts = Object.fromEntries(
      formatter.formatToParts(result).filter((part) => part.type !== "literal").map((part) => [part.type, part.value])
    )
    const represented = Date.UTC(
      Number(parts.year),
      Number(parts.month) - 1,
      Number(parts.day),
      Number(parts.hour),
      Number(parts.minute)
    )
    const wanted = Date.UTC(year, month - 1, day, hour, minute)
    result = new Date(result.getTime() + wanted - represented)
  }
  return result
}

export function getZonedDay(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).formatToParts(date)
  const values = Object.fromEntries(parts.filter((part) => part.type !== "literal").map((part) => [part.type, part.value]))
  const dayMap: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 }
  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    dayOfWeek: dayMap[values.weekday],
  }
}
