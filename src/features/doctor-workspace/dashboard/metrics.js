import { addDays, formatTime, startOfDay } from '../dates'
import { getAppointmentsForDay, getLiveStatus } from '../mockData'

export function filterByPeriod(appointments, period) {
  const today = startOfDay()
  if (period === 'today') {
    return getAppointmentsForDay(appointments, today)
  }
  if (period === 'year') {
    return appointments.filter(
      (item) => new Date(item.startAt).getFullYear() === today.getFullYear(),
    )
  }
  return appointments.filter((item) => {
    const date = new Date(item.startAt)
    return (
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
  })
}

export function getKpi(appointments, period) {
  const items = filterByPeriod(appointments, period)
  const live = items.map((item) => ({ ...item, live: getLiveStatus(item) }))
  const confirmed = live.filter((item) =>
    ['confirmed', 'in-progress', 'completed'].includes(item.live),
  ).length
  const pending = live.filter((item) => item.live === 'pending').length
  const cancelled = live.filter((item) =>
    ['cancelled', 'refused'].includes(item.live),
  ).length
  const total = Math.max(live.length, 1)
  return {
    total: live.length,
    confirmed,
    pending,
    occupancy: Math.round((confirmed / total) * 100),
    cancelRate: Math.round((cancelled / total) * 100),
  }
}

export function getBarSeries(appointments) {
  const today = startOfDay()
  return Array.from({ length: 12 }, (_, index) => {
    const day = addDays(today, index - 11)
    const items = getAppointmentsForDay(appointments, day)
    return {
      label: String(day.getDate()).padStart(2, '0'),
      confirmed: items.filter((item) =>
        ['confirmed', 'completed', 'in-progress'].includes(item.status),
      ).length,
      pending: items.filter((item) => item.status === 'pending').length,
    }
  })
}

export function nextPatient(appointments) {
  const upcoming = [...appointments]
    .filter(
      (item) => !['cancelled', 'refused', 'completed'].includes(item.status),
    )
    .filter((item) => new Date(item.endAt) >= new Date())
    .sort((left, right) => new Date(left.startAt) - new Date(right.startAt))[0]
  if (!upcoming) return 'Aucun patient en attente'
  return `${formatTime(upcoming.startAt)} · ${upcoming.patientName}`
}
