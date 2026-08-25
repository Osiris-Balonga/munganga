const { ApiError } = require('../utils/apiError')

// Ce service portera toute la logique métier des rendez-vous : réservation,
// confirmation, refus, annulation, liste des rendez-vous d'un médecin.
// Chaque fonction manipule `db` (app.db, l'accès direct à db.json) et ne
// fait jamais d'appel HTTP interne — c'est une règle de l'issue #7.
//
// Pour l'instant (issue #7 : structurer le serveur), ces fonctions ne
// sont que des squelettes. La vraie logique sera ajoutée route par route
// dans les issues #9 (confirm), #10 (refuse), #11 (cancel), #12 (liste
// médecin) et #13 (book / gestion des créneaux).

function bookAppointment(_db, _patientId, _input) {
  throw new ApiError(
    501,
    'Route métier préparée mais non implémentée dans le socle initial.',
  )
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
