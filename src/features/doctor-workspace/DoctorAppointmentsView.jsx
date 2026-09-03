import { Link } from '@tanstack/react-router'
import { CalendarCheck, CheckCircle2, Clock3, Stethoscope } from 'lucide-react'
import { useMemo, useState } from 'react'
import { InitialsAvatar } from '../../components/domain'
import { Button, EmptyState, StatusBadge } from '../../design-system'
import { formatTime, isSameDay, startOfDay } from './dates'
import { AppointmentDetailDialog } from './AppointmentDetailDialog'
import { DoctorDataState } from './DoctorDataState'
import { KpiCards } from './KpiCards'
import { PageBanner } from './PageBanner'
import { SegmentedControl } from './SegmentedControl'
import { useDoctorWorkspace } from './workspaceContext'

const filters = [
  { id: 'today', label: 'Aujourd’hui' },
  { id: 'done', label: 'Terminés' },
]

function matchesFilter(appointment, filterId) {
  const today = startOfDay()
  const start = new Date(appointment.startAt)
  if (filterId === 'today') return isSameDay(start, today)
  return ['completed', 'cancelled', 'refused'].includes(appointment.status)
}

function dateLabel(value) {
  if (isSameDay(value, startOfDay())) return 'Aujourd’hui'
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(new Date(value))
}

export function DoctorAppointmentsView() {
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    refetchAppointments,
    confirmAppointment,
    refuseAppointment,
    isMutatingAppointment,
  } = useDoctorWorkspace()
  const [filterId, setFilterId] = useState('today')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const visible = useMemo(
    () =>
      appointments
        .filter((item) => matchesFilter(item, filterId))
        .sort(
          (left, right) => new Date(left.startAt) - new Date(right.startAt),
        ),
    [appointments, filterId],
  )

  const today = startOfDay()
  const todayItems = appointments.filter(
    (item) =>
      isSameDay(item.startAt, today) &&
      !['cancelled', 'refused'].includes(item.status),
  )
  const pendingCount = appointments.filter(
    (item) => item.status === 'pending',
  ).length
  const confirmedToday = todayItems.filter(
    (item) => item.status === 'confirmed',
  ).length
  const doneCount = appointments.filter((item) =>
    ['completed', 'cancelled', 'refused'].includes(item.status),
  ).length

  const cards = [
    {
      label: 'Rendez-vous',
      value: String(todayItems.length),
      unit: 'aujourd’hui',
      badge: '+12,4 %',
      tone: 'up',
      icon: CalendarCheck,
      color: '#1d4ed8',
      spark: [3, 5, 4, 7, 6, todayItems.length || 4],
    },
    {
      label: 'Confirmés',
      value: String(confirmedToday),
      unit: 'consultations',
      badge: '+8,1 %',
      tone: 'up',
      icon: Stethoscope,
      color: '#2563eb',
      spark: [2, 3, 3, 5, 4, confirmedToday || 3],
    },
    {
      label: 'En attente',
      value: String(pendingCount),
      unit: 'demandes',
      badge: pendingCount ? '+1,2 %' : '0 en cours',
      tone: pendingCount ? 'up' : 'down',
      icon: Clock3,
      color: '#0ea5e9',
      spark: [1, 2, 1, 2, 3, pendingCount || 1],
    },
    {
      label: 'Historique',
      value: String(doneCount),
      unit: 'terminés / annulés',
      badge: 'suivi',
      tone: 'up',
      icon: CheckCircle2,
      color: '#3b82f6',
      spark: [2, 2, 3, 4, 3, doneCount || 2],
    },
  ]

  return (
    <DoctorDataState
      error={appointmentsError}
      isLoading={appointmentsLoading}
      loadingLabel="Chargement des rendez-vous…"
      onRetry={refetchAppointments}
    >
      <section className="kb-page">
        <PageBanner
          action={
            <Link className="kb-banner__cta" to="/doctor/agenda">
              Ouvrir l’agenda
            </Link>
          }
          description="Traitez les demandes du jour et consultez l’historique des rendez-vous déjà clos."
          eyebrow="Pilotage des consultations"
          side={
            <SegmentedControl
              ariaLabel="Filtrer les rendez-vous"
              items={filters}
              onChange={setFilterId}
              value={filterId}
            />
          }
          title="Rendez-vous"
        />

        <KpiCards cards={cards} />

        <section className="kb-card kb-panel">
          <div className="kb-panel__toolbar">
            <div>
              <h2>Liste des rendez-vous</h2>
              <p>
                {filterId === 'today'
                  ? 'Patients prévus aujourd’hui.'
                  : 'Rendez-vous terminés, annulés ou refusés.'}
              </p>
            </div>
          </div>
          {visible.length === 0 ? (
            <EmptyState
              description="Modifiez le filtre pour afficher une autre période."
              title="Aucun rendez-vous sur cette période."
            />
          ) : (
            <div className="kb-appt-grid">
              {visible.map((item) => (
                <article className="kb-appt-card" key={item.id}>
                  <div className="kb-appt-card__head">
                    <InitialsAvatar name={item.patientName} />
                    <StatusBadge status={item.status} />
                  </div>
                  <strong>{item.patientName}</strong>
                  <p>{item.reason}</p>
                  <div className="kb-appt-card__meta">
                    <span>
                      {dateLabel(item.startAt)} · {formatTime(item.startAt)}
                    </span>
                    <span>{item.phone}</span>
                  </div>
                  <div className="kb-actions">
                    {item.status === 'pending' ? (
                      <>
                        <Button
                          disabled={isMutatingAppointment}
                          onClick={() => confirmAppointment(item.id)}
                          size="sm"
                        >
                          Confirmer
                        </Button>
                        <Button
                          disabled={isMutatingAppointment}
                          onClick={() => refuseAppointment(item.id)}
                          size="sm"
                          variant="secondary"
                        >
                          Refuser
                        </Button>
                      </>
                    ) : (
                      <Button
                        onClick={() => setSelectedAppointment(item)}
                        size="sm"
                        variant="quiet"
                      >
                        Voir le détail
                      </Button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <AppointmentDetailDialog
          appointment={selectedAppointment}
          onConfirm={(id) => {
            confirmAppointment(id)
            setSelectedAppointment(null)
          }}
          onOpenChange={(open) => {
            if (!open) setSelectedAppointment(null)
          }}
          onRefuse={(id) => {
            refuseAppointment(id)
            setSelectedAppointment(null)
          }}
          open={Boolean(selectedAppointment)}
        />
      </section>
    </DoctorDataState>
  )
}
