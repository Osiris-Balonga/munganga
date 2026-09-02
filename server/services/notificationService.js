const NOTIFICATION_TIME_ZONE = 'Africa/Brazzaville'

const EVENT_MESSAGES = {
  'appointment.booked': 'Un rendez-vous vient d’être demandé.',
  'appointment.confirmed': 'Le rendez-vous a été confirmé.',
  'appointment.refused': 'Le rendez-vous a été refusé.',
  'appointment.cancelled': 'Le rendez-vous a été annulé.',
  'appointment.reminder': 'Rappel : le rendez-vous a lieu demain.',
}

function localDateKey(value) {
  return new Intl.DateTimeFormat('fr-CA', {
    timeZone: NOTIFICATION_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(value))
}

function addCalendarDay(value) {
  const result = new Date(value)
  result.setUTCDate(result.getUTCDate() + 1)
  return result
}

function resolveRecipients(db, appointment) {
  const doctor = db.get('doctors').find({ id: appointment.doctorId }).value()
  return [appointment.userId, doctor && doctor.userId].filter(Boolean)
}

function createSimulatedNotificationService({
  clock = () => new Date(),
  deliver = () => {},
} = {}) {
  const outbox = []
  const deliveredKeys = new Set()

  function recordAppointmentEvent(db, event, appointment) {
    if (!EVENT_MESSAGES[event]) {
      throw new Error(`Événement de notification inconnu : ${event}`)
    }

    return resolveRecipients(db, appointment).flatMap((recipientUserId) => {
      const key = `${event}:${appointment.id}:${recipientUserId}`
      if (deliveredKeys.has(key)) return []

      const notification = {
        id: key,
        channel: 'simulated',
        event,
        appointmentId: appointment.id,
        recipientUserId,
        message: EVENT_MESSAGES[event],
        createdAt: clock().toISOString(),
      }

      deliveredKeys.add(key)
      outbox.push(notification)
      deliver(notification)
      return [notification]
    })
  }

  function sendDueReminders(db, at = clock()) {
    const tomorrow = localDateKey(addCalendarDay(at))

    return db
      .get('appointments')
      .filter({ status: 'confirmed' })
      .value()
      .flatMap((appointment) => {
        const slot = db
          .get('availabilitySlots')
          .find({ id: appointment.slotId })
          .value()

        if (!slot || localDateKey(slot.startAt) !== tomorrow) return []
        return recordAppointmentEvent(db, 'appointment.reminder', appointment)
      })
  }

  return {
    recordAppointmentEvent,
    sendDueReminders,
    list: () => [...outbox],
  }
}

module.exports = {
  NOTIFICATION_TIME_ZONE,
  createSimulatedNotificationService,
}
