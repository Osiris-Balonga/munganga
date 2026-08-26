export const architectureExample = `// src/routes/doctors/index.jsx
import { createFileRoute } from '@tanstack/react-router'
import { DoctorsDirectory } from '../../features/doctors'

export const Route = createFileRoute('/doctors/')({
  component: DoctorsDirectory,
})

// src/features/doctors/DoctorsDirectory.jsx
import { DoctorCard } from '../../components/domain'

export function DoctorsDirectory() {
  const { data: doctors } = useDoctors()
  return doctors.map((doctor) => (
    <DoctorCard doctor={doctor} key={doctor.id} />
  ))
}`

export const quickStartExample = `// Depuis un composant de feature
import { Button, SelectField } from '../../design-system'
import { DoctorCard } from '../../components/domain'

export function DoctorsDirectory() {
  return <DoctorCard doctor={doctor} />
}`

export const actionsExample = `import { Button, StatusBadge } from '../design-system'

<Button onClick={handleSubmit}>Confirmer</Button>
<Button variant="secondary">Annuler</Button>
<StatusBadge status="confirmed" />`

export const fieldsExample = `import { SelectField, TextField } from '../design-system'

<TextField
  label="Téléphone"
  name="phone"
  placeholder="+242 06 000 00 00"
/>

<SelectField
  label="Spécialité"
  items={specialties}
  placeholder="Toutes les spécialités"
/>`

export const navigationExample = `import {
  DesktopHeader,
  MobileBottomNav,
  MobileTopBar,
} from '../components/navigation/AppNavigation'

<DesktopHeader mode="doctor" user={currentUser} />
<MobileTopBar mode="doctor" user={currentUser} />
<MobileBottomNav mode="doctor" />`

export const doctorCardExample = `import { DoctorCard } from '../components/domain'

const doctor = {
  id: 'prisca-makaya',
  name: 'Dr Prisca Makaya',
  specialty: 'Gynécologue',
  clinic: 'Clinique Les Manguiers',
  nextAvailability: 'demain à 09:00',
}

<DoctorCard doctor={doctor} />
<DoctorCard doctor={doctor} variant="compact" />`

export const clinicCardExample = `import { ClinicCard } from '../components/domain'

const clinic = {
  id: 'mere-et-enfant',
  name: 'Clinique Mère et Enfant',
  address: 'Brazzaville',
  specialties: ['Cardiologie', 'Gynécologie', 'Pédiatrie'],
}

<ClinicCard clinic={clinic} />`

export const appointmentExample = `import {
  AppointmentCard,
  RequestCard,
  ScheduleEvent,
} from '../components/domain'

<AppointmentCard
  appointment={appointment}
  onCancel={handleCancel}
/>
<RequestCard
  request={request}
  onAccept={handleAccept}
  onRefuse={handleRefuse}
/>
<ScheduleEvent event={event} />`

export const feedbackExample = `import {
  Button,
  ConfirmationDialog,
  EmptyState,
  Skeleton,
} from '../design-system'

<ConfirmationDialog
  title="Annuler ce rendez-vous ?"
  description="Le créneau sera libéré."
  destructive
  trigger={<Button variant="secondary">Annuler</Button>}
  onConfirm={handleConfirm}
/>`
