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
import {
  decorativeNotifications,
  practitionerDefaults,
} from './decorativeFixtures'
import { presentDoctorAppointments } from './presentDoctorAppointments'

const DoctorWorkspaceContext = createContext(null)

function buildPractitioner(session) {
  const user = session?.user
  if (!user) {
    return {
      ...practitionerDefaults,
      id: null,
      userId: null,
      firstName: '',
      lastName: '',
      title: 'Praticien',
      email: '',
    }
  }

  return {
    ...practitionerDefaults,
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone ?? practitionerDefaults.phone,
    title: `Dr. ${user.firstName} ${user.lastName}`,
  }
}

export function DoctorWorkspaceProvider({ children }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date())
  // Chrome UI uniquement — pas une source de vérité métier.
  const [notifications, setNotifications] = useState(decorativeNotifications)
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

  const availabilitySlots = useMemo(
    () => availabilityQuery.data ?? [],
    [availabilityQuery.data],
  )
  const appointments = useMemo(
    () =>
      presentDoctorAppointments(
        appointmentsQuery.data ?? [],
        availabilitySlots,
      ),
    [appointmentsQuery.data, availabilitySlots],
  )

  const value = useMemo(
    () => ({
      practitioner,
      selectedDate,
      setSelectedDate,
      appointments,
      appointmentsLoading: appointmentsQuery.isLoading,
      appointmentsError: appointmentsQuery.error,
      refetchAppointments: appointmentsQuery.refetch,
      availabilitySlots,
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
      appointments,
      appointmentsQuery.error,
      appointmentsQuery.isLoading,
      appointmentsQuery.refetch,
      availabilityQuery.error,
      availabilityQuery.isLoading,
      availabilityQuery.refetch,
      availabilitySlots,
      confirmMutation,
      createSlotMutation,
      deleteSlotMutation,
      notifications,
      practitioner,
      refuseMutation,
      selectedDate,
      toast,
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
