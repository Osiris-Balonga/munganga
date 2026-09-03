const { ApiError } = require('../utils/apiError')

function findDoctorClinicId(db, doctorId) {
  const doctor = db.get('doctors').find({ id: doctorId }).value()
  return doctor ? doctor.clinicId : null
}

function findDoctorAppointment(db, doctor, appointmentId) {
  const id = Number(appointmentId)
  const appointment = db
    .get('appointments')
    .find({ id, doctorId: doctor.id })
    .value()

  if (!appointment) {
    throw new ApiError(404, 'Rendez-vous introuvable.')
  }

  return appointment
}

function enrichAppointment(db, appointment) {
  const user = db.get('users').find({ id: appointment.userId }).value()
  const slot = db.get('availabilitySlots').find({ id: appointment.slotId }).value()
  const clinic = db.get('clinics').find({ id: appointment.clinicId }).value()

  return {
    id: appointment.id,
    userId: appointment.userId,
    doctorId: appointment.doctorId,
    clinicId: appointment.clinicId,
    slotId: appointment.slotId,
    status: appointment.status,
    reason: appointment.reason,
    createdAt: appointment.createdAt,
    updatedAt: appointment.updatedAt,
    patientName: user ? `${user.firstName} ${user.lastName}` : 'Patient inconnu',
    phone: user?.phone ?? '',
    startAt: slot?.startAt ?? appointment.createdAt,
    endAt: slot?.endAt ?? appointment.createdAt,
    clinic: clinic?.name ?? '',
    district: clinic?.district ?? '',
  }
}

function bookAppointment(db, patientId, input) {
  const slotId = input && input.slotId

  if (!slotId) {
    throw new ApiError(400, 'Le champ slotId est requis.')
  }

  const slot = db.get('availabilitySlots').find({ id: slotId }).value()

  if (!slot) {
    throw new ApiError(404, 'Créneau introuvable.')
  }

  if (slot.status !== 'available') {
    throw new ApiError(409, "Ce créneau n'est plus disponible.")
  }

  const createdAt = new Date().toISOString()

  const appointment = db
    .get('appointments')
    .insert({
      userId: patientId,
      doctorId: slot.doctorId,
      clinicId: findDoctorClinicId(db, slot.doctorId),
      slotId: slot.id,
      status: 'pending',
      reason: typeof input.reason === 'string' ? input.reason : '',
      createdAt,
      updatedAt: createdAt,
    })
    .write()

  db.get('availabilitySlots')
    .find({ id: slot.id })
    .assign({ status: 'unavailable', appointmentId: appointment.id })
    .write()

  return enrichAppointment(db, appointment)
}

function listDoctorAppointments(db, doctor) {
  return db
    .get('appointments')
    .filter({ doctorId: doctor.id })
    .value()
    .map((appointment) => enrichAppointment(db, appointment))
    .sort((left, right) => new Date(left.startAt) - new Date(right.startAt))
}

function confirmAppointment(db, doctor, appointmentId) {
  const appointment = findDoctorAppointment(db, doctor, appointmentId)

  if (appointment.status !== 'pending') {
    throw new ApiError(
      409,
      'Seules les demandes en attente peuvent être confirmées.',
    )
  }

  const updatedAt = new Date().toISOString()

  db.get('appointments')
    .find({ id: appointment.id })
    .assign({ status: 'confirmed', updatedAt })
    .write()

  return enrichAppointment(db, { ...appointment, status: 'confirmed', updatedAt })
}

function refuseAppointment(db, doctor, appointmentId) {
  const appointment = findDoctorAppointment(db, doctor, appointmentId)

  if (appointment.status !== 'pending') {
    throw new ApiError(
      409,
      'Seules les demandes en attente peuvent être refusées.',
    )
  }

  const updatedAt = new Date().toISOString()

  db.get('appointments')
    .find({ id: appointment.id })
    .assign({ status: 'refused', updatedAt })
    .write()

  if (appointment.slotId) {
    db.get('availabilitySlots')
      .find({ id: appointment.slotId })
      .assign({ status: 'available', appointmentId: null })
      .write()
  }

  return enrichAppointment(db, { ...appointment, status: 'refused', updatedAt })
}

function cancelAppointment(_db, _patientId, _appointmentId) {
  throw new ApiError(
    501,
    'Route métier préparée mais non implémentée dans le socle initial.',
  )
}

module.exports = {
  bookAppointment,
  confirmAppointment,
  refuseAppointment,
  cancelAppointment,
  listDoctorAppointments,
}
