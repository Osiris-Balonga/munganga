const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')

const { createApp } = require('../server.js')

// Voir tests/auth-contract.test.js pour le détail de ces choix.
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

test('un médecin ne voit que ses propres rendez-vous', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    // Dr Makaya (userId=10, doctors.id=1) : dans le jeu de données de
    // démo, seul l'appointment id=1 a doctorId=1.
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')

    const response = await fetch(`${baseUrl}/api/doctor/appointments`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 200)
    const appointments = await response.json()

    assert.ok(Array.isArray(appointments))
    assert.ok(appointments.length > 0)
    assert.ok(appointments.every((item) => item.doctorId === 1))
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('un patient reçoit 403 sur cette route', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
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

test('sans JWT, la route renvoie 401', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const response = await fetch(`${baseUrl}/api/doctor/appointments`)
    assert.equal(response.status, 401)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})
