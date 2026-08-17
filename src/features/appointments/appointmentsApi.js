import { apiClient } from '../../lib/api/apiClient'

export const bookAppointment = (input) => apiClient('/api/book', {
  method: 'POST',
  body: JSON.stringify(input),
})

export const confirmAppointment = (appointmentId) => apiClient(`/api/appointments/${appointmentId}/confirm`, { method: 'PATCH' })
export const refuseAppointment = (appointmentId) => apiClient(`/api/appointments/${appointmentId}/refuse`, { method: 'PATCH' })
export const cancelAppointment = (appointmentId) => apiClient(`/api/appointments/${appointmentId}/cancel`, { method: 'PATCH' })
export const getDoctorAppointments = () => apiClient('/api/doctor/appointments')
