const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')

const { createApp } = require('../server.js')

function createTestDbPath() {
  const source = path.resolve(__dirname, '..', 'db.json')
  const destination = path.join(
    os.tmpdir(),
    `munganga-avail-db-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  )
  fs.copyFileSync(source, destination)
  return destination
}

function signTokenFor(userId, email) {
  return jwt.sign({ email }, JWT_SECRET_KEY, { subject: String(userId) })
}

async function startTestServer() {
  const dbPath = createTestDbPath()
  const app = createApp(dbPath)

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

function futureRange(dayOffset, durationMinutes = 30) {
  // Ancre fixe loin dans le futur pour éviter tout chevauchement
  // avec les créneaux historiques de db.json (août 2026) ou d'autres tests.
  const start = new Date(Date.UTC(2027, 5, 15 + dayOffset, 10, 0, 0))
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000)
  return { startAt: start.toISOString(), endAt: end.toISOString() }
}

test('GET /api/doctor/availability-slots : le propriétaire ne voit que ses créneaux', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')
    const response = await fetch(`${baseUrl}/api/doctor/availability-slots`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 200)
    const slots = await response.json()
    assert.ok(Array.isArray(slots))
    assert.ok(slots.length > 0)
    assert.ok(slots.every((slot) => slot.doctorId === 1))
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('GET /api/doctor/availability-slots : un autre médecin ne voit pas les créneaux du premier', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(11, 'dr.okemba@munganga.cg')
    const response = await fetch(`${baseUrl}/api/doctor/availability-slots`, {
      headers: { Authorization: `Bearer ${token}` },
    })

    assert.equal(response.status, 200)
    const slots = await response.json()
    assert.ok(Array.isArray(slots))
    assert.ok(slots.every((slot) => slot.doctorId === 2))
    assert.ok(slots.every((slot) => slot.doctorId !== 1))
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('POST /api/doctor/availability-slots : le propriétaire peut créer un créneau futur', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')
    const body = futureRange(0, 30)

    const response = await fetch(`${baseUrl}/api/doctor/availability-slots`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    assert.equal(response.status, 201)
    const created = await response.json()
    assert.equal(created.doctorId, 1)
    assert.equal(created.status, 'available')
    assert.equal(created.appointmentId, null)
    assert.equal(created.startAt, body.startAt)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('POST /api/doctor/availability-slots : chevauchement → 409', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')
    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
    const body = futureRange(1, 30)

    const first = await fetch(`${baseUrl}/api/doctor/availability-slots`, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    })
    assert.equal(first.status, 201)

    const overlap = await fetch(`${baseUrl}/api/doctor/availability-slots`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        startAt: body.startAt,
        endAt: body.endAt,
      }),
    })
    assert.equal(overlap.status, 409)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('DELETE /api/doctor/availability-slots/:id : suppression d’un créneau réservé → 409', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const token = signTokenFor(10, 'dr.makaya@munganga.cg')
    // Slot id=2 is unavailable + linked to appointment 1 in db.json demo data.
    const response = await fetch(
      `${baseUrl}/api/doctor/availability-slots/2`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      },
    )

    assert.equal(response.status, 409)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})

test('DELETE /api/doctor/availability-slots/:id : un autre médecin ne peut pas supprimer un créneau étranger', async () => {
  const { baseUrl, close, dbPath } = await startTestServer()

  try {
    const ownerToken = signTokenFor(10, 'dr.makaya@munganga.cg')
    const otherToken = signTokenFor(11, 'dr.okemba@munganga.cg')
    const body = futureRange(2, 30)

    const createdResponse = await fetch(
      `${baseUrl}/api/doctor/availability-slots`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${ownerToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      },
    )
    assert.equal(createdResponse.status, 201)
    const created = await createdResponse.json()

    const deleteResponse = await fetch(
      `${baseUrl}/api/doctor/availability-slots/${created.id}`,
      {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${otherToken}` },
      },
    )

    assert.equal(deleteResponse.status, 404)
  } finally {
    await close()
    fs.rmSync(dbPath, { force: true })
  }
})
