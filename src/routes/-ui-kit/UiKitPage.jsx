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
} from '../../design-system'
import {
  AppointmentCard,
  ClinicCard,
  DoctorCard,
  RequestCard,
  ScheduleEvent,
  TimeSlot,
} from '../../components/domain'
import {
  DesktopHeader,
  MobileBottomNav,
  MobileTopBar,
} from '../../components/navigation/AppNavigation'
import { CodeExample } from './CodeExample'
import {
  actionsExample,
  architectureExample,
  appointmentExample,
  clinicCardExample,
  doctorCardExample,
  feedbackExample,
  fieldsExample,
  navigationExample,
  quickStartExample,
} from './examples'

const doctors = [
  {
    id: 'prisca-makaya',
    name: 'Dr Prisca Makaya',
    specialty: 'Gynécologue',
    clinic: 'Clinique Les Manguiers',
    address: 'Brazzaville',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACW15Pkj_I2GXIueAhwYhXF3sZqvkw5XOHZOtqrvH63X2JQh4iFvvvFjz-3s-ojdPYxDBNnPQk_0SxVaRwGLjbLnk8TeueNyApOENbCWjBBHc7-RrNstDjSIL-nN3z3jy7i6LAaPqKvEHmC03vgc4oQSePp_ZHticCK1P4SydH26aqy_szB_omw01pJIgsK6iBYfw07h7rF2HvALkBLgIp1Fkm6nB_VYecYdIQouwqST9U_qR_QX4A',
    nextAvailability: 'demain à 09:00',
  },
  {
    id: 'christian-okemba',
    name: 'Dr Christian Okemba',
    specialty: 'Médecin généraliste',
    clinic: 'Polyclinique de la Paix',
    address: 'Brazzaville',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBNXx84M4kqneKqMymE65xq347TBWTNMKZzGCkIGdc9XqJD8eSTBZUQbiOiQ9lX_01V8Y4KqocPeG1X5ymbQ9CjwkS7xgRkpZpCytP2vk7n0v8BDHd-2Wr-WLt-Te2CfuFF9lX8FFpM5QN2Ckf_qFplwytwe3sxv6NWVE11nIxNOhbSN0CjHSrqL-p6E5mYZIKSrRE6ndeHKjCpf1F9dsHqfETgiTItvTwpXsf0LhpA5S4mdqNRC1fS',
    nextAvailability: 'jeudi à 10:30',
  },
]

const clinics = [
  {
    id: 'mere-et-enfant',
    name: 'Clinique Mère et Enfant',
    type: 'Clinique',
    address: 'Brazzaville',
    hours: 'Ouvert aujourd’hui jusqu’à 20:00',
    status: 'Ouvert',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBAyQwUVqVz72Y3jn6pIY0kjzIDy262ma2-OnpHHuuqweL-o1oV8YiV_RY7GwjR8sgGcUVTL0UfPiFSbreifqH-T_PsQVrEswa1x1D_ALiZ_SzTq1qJsuLFQ0ek1aKBvnvvyvu2MrRQ7uU4DTkVr997Oj-aVZtaQkIIFtX6MWWufSRpMGuLcrb_6s5lbeYq2kOlSoiYoBJZl7t2rC5KBjg7V5Ag0CgdKFE8ipLw-NiGq1FhxPYuIAQE',
    specialties: ['Cardiologie', 'Gynécologie', 'Pédiatrie'],
  },
  {
    id: 'les-manguiers',
    name: 'Clinique Les Manguiers',
    type: 'Clinique',
    address: 'Brazzaville',
    hours: 'Ouvert demain à 07:30',
    status: 'Fermé',
    statusTone: 'neutral',
    imageUrl:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuD2ZqF-WwCbdSSrxkKl_hn31tj727z3jK2dGIDdwZ5jwdkebt9xbLytAJFEIykWGijI8Ng6vncoLTPzI5Jwo3Gd5ICWLnWnHoi8HPHPJ1tu4zMnXIIHbrl5fxAGE3W2bBhTjEvwE8MVP2s5TRSGV18owLV_rav9y7OVZZvJ9LNz9yRpIOYYmTGQ9OgqVUEUBSGrMK05eHnCAE_TUWBiVYwBRq6i5jlAKALLTOlnjHj24vpR510miSZI',
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
        title="Où placer le code"
        description="Une route décrit l’URL et assemble une feature. La feature porte le comportement métier et réutilise les composants communs."
      >
        <div className="ui-kit-guidelines">
          <div>
            <strong>Route légère</strong>
            <span>
              Déclarez l’URL, les guards et le composant de page dans
              src/routes.
            </span>
          </div>
          <div>
            <strong>Logique dans la feature</strong>
            <span>
              Placez formulaires, hooks et appels métier dans
              src/features/&lt;domaine&gt;.
            </span>
          </div>
          <div>
            <strong>Interface partagée</strong>
            <span>
              Réutilisez components/domain et design-system avant de créer du
              nouveau HTML.
            </span>
          </div>
        </div>
        <CodeExample
          code={architectureExample}
          title="Route → feature → composants"
        />
      </Section>

      <Section
        title="Prise en main"
        description="Importez toujours depuis les points d’entrée communs. Base UI reste encapsulé dans le design system."
      >
        <div className="ui-kit-guidelines">
          <div>
            <strong>1. Chercher le composant ici</strong>
            <span>
              Vérifiez ses variantes et ses états avant d’en créer un nouveau.
            </span>
          </div>
          <div>
            <strong>2. Importer depuis l’index</strong>
            <span>
              Évitez les imports directs vers un fichier interne du composant.
            </span>
          </div>
          <div>
            <strong>3. Fournir des données métier</strong>
            <span>
              Utilisez les propriétés documentées au lieu de dupliquer le HTML.
            </span>
          </div>
        </div>
        <CodeExample code={quickStartExample} title="Premier import" />
      </Section>

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
        <CodeExample code={actionsExample} />
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
        <CodeExample code={fieldsExample} />
      </Section>

      <Section title="Navigation dans une vue">
        <div className="navigation-showcase">
          <div className="navigation-preview">
            <span className="navigation-preview__label">Visiteur · bureau</span>
            <div className="navigation-preview__surface">
              <DesktopHeader mode="visitor" />
            </div>
          </div>
          <div className="navigation-preview">
            <span className="navigation-preview__label">Patient · bureau</span>
            <div className="navigation-preview__surface">
              <DesktopHeader
                mode="patient"
                user={{ name: 'Esther Mavoungou' }}
              />
            </div>
          </div>
          <div className="navigation-preview">
            <span className="navigation-preview__label">
              Médecin · bureau, sans sidebar
            </span>
            <div className="navigation-preview__surface">
              <DesktopHeader
                mode="doctor"
                user={{ name: 'Dr Esther Mavoungou' }}
              />
            </div>
          </div>
          <div className="navigation-preview navigation-preview--mobile">
            <span className="navigation-preview__label">Patient · mobile</span>
            <div className="navigation-preview__device">
              <MobileTopBar
                mode="patient"
                user={{ name: 'Esther Mavoungou' }}
              />
              <div className="navigation-preview__mobile-content">
                Contenu de la page
              </div>
              <MobileBottomNav mode="patient" />
            </div>
          </div>
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
        <CodeExample code={navigationExample} />
      </Section>

      <Section
        title="Médecins"
        description="La composition Stitch est conservée : portrait, identité, clinique, disponibilité et actions cohérentes."
      >
        <div className="ui-kit-card-grid">
          <DoctorCard doctor={doctors[0]} />
          <DoctorCard doctor={doctors[1]} />
        </div>
        <div className="ui-kit-stack">
          <DoctorCard doctor={doctors[0]} variant="compact" />
        </div>
        <CodeExample code={doctorCardExample} />
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
        <CodeExample code={clinicCardExample} />
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
        <CodeExample code={appointmentExample} />
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
        <CodeExample code={feedbackExample} />
      </Section>
    </div>
  )
}
