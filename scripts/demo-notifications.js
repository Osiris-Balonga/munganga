const path = require('node:path')
const jsonServer = require('json-server')
const {
  createSimulatedNotificationService,
} = require('../server/services/notificationService')

const db = jsonServer.router(path.resolve(__dirname, '..', 'db.json')).db
const confirmedAppointment = db
  .get('appointments')
  .find({ status: 'confirmed' })
  .value()
const slot = db
  .get('availabilitySlots')
  .find({ id: confirmedAppointment.slotId })
  .value()
const reminderRunAt = new Date(slot.startAt)
reminderRunAt.setUTCDate(reminderRunAt.getUTCDate() - 1)

const service = createSimulatedNotificationService()
const notifications = service.sendDueReminders(db, reminderRunAt)

console.log(JSON.stringify(notifications, null, 2))
