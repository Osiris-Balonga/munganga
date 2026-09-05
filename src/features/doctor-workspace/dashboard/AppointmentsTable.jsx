import { Ellipsis, Phone, RotateCcw } from 'lucide-react'
import { StatusBadge } from '../../../design-system'
import { InitialsAvatar } from '../../../components/domain'
import { formatTime } from '../dates'
import { getLiveStatus } from '../scheduleUtils'

const liveLabels = {
  'in-progress': 'En cours',
}

export function AppointmentsTable({ appointments, onOpen }) {
  return (
    <section className="mb-card">
      <div className="mb-card__head">
        <h2>Prochains rendez-vous</h2>
        <button
          aria-label="Options du tableau"
          className="mb-icon-ghost"
          type="button"
        >
          <Ellipsis />
        </button>
      </div>
      <div className="mb-table-wrap">
        <table className="mb-table">
          <thead>
            <tr>
              <th aria-label="Sélection" />
              <th>Patient</th>
              <th>Heure</th>
              <th>Motif</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((item) => {
              const live = getLiveStatus(item)
              return (
                <tr key={item.id}>
                  <td>
                    <input
                      aria-label={`Sélectionner ${item.patientName}`}
                      type="checkbox"
                    />
                  </td>
                  <td>
                    <button
                      className="mb-patient"
                      onClick={() => onOpen(item)}
                      type="button"
                    >
                      <InitialsAvatar name={item.patientName} size="sm" />
                      <span>
                        <strong>{item.patientName}</strong>
                        <small>{item.phone}</small>
                      </span>
                    </button>
                  </td>
                  <td>{formatTime(item.startAt)}</td>
                  <td>{item.reason}</td>
                  <td>
                    <StatusBadge
                      status={live === 'in-progress' ? 'pending' : live}
                    >
                      {liveLabels[live]}
                    </StatusBadge>
                  </td>
                  <td>
                    <div className="mb-row-actions">
                      <button
                        aria-label={`Appeler ${item.patientName}`}
                        className="mb-icon-ghost"
                        type="button"
                      >
                        <Phone />
                      </button>
                      <button
                        aria-label={`Reprogrammer ${item.patientName}`}
                        className="mb-icon-ghost"
                        type="button"
                      >
                        <RotateCcw />
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
