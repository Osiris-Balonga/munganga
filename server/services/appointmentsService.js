const { ApiError } = require('../utils/apiError')

// Ce service porte toute la logique métier des rendez-vous : réservation,
// confirmation, refus, annulation, liste des rendez-vous d'un médecin.
// Chaque fonction manipule `db` (app.db, l'accès direct à db.json) et ne
// fait jamais d'appel HTTP interne — c'est une règle de l'issue #7.
//
// bookAppointment est implémentée (issue #8). Les autres fonctions restent
// des squelettes ; la logique arrive avec les issues #9 (confirm),
// #10 (refuse), #11 (cancel), #12 (liste médecin) et #13 (créneaux).

// Réserve un créneau pour le patient connecté (issue #8).
//
// Toutes les lectures/écritures ci-dessous sont synchrones (lowdb v1, la
// base utilisée par json-server) : aucun `await` n'intervient entre la
// vérification du créneau et son verrouillage. Node.js étant mono-thread,
// aucune autre requête ne peut s'intercaler pendant cette fonction — c'est
// ce qui rend la transition "atomique" comme demandé par l'issue.
function bookAppointment(db, patientId, input) {
  const slotId = input && input.slotId

  if (!slotId) {
    throw new ApiError(400, 'Le champ slotId est requis.')
  }

  const slot = db.get('availabilitySlots').find({ id: slotId }).value()

  if (!slot) {
    throw new ApiError(404, 'Créneau introuvable.')
  }

  // Conflit concurrent : quelqu'un d'autre a réservé ce créneau entre le
  // moment où le patient l'a vu côté frontend et sa demande de réservation.
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

  return appointment
}

// Le créneau ne porte pas directement le clinicId : on le retrouve via
// le médecin propriétaire du créneau (voir db.json : doctors.clinicId).
function findDoctorClinicId(db, doctorId) {
  const doctor = db.get('doctors').find({ id: doctorId }).value()
  return doctor ? doctor.clinicId : null
}

function confirmAppointment(_db, _doctor, _appointmentId) {
  throw new ApiError(
    501,
    'Route métier préparée mais non implémentée dans le socle initial.',
  )
}

function refuseAppointment(_db, _doctor, _appointmentId) {
  throw new ApiError(
    501,
    'Route métier préparée mais non implémentée dans le socle initial.',
  )
}

function cancelAppointment(_db, _patientId, _appointmentId) {
  throw new ApiError(
    501,
    'Route métier préparée mais non implémentée dans le socle initial.',
  )
}

function listDoctorAppointments(_db, _doctor) {
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
