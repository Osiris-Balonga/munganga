import {
  createRootRouteWithContext,
  createRoute,
  createRouter,
} from '@tanstack/react-router'
import { AppShell } from '../components/AppShell'
import { requireRole } from '../lib/auth/auth'
import {
  BookPage,
  ClinicPage,
  ClinicsPage,
  DoctorAgendaPage,
  DoctorAppointmentsPage,
  DoctorAvailabilityPage,
  DoctorPage,
  DoctorsPage,
  HomePage,
  LoginPage,
  PatientAppointmentPage,
  PatientAppointmentsPage,
  RegisterPage,
} from '../routes/pages'

const rootRoute = createRootRouteWithContext()({ component: AppShell })

const route = (path, component, options = {}) =>
  createRoute({
    getParentRoute: () => rootRoute,
    path,
    component,
    ...options,
  })

const routes = [
  route('/', HomePage),
  route('/doctors', DoctorsPage),
  route('/doctors/$doctorId', DoctorPage),
  route('/doctors/$doctorId/book', BookPage, {
    beforeLoad: () => requireRole('patient'),
  }),
  route('/clinics', ClinicsPage),
  route('/clinics/$clinicId', ClinicPage),
  route('/login', LoginPage),
  route('/register', RegisterPage),
  route('/patient/appointments', PatientAppointmentsPage, {
    beforeLoad: () => requireRole('patient'),
  }),
  route('/patient/appointments/$appointmentId', PatientAppointmentPage, {
    beforeLoad: () => requireRole('patient'),
  }),
  route('/doctor/agenda', DoctorAgendaPage, {
    beforeLoad: () => requireRole('doctor'),
  }),
  route('/doctor/appointments', DoctorAppointmentsPage, {
    beforeLoad: () => requireRole('doctor'),
  }),
  route('/doctor/availability', DoctorAvailabilityPage, {
    beforeLoad: () => requireRole('doctor'),
  }),
]

const routeTree = rootRoute.addChildren(routes)

export const router = createRouter({
  routeTree,
  context: {
    auth: undefined,
    queryClient: undefined,
  },
  defaultPreload: 'intent',
})
