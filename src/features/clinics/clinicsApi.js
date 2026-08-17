import { apiClient } from '../../lib/api/apiClient'

export const getClinics = () => apiClient('/clinics')
export const getClinic = (clinicId) => apiClient(`/clinics/${clinicId}`)
