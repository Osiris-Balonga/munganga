import { startOfDay } from './dates'

export const DAY_HOURS = Array.from({ length: 21 }, (_, index) => {
  const totalMinutes = 8 * 60 + index * 30
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes % 60
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
})

export function getUpcomingAppointments(appointments, from = new Date()) {
  return [...appointments]
    .filter((item) => !['cancelled', 'refused'].includes(item.status))
    .filter((item) => new Date(item.startAt) >= from)
    .sort((left, right) => new Date(left.startAt) - new Date(right.startAt))
}

export function getAppointmentsForDay(appointments, date) {
  const day = startOfDay(date).getTime()
  return appointments
    .filter((item) => startOfDay(item.startAt).getTime() === day)
    .sort((left, right) => new Date(left.startAt) - new Date(right.startAt))
}

export function getNextAppointment(appointments, from = new Date()) {
  return getUpcomingAppointments(appointments, from)[0] ?? null
}

export function getLiveStatus(appointment, now = new Date()) {
  const start = new Date(appointment.startAt)
  const end = new Date(appointment.endAt)
  if (appointment.status === 'completed') return 'completed'
  if (appointment.status === 'cancelled') return 'cancelled'
  if (appointment.status === 'refused') return 'refused'
  if (appointment.status === 'pending') return 'pending'
  if (start <= now && now < end) return 'in-progress'
  if (end <= now && startOfDay(start).getTime() === startOfDay(now).getTime()) {
    return 'completed'
  }
  return appointment.status
}

export function getFunnelMetrics(appointments, date = new Date()) {
  const todayItems = getAppointmentsForDay(appointments, date)
  const live = todayItems.map((item) => ({
    ...item,
    liveStatus: getLiveStatus(item),
  }))
  const active = live.filter(
    (item) => !['cancelled', 'refused'].includes(item.liveStatus),
  )
  const confirmed = live.filter((item) =>
    ['confirmed', 'in-progress', 'completed'].includes(item.liveStatus),
  )
  const inProgress = live.filter((item) => item.liveStatus === 'in-progress')
  const completed = live.filter((item) => item.liveStatus === 'completed')
  const cancelled = live.filter((item) =>
    ['cancelled', 'refused'].includes(item.liveStatus),
  )
  const total = Math.max(live.length, 1)

  return {
    programmed: active.length,
    confirmed: confirmed.length,
    inProgress: inProgress.length,
    completed: completed.length,
    cancelledShare: Math.round((cancelled.length / total) * 100),
    confirmedShare: Math.round((confirmed.length / total) * 100),
    waitingShare: Math.round((inProgress.length / total) * 100),
    doneShare: Math.round((completed.length / total) * 100),
  }
}
