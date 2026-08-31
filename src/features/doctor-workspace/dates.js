const dateFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})

const shortDateFormatter = new Intl.DateTimeFormat('fr-FR', {
  day: 'numeric',
  month: 'short',
})

const weekdayFormatter = new Intl.DateTimeFormat('fr-FR', {
  weekday: 'short',
})

const monthFormatter = new Intl.DateTimeFormat('fr-FR', {
  month: 'long',
  year: 'numeric',
})

export function startOfDay(value = new Date()) {
  const date = new Date(value)
  date.setHours(0, 0, 0, 0)
  return date
}

export function addDays(value, amount) {
  const date = new Date(value)
  date.setDate(date.getDate() + amount)
  return date
}

export function addMonths(value, amount) {
  const date = new Date(value)
  date.setMonth(date.getMonth() + amount)
  return date
}

export function isSameDay(left, right) {
  return startOfDay(left).getTime() === startOfDay(right).getTime()
}

export function toDateKey(value) {
  const date = new Date(value)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function combineDateAndTime(dateValue, time) {
  const date = startOfDay(dateValue)
  const [hours, minutes] = time.split(':').map(Number)
  date.setHours(hours, minutes, 0, 0)
  return date
}

export function formatTime(value) {
  const date = value instanceof Date ? value : new Date(value)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
}

export function formatLongDate(value) {
  const formatted = dateFormatter.format(new Date(value))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function formatShortDate(value) {
  return shortDateFormatter.format(new Date(value))
}

export function formatWeekday(value) {
  const formatted = weekdayFormatter.format(new Date(value))
  return formatted.replace('.', '')
}

export function formatMonth(value) {
  const formatted = monthFormatter.format(new Date(value))
  return formatted.charAt(0).toUpperCase() + formatted.slice(1)
}

export function startOfWeek(value) {
  const date = startOfDay(value)
  const day = date.getDay()
  const diff = day === 0 ? -6 : 1 - day
  return addDays(date, diff)
}

export function startOfMonth(value) {
  const date = startOfDay(value)
  date.setDate(1)
  return date
}

export function getMonthGrid(value) {
  const monthStart = startOfMonth(value)
  const gridStart = startOfWeek(monthStart)
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
}

export function getWeekDays(value) {
  const weekStart = startOfWeek(value)
  return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
}
