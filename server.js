const path = require('node:path')
const jsonServer = require('json-server')
const auth = require('json-server-auth')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')
const jwt = require('jsonwebtoken')
require('dotenv').config()

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

function requireJwt(request, response, next) {
  const authorization = request.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authentification requise.' })
  }

  try {
    request.auth = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] })
    return next()
  } catch {
    return response.status(401).json({ message: 'Session invalide ou expirée.' })
  }
}

const plannedBusinessRoutes = [
  ['post', '/api/book'],
  ['patch', '/api/appointments/:id/confirm'],
  ['patch', '/api/appointments/:id/refuse'],
  ['patch', '/api/appointments/:id/cancel'],
  ['get', '/api/doctor/appointments'],
]

plannedBusinessRoutes.forEach(([method, route]) => {
  app[method](route, requireJwt, (_request, response) => {
    response.status(501).json({
      message: 'Route métier préparée mais non implémentée dans le socle initial.',
    })
  })
})

app.use(['/appointments', '/appointments/*', '/availabilitySlots', '/availabilitySlots/*'], (request, response, next) => {
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return next()
  }

  return response.status(405).json({
    message: 'Utilisez une route /api métier pour modifier les rendez-vous ou les créneaux.',
  })
})

app.use(router)

app.listen(port, () => {
  console.log(`API Munganga disponible sur http://localhost:${port}`)
})
