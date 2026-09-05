const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')

const { createApp } = require('../server.js')

// On travaille sur une copie jetable de db.json, pour que les écritures
// faites par un test (ex. POST /api/book) ne polluent jamais le vrai
// fichier ni les autres tests.
function createTestDbPath() {
  const source = path.resolve(__dirname, '..', 'db.json')
  const destination = path.join(
    os.tmpdir(),
    `munganga-test-db-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  )
  fs.copyFileSync(source, destination)
  return destination
}

// Reproduit exactement la forme du token émis par json-server-auth au
// login : payload { email }, id utilisateur dans la claim "sub" (voir
// node_modules/json-server-auth/dist/users.js). C'est le format que la
// review de la PR #7 a signalé comme différent de ce qu'on supposait.
function signTokenFor(userId, email) {
  return jwt.sign({ email }, JWT_SECRET_KEY, { subject: String(userId) })
}

async function startTestServer(overrides = {}) {
  const dbPath = createTestDbPath()
  const app = createApp(dbPath, overrides)

  return new Promise((resolve) => {
    // Port 0 : le système attribue un port libre, pour ne jamais entrer
    // en conflit avec un serveur de développement déjà lancé.
    const server = app.listen(0, () => {
      const { port } = server.address()
      resolve({
        baseUrl: `http://127.0.0.1:${port}`,
        close: () => new Promise((closed) => server.close(() => closed())),
        dbPath,
      })
    })
  })
}

test('GET /api/doctor/appointments sans JWT renvoie 401', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const response = await fetch(`${baseUrl}/api/doctor/appointments`)
    assert.equal(response.status, 401)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('un patient sur une route réservée aux médecins reçoit 403', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // Alice (id 1) est un patient dans le jeu de données de démo.
    const token = signTokenFor(1, 'alice.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/doctor/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 403)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('un médecin valide atteint le service (pas bloqué par 401/403)', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // Dr Makaya (id 10) est un médecin dans le jeu de données de démo —
    // c'est exactement le compte utilisé dans le rapport de bug de la
    // review (sub: "10", role absent du JWT).
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/doctor/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    // listDoctorAppointments est désormais implémentée (issue #12) : la
    // couverture détaillée de son comportement vit dans
    // tests/doctor-appointments.test.js. Ce test-ci reste centré sur son
    // objet d'origine — l'autorisation laisse bien passer un vrai
    // médecin, ce qui était cassé avant le correctif JWT.
    assert.equal(response.status, 200)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('POST /api/book utilise le véritable userId du patient connecté', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // Junior (id 2) est un second patient de démo, pour ne pas dépendre
    // d'un état déjà modifié par un autre test sur Alice (id 1).
    const token = signTokenFor(2, 'junior.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/book`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slotId: 5, reason: 'Contrôle de routine' }),
    })

    assert.equal(response.status, 201)
    const appointment = await response.json()
    assert.equal(appointment.userId, 2)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('PATCH /api/appointments/:id/cancel transmet le véritable userId au service', async () => {
  // cancelAppointment n'est pas encore implémentée (issue #11) : c'est un
  // stub qui renvoie toujours 501, quels que soient ses arguments. Un test
  // qui se contente de vérifier le code 501 ne prouverait donc rien sur
  // l'identité transmise — il resterait vert même si la route repassait
  // accidentellement `request.auth.id` (undefined) au lieu de `userId`.
  //
  // On injecte ici un faux service qui espionne ses arguments et répond
  // avec succès, pour observer précisément ce que la route lui transmet.
  const realAppointmentsService = require('../server/services/appointmentsService')
  const calls = []
  const fakeAppointmentsService = {
    ...realAppointmentsService,
    cancelAppointment(_db, patientId, appointmentId) {
      calls.push({ patientId, appointmentId })
      return {
        id: Number(appointmentId),
        userId: patientId,
        status: 'cancelled',
      }
    },
  }

  const { baseUrl, close, dbPath } = await startTestServer({
    appointmentsService: fakeAppointmentsService,
  })

  try {
    const token = signTokenFor(1, 'alice.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/1/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 200)
    const appointment = await response.json()
    assert.equal(appointment.userId, 1)

    // L'assertion demandée par la review : le service a bien été appelé
    // avec userId === 1 (l'id d'Alice), pas request.auth.id (undefined
    // avec la forme réelle du JWT) ni une autre valeur accidentelle.
    assert.equal(calls.length, 1)
    assert.equal(calls[0].patientId, 1)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})
