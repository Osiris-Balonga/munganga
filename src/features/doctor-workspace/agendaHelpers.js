import { formatTime, isSameDay } from './dates'
import { DAY_HOURS, getAppointmentsForDay } from './scheduleUtils'

function isActiveAppointment(item) {
  return !['cancelled', 'refused'].includes(item.status)
}

export function isApiSlotFree(availabilitySlots, appointments, date, time) {
  const booked = getAppointmentsForDay(appointments, date).some(
    (item) => isActiveAppointment(item) && formatTime(item.startAt) === time,
  )

  if (booked) return false

  return availabilitySlots.some(
    (slot) =>
      isSameDay(slot.startAt, date) &&
      formatTime(slot.startAt) === time &&
      slot.status === 'available' &&
      !slot.appointmentId,
  )
}

export function countApiAvailableSlots(availabilitySlots, appointments, date) {
  return DAY_HOURS.filter((time) =>
    isApiSlotFree(availabilitySlots, appointments, date, time),
  ).length
}
