const { ApiError } = require('../utils/apiError')

// Ce service porte toute la logique métier des rendez-vous : réservation,
// confirmation, refus, annulation, liste des rendez-vous d'un médecin.
// Chaque fonction manipule `db` (app.db, l'accès direct à db.json) et ne
// fait jamais d'appel HTTP interne — c'est une règle de l'issue #7.
//
// bookAppointment (issue #8), confirmAppointment (issue #9),
// refuseAppointment (issue #10), cancelAppointment (issue #11) et
// listDoctorAppointments (issue #12) sont implémentées. La logique
// restante arrive avec l'issue #13 (créneaux).

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

// Refuse un rendez-vous en attente (issue #10).
//
// Contrairement à confirmAppointment, ici le créneau associé doit être
// libéré : il redevient "available" et perd sa référence au rendez-vous
// (appointmentId remis à null), pour qu'un autre patient puisse le
// réserver.
function refuseAppointment(db, doctor, appointmentId) {
  const appointment = findAppointmentOrThrow(db, appointmentId)

  if (appointment.doctorId !== doctor.id) {
    throw new ApiError(403, "Ce rendez-vous n'est pas associé à ce médecin.")
  }

  if (appointment.status !== 'pending') {
    throw new ApiError(
      409,
      `Ce rendez-vous ne peut pas être refusé depuis son statut actuel (${appointment.status}).`,
    )
  }

  const updatedAt = new Date().toISOString()

  const updatedAppointment = db
    .get('appointments')
    .find({ id: appointment.id })
    .assign({ status: 'refused', updatedAt })
    .write()

  db.get('availabilitySlots')
    .find({ id: appointment.slotId })
    .assign({ status: 'available', appointmentId: null })
    .write()

  return updatedAppointment
}

// Annule un rendez-vous, à la demande du patient propriétaire (issue #11).
//
// Contrairement à confirm/refuse (réservés au médecin), c'est ici le
// patient (appointment.userId) qui doit être le demandeur. Un rendez-vous
// `pending` OU `confirmed` peut être annulé, mais seulement si le créneau
// n'est pas déjà passé — on ne permet pas d'annuler après coup un
// rendez-vous déjà entamé ou terminé.
function cancelAppointment(db, patientId, appointmentId) {
  const appointment = findAppointmentOrThrow(db, appointmentId)

  if (appointment.userId !== patientId) {
    throw new ApiError(403, 'Ce rendez-vous ne vous appartient pas.')
  }

  if (!['pending', 'confirmed'].includes(appointment.status)) {
    throw new ApiError(
      409,
      `Ce rendez-vous ne peut pas être annulé depuis son statut actuel (${appointment.status}).`,
    )
  }

  const slot = db
    .get('availabilitySlots')
    .find({ id: appointment.slotId })
    .value()

  if (slot && new Date(slot.startAt).getTime() <= Date.now()) {
    throw new ApiError(
      409,
      'Ce rendez-vous ne peut plus être annulé : le créneau est déjà passé.',
    )
  }

  const updatedAt = new Date().toISOString()

  const updatedAppointment = db
    .get('appointments')
    .find({ id: appointment.id })
    .assign({ status: 'cancelled', updatedAt })
    .write()

  if (slot) {
    db.get('availabilitySlots')
      .find({ id: slot.id })
      .assign({ status: 'available', appointmentId: null })
      .write()
  }

  return updatedAppointment
}

// Liste les rendez-vous du médecin connecté (issue #12).
//
// `doctor` est déjà résolu par requireDoctorProfile avant d'arriver ici
// (voir doctorAppointmentsRoute.js) : la résolution JWT → doctors.userId,
// le refus 403 d'un patient, et l'erreur si le profil médecin est
// manquant sont donc déjà gérés en amont, dans la route. Cette fonction
// n'a plus qu'à filtrer par doctorId — pas d'accès à l'agenda d'un autre
// médecin possible, quel que soit ce qu'un client enverrait.
function listDoctorAppointments(db, doctor) {
  return db.get('appointments').filter({ doctorId: doctor.id }).value()
}

module.exports = {
  bookAppointment,
  confirmAppointment,
  refuseAppointment,
  cancelAppointment,
  listDoctorAppointments,
}
