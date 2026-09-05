import { Link } from '@tanstack/react-router'
import { CalendarCheck, Phone, UserRound, Users } from 'lucide-react'
import { useMemo, useState } from 'react'
import { InitialsAvatar } from '../../components/domain'
import { Button, EmptyState, StatusBadge } from '../../design-system'
import { formatTime, isSameDay, startOfDay } from './dates'
import { KpiCards } from './KpiCards'
import { PageBanner } from './PageBanner'
import { SegmentedControl } from './SegmentedControl'
import { decorativeMessages as initialMessages } from './decorativeFixtures'
import { useDoctorWorkspace } from './workspaceContext'

const patientFilters = [
  { id: 'today', label: 'Aujourd’hui' },
  { id: 'done', label: 'Terminé' },
]

function dateLabel(value) {
  if (isSameDay(value, startOfDay())) return 'Aujourd’hui'
  return new Intl.DateTimeFormat('fr-FR', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))
}

function toPatientCard(appointment) {
  return {
    name: appointment.patientName,
    phone: appointment.phone,
    lastAt: appointment.startAt,
    lastReason: appointment.reason,
    status: appointment.status,
  }
}

export function DoctorPatientsView() {
  const { appointments } = useDoctorWorkspace()
  const [filterId, setFilterId] = useState('today')

  const patients = useMemo(() => {
    const today = startOfDay()
    const seen = new Set()

    if (filterId === 'today') {
      return appointments
        .filter(
          (item) =>
            isSameDay(item.startAt, today) &&
            !['cancelled', 'refused'].includes(item.status),
        )
        .sort((left, right) => new Date(left.startAt) - new Date(right.startAt))
        .filter((item) => {
          if (seen.has(item.patientName)) return false
          seen.add(item.patientName)
          return true
        })
        .map(toPatientCard)
    }

    return appointments
      .filter(
        (item) =>
          ['completed', 'cancelled', 'refused'].includes(item.status) &&
          new Date(item.startAt) < today,
      )
      .sort((left, right) => new Date(right.startAt) - new Date(left.startAt))
      .filter((item) => {
        if (seen.has(item.patientName)) return false
        seen.add(item.patientName)
        return true
      })
      .map(toPatientCard)
  }, [appointments, filterId])

  const todayCount = appointments.filter(
    (item) =>
      isSameDay(item.startAt, startOfDay()) &&
      !['cancelled', 'refused'].includes(item.status),
  ).length
  const pendingCount = appointments.filter(
    (item) => item.status === 'pending',
  ).length
  const confirmedCount = appointments.filter(
    (item) => item.status === 'confirmed',
  ).length

  const cards = [
    {
      label: 'Patients suivis',
      value: String(new Set(appointments.map((item) => item.patientName)).size),
      unit: 'dans votre agenda',
      badge: '+5',
      tone: 'up',
      icon: Users,
      color: '#1d4ed8',
      spark: [4, 5, 6, 7, 6, todayCount || 5],
    },
    {
      label: 'Aujourd’hui',
      value: String(todayCount),
      unit: 'avec un rendez-vous',
      badge: todayCount ? '+2' : '0',
      tone: todayCount ? 'up' : 'down',
      icon: UserRound,
      color: '#2563eb',
      spark: [1, 2, 2, 3, 2, todayCount || 1],
    },
    {
      label: 'Confirmés',
      value: String(confirmedCount),
      unit: 'dossiers actifs',
      badge: '+3 %',
      tone: 'up',
      icon: CalendarCheck,
      color: '#0ea5e9',
      spark: [2, 3, 3, 4, 3, confirmedCount || 2],
    },
    {
      label: 'En attente',
      value: String(pendingCount),
      unit: 'à confirmer',
      badge: pendingCount ? '+1' : '0',
      tone: pendingCount ? 'up' : 'down',
      icon: Phone,
      color: '#3b82f6',
      spark: [1, 1, 2, 1, 2, pendingCount || 1],
    },
  ]

  return (
    <section className="kb-page">
      <PageBanner
        action={
          <Link className="kb-banner__cta" to="/doctor/appointments">
            Voir les rendez-vous
          </Link>
        }
        description="Retrouvez les patients du jour ou ceux dont la consultation est terminée."
        eyebrow="Votre patientèle"
        side={
          <SegmentedControl
            ariaLabel="Filtrer les patients"
            items={patientFilters}
            onChange={setFilterId}
            value={filterId}
          />
        }
        title="Patients"
      />

      <KpiCards cards={cards} />

      <section className="kb-card kb-panel">
        <div className="kb-panel__toolbar">
          <div>
            <h2>Liste des patients</h2>
            <p>
              {filterId === 'today'
                ? 'Patients avec rendez-vous aujourd’hui.'
                : 'Consultations terminées, annulées ou refusées.'}
            </p>
          </div>
        </div>
        {patients.length === 0 ? (
          <EmptyState
            description="Les patients apparaîtront ici dès le premier rendez-vous."
            title="Aucun patient pour le moment."
          />
        ) : (
          <div className="kb-patient-grid">
            {patients.map((patient) => (
              <article className="kb-patient-card" key={patient.name}>
                <div className="kb-patient-card__top">
                  <InitialsAvatar name={patient.name} />
                  <StatusBadge status={patient.status} />
                </div>
                <strong>{patient.name}</strong>
                <p>{patient.lastReason}</p>
                <div className="kb-patient-card__meta">
                  <span>{patient.phone}</span>
                  <span>
                    {dateLabel(patient.lastAt)} · {formatTime(patient.lastAt)}
                  </span>
                </div>
                <Button size="sm" variant="secondary">
                  Voir la fiche
                </Button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  )
}

export function DoctorStatsView() {
  const { appointments } = useDoctorWorkspace()
  return (
    <section className="kb-page">
      <PageBanner
        description="Vue synthétique de votre activité de consultations."
        eyebrow="Indicateurs"
        title="Statistiques"
      />
      <section className="kb-card">
        <p className="kb-muted">
          {appointments.length} rendez-vous sont actuellement suivis dans votre
          espace. Les graphiques détaillés restent sur le tableau de bord.
        </p>
      </section>
    </section>
  )
}

export function DoctorMessagesView() {
  return (
    <section className="kb-page">
      <PageBanner
        description="Échanges avec vos patients et votre établissement."
        eyebrow="Messagerie"
        title="Messages"
      />
      <section className="kb-card kb-panel">
        <div className="kb-stack">
          {initialMessages.map((item) => (
            <article className="kb-row-card" key={item.id}>
              <div className="kb-row-card__main">
                <InitialsAvatar name={item.from} />
                <div>
                  <strong>{item.from}</strong>
                  <p>{item.preview}</p>
                </div>
              </div>
              <small className="kb-muted">{item.time}</small>
            </article>
          ))}
        </div>
      </section>
    </section>
  )
}

export function DoctorSupportView() {
  return (
    <section className="kb-page">
      <PageBanner
        description="Assistance pour l’espace praticien Munganga."
        eyebrow="Aide"
        title="À propos"
      />
      <section className="kb-card">
        <p className="kb-muted">
          Pour une démonstration, contactez l’équipe projet à
          support@munganga.cg.
        </p>
      </section>
    </section>
  )
}
