const { ApiError } = require('../utils/apiError')

function getNextId(collection) {
  const ids = collection.map((item) => Number(item.id)).filter(Number.isFinite)
  return ids.length ? Math.max(...ids) + 1 : 1
}

function parseInstant(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    throw new ApiError(400, 'Date de créneau invalide.')
  }
  return date
}

function assertValidRange(startAt, endAt) {
  if (!(endAt > startAt)) {
    throw new ApiError(400, 'La fin du créneau doit être postérieure au début.')
  }
  if (endAt.getTime() - startAt.getTime() > 4 * 60 * 60 * 1000) {
    throw new ApiError(400, 'Un créneau ne peut pas dépasser 4 heures.')
  }
}

function overlaps(leftStart, leftEnd, rightStart, rightEnd) {
  return leftStart < rightEnd && rightStart < leftEnd
}

function listDoctorAvailabilitySlots(db, doctor) {
  return db
    .get('availabilitySlots')
    .filter({ doctorId: doctor.id })
    .value()
    .slice()
    .sort((left, right) => new Date(left.startAt) - new Date(right.startAt))
}

function createAvailabilitySlot(db, doctor, body = {}) {
  const startAt = parseInstant(body.startAt)
  const endAt = parseInstant(body.endAt)
  assertValidRange(startAt, endAt)

  if (startAt.getTime() < Date.now() - 60 * 1000) {
    throw new ApiError(400, 'Impossible de créer un créneau dans le passé.')
  }

  const slots = db.get('availabilitySlots')
  const conflict = slots
    .filter({ doctorId: doctor.id })
    .value()
    .some((slot) =>
      overlaps(startAt, endAt, new Date(slot.startAt), new Date(slot.endAt)),
    )

  if (conflict) {
    throw new ApiError(409, 'Un créneau existe déjà sur cette plage horaire.')
  }

  const created = {
    id: getNextId(slots.value()),
    doctorId: doctor.id,
    startAt: startAt.toISOString(),
    endAt: endAt.toISOString(),
    status: 'available',
    appointmentId: null,
  }

  slots.push(created).write()
  return created
}

function deleteAvailabilitySlot(db, doctor, slotId) {
  const id = Number(slotId)
  const slots = db.get('availabilitySlots')
  const slot = slots.find({ id, doctorId: doctor.id }).value()

  if (!slot) {
    throw new ApiError(404, 'Créneau introuvable.')
  }

  if (slot.status !== 'available' || slot.appointmentId) {
    throw new ApiError(409, 'Impossible de supprimer un créneau déjà réservé.')
  }

  slots.remove({ id: slot.id }).write()
  return { id: slot.id }
}

module.exports = {
  listDoctorAvailabilitySlots,
  createAvailabilitySlot,
  deleteAvailabilitySlot,
}
