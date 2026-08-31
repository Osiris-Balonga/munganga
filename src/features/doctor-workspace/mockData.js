import { addDays, combineDateAndTime, formatTime, startOfDay } from './dates'

function appointment({
  id,
  patientName,
  phone,
  reason,
  status,
  offsetDays,
  start,
  end,
}) {
  const day = addDays(startOfDay(), offsetDays)
  const startAt = combineDateAndTime(day, start)
  const endAt = combineDateAndTime(day, end)

  return {
    id,
    patientName,
    phone,
    reason,
    status,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    clinic: 'Clinique Mère et Enfant',
    district: 'Poto-Poto',
  }
}

export const practitioner = {
  id: 1,
  userId: 10,
  firstName: 'Prisca',
  lastName: 'Makaya',
  title: 'Dr. Prisca Makaya',
  specialty: 'Médecine générale',
  clinic: 'Clinique Mère et Enfant',
  district: 'Poto-Poto',
  address: 'Avenue de la Paix, Brazzaville',
  phone: '+242 06 555 10 10',
  email: 'dr.makaya@munganga.cg',
  bio: 'Consultations de médecine générale pour adultes et enfants, suivi des pathologies courantes et prévention.',
}

export const initialAppointments = [
  appointment({
    id: 1,
    patientName: 'Alice Massamba',
    phone: '+242 06 555 01 01',
    reason: 'Consultation générale',
    status: 'confirmed',
    offsetDays: 0,
    start: '08:00',
    end: '08:30',
  }),
  appointment({
    id: 2,
    patientName: 'Grâce Ndinga',
    phone: '+242 05 555 03 03',
    reason: 'Suivi de tension artérielle',
    status: 'pending',
    offsetDays: 0,
    start: '09:30',
    end: '10:00',
  }),
  appointment({
    id: 3,
    patientName: 'Patrick Moukoko',
    phone: '+242 06 555 04 04',
    reason: 'Douleurs abdominales',
    status: 'confirmed',
    offsetDays: 0,
    start: '10:30',
    end: '11:00',
  }),
  appointment({
    id: 4,
    patientName: 'Amina Loemba',
    phone: '+242 05 555 05 05',
    reason: 'Bilan de santé',
    status: 'confirmed',
    offsetDays: 0,
    start: '14:00',
    end: '14:30',
  }),
  appointment({
    id: 5,
    patientName: 'Sylvie Tchicaya',
    phone: '+242 06 555 06 06',
    reason: 'Consultation de suivi',
    status: 'pending',
    offsetDays: 0,
    start: '16:00',
    end: '16:30',
  }),
  appointment({
    id: 6,
    patientName: 'Junior Mabiala',
    phone: '+242 05 555 02 02',
    reason: 'Fièvre et toux',
    status: 'confirmed',
    offsetDays: 1,
    start: '09:00',
    end: '09:30',
  }),
  appointment({
    id: 7,
    patientName: 'Nadia Makosso',
    phone: '+242 06 555 07 07',
    reason: 'Renouvellement d’ordonnance',
    status: 'pending',
    offsetDays: 1,
    start: '11:00',
    end: '11:30',
  }),
  appointment({
    id: 8,
    patientName: 'Jean-Claude Ibara',
    phone: '+242 05 555 08 08',
    reason: 'Contrôle post-consultation',
    status: 'confirmed',
    offsetDays: 2,
    start: '08:30',
    end: '09:00',
  }),
  appointment({
    id: 9,
    patientName: 'Chantal Bouanga',
    phone: '+242 06 555 09 09',
    reason: 'Consultation générale',
    status: 'cancelled',
    offsetDays: -1,
    start: '15:00',
    end: '15:30',
  }),
  appointment({
    id: 10,
    patientName: 'Michel Ngoma',
    phone: '+242 05 555 12 12',
    reason: 'Douleurs articulaires',
    status: 'completed',
    offsetDays: -1,
    start: '09:00',
    end: '09:30',
  }),
  appointment({
    id: 11,
    patientName: 'Ruth Kimbembe',
    phone: '+242 06 555 13 13',
    reason: 'Suivi diabète',
    status: 'refused',
    offsetDays: -2,
    start: '10:00',
    end: '10:30',
  }),
  appointment({
    id: 12,
    patientName: 'Honoré Samba',
    phone: '+242 06 555 14 14',
    reason: 'Pansement',
    status: 'completed',
    offsetDays: 0,
    start: '07:30',
    end: '08:00',
  }),
]

export const consultationMix = [
  { label: 'Consultation générale', value: 52, color: '#1d4ed8' },
  { label: 'Suivi', value: 31, color: '#3b82f6' },
  { label: 'Urgence', value: 17, color: '#93c5fd' },
]

export const upcomingClinicEvents = [
  {
    id: 1,
    title: 'Formation médicale continue',
    detail: 'Jeudi 10 septembre · 14:00',
    tone: 'green',
  },
  {
    id: 2,
    title: 'Congés prévus',
    detail: 'Du 22 au 26 septembre',
    tone: 'orange',
  },
]

export const initialMessages = [
  {
    id: 1,
    from: 'Alice Massamba',
    preview: 'Puis-je arriver 10 minutes en avance ?',
    time: '09:12',
    unread: true,
  },
  {
    id: 2,
    from: 'Clinique Mère et Enfant',
    preview: 'Rappel : réunion de service demain à 07:30.',
    time: 'Hier',
    unread: true,
  },
  {
    id: 3,
    from: 'Patrick Moukoko',
    preview: 'Merci pour la confirmation de 10:30.',
    time: 'Hier',
    unread: false,
  },
]

export const initialWeeklyAvailability = [
  {
    id: 'monday',
    label: 'Lundi',
    enabled: true,
    periods: [
      { id: 'monday-am', start: '08:00', end: '12:00' },
      { id: 'monday-pm', start: '14:00', end: '17:00' },
    ],
  },
  {
    id: 'tuesday',
    label: 'Mardi',
    enabled: true,
    periods: [
      { id: 'tuesday-am', start: '08:00', end: '12:00' },
      { id: 'tuesday-pm', start: '14:00', end: '17:00' },
    ],
  },
  {
    id: 'wednesday',
    label: 'Mercredi',
    enabled: true,
    periods: [
      { id: 'wednesday-am', start: '08:00', end: '12:00' },
      { id: 'wednesday-pm', start: '14:00', end: '17:00' },
    ],
  },
  {
    id: 'thursday',
    label: 'Jeudi',
    enabled: true,
    periods: [
      { id: 'thursday-am', start: '08:00', end: '12:00' },
      { id: 'thursday-pm', start: '14:00', end: '17:00' },
    ],
  },
  {
    id: 'friday',
    label: 'Vendredi',
    enabled: true,
    periods: [
      { id: 'friday-am', start: '08:00', end: '12:00' },
      { id: 'friday-pm', start: '14:00', end: '17:00' },
    ],
  },
  {
    id: 'saturday',
    label: 'Samedi',
    enabled: true,
    periods: [{ id: 'saturday-am', start: '08:00', end: '12:00' }],
  },
  {
    id: 'sunday',
    label: 'Dimanche',
    enabled: false,
    periods: [],
  },
]

function buildPreviewSlots() {
  const slots = []
  let id = 1
  for (let offset = 0; offset < 7; offset += 1) {
    const day = addDays(startOfDay(), offset)
    const weekday = day.getDay()
    const dayIndex = weekday === 0 ? 6 : weekday - 1
    const schedule = initialWeeklyAvailability[dayIndex]
    if (!schedule?.enabled) continue

    for (const period of schedule.periods) {
      let cursor = combineDateAndTime(day, period.start)
      const end = combineDateAndTime(day, period.end)
      while (cursor < end) {
        const next = new Date(cursor.getTime() + 30 * 60 * 1000)
        const isBooked =
          offset === 0 &&
          (formatTime(cursor) === '08:00' || formatTime(cursor) === '10:30')
        slots.push({
          id: id++,
          doctorId: practitioner.id,
          startAt: cursor.toISOString(),
          endAt: next.toISOString(),
          status: isBooked ? 'unavailable' : 'available',
          appointmentId: isBooked ? id : null,
        })
        cursor = next
      }
    }
  }
  return slots
}

export const initialAvailabilitySlots = buildPreviewSlots()

export const initialNotifications = [
  {
    id: 1,
    type: 'request',
    title: 'Nouveau rendez-vous',
    message: 'Grâce Ndinga a demandé une consultation à 09:30.',
    time: 'Il y a 12 min',
    unread: true,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Rappel',
    message: 'Patrick Moukoko arrive à 10:30 pour des douleurs abdominales.',
    time: 'Il y a 40 min',
    unread: true,
  },
  {
    id: 3,
    type: 'cancelled',
    title: 'Rendez-vous annulé',
    message: 'Chantal Bouanga a annulé sa consultation d’hier à 15:00.',
    time: 'Hier',
    unread: false,
  },
  {
    id: 4,
    type: 'confirmed',
    title: 'Rendez-vous confirmé',
    message: 'Alice Massamba est confirmée pour 08:00.',
    time: 'Hier',
    unread: false,
  },
]

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

export function countAvailableSlots(weeklyAvailability, appointments, date) {
  const weekday = new Date(date).getDay()
  const dayIndex = weekday === 0 ? 6 : weekday - 1
  const schedule = weeklyAvailability[dayIndex]
  if (!schedule?.enabled) return 0

  const bookedTimes = new Set(
    getAppointmentsForDay(appointments, date)
      .filter((item) => !['cancelled', 'refused'].includes(item.status))
      .map((item) => formatTime(item.startAt)),
  )

  return schedule.periods.reduce((total, period) => {
    const [startHour, startMinute] = period.start.split(':').map(Number)
    const [endHour, endMinute] = period.end.split(':').map(Number)
    const start = startHour * 60 + startMinute
    const end = endHour * 60 + endMinute
    const slots = []
    for (let minute = start; minute < end; minute += 30) {
      const hours = Math.floor(minute / 60)
      const minutes = minute % 60
      slots.push(
        `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
      )
    }
    return total + slots.filter((slot) => !bookedTimes.has(slot)).length
  }, 0)
}

export function isSlotAvailable(weeklyAvailability, appointments, date, time) {
  const weekday = new Date(date).getDay()
  const dayIndex = weekday === 0 ? 6 : weekday - 1
  const schedule = weeklyAvailability[dayIndex]
  if (!schedule?.enabled) return false

  const [hours, minutes] = time.split(':').map(Number)
  const value = hours * 60 + minutes
  const inPeriod = schedule.periods.some((period) => {
    const [startHour, startMinute] = period.start.split(':').map(Number)
    const [endHour, endMinute] = period.end.split(':').map(Number)
    return (
      value >= startHour * 60 + startMinute && value < endHour * 60 + endMinute
    )
  })
  if (!inPeriod) return false

  return !getAppointmentsForDay(appointments, date).some(
    (item) =>
      !['cancelled', 'refused'].includes(item.status) &&
      formatTime(item.startAt) === time,
  )
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
