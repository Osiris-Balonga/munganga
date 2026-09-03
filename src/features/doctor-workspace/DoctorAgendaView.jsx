import {
  ArrowRight,
  CalendarCheck,
  CalendarPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
} from 'lucide-react'
import { Fragment, useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { EmptyState, StatusBadge } from '../../design-system'
import { InitialsAvatar } from '../../components/domain'
import { AppointmentDetailDialog } from './AppointmentDetailDialog'
import { DoctorDataState } from './DoctorDataState'
import { KpiCards } from './KpiCards'
import { PageBanner } from './PageBanner'
import { SegmentedControl } from './SegmentedControl'
import {
  addDays,
  addMonths,
  formatLongDate,
  formatMonth,
  formatTime,
  formatWeekday,
  getMonthGrid,
  getWeekDays,
  isSameDay,
  startOfDay,
  toDateKey,
} from './dates'
import {
  DAY_HOURS,
  countAvailableSlots,
  getAppointmentsForDay,
  getNextAppointment,
  isSlotAvailable,
} from './mockData'
import { useDoctorWorkspace } from './workspaceContext'

const viewItems = [
  { id: 'day', label: 'Jour' },
  { id: 'week', label: 'Semaine' },
  { id: 'month', label: 'Mois' },
]

const weekLabels = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const weekHours = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
]
const DAY_PART_SPLIT = '13:00'
const ACTIVE = (item) => !['cancelled', 'refused'].includes(item.status)

function nowSlotKey(date) {
  const now = new Date()
  if (!isSameDay(date, now)) return null
  return `${String(now.getHours()).padStart(2, '0')}:${now.getMinutes() < 30 ? '00' : '30'}`
}

function DayTimeline({ date, appointments, weeklyAvailability, onSelect }) {
  const dayAppointments = getAppointmentsForDay(appointments, date).filter(
    ACTIVE,
  )
  const nowKey = nowSlotKey(date)

  const rows = DAY_HOURS.map((time) => ({
    time,
    event: dayAppointments.find((item) => formatTime(item.startAt) === time),
    free: isSlotAvailable(weeklyAvailability, appointments, date, time),
  }))

  const parts = [
    {
      id: 'am',
      label: 'Matin',
      rows: rows.filter((row) => row.time < DAY_PART_SPLIT),
    },
    {
      id: 'pm',
      label: 'Après-midi',
      rows: rows.filter((row) => row.time >= DAY_PART_SPLIT),
    },
  ]

  return (
    <div className="kb-ag-day">
      {parts.map((part) => {
        const count = part.rows.filter((row) => row.event).length
        const free = part.rows.filter((row) => row.free).length
        return (
          <div className="kb-ag-part" key={part.id}>
            <div className="kb-ag-part__label">
              <span>{part.label}</span>
              <small>
                {count} RDV · {free} libre{free > 1 ? 's' : ''}
              </small>
            </div>
            <div className="kb-ag-grid">
              {part.rows.map(({ time, event, free: isFree }) => (
                <div
                  className={`kb-ag-slot ${event ? 'has-event' : isFree ? 'is-free' : 'is-off'} ${time === nowKey ? 'is-now' : ''}`}
                  key={time}
                >
                  <span className="kb-ag-slot__time">{time}</span>
                  {event ? (
                    <button
                      className={`kb-ag-event kb-ag-event--${event.status}`}
                      onClick={() => onSelect(event)}
                      type="button"
                    >
                      <InitialsAvatar name={event.patientName} size="sm" />
                      <span className="kb-ag-event__body">
                        <strong>{event.patientName}</strong>
                        <small>{event.reason}</small>
                      </span>
                      <StatusBadge status={event.status} />
                    </button>
                  ) : isFree ? (
                    <span className="kb-ag-slot__free">Libre</span>
                  ) : (
                    <span className="kb-ag-slot__off" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}

function NextAppointmentCard({ appointment, onSelect }) {
  return (
    <article className="kb-card kb-rail-card">
      <div className="kb-card__head">
        <div>
          <h2>Prochain rendez-vous</h2>
          <p>Le plus proche à venir</p>
        </div>
      </div>
      {appointment ? (
        <button
          className="kb-next-appt"
          onClick={() => onSelect(appointment)}
          type="button"
        >
          <InitialsAvatar name={appointment.patientName} />
          <span className="kb-next-appt__body">
            <strong>{appointment.patientName}</strong>
            <small>{appointment.reason}</small>
            <span className="kb-next-appt__when">
              {formatLongDate(appointment.startAt)} ·{' '}
              {formatTime(appointment.startAt)}
            </span>
          </span>
          <StatusBadge status={appointment.status} />
        </button>
      ) : (
        <p className="kb-rail-empty">Aucun rendez-vous à venir.</p>
      )}
    </article>
  )
}

function DaySummaryCard({ date, appointments, freeCount }) {
  const items = getAppointmentsForDay(appointments, date).filter(ACTIVE)
  const confirmed = items.filter((item) => item.status === 'confirmed').length
  const pending = items.filter((item) => item.status === 'pending').length
  const first = items[0]
  const last = items[items.length - 1]

  const rows = [
    { label: 'Consultations prévues', value: String(items.length) },
    { label: 'Confirmées', value: String(confirmed) },
    { label: 'En attente', value: String(pending) },
    { label: 'Créneaux libres', value: String(freeCount) },
    {
      label: 'Première consultation',
      value: first ? formatTime(first.startAt) : '—',
    },
    {
      label: 'Dernière consultation',
      value: last ? formatTime(last.startAt) : '—',
    },
  ]

  return (
    <article className="kb-card kb-rail-card">
      <div className="kb-card__head">
        <div>
          <h2>Résumé de la journée</h2>
          <p>{formatLongDate(date)}</p>
        </div>
      </div>
      <dl className="kb-rail-stats">
        {rows.map((row) => (
          <div className="kb-rail-stats__row" key={row.label}>
            <dt>{row.label}</dt>
            <dd>{row.value}</dd>
          </div>
        ))}
      </dl>
    </article>
  )
}

function FreeSlotsCard({ date, appointments, weeklyAvailability }) {
  const slots = DAY_HOURS.filter((time) =>
    isSlotAvailable(weeklyAvailability, appointments, date, time),
  )

  return (
    <article className="kb-card kb-rail-card">
      <div className="kb-card__head">
        <div>
          <h2>Créneaux libres</h2>
          <p>
            {slots.length} disponible{slots.length > 1 ? 's' : ''} ce jour
          </p>
        </div>
      </div>
      {slots.length === 0 ? (
        <p className="kb-rail-empty">Journée complète ou fermée.</p>
      ) : (
        <div className="kb-freeslots">
          {slots.map((time) => (
            <span className="kb-freeslots__pill" key={time}>
              {time}
            </span>
          ))}
        </div>
      )}
      <Link className="kb-rail-link" to="/doctor/availability">
        Gérer les créneaux <ArrowRight aria-hidden="true" size={14} />
      </Link>
    </article>
  )
}

export function DoctorAgendaView() {
  const {
    appointments,
    appointmentsLoading,
    appointmentsError,
    refetchAppointments,
    weeklyAvailability,
    selectedDate,
    setSelectedDate,
    confirmAppointment,
    refuseAppointment,
  } = useDoctorWorkspace()
  const [view, setView] = useState('day')
  const [selectedAppointment, setSelectedAppointment] = useState(null)
  const weekDays = getWeekDays(selectedDate)
  const monthDays = getMonthGrid(selectedDate)

  const todayAppointments = getAppointmentsForDay(
    appointments,
    selectedDate,
  ).filter(ACTIVE)
  const confirmedCount = todayAppointments.filter(
    (item) => item.status === 'confirmed',
  ).length
  const pendingCount = todayAppointments.filter(
    (item) => item.status === 'pending',
  ).length
  const freeCount = countAvailableSlots(
    weeklyAvailability,
    appointments,
    selectedDate,
  )
  const occupancy = Math.round(
    (todayAppointments.length /
      Math.max(todayAppointments.length + freeCount, 1)) *
      100,
  )
  const nextAppointment = getNextAppointment(appointments)

  const emptyDay = todayAppointments.length === 0 && freeCount === 0

  const spark = useMemo(() => {
    const days = Array.from({ length: 6 }, (_, index) =>
      addDays(selectedDate, index - 5),
    )
    return {
      total: days.map(
        (day) => getAppointmentsForDay(appointments, day).filter(ACTIVE).length,
      ),
      confirmed: days.map(
        (day) =>
          getAppointmentsForDay(appointments, day).filter(
            (item) => item.status === 'confirmed',
          ).length,
      ),
      pending: days.map(
        (day) =>
          getAppointmentsForDay(appointments, day).filter(
            (item) => item.status === 'pending',
          ).length,
      ),
      free: days.map((day) =>
        countAvailableSlots(weeklyAvailability, appointments, day),
      ),
    }
  }, [appointments, weeklyAvailability, selectedDate])

  const kpiCards = [
    {
      label: 'RDV du jour',
      value: String(todayAppointments.length),
      unit: 'programmés',
      badge: todayAppointments.length
        ? `${confirmedCount}/${todayAppointments.length} confirmés`
        : 'journée libre',
      tone: 'up',
      icon: CalendarCheck,
      color: '#1d4ed8',
      spark: spark.total,
    },
    {
      label: 'Confirmés',
      value: String(confirmedCount),
      unit: 'consultations',
      badge: pendingCount ? `${pendingCount} en attente` : 'à jour',
      tone: pendingCount ? 'down' : 'up',
      icon: CheckCircle2,
      color: '#2563eb',
      spark: spark.confirmed,
    },
    {
      label: 'En attente',
      value: String(pendingCount),
      unit: 'à traiter',
      badge: pendingCount ? 'action requise' : '0 en cours',
      tone: pendingCount ? 'down' : 'up',
      icon: Clock3,
      color: '#0ea5e9',
      spark: spark.pending,
    },
    {
      label: 'Créneaux libres',
      value: String(freeCount),
      unit: 'ce jour',
      badge: `${occupancy}% occupé`,
      tone: 'up',
      icon: CalendarPlus,
      color: '#3b82f6',
      spark: spark.free,
    },
  ]

  const monthCells = useMemo(
    () =>
      monthDays.map((day) => ({
        day,
        events: getAppointmentsForDay(appointments, day).filter(ACTIVE),
      })),
    [appointments, monthDays],
  )

  return (
    <DoctorDataState
      error={appointmentsError}
      isLoading={appointmentsLoading}
      loadingLabel="Chargement de l’agenda…"
      onRetry={refetchAppointments}
    >
      <section className="kb-page">
        <PageBanner
          action={
            <Link className="kb-banner__cta" to="/doctor/availability">
              Gérer les créneaux
            </Link>
          }
          description="Visualisez vos rendez-vous, créneaux libres et journées occupées."
          eyebrow="Organisation de votre journée"
          side={
            <SegmentedControl
              ariaLabel="Vue de l’agenda"
              items={viewItems}
              onChange={setView}
              value={view}
            />
          }
          title="Agenda"
        />

        <KpiCards cards={kpiCards} />

        <div className="kb-workspace-grid">
          <article className="kb-card kb-agenda kb-panel">
            <div className="kb-agenda__bar">
              <div className="kb-cal-nav">
                <button
                  aria-label="Période précédente"
                  className="kb-iconbtn"
                  onClick={() =>
                    setSelectedDate(
                      view === 'month'
                        ? addMonths(selectedDate, -1)
                        : addDays(selectedDate, view === 'week' ? -7 : -1),
                    )
                  }
                  type="button"
                >
                  <ChevronLeft />
                </button>
                <strong>
                  {view === 'month'
                    ? formatMonth(selectedDate)
                    : formatLongDate(selectedDate)}
                </strong>
                <button
                  aria-label="Période suivante"
                  className="kb-iconbtn"
                  onClick={() =>
                    setSelectedDate(
                      view === 'month'
                        ? addMonths(selectedDate, 1)
                        : addDays(selectedDate, view === 'week' ? 7 : 1),
                    )
                  }
                  type="button"
                >
                  <ChevronRight />
                </button>
              </div>
              <button
                className="kb-text-btn"
                onClick={() => setSelectedDate(startOfDay())}
                type="button"
              >
                Aujourd’hui
              </button>
            </div>

            {view === 'day' ? (
              emptyDay ? (
                <EmptyState
                  description="Cette journée n’a ni rendez-vous ni créneau ouvert."
                  title="Aucune activité sur cette date."
                />
              ) : (
                <DayTimeline
                  appointments={appointments}
                  date={selectedDate}
                  onSelect={setSelectedAppointment}
                  weeklyAvailability={weeklyAvailability}
                />
              )
            ) : null}

            {view === 'week' ? (
              <div className="kb-week-wrap">
                <div className="kb-ag-week">
                  <div className="kb-ag-week__corner" />
                  {weekDays.map((day) => (
                    <div
                      className={`kb-ag-week__head ${isSameDay(day, selectedDate) ? 'is-current' : ''} ${isSameDay(day, startOfDay()) ? 'is-today' : ''}`}
                      key={toDateKey(day)}
                    >
                      <small>{formatWeekday(day)}</small>
                      <strong>{day.getDate()}</strong>
                    </div>
                  ))}
                  {weekHours.map((time) => (
                    <Fragment key={time}>
                      <div className="kb-ag-week__time">{time}</div>
                      {weekDays.map((day) => {
                        const hour = Number(time.slice(0, 2))
                        const dayEvents = getAppointmentsForDay(
                          appointments,
                          day,
                        )
                          .filter(ACTIVE)
                          .filter(
                            (item) =>
                              new Date(item.startAt).getHours() === hour,
                          )
                        const event = dayEvents[0]
                        const extra = dayEvents.length - 1
                        const free =
                          !event &&
                          isSlotAvailable(
                            weeklyAvailability,
                            appointments,
                            day,
                            `${time.slice(0, 2)}:00`,
                          )
                        return (
                          <div
                            className="kb-ag-week__cell"
                            key={`${toDateKey(day)}-${time}`}
                          >
                            {event ? (
                              <button
                                className={`kb-ag-chip kb-ag-chip--${event.status}`}
                                onClick={() => setSelectedAppointment(event)}
                                type="button"
                              >
                                <b>{formatTime(event.startAt)}</b>
                                <span>{event.patientName}</span>
                                {extra > 0 ? (
                                  <em className="kb-ag-chip__more">+{extra}</em>
                                ) : null}
                              </button>
                            ) : free ? (
                              <span className="kb-ag-week__free" />
                            ) : null}
                          </div>
                        )
                      })}
                    </Fragment>
                  ))}
                </div>
              </div>
            ) : null}

            {view === 'month' ? (
              <div className="kb-ag-month">
                {weekLabels.map((label) => (
                  <span className="kb-ag-month__label" key={label}>
                    {label}
                  </span>
                ))}
                {monthCells.map(({ day, events }) => (
                  <button
                    className={`kb-ag-month__cell ${day.getMonth() !== selectedDate.getMonth() ? 'is-muted' : ''} ${isSameDay(day, selectedDate) ? 'is-selected' : ''} ${isSameDay(day, startOfDay()) ? 'is-today' : ''}`}
                    key={toDateKey(day)}
                    onClick={() => {
                      setSelectedDate(day)
                      setView('day')
                    }}
                    type="button"
                  >
                    <span className="kb-ag-month__num">
                      <strong>{day.getDate()}</strong>
                      {events.length ? (
                        <em className="kb-ag-month__count">{events.length}</em>
                      ) : null}
                    </span>
                    {events.slice(0, 2).map((event) => (
                      <small
                        className={`kb-ag-month__event is-${event.status}`}
                        key={event.id}
                      >
                        {formatTime(event.startAt)} {event.patientName}
                      </small>
                    ))}
                    {events.length > 2 ? (
                      <small className="kb-ag-month__event is-more">
                        +{events.length - 2} autre
                        {events.length - 2 > 1 ? 's' : ''}
                      </small>
                    ) : null}
                  </button>
                ))}
              </div>
            ) : null}
          </article>

          <aside className="kb-rail">
            <NextAppointmentCard
              appointment={nextAppointment}
              onSelect={setSelectedAppointment}
            />
            <DaySummaryCard
              appointments={appointments}
              date={selectedDate}
              freeCount={freeCount}
            />
            <FreeSlotsCard
              appointments={appointments}
              date={selectedDate}
              weeklyAvailability={weeklyAvailability}
            />
          </aside>
        </div>

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
