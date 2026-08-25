const { bookAppointment } = require('../services/appointmentsService')

// Enregistre POST /api/book sur `app`. La route ne fait que : vérifier le
// JWT (via requireJwt), extraire les infos utiles de la requête, appeler
// le service, et transformer son résultat en réponse HTTP. Toute la
// logique métier (créneau disponible, création du rendez-vous...) vit
// dans appointmentsService.bookAppointment.
function registerBookRoute(app, { requireJwt }) {
  app.post('/api/book', requireJwt, (request, response, next) => {
    try {
      const patientId = request.auth.userId
      const appointment = bookAppointment(app.db, patientId, request.body)
      return response.status(201).json(appointment)
    } catch (error) {
      return next(error)
    }
  })
}

module.exports = { registerBookRoute }
