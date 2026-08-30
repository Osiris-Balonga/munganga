const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')

const { createApp } = require('../server.js')

// Voir tests/auth-contract.test.js pour le détail de ces choix (copie de
// base jetable, forme réelle du JWT, port 0 pour le serveur de test).
//
// Particularité de cette suite : les créneaux du jeu de données de démo
// (db.json) sont datés du 20 au 22 août 2026, donc déjà DANS LE PASSÉ au
// moment où ces tests tournent. C'est en fait pratique pour tester le
// rejet d'un créneau passé sans rien modifier — mais pour tester le cas
// de succès (annulation d'un rendez-vous à venir), on doit avancer la
// date d'un créneau dans la copie de test avant de démarrer le serveur.
function createTestDbPath({ futureSlotId } = {}) {
  const source = path.resolve(__dirname, '..', 'db.json')
  const destination = path.join(
    os.tmpdir(),
    `munganga-test-db-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  )

  if (futureSlotId === undefined) {
    fs.copyFileSync(source, destination)
    return destination
  }

  const data = JSON.parse(fs.readFileSync(source, 'utf8'))
  const slot = data.availabilitySlots.find((item) => item.id === futureSlotId)
  if (slot) {
    slot.startAt = '2027-08-20T08:00:00+01:00'
    slot.endAt = '2027-08-20T08:30:00+01:00'
  }
  fs.writeFileSync(destination, JSON.stringify(data, null, 2))
  return destination
}

function signTokenFor(userId, email) {
  return jwt.sign({ email }, JWT_SECRET_KEY, { subject: String(userId) })
}

async function startTestServer({ overrides = {}, futureSlotId } = {}) {
  const dbPath = createTestDbPath({ futureSlotId })
  const app = createApp(dbPath, overrides)

  return new Promise((resolve) => {
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

test('le patient propriétaire annule un rendez-vous pending à venir', async () => {
  // appointment id=1 -> slotId=2, userId=1, status "pending" dans la démo.
  const { baseUrl, close, dbPath } = await startTestServer({
    futureSlotId: 2,
  })

  try {
    const token = signTokenFor(1, 'alice.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/1/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 200)
    const appointment = await response.json()
    assert.equal(appointment.status, 'cancelled')
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test("l'annulation libère le créneau associé (available, appointmentId null)", async () => {
  const { baseUrl, close, dbPath } = await startTestServer({
    futureSlotId: 2,
  })

  try {
    const token = signTokenFor(1, 'alice.patient@munganga.cg')

    await fetch(`${baseUrl}/api/appointments/1/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    const slotResponse = await fetch(`${baseUrl}/availabilitySlots/2`)
    const slot = await slotResponse.json()

    assert.equal(slot.status, 'available')
    assert.equal(slot.appointmentId, null)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test("un patient ne peut pas annuler le rendez-vous d'un autre patient", async () => {
  const { baseUrl, close, dbPath } = await startTestServer({
    futureSlotId: 2,
  })

  try {
    // appointment id=1 appartient à userId=1 ; on tente avec userId=2.
    const token = signTokenFor(2, 'junior.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/1/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 403)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('annuler un rendez-vous dont le créneau est déjà passé renvoie 409', async () => {
  // On n'avance aucune date ici : appointment id=2 (userId=2, "confirmed")
  // pointe vers un créneau daté du 21 août 2026, déjà dans le passé au
  // moment où ces tests tournent — aucune modification nécessaire.
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(2, 'junior.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/2/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 409)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('annuler un rendez-vous déjà annulé renvoie 409', async () => {
  // appointment id=3 a déjà status "cancelled" dans le jeu de données.
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(1, 'alice.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/3/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 409)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('annuler un rendez-vous inexistant renvoie 404', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(1, 'alice.patient@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/99999/cancel`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 404)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})
