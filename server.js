const path = require('node:path')
const jsonServer = require('json-server')
const auth = require('json-server-auth')
require('dotenv').config()

const { requireJwt } = require('./server/middlewares/requireJwt')
const { errorHandler } = require('./server/utils/apiError')
const { registerBookRoute } = require('./server/routes/bookRoute')
const {
  registerAppointmentActionsRoute,
} = require('./server/routes/appointmentActionsRoute')
const {
  registerDoctorAppointmentsRoute,
} = require('./server/routes/doctorAppointmentsRoute')
const {
  createSimulatedNotificationService,
} = require('./server/services/notificationService')

// Construit l'application Express/json-server. Extrait dans une fonction
// (plutôt qu'exécuté directement au chargement du fichier) pour que les
// tests HTTP puissent démarrer un serveur isolé sur une base de test et un
// port de test, sans dupliquer le branchement des routes ni des middlewares.
//
// `overrides.appointmentsService`, si fourni, remplace le vrai service dans
// toutes les routes métier — utilisé par les tests pour espionner les
// arguments reçus par une fonction encore non implémentée (ex. cancel).
function createApp(dbPath = path.join(__dirname, 'db.json'), overrides = {}) {
  const app = jsonServer.create()
  const router = jsonServer.router(dbPath)
  const defaults = jsonServer.defaults()
  const rules = require('./routes.json')

  app.db = router.db
  app.use(defaults)
  app.use(jsonServer.bodyParser)

  // Ordre obligatoire : règles de réécriture, authentification, puis router.
  app.use(auth.rewriter(rules))

  app.post(['/register', '/signup'], (request, _response, next) => {
    request.body.role = 'patient'
    next()
  })

  app.use(auth)

  const notificationService =
    overrides.notificationService || createSimulatedNotificationService()

  // Routes métier : chaque module s'enregistre lui-même sur `app` et reçoit
  // le middleware requireJwt centralisé en dépendance (voir issue #7).
  // `services` reste undefined en production : chaque route retombe alors
  // sur son import par défaut du vrai appointmentsService.
  registerBookRoute(app, {
    requireJwt,
    services: overrides.appointmentsService,
    notificationService,
  })
  registerAppointmentActionsRoute(app, {
    requireJwt,
    services: overrides.appointmentsService,
    notificationService,
  })
  registerDoctorAppointmentsRoute(app, {
    requireJwt,
    services: overrides.appointmentsService,
  })

  app.use(
    [
      '/appointments',
      '/appointments/*',
      '/availabilitySlots',
      '/availabilitySlots/*',
    ],
    (request, response, next) => {
      if (
        request.method === 'GET' ||
        request.method === 'HEAD' ||
        request.method === 'OPTIONS'
      ) {
        return next()
      }

      return response.status(405).json({
        message:
          'Utilisez une route /api métier pour modifier les rendez-vous ou les créneaux.',
      })
    },
  )

  app.use(router)

  // Gestionnaire d'erreur centralisé : toute erreur passée à next(error)
  // dans une route métier finit ici avec un format JSON cohérent.
  app.use(errorHandler)

  return app
}

// Ne démarre le serveur que si ce fichier est exécuté directement
// (`node server.js`), pas quand il est importé par les tests.
if (require.main === module) {
  const port = Number(process.env.PORT || 3001)
  createApp().listen(port, () => {
    console.log(`API Munganga disponible sur http://localhost:${port}`)
  })
}

module.exports = { createApp }
