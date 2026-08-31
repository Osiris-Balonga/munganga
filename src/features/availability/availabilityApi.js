import { apiClient } from '../../lib/api/apiClient'
import { getAccessToken } from '../../lib/auth/tokenStorage'

export const getAvailableSlots = (doctorId) =>
  apiClient(`/availabilitySlots?doctorId=${doctorId}&status=available`)

export function canUseDoctorAvailabilityApi() {
  const token = getAccessToken()
  return Boolean(token) && token !== 'preview-doctor'
}

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
