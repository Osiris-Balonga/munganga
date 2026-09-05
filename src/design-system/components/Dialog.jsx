import { Dialog } from '@base-ui/react/dialog'
import { Button, IconButton } from './Button'
import { CloseIcon } from './Icons'

export function ConfirmationDialog({
  trigger,
  title,
  description,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  destructive = false,
  onConfirm,
  open,
  onOpenChange,
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      {trigger ? <Dialog.Trigger render={trigger} /> : null}
      <Dialog.Portal>
        <Dialog.Backdrop className="ds-dialog__backdrop" />
        <Dialog.Viewport className="ds-dialog__viewport">
          <Dialog.Popup className="ds-dialog__popup">
            <IconButton
              className="ds-dialog__close"
              label="Fermer"
              render={<Dialog.Close />}
            >
              <CloseIcon />
            </IconButton>
            <div className="ds-dialog__copy">
              <Dialog.Title className="ds-dialog__title">{title}</Dialog.Title>
              <Dialog.Description className="ds-dialog__description">
                {description}
              </Dialog.Description>
            </div>
            <div className="ds-dialog__actions">
              <Dialog.Close render={<Button variant="secondary" />}>
                {cancelLabel}
              </Dialog.Close>
              <Dialog.Close
                render={<Button variant={destructive ? 'danger' : 'primary'} />}
                onClick={onConfirm}
              >
                {confirmLabel}
              </Dialog.Close>
            </div>
          </Dialog.Popup>
        </Dialog.Viewport>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
