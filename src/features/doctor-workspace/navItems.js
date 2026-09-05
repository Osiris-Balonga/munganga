import {
  CalendarDays,
  Clock3,
  LayoutDashboard,
  Users,
  ClipboardList,
} from 'lucide-react'

export const sidebarNavItems = [
  {
    label: 'Tableau de bord',
    to: '/doctor',
    icon: LayoutDashboard,
    exact: true,
  },
  { label: 'Rendez-vous', to: '/doctor/appointments', icon: ClipboardList },
  { label: 'Agenda', to: '/doctor/agenda', icon: CalendarDays },
  { label: 'Patients', to: '/doctor/patients', icon: Users },
  { label: 'Disponibilités', to: '/doctor/availability', icon: Clock3 },
]
