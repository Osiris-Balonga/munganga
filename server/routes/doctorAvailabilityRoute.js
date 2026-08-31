const availabilityService = require('../services/availabilityService')
const { requireDoctorProfile } = require('../services/doctorsService')

function registerDoctorAvailabilityRoute(
  app,
  { requireJwt, services = availabilityService },
) {
  app.get(
    '/api/doctor/availability-slots',
    requireJwt,
    (request, response, next) => {
      try {
        const doctor = requireDoctorProfile(app.db, request.auth)
        const slots = services.listDoctorAvailabilitySlots(app.db, doctor)
        return response.status(200).json(slots)
      } catch (error) {
        return next(error)
      }
    },
  )

  app.post(
    '/api/doctor/availability-slots',
    requireJwt,
    (request, response, next) => {
      try {
        const doctor = requireDoctorProfile(app.db, request.auth)
        const slot = services.createAvailabilitySlot(
          app.db,
          doctor,
          request.body,
        )
        return response.status(201).json(slot)
      } catch (error) {
        return next(error)
      }
    },
  )

  app.delete(
    '/api/doctor/availability-slots/:id',
    requireJwt,
    (request, response, next) => {
      try {
        const doctor = requireDoctorProfile(app.db, request.auth)
        const result = services.deleteAvailabilitySlot(
          app.db,
          doctor,
          request.params.id,
        )
        return response.status(200).json(result)
      } catch (error) {
        return next(error)
      }
    },
  )
}

module.exports = { registerDoctorAvailabilityRoute }
