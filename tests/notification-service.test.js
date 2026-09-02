const assert = require('node:assert/strict')
const path = require('node:path')
const test = require('node:test')
const jsonServer = require('json-server')
const {
  createSimulatedNotificationService,
} = require('../server/services/notificationService')

function createDb() {
  return jsonServer.router(path.resolve(__dirname, '..', 'db.json')).db
}

test('les quatre événements métier créent des notifications simulées', () => {
  const db = createDb()
  const appointment = db.get('appointments').find({ id: 1 }).value()
  const delivered = []
  const service = createSimulatedNotificationService({
    clock: () => new Date('2026-08-19T10:00:00+01:00'),
    deliver: (notification) => delivered.push(notification),
  })

  for (const event of [
    'appointment.booked',
    'appointment.confirmed',
    'appointment.refused',
    'appointment.cancelled',
  ]) {
    service.recordAppointmentEvent(db, event, appointment)
  }

  assert.deepEqual(
    new Set(delivered.map(({ event }) => event)),
    new Set([
      'appointment.booked',
      'appointment.confirmed',
      'appointment.refused',
      'appointment.cancelled',
    ]),
  )
  assert.ok(delivered.every(({ channel }) => channel === 'simulated'))
  assert.ok(delivered.some(({ recipientUserId }) => recipientUserId === 1))
  assert.ok(delivered.some(({ recipientUserId }) => recipientUserId === 10))
})

test('le rappel de la veille est démontrable et idempotent', () => {
  const db = createDb()
  const service = createSimulatedNotificationService({
    clock: () => new Date('2026-08-20T08:00:00+01:00'),
  })

  const firstRun = service.sendDueReminders(
    db,
    new Date('2026-08-20T08:00:00+01:00'),
  )
  const secondRun = service.sendDueReminders(
    db,
    new Date('2026-08-20T12:00:00+01:00'),
  )

  assert.equal(firstRun.length, 2)
  assert.ok(firstRun.every(({ event }) => event === 'appointment.reminder'))
  assert.equal(secondRun.length, 0)
})
