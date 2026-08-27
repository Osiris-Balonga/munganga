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
function createTestDbPath() {
  const source = path.resolve(__dirname, '..', 'db.json')
  const destination = path.join(
    os.tmpdir(),
    `munganga-test-db-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  )
  fs.copyFileSync(source, destination)
  return destination
}

function signTokenFor(userId, email) {
  return jwt.sign({ email }, JWT_SECRET_KEY, { subject: String(userId) })
}

async function startTestServer(overrides = {}) {
  const dbPath = createTestDbPath()
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

test('un médecin refuse un rendez-vous pending qui lui est associé', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // db.json de démo : appointment id=1 a doctorId=1, status "pending".
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/1/refuse`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 200)
    const appointment = await response.json()
    assert.equal(appointment.status, 'refused')
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('le refus libère le créneau associé (available, appointmentId null)', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    await fetch(`${baseUrl}/api/appointments/1/refuse`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    // appointment 1 est lié au slot 2 dans le jeu de données de démo.
    const slotResponse = await fetch(`${baseUrl}/availabilitySlots/2`)
    const slot = await slotResponse.json()

    assert.equal(slot.status, 'available')
    assert.equal(slot.appointmentId, null)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test("un médecin ne peut pas refuser le rendez-vous d'un confrère", async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // Dr Makaya (doctors.id=1) tente de refuser le rendez-vous 2, qui
    // appartient au doctorId=2 dans le jeu de données de démo.
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/2/refuse`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 403)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('refuser un rendez-vous déjà traité renvoie 409', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const first = await fetch(`${baseUrl}/api/appointments/1/refuse`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.equal(first.status, 200)

    const second = await fetch(`${baseUrl}/api/appointments/1/refuse`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.equal(second.status, 409)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('refuser un rendez-vous inexistant renvoie 404', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/99999/refuse`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 404)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})
