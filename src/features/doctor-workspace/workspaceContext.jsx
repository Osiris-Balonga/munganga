/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { formatTime } from './dates'
import {
  initialAppointments,
  initialAvailabilitySlots,
  initialNotifications,
  initialWeeklyAvailability,
  practitioner,
} from './mockData'

const DoctorWorkspaceContext = createContext(null)

function overlaps(leftStart, leftEnd, rightStart, rightEnd) {
  return leftStart < rightEnd && rightStart < leftEnd
}

export function DoctorWorkspaceProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [appointments, setAppointments] = useState(initialAppointments)
  const [weeklyAvailability, setWeeklyAvailability] = useState(
    initialWeeklyAvailability,
  )
  const [availabilitySlots, setAvailabilitySlots] = useState(
    initialAvailabilitySlots,
  )
  const [notifications, setNotifications] = useState(initialNotifications)
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2800)
  }

  const value = useMemo(
    () => ({
      practitioner,
      selectedDate,
      setSelectedDate,
      appointments,
      weeklyAvailability,
      availabilitySlots,
      setAvailabilitySlots,
      notifications,
      toast,
      showToast,
      unreadCount: notifications.filter((item) => item.unread).length,
      markNotificationsRead() {
        setNotifications((current) =>
          current.map((item) => ({ ...item, unread: false })),
        )
      },
      confirmAppointment(appointmentId) {
        setAppointments((current) =>
          current.map((item) =>
            item.id === appointmentId ? { ...item, status: 'confirmed' } : item,
          ),
        )
        showToast('Rendez-vous confirmé.')
      },
      refuseAppointment(appointmentId) {
        setAppointments((current) =>
          current.map((item) =>
            item.id === appointmentId ? { ...item, status: 'refused' } : item,
          ),
        )
        showToast('Demande refusée. Le créneau est de nouveau disponible.')
      },
      toggleDay(dayId) {
        setWeeklyAvailability((current) =>
          current.map((day) =>
            day.id === dayId
              ? {
                  ...day,
                  enabled: !day.enabled,
                  periods:
                    !day.enabled && day.periods.length === 0
                      ? [{ id: `${day.id}-am`, start: '08:00', end: '12:00' }]
                      : day.periods,
                }
              : day,
          ),
        )
        showToast('Disponibilités mises à jour.')
      },
      addPeriod(dayId) {
        setWeeklyAvailability((current) =>
          current.map((day) => {
            if (day.id !== dayId) return day
            const hasMorning = day.periods.some(
              (period) => period.start === '08:00',
            )
            const nextPeriod = hasMorning
              ? {
                  id: `${day.id}-pm-${Date.now()}`,
                  start: '14:00',
                  end: '17:00',
                }
              : {
                  id: `${day.id}-am-${Date.now()}`,
                  start: '08:00',
                  end: '12:00',
                }
            return {
              ...day,
              enabled: true,
              periods: [...day.periods, nextPeriod],
            }
          }),
        )
        showToast('Créneau ajouté.')
      },
      removePeriod(dayId, periodId) {
        const day = weeklyAvailability.find((item) => item.id === dayId)
        const period = day?.periods.find((item) => item.id === periodId)
        const hasBookedSlot = appointments.some((appointment) => {
          const weekday = new Date(appointment.startAt).getDay()
          const dayIndex = weekday === 0 ? 6 : weekday - 1
          if (weeklyAvailability[dayIndex].id !== dayId) return false
          if (['cancelled', 'refused'].includes(appointment.status))
            return false
          if (!period) return false
          const time = formatTime(appointment.startAt)
          return time >= period.start && time < period.end
        })

        if (hasBookedSlot) {
          showToast('Impossible de supprimer un créneau déjà réservé.')
          return
        }

        setWeeklyAvailability((current) =>
          current.map((item) =>
            item.id === dayId
              ? {
                  ...item,
                  periods: item.periods.filter(
                    (entry) => entry.id !== periodId,
                  ),
                }
              : item,
          ),
        )
        showToast('Créneau supprimé.')
      },
      createAvailabilitySlot({ startAt, endAt }) {
        const start = new Date(startAt)
        const end = new Date(endAt)
        if (!(end > start)) {
          showToast('La fin du créneau doit être postérieure au début.')
          return null
        }
        const conflict = availabilitySlots.some((slot) =>
          overlaps(start, end, new Date(slot.startAt), new Date(slot.endAt)),
        )
        if (conflict) {
          showToast('Un créneau existe déjà sur cette plage horaire.')
          return null
        }
        const created = {
          id: Date.now(),
          doctorId: practitioner.id,
          startAt: start.toISOString(),
          endAt: end.toISOString(),
          status: 'available',
          appointmentId: null,
        }
        setAvailabilitySlots((current) =>
          [...current, created].sort(
            (left, right) => new Date(left.startAt) - new Date(right.startAt),
          ),
        )
        showToast('Créneau disponible créé.')
        return created
      },
      deleteAvailabilitySlot(slotId) {
        const slot = availabilitySlots.find((item) => item.id === slotId)
        if (!slot) {
          showToast('Créneau introuvable.')
          return false
        }
        if (slot.status !== 'available' || slot.appointmentId) {
          showToast('Impossible de supprimer un créneau déjà réservé.')
          return false
        }
        setAvailabilitySlots((current) =>
          current.filter((item) => item.id !== slotId),
        )
        showToast('Créneau disponible supprimé.')
        return true
      },
    }),
    [
      appointments,
      availabilitySlots,
      notifications,
      selectedDate,
      toast,
      weeklyAvailability,
    ],
  )

  return (
    <DoctorWorkspaceContext.Provider value={value}>
      {children}
    </DoctorWorkspaceContext.Provider>
  )
}

export function useDoctorWorkspace() {
  const context = useContext(DoctorWorkspaceContext)
  if (!context) {
    throw new Error('useDoctorWorkspace must be used inside the workspace.')
  }
  return context
}
