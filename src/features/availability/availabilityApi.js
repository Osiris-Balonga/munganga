import { apiClient } from '../../lib/api/apiClient'

export const getAvailableSlots = (doctorId) => apiClient(`/availabilitySlots?doctorId=${doctorId}&status=available`)
