import { apiClient } from '../../lib/api/apiClient'

export const getAvailableSlots = (doctorId) =>
  apiClient(`/availabilitySlots?doctorId=${doctorId}&status=available`)

export const listDoctorAvailabilitySlots = () =>
  apiClient('/api/doctor/availability-slots')

export const createDoctorAvailabilitySlot = (payload) =>
  apiClient('/api/doctor/availability-slots', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

export const deleteDoctorAvailabilitySlot = (slotId) =>
  apiClient(`/api/doctor/availability-slots/${slotId}`, {
    method: 'DELETE',
  })
