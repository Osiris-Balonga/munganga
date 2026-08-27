const { ApiError } = require('../utils/apiError')

// Ce service porte toute la logique métier des rendez-vous : réservation,
// confirmation, refus, annulation, liste des rendez-vous d'un médecin.
// Chaque fonction manipule `db` (app.db, l'accès direct à db.json) et ne
// fait jamais d'appel HTTP interne — c'est une règle de l'issue #7.
//
// bookAppointment (issue #8) et confirmAppointment (issue #9) sont
// implémentées. Les autres fonctions restent des squelettes ; la logique
// arrive avec les issues #10 (refuse), #11 (cancel), #12 (liste médecin)
// et #13 (créneaux).

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

// Confirme un rendez-vous en attente (issue #9).
//
// `doctor` est le profil médecin déjà résolu par requireDoctorProfile,
// PAS un simple id — ça permet de vérifier que le médecin connecté est
// bien celui associé au rendez-vous, sans requête supplémentaire.
function confirmAppointment(db, doctor, appointmentId) {
  const appointment = findAppointmentOrThrow(db, appointmentId)

  // Seul le médecin associé au rendez-vous peut le confirmer — pas un
  // autre médecin qui devinerait ou changerait l'id dans l'URL.
  if (appointment.doctorId !== doctor.id) {
    throw new ApiError(403, "Ce rendez-vous n'est pas associé à ce médecin.")
  }

  if (appointment.status !== 'pending') {
    throw new ApiError(
      409,
      `Ce rendez-vous ne peut pas être confirmé depuis son statut actuel (${appointment.status}).`,
    )
  }

  // Le créneau reste "unavailable" : seul le statut du rendez-vous change,
  // pas de mise à jour de availabilitySlots ici.
  return db
    .get('appointments')
    .find({ id: appointment.id })
    .assign({ status: 'confirmed', updatedAt: new Date().toISOString() })
    .write()
}

// Retrouve un rendez-vous par id, ou lève une 404. Le paramètre d'URL
// (request.params.id) arrive toujours en chaîne de caractères ; on le
// convertit ici pour matcher les id numériques stockés dans db.json.
function findAppointmentOrThrow(db, appointmentId) {
  const id = Number(appointmentId)
  const appointment = db.get('appointments').find({ id }).value()

  if (!appointment) {
    throw new ApiError(404, 'Rendez-vous introuvable.')
  }

  return appointment
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
