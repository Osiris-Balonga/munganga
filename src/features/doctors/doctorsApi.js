import { apiClient } from '../../lib/api/apiClient'

export const getDoctors = () => apiClient('/doctors')
export const getDoctor = (doctorId) => apiClient(`/doctors/${doctorId}`)
