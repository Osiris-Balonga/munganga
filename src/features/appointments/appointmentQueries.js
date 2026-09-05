import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { doctorAvailabilityQueryKey } from '../availability/availabilityQueries'
import {
  confirmAppointment,
  getDoctorAppointments,
  refuseAppointment,
} from './appointmentsApi'

export const doctorAppointmentsQueryKey = ['doctor', 'appointments']

export function useDoctorAppointmentsQuery() {
  return useQuery({
    queryKey: doctorAppointmentsQueryKey,
    queryFn: getDoctorAppointments,
  })
}

export function useConfirmAppointmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: confirmAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorAppointmentsQueryKey })
      queryClient.invalidateQueries({ queryKey: doctorAvailabilityQueryKey })
    },
  })
}

export function useRefuseAppointmentMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: refuseAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorAppointmentsQueryKey })
      queryClient.invalidateQueries({ queryKey: doctorAvailabilityQueryKey })
    },
  })
}
