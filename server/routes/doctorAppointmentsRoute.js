const appointmentsService = require('../services/appointmentsService')
const { requireDoctorProfile } = require('../services/doctorsService')

// GET /api/doctor/appointments : le médecin n'est jamais passé dans
// l'URL ni dans le body — on le déduit toujours du token JWT connecté
// (request.auth), pour qu'un médecin ne puisse jamais lire l'agenda
// d'un confrère juste en changeant un paramètre.
//
// `services` est injectable (par défaut, le vrai module), par cohérence
// avec les autres routes métier — voir bookRoute.js.
function registerDoctorAppointmentsRoute(
  app,
  { requireJwt, services = appointmentsService },
) {
  app.get('/api/doctor/appointments', requireJwt, (request, response, next) => {
    try {
      const doctor = requireDoctorProfile(app.db, request.auth)
      const appointments = services.listDoctorAppointments(app.db, doctor)
      return response.status(200).json(appointments)
    } catch (error) {
      return next(error)
    }
  })
}

module.exports = { registerDoctorAppointmentsRoute }
