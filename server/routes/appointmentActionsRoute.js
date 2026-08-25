const {
  confirmAppointment,
  refuseAppointment,
  cancelAppointment,
} = require('../services/appointmentsService')
const { requireDoctorProfile } = require('../services/doctorsService')

// Regroupe les 3 actions PATCH sur un rendez-vous existant. Confirm et
// refuse sont réservées au médecin concerné ; cancel est réservée au
// patient propriétaire du rendez-vous. Chaque route reste fine : elle
// résout qui fait la demande, puis délègue au service correspondant.
function registerAppointmentActionsRoute(app, { requireJwt }) {
  app.patch(
    '/api/appointments/:id/confirm',
    requireJwt,
    (request, response, next) => {
      try {
        const doctor = requireDoctorProfile(app.db, request.auth)
        const appointment = confirmAppointment(
          app.db,
          doctor,
          request.params.id,
        )
        return response.status(200).json(appointment)
      } catch (error) {
        return next(error)
      }
    },
  )

  app.patch(
    '/api/appointments/:id/refuse',
    requireJwt,
    (request, response, next) => {
      try {
        const doctor = requireDoctorProfile(app.db, request.auth)
        const appointment = refuseAppointment(app.db, doctor, request.params.id)
        return response.status(200).json(appointment)
      } catch (error) {
        return next(error)
      }
    },
  )

  app.patch(
    '/api/appointments/:id/cancel',
    requireJwt,
    (request, response, next) => {
      try {
        const patientId = request.auth.userId
        const appointment = cancelAppointment(
          app.db,
          patientId,
          request.params.id,
        )
        return response.status(200).json(appointment)
      } catch (error) {
        return next(error)
      }
    },
  )
}

module.exports = { registerAppointmentActionsRoute }
