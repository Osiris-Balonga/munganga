import { Dialog } from '@base-ui/react/dialog'
import { Button, StatusBadge } from '../../design-system'
import { InitialsAvatar } from '../../components/domain'
import { formatLongDate, formatTime } from './dates'

export function AppointmentDetailDialog({
  appointment,
  open,
  onOpenChange,
  onConfirm,
  onRefuse,
}) {
  if (!appointment) return null

  return (
    <Dialog.Root onOpenChange={onOpenChange} open={open}>
      <Dialog.Portal>
        <Dialog.Backdrop className="ds-dialog__backdrop" />
        <Dialog.Viewport className="ds-dialog__viewport">
          <Dialog.Popup className="ds-dialog__popup">
            <Dialog.Title className="ds-dialog__title">
              Détail du rendez-vous
            </Dialog.Title>
            <Dialog.Description className="ds-dialog__description">
              {formatLongDate(appointment.startAt)} ·{' '}
              {formatTime(appointment.startAt)} –{' '}
              {formatTime(appointment.endAt)}
            </Dialog.Description>
            <div className="dw-next" style={{ marginTop: '1rem' }}>
              <div
                style={{
                  display: 'flex',
                  gap: '0.75rem',
                  alignItems: 'center',
                }}
              >
                <InitialsAvatar name={appointment.patientName} />
                <div>
                  <strong>{appointment.patientName}</strong>
                  <p style={{ margin: '0.2rem 0 0' }}>{appointment.phone}</p>
                </div>
              </div>
              <p style={{ margin: 0 }}>{appointment.reason}</p>
              <p style={{ margin: 0 }}>
                {appointment.clinic} · {appointment.district}
              </p>
              <StatusBadge status={appointment.status} />
            </div>
            <div className="ds-dialog__actions">
              <Dialog.Close render={<Button variant="secondary" />}>
                Fermer
              </Dialog.Close>
              {appointment.status === 'pending' ? (
                <>
                  <Button
                    onClick={() => onRefuse(appointment.id)}
                    variant="danger"
                  >
                    Refuser
                  </Button>
                  <Button onClick={() => onConfirm(appointment.id)}>
                    Confirmer
                  </Button>
                </>
              ) : null}
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
