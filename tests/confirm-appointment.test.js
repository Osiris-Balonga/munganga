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

test('un médecin confirme un rendez-vous pending qui lui est associé', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // db.json de démo : appointment id=1 a doctorId=1, status "pending".
    // Dr Makaya (userId=10, doctors.id=1) est bien ce médecin.
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/1/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 200)
    const appointment = await response.json()
    assert.equal(appointment.status, 'confirmed')
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('la confirmation laisse le créneau associé "unavailable"', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    await fetch(`${baseUrl}/api/appointments/1/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    // Vérifie l'état réel du créneau après confirmation, via la route
    // GET publique — pas d'accès direct au fichier de test, on teste
    // le même chemin qu'un vrai client de l'API.
    const slotResponse = await fetch(`${baseUrl}/availabilitySlots/2`)
    const slot = await slotResponse.json()

    assert.equal(slot.status, 'unavailable')
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test("un médecin ne peut pas confirmer le rendez-vous d'un confrère", async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // Dr Makaya (doctors.id=1) tente de confirmer le rendez-vous 2, qui
    // appartient au doctorId=2 dans le jeu de données de démo.
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/2/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 403)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('confirmer un rendez-vous déjà confirmé renvoie 409', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const first = await fetch(`${baseUrl}/api/appointments/1/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.equal(first.status, 200)

    const second = await fetch(`${baseUrl}/api/appointments/1/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })
    assert.equal(second.status, 409)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('confirmer un rendez-vous inexistant renvoie 404', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/appointments/99999/confirm`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 404)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})
