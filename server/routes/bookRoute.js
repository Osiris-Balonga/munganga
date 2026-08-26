const appointmentsService = require('../services/appointmentsService')

// Enregistre POST /api/book sur `app`. La route ne fait que : vérifier le
// JWT (via requireJwt), extraire les infos utiles de la requête, appeler
// le service, et transformer son résultat en réponse HTTP. Toute la
// logique métier (créneau disponible, création du rendez-vous...) vit
// dans appointmentsService.bookAppointment.
//
// `services` est injectable (par défaut, le vrai module) : ça permet aux
// tests de fournir un faux service pour vérifier précisément quels
// arguments la route lui transmet, sans dépendre du comportement réel
// de la logique métier.
function registerBookRoute(
  app,
  { requireJwt, services = appointmentsService },
) {
  app.post('/api/book', requireJwt, (request, response, next) => {
    try {
      const patientId = request.auth.userId
      const appointment = services.bookAppointment(
        app.db,
        patientId,
        request.body,
      )
      return response.status(201).json(appointment)
    } catch (error) {
      return next(error)
    }
  })
}

module.exports = { registerBookRoute }
