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

const app = jsonServer.create()
const router = jsonServer.router(path.join(__dirname, 'db.json'))
const defaults = jsonServer.defaults()
const rules = require('./routes.json')
const port = Number(process.env.PORT || 3001)

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

// Routes métier : chaque module s'enregistre lui-même sur `app` et reçoit
// le middleware requireJwt centralisé en dépendance (voir issue #7).
registerBookRoute(app, { requireJwt })
registerAppointmentActionsRoute(app, { requireJwt })
registerDoctorAppointmentsRoute(app, { requireJwt })

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

app.listen(port, () => {
  console.log(`API Munganga disponible sur http://localhost:${port}`)
})
