/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'
import { getSession } from '../../lib/auth/tokenStorage'
import {
  useConfirmAppointmentMutation,
  useDoctorAppointmentsQuery,
  useRefuseAppointmentMutation,
} from '../appointments'
import {
  useCreateAvailabilitySlotMutation,
  useDeleteAvailabilitySlotMutation,
  useDoctorAvailabilityQuery,
} from '../availability'
import { formatTime } from './dates'
import {
  initialNotifications,
  initialWeeklyAvailability,
  practitioner as defaultPractitioner,
} from './mockData'

const DoctorWorkspaceContext = createContext(null)

function buildPractitioner(session) {
  const user = session?.user
  if (!user) return defaultPractitioner

  return {
    ...defaultPractitioner,
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? defaultPractitioner.phone,
    title: `Dr. ${user.firstName} ${user.lastName}`,
  }
}

export function DoctorWorkspaceProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  const [weeklyAvailability, setWeeklyAvailability] = useState(
    initialWeeklyAvailability,
  )
  const [notifications, setNotifications] = useState(initialNotifications)
  const [toast, setToast] = useState(null)

  const practitioner = useMemo(() => buildPractitioner(getSession()), [])

  const appointmentsQuery = useDoctorAppointmentsQuery()
  const availabilityQuery = useDoctorAvailabilityQuery()
  const confirmMutation = useConfirmAppointmentMutation()
  const refuseMutation = useRefuseAppointmentMutation()
  const createSlotMutation = useCreateAvailabilitySlotMutation()
  const deleteSlotMutation = useDeleteAvailabilitySlotMutation()

  const showToast = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(null), 2800)
  }

  const value = useMemo(
    () => ({
      practitioner,
      selectedDate,
      setSelectedDate,
      appointments: appointmentsQuery.data ?? [],
      appointmentsLoading: appointmentsQuery.isLoading,
      appointmentsError: appointmentsQuery.error,
      refetchAppointments: appointmentsQuery.refetch,
      weeklyAvailability,
      availabilitySlots: availabilityQuery.data ?? [],
      availabilityLoading: availabilityQuery.isLoading,
      availabilityError: availabilityQuery.error,
      refetchAvailability: availabilityQuery.refetch,
      notifications,
      toast,
      showToast,
      unreadCount: notifications.filter((item) => item.unread).length,
      isMutatingAppointment:
        confirmMutation.isPending || refuseMutation.isPending,
      isMutatingAvailability:
        createSlotMutation.isPending || deleteSlotMutation.isPending,
      markNotificationsRead() {
        setNotifications((current) =>
          current.map((item) => ({ ...item, unread: false })),
        )
      },
      confirmAppointment(appointmentId) {
        confirmMutation.mutate(appointmentId, {
          onSuccess: () => showToast('Rendez-vous confirmé.'),
          onError: (error) =>
            showToast(error.message || 'Confirmation impossible.'),
        })
      },
      refuseAppointment(appointmentId) {
        refuseMutation.mutate(appointmentId, {
          onSuccess: () =>
            showToast('Demande refusée. Le créneau est de nouveau disponible.'),
          onError: (error) => showToast(error.message || 'Refus impossible.'),
        })
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
        const hasBookedSlot = (appointmentsQuery.data ?? []).some(
          (appointment) => {
            const weekday = new Date(appointment.startAt).getDay()
            const dayIndex = weekday === 0 ? 6 : weekday - 1
            if (weeklyAvailability[dayIndex].id !== dayId) return false
            if (['cancelled', 'refused'].includes(appointment.status))
              return false
            if (!period) return false
            const time = formatTime(appointment.startAt)
            return time >= period.start && time < period.end
          },
        )

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
      createAvailabilitySlot(payload) {
        return new Promise((resolve, reject) => {
          createSlotMutation.mutate(payload, {
            onSuccess: (created) => {
              showToast('Créneau disponible créé.')
              resolve(created)
            },
            onError: (error) => {
              showToast(error.message || 'Création impossible.')
              reject(error)
            },
          })
        })
      },
      deleteAvailabilitySlot(slotId) {
        return new Promise((resolve, reject) => {
          deleteSlotMutation.mutate(slotId, {
            onSuccess: () => {
              showToast('Créneau disponible supprimé.')
              resolve(true)
            },
            onError: (error) => {
              showToast(error.message || 'Suppression impossible.')
              reject(error)
            },
          })
        })
      },
    }),
    [
      appointmentsQuery.data,
      appointmentsQuery.error,
      appointmentsQuery.isLoading,
      appointmentsQuery.refetch,
      availabilityQuery.data,
      availabilityQuery.error,
      availabilityQuery.isLoading,
      availabilityQuery.refetch,
      confirmMutation,
      createSlotMutation,
      deleteSlotMutation,
      notifications,
      practitioner,
      refuseMutation,
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
