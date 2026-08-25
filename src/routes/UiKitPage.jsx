import { useState } from 'react'
import {
  Button,
  CheckboxField,
  ConfirmationDialog,
  EmptyState,
  FilterChip,
  Pagination,
  SearchField,
  SelectField,
  Skeleton,
  StatusBadge,
  SwitchField,
  Tabs,
  TextField,
} from '../design-system'
import {
  AppointmentCard,
  ClinicCard,
  DoctorCard,
  RequestCard,
  ScheduleEvent,
  TimeSlot,
} from '../components/domain'
import { AccountMenu } from '../components/navigation/AppNavigation'

const doctors = [
  {
    id: 'prisca-makaya',
    name: 'Dr Prisca Makaya',
    specialty: 'Gynécologue',
    clinic: 'Clinique Les Manguiers',
    nextAvailability: 'demain à 09:00',
  },
  {
    id: 'christian-okemba',
    name: 'Dr Christian Okemba',
    specialty: 'Médecin généraliste',
    clinic: 'Polyclinique de la Paix',
    nextAvailability: 'jeudi à 10:30',
  },
]

const clinics = [
  {
    id: 'mere-et-enfant',
    name: 'Clinique Mère et Enfant',
    type: 'Clinique',
    address: 'Brazzaville',
    specialties: ['Cardiologie', 'Gynécologie', 'Pédiatrie'],
  },
  {
    id: 'les-manguiers',
    name: 'Clinique Les Manguiers',
    type: 'Clinique',
    address: 'Brazzaville',
    specialties: ['Gynécologie', 'Médecine générale'],
  },
]

const appointment = {
  doctor: { name: 'Dr Esther Mavoungou', specialty: 'Cardiologue' },
  clinic: 'Clinique Mère et Enfant',
  date: '24 août 2026',
  time: '14:30',
  reason: 'Consultation de suivi',
  status: 'confirmed',
}

const request = {
  patientName: 'Jean-Paul',
  date: '26 août 2026',
  time: '10:30–11:00',
  reason: 'Bilan complet',
  status: 'pending',
}

const schedule = [
  {
    patientName: 'Aminata',
    time: '09:00–09:30',
    reason: 'Consultation de suivi',
    status: 'confirmed',
  },
  {
    patientName: 'Jean-Paul',
    time: '10:30–11:00',
    reason: 'Bilan complet',
    status: 'pending',
  },
]

const specialties = [
  { label: 'Cardiologie', value: 'cardiology' },
  { label: 'Gynécologie', value: 'gynecology' },
  { label: 'Médecine générale', value: 'general-medicine' },
  { label: 'Pédiatrie', value: 'pediatrics' },
]

function Section({ title, description, children }) {
  return (
    <section className="ui-kit-section">
      <header className="ui-kit-section__heading">
        <h2>{title}</h2>
        {description ? <p>{description}</p> : null}
      </header>
      {children}
    </section>
  )
}

export function UiKitPage() {
  const [page, setPage] = useState(1)

  return (
    <div className="ui-kit-page page-container">
      <header className="ui-kit-hero">
        <p className="eyebrow">Référence interne</p>
        <h1>Design system Munganga</h1>
        <p>
          Les composants de cette page sont les références à réutiliser dans les
          parcours patient, médecin et visiteur.
        </p>
      </header>

      <Section
        title="Fondations"
        description="Une palette sémantique réduite, Poppins et une échelle d'espacement commune."
      >
        <div className="ui-kit-swatches">
          {[
            ['Marque', 'var(--color-brand-600)'],
            ['Encre', 'var(--color-ink)'],
            ['Surface', 'var(--color-surface)'],
            ['Fond doux', 'var(--color-surface-brand)'],
            ['Succès', 'var(--color-success)'],
            ['Alerte', 'var(--color-warning)'],
            ['Danger', 'var(--color-danger)'],
          ].map(([label, color]) => (
            <div className="ui-kit-swatch" key={label}>
              <span style={{ background: color }} />
              <small>{label}</small>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Actions et statuts">
        <div className="ui-kit-row">
          <Button>Action principale</Button>
          <Button variant="secondary">Action secondaire</Button>
          <Button variant="quiet">Action discrète</Button>
          <Button variant="danger">Action destructive</Button>
          <Button disabled>Indisponible</Button>
        </div>
        <div className="ui-kit-row">
          <StatusBadge status="confirmed" />
          <StatusBadge status="pending" />
          <StatusBadge status="cancelled" />
          <StatusBadge status="completed" />
        </div>
      </Section>

      <Section title="Champs et choix">
        <div className="ui-kit-form-grid">
          <SearchField placeholder="Médecin, spécialité ou clinique" />
          <SelectField
            items={specialties}
            label="Spécialité"
            placeholder="Toutes les spécialités"
          />
          <TextField
            description="Utilisé pour vous joindre si nécessaire."
            label="Téléphone"
            placeholder="+242 06 000 00 00"
          />
          <TextField
            error="Ce champ est obligatoire."
            label="Motif de consultation"
          />
        </div>
        <div className="ui-kit-controls">
          <CheckboxField defaultChecked label="J'accepte les conditions" />
          <SwitchField
            defaultChecked
            description="Recevoir un rappel avant le rendez-vous"
            label="Rappels"
          />
        </div>
        <div className="ui-kit-row">
          <FilterChip active>Tous</FilterChip>
          <FilterChip>Cardiologie</FilterChip>
          <FilterChip>Pédiatrie</FilterChip>
          <TimeSlot>09:00</TimeSlot>
          <TimeSlot selected>09:30</TimeSlot>
        </div>
      </Section>

      <Section title="Navigation dans une vue">
        <div className="ui-kit-navigation-sample">
          <div>
            <strong>Navigation médecin sans barre latérale</strong>
            <span>Agenda · Demandes · Disponibilités</span>
          </div>
          <AccountMenu mode="doctor" user={{ name: 'Dr Esther Mavoungou' }} />
        </div>
        <Tabs
          defaultValue="upcoming"
          items={[
            {
              value: 'upcoming',
              label: 'À venir',
              content: 'Les rendez-vous confirmés à venir.',
            },
            {
              value: 'pending',
              label: 'En attente',
              content: 'Les demandes en cours de traitement.',
            },
            {
              value: 'past',
              label: 'Passés',
              content: 'L’historique des rendez-vous.',
            },
          ]}
        />
      </Section>

      <Section
        title="Médecins"
        description="Un seul composant, avec les variantes standard, compacte et mise en avant."
      >
        <div className="ui-kit-card-grid">
          <DoctorCard doctor={doctors[0]} />
          <DoctorCard doctor={doctors[1]} variant="featured" />
        </div>
        <div className="ui-kit-stack">
          <DoctorCard doctor={doctors[0]} variant="compact" />
        </div>
      </Section>

      <Section
        title="Cliniques"
        description="Même grammaire visuelle que les médecins, contenu métier distinct."
      >
        <div className="ui-kit-card-grid">
          {clinics.map((clinic) => (
            <ClinicCard clinic={clinic} key={clinic.id} />
          ))}
        </div>
      </Section>

      <Section
        title="Parcours de rendez-vous"
        description="Trois composants séparés pour trois intentions : patient, demande et agenda."
      >
        <div className="ui-kit-card-grid">
          <AppointmentCard appointment={appointment} onCancel={() => {}} />
          <RequestCard request={request} />
        </div>
        <div className="ui-kit-stack">
          {schedule.map((event) => (
            <ScheduleEvent event={event} key={event.time} />
          ))}
        </div>
      </Section>

      <Section title="Retours d’état et superpositions">
        <div className="ui-kit-card-grid">
          <EmptyState
            action={<Button>Rechercher un médecin</Button>}
            description="Modifiez vos filtres ou lancez une nouvelle recherche."
            title="Aucun résultat"
          />
          <div
            className="ui-kit-skeleton-card"
            aria-label="Chargement d'une carte"
          >
            <Skeleton className="ui-kit-skeleton-avatar" />
            <Skeleton />
            <Skeleton className="ui-kit-skeleton-short" />
          </div>
        </div>
        <div className="ui-kit-row">
          <ConfirmationDialog
            description="Le créneau sera libéré pour un autre patient. Cette action est définitive."
            destructive
            title="Annuler ce rendez-vous ?"
            trigger={
              <Button variant="secondary">Tester la confirmation</Button>
            }
          />
          <Pagination onPageChange={setPage} page={page} pageCount={4} />
        </div>
      </Section>
    </div>
  )
}
