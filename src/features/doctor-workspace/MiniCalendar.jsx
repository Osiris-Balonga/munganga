import { IconButton } from '../../design-system'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import {
  addMonths,
  formatMonth,
  formatWeekday,
  getMonthGrid,
  isSameDay,
  startOfDay,
  startOfMonth,
  toDateKey,
} from './dates'

export function MiniCalendar({ value, onChange, weeklyAvailability }) {
  const monthStart = startOfMonth(value)
  const days = getMonthGrid(value)
  const today = startOfDay()

  return (
    <div className="dw-calendar">
      <div className="dw-calendar__nav">
        <IconButton
          label="Mois précédent"
          onClick={() => onChange(addMonths(monthStart, -1))}
        >
          <ChevronLeft />
        </IconButton>
        <strong>{formatMonth(value)}</strong>
        <IconButton
          label="Mois suivant"
          onClick={() => onChange(startOfMonth(addMonths(monthStart, 1)))}
        >
          <ChevronRight />
        </IconButton>
      </div>
      <div className="dw-calendar__weekdays">
        {days.slice(0, 7).map((day) => (
          <span key={toDateKey(day)}>{formatWeekday(day)}</span>
        ))}
      </div>
      <div className="dw-calendar__grid">
        {days.map((day) => {
          const weekday = day.getDay()
          const dayIndex = weekday === 0 ? 6 : weekday - 1
          const hasSlot = weeklyAvailability?.[dayIndex]?.enabled
          const classes = [
            'dw-calendar__day',
            day.getMonth() !== value.getMonth() ? 'is-muted' : '',
            isSameDay(day, today) ? 'is-today' : '',
            isSameDay(day, value) ? 'is-selected' : '',
            hasSlot ? 'has-slot' : '',
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <button
              className={classes}
              key={toDateKey(day)}
              onClick={() => onChange(day)}
              type="button"
            >
              {day.getDate()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
