import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createDoctorAvailabilitySlot,
  deleteDoctorAvailabilitySlot,
  listDoctorAvailabilitySlots,
} from './availabilityApi'

export const doctorAvailabilityQueryKey = ['doctor', 'availability-slots']

export function useDoctorAvailabilityQuery() {
  return useQuery({
    queryKey: doctorAvailabilityQueryKey,
    queryFn: listDoctorAvailabilitySlots,
  })
}

export function useCreateAvailabilitySlotMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createDoctorAvailabilitySlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorAvailabilityQueryKey })
    },
  })
}

export function useDeleteAvailabilitySlotMutation() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteDoctorAvailabilitySlot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: doctorAvailabilityQueryKey })
    },
  })
}
