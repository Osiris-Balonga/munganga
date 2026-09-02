const appointmentsService = require('../services/appointmentsService')
const { requireDoctorProfile } = require('../services/doctorsService')

// Regroupe les 3 actions PATCH sur un rendez-vous existant. Confirm et
// refuse sont réservées au médecin concerné ; cancel est réservée au
// patient propriétaire du rendez-vous. Chaque route reste fine : elle
// résout qui fait la demande, puis délègue au service correspondant.
//
// `services` est injectable (par défaut, le vrai module) : ça permet aux
// tests de fournir un faux service pour vérifier précisément quels
// arguments la route lui transmet (voir tests/auth-contract.test.js,
// suite à la review demandant une assertion observable sur l'action
// "cancel").
function registerAppointmentActionsRoute(
  app,
  { requireJwt, services = appointmentsService, notificationService },
) {
  app.patch(
    '/api/appointments/:id/confirm',
    requireJwt,
    (request, response, next) => {
      try {
        const doctor = requireDoctorProfile(app.db, request.auth)
        const appointment = services.confirmAppointment(
          app.db,
          doctor,
          request.params.id,
        )
        notificationService.recordAppointmentEvent(
          app.db,
          'appointment.confirmed',
          appointment,
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
        const appointment = services.refuseAppointment(
          app.db,
          doctor,
          request.params.id,
        )
        notificationService.recordAppointmentEvent(
          app.db,
          'appointment.refused',
          appointment,
        )
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
        const appointment = services.cancelAppointment(
          app.db,
          patientId,
          request.params.id,
        )
        notificationService.recordAppointmentEvent(
          app.db,
          'appointment.cancelled',
          appointment,
        )
        return response.status(200).json(appointment)
      } catch (error) {
        return next(error)
      }
    },
  )
}

module.exports = { registerAppointmentActionsRoute }
