import {
  CalendarPlus,
  CalendarRange,
  CalendarX2,
  ChevronLeft,
  ChevronRight,
  Lock,
  Percent,
  Plus,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button, EmptyState } from '../../design-system'
import {
  canUseDoctorAvailabilityApi,
  createDoctorAvailabilitySlot,
  deleteDoctorAvailabilitySlot,
  listDoctorAvailabilitySlots,
} from '../availability/availabilityApi'
import {
  addDays,
  combineDateAndTime,
  formatLongDate,
  formatTime,
  formatWeekday,
  getWeekDays,
  isSameDay,
  startOfDay,
  startOfWeek,
  toDateKey,
} from './dates'
import { KpiCards } from './KpiCards'
import { PageBanner } from './PageBanner'
import { useDoctorWorkspace } from './workspaceContext'

const DURATIONS = [15, 30, 45, 60]
const DAY_PART_SPLIT = '13:00'

function toInputDate(value) {
  return toDateKey(value)
}

function isReservedSlot(slot) {
  return slot.status !== 'available' || Boolean(slot.appointmentId)
}

function SlotCard({ slot, busy, onDelete }) {
  const reserved = isReservedSlot(slot)
  return (
    <article className={`kb-slot-card ${reserved ? 'is-reserved' : 'is-free'}`}>
      <div>
        <strong>
          {formatTime(slot.startAt)} – {formatTime(slot.endAt)}
        </strong>
        <p>{reserved ? 'Réservé' : 'Libre'}</p>
      </div>
      {reserved ? (
        <span className="kb-slot-badge">
          <Lock aria-hidden="true" size={14} />
          Protégé
        </span>
      ) : (
        <Button
          disabled={busy}
          onClick={() => onDelete(slot.id)}
          size="sm"
          variant="secondary"
        >
          <CalendarX2 aria-hidden="true" size={14} />
          Supprimer
        </Button>
      )}
    </article>
  )
}

export function DoctorAvailabilityView() {
  const {
    availabilitySlots,
    setAvailabilitySlots,
    createAvailabilitySlot,
    deleteAvailabilitySlot,
    showToast,
  } = useDoctorWorkspace()
  const [selectedDay, setSelectedDay] = useState(() => startOfDay())
  const [time, setTime] = useState('09:00')
  const [duration, setDuration] = useState(30)
  const [busy, setBusy] = useState(false)

  const weekStart = startOfWeek(selectedDay)
  const weekDays = getWeekDays(selectedDay)

  const daySlots = useMemo(
    () =>
      availabilitySlots
        .filter((slot) => isSameDay(slot.startAt, selectedDay))
        .sort(
          (left, right) => new Date(left.startAt) - new Date(right.startAt),
        ),
    [availabilitySlots, selectedDay],
  )

  const weekStats = useMemo(() => {
    const end = addDays(weekStart, 7)
    const perDay = weekDays.map((day) => {
      const slots = availabilitySlots.filter((slot) =>
        isSameDay(slot.startAt, day),
      )
      const reserved = slots.filter(isReservedSlot).length
      return {
        day,
        total: slots.length,
        reserved,
        free: slots.length - reserved,
      }
    })
    const weekSlots = availabilitySlots.filter((slot) => {
      const date = new Date(slot.startAt)
      return date >= weekStart && date < end
    })
    const reserved = weekSlots.filter(isReservedSlot).length
    return {
      perDay,
      total: weekSlots.length,
      reserved,
      free: weekSlots.length - reserved,
      fillRate: weekSlots.length
        ? Math.round((reserved / weekSlots.length) * 100)
        : 0,
    }
  }, [availabilitySlots, weekDays, weekStart])

  const dayFree = daySlots.filter((slot) => !isReservedSlot(slot)).length
  const dayParts = [
    {
      id: 'am',
      label: 'Matin',
      slots: daySlots.filter(
        (slot) => formatTime(slot.startAt) < DAY_PART_SPLIT,
      ),
    },
    {
      id: 'pm',
      label: 'Après-midi',
      slots: daySlots.filter(
        (slot) => formatTime(slot.startAt) >= DAY_PART_SPLIT,
      ),
    },
  ]

  const endTime = formatTime(
    new Date(
      combineDateAndTime(selectedDay, time).getTime() + duration * 60 * 1000,
    ),
  )

  const kpiCards = [
    {
      label: 'Créneaux ouverts',
      value: String(weekStats.total),
      unit: 'cette semaine',
      badge: '7 jours',
      tone: 'up',
      icon: CalendarRange,
      color: '#1d4ed8',
      spark: weekStats.perDay.map((entry) => entry.total),
    },
    {
      label: 'Réservés',
      value: String(weekStats.reserved),
      unit: 'consultations',
      badge: `${weekStats.fillRate}% rempli`,
      tone: 'up',
      icon: Lock,
      color: '#2563eb',
      spark: weekStats.perDay.map((entry) => entry.reserved),
    },
    {
      label: 'Libres',
      value: String(weekStats.free),
      unit: 'disponibles',
      badge: weekStats.free ? 'ouverts' : 'complet',
      tone: weekStats.free ? 'up' : 'down',
      icon: CalendarPlus,
      color: '#0ea5e9',
      spark: weekStats.perDay.map((entry) => entry.free),
    },
    {
      label: 'Remplissage',
      value: `${weekStats.fillRate} %`,
      unit: 'de l’agenda',
      badge: weekStats.fillRate >= 80 ? 'élevé' : 'sous contrôle',
      tone: 'up',
      icon: Percent,
      color: '#3b82f6',
      spark: weekStats.perDay.map((entry) => entry.total - entry.free),
    },
  ]

  async function refreshFromApi() {
    if (!canUseDoctorAvailabilityApi()) return
    const slots = await listDoctorAvailabilitySlots()
    setAvailabilitySlots(slots)
  }

  async function handleCreate(event) {
    event.preventDefault()
    const startAt = combineDateAndTime(selectedDay, time)
    const endAt = new Date(startAt.getTime() + duration * 60 * 1000)
    const payload = {
      startAt: startAt.toISOString(),
      endAt: endAt.toISOString(),
    }

    setBusy(true)
    try {
      if (canUseDoctorAvailabilityApi()) {
        await createDoctorAvailabilitySlot(payload)
        await refreshFromApi()
        showToast('Créneau disponible créé.')
      } else {
        createAvailabilitySlot(payload)
      }
    } catch (error) {
      showToast(error.message || 'Création impossible.')
    } finally {
      setBusy(false)
    }
  }

  async function handleDelete(slotId) {
    setBusy(true)
    try {
      if (canUseDoctorAvailabilityApi()) {
        await deleteDoctorAvailabilitySlot(slotId)
        await refreshFromApi()
        showToast('Créneau disponible supprimé.')
      } else {
        deleteAvailabilitySlot(slotId)
      }
    } catch (error) {
      showToast(error.message || 'Suppression impossible.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="kb-page">
      <PageBanner
        action={
          <Link className="kb-banner__cta" to="/doctor/agenda">
            Voir l’agenda
          </Link>
        }
        description="Créez ou retirez des créneaux disponibles. Les créneaux réservés restent protégés."
        eyebrow="Gestion des créneaux"
        title="Disponibilités"
      />

      <KpiCards cards={kpiCards} />

      <div className="kb-workspace-grid">
        <div className="kb-av-main">
          <article className="kb-card kb-panel">
            <div className="kb-panel__toolbar">
              <div>
                <h2>Vue de la semaine</h2>
                <p>Taux de remplissage par jour. Cliquez pour sélectionner.</p>
              </div>
              <div className="kb-cal-nav">
                <button
                  aria-label="Semaine précédente"
                  className="kb-iconbtn"
                  onClick={() => setSelectedDay(addDays(selectedDay, -7))}
                  type="button"
                >
                  <ChevronLeft />
                </button>
                <button
                  aria-label="Semaine suivante"
                  className="kb-iconbtn"
                  onClick={() => setSelectedDay(addDays(selectedDay, 7))}
                  type="button"
                >
                  <ChevronRight />
                </button>
              </div>
            </div>
            <div className="kb-av-week">
              {weekStats.perDay.map(({ day, total, reserved, free }) => {
                const pct = total ? Math.round((reserved / total) * 100) : 0
                return (
                  <button
                    className={`kb-av-day ${isSameDay(day, selectedDay) ? 'is-selected' : ''} ${isSameDay(day, startOfDay()) ? 'is-today' : ''}`}
                    key={toDateKey(day)}
                    onClick={() => setSelectedDay(startOfDay(day))}
                    type="button"
                  >
                    <small>{formatWeekday(day)}</small>
                    <strong>{day.getDate()}</strong>
                    <span
                      className={`kb-track ${total ? '' : 'is-off'}`}
                      aria-hidden="true"
                    >
                      <span
                        className="kb-track__block"
                        style={{ width: `${pct}%` }}
                      />
                    </span>
                    <em>{total ? `${free}/${total} libres` : 'Fermé'}</em>
                  </button>
                )
              })}
            </div>
          </article>

          <article className="kb-card kb-panel">
            <div className="kb-panel__toolbar">
              <div>
                <h2>{formatLongDate(selectedDay)}</h2>
                <p>
                  {daySlots.length} créneau{daySlots.length > 1 ? 'x' : ''} ·{' '}
                  {dayFree} libre{dayFree > 1 ? 's' : ''}
                </p>
              </div>
            </div>
            {daySlots.length === 0 ? (
              <EmptyState
                description="Utilisez le formulaire pour ouvrir un créneau."
                title="Aucun créneau ce jour."
              />
            ) : (
              <div className="kb-av-slots">
                {dayParts.map((part) =>
                  part.slots.length === 0 ? null : (
                    <div className="kb-av-slots__part" key={part.id}>
                      <div className="kb-ag-part__label">
                        <span>{part.label}</span>
                        <small>
                          {part.slots.length} créneau
                          {part.slots.length > 1 ? 'x' : ''}
                        </small>
                      </div>
                      <div className="kb-av-slots__grid">
                        {part.slots.map((slot) => (
                          <SlotCard
                            busy={busy}
                            key={slot.id}
                            onDelete={handleDelete}
                            slot={slot}
                          />
                        ))}
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </article>
        </div>

        <aside className="kb-rail">
          <article className="kb-card kb-rail-card">
            <div className="kb-card__head">
              <div>
                <h2>Nouveau créneau</h2>
                <p>Ouvre un créneau disponible à la réservation.</p>
              </div>
            </div>
            <form className="kb-slot-form" onSubmit={handleCreate}>
              <label>
                Date
                <input
                  onChange={(event) =>
                    setSelectedDay(startOfDay(event.target.value))
                  }
                  required
                  type="date"
                  value={toInputDate(selectedDay)}
                />
              </label>
              <div className="kb-slot-form__row">
                <label>
                  Début
                  <input
                    onChange={(event) => setTime(event.target.value)}
                    required
                    step={900}
                    type="time"
                    value={time}
                  />
                </label>
                <label>
                  Durée
                  <select
                    onChange={(event) =>
                      setDuration(Number(event.target.value))
                    }
                    value={duration}
                  >
                    {DURATIONS.map((value) => (
                      <option key={value} value={value}>
                        {value} min
                      </option>
                    ))}
                  </select>
                </label>
              </div>
              <div className="kb-slot-form__footer">
                <span className="kb-muted">
                  Fin {endTime} · {duration} min
                </span>
                <Button disabled={busy} size="sm" type="submit">
                  <Plus aria-hidden="true" size={16} />
                  Créer
                </Button>
              </div>
            </form>
          </article>

          <article className="kb-card kb-rail-card">
            <div className="kb-card__head">
              <div>
                <h2>Cette semaine</h2>
                <p>Semaine du {formatLongDate(weekStart)}</p>
              </div>
            </div>
            <dl className="kb-rail-stats">
              <div className="kb-rail-stats__row">
                <dt>Créneaux ouverts</dt>
                <dd>{weekStats.total}</dd>
              </div>
              <div className="kb-rail-stats__row">
                <dt>Réservés</dt>
                <dd>{weekStats.reserved}</dd>
              </div>
              <div className="kb-rail-stats__row">
                <dt>Libres</dt>
                <dd>{weekStats.free}</dd>
              </div>
              <div className="kb-rail-stats__row">
                <dt>Remplissage</dt>
                <dd>{weekStats.fillRate} %</dd>
              </div>
            </dl>
          </article>
        </aside>
      </div>
    </section>
  )
}
