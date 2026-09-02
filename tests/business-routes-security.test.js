const assert = require('node:assert/strict')
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const test = require('node:test')
const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')

const { createApp } = require('../server.js')

function createTestDbPath() {
  const destination = path.join(
    os.tmpdir(),
    `munganga-business-routes-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  )
  fs.copyFileSync(path.resolve(__dirname, '..', 'db.json'), destination)
  return destination
}

function signTokenFor(userId, email) {
  return jwt.sign({ email }, JWT_SECRET_KEY, { subject: String(userId) })
}

async function withTestServer(run) {
  const dbPath = createTestDbPath()
  const server = await new Promise((resolve) => {
    const instance = createApp(dbPath).listen(0, () => resolve(instance))
  })
  const baseUrl = `http://127.0.0.1:${server.address().port}`

  try {
    await run({ baseUrl, dbPath })
  } finally {
    await new Promise((resolve) => server.close(resolve))
    fs.rmSync(dbPath, { force: true })
  }
}

test('un JWT invalide est refusé sur les routes métier', async () => {
  await withTestServer(async ({ baseUrl }) => {
    const response = await fetch(`${baseUrl}/api/book`, {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ceci-n-est-pas-un-jwt',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ slotId: 1 }),
    })

    assert.equal(response.status, 401)
  })
})

test('deux réservations concurrentes ne peuvent prendre le même créneau', async () => {
  await withTestServer(async ({ baseUrl, dbPath }) => {
    const headers = {
      Authorization: `Bearer ${signTokenFor(1, 'alice.patient@munganga.cg')}`,
      'Content-Type': 'application/json',
    }
    const reserve = (reason) =>
      fetch(`${baseUrl}/api/book`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ slotId: 1, reason }),
      })

    const responses = await Promise.all([
      reserve('Première demande'),
      reserve('Demande concurrente'),
    ])
    assert.deepEqual(responses.map(({ status }) => status).sort(), [201, 409])

    const database = JSON.parse(fs.readFileSync(dbPath, 'utf8'))
    const appointments = database.appointments.filter(
      ({ slotId }) => slotId === 1,
    )
    const slot = database.availabilitySlots.find(({ id }) => id === 1)

    assert.equal(appointments.length, 1)
    assert.equal(slot.status, 'unavailable')
    assert.equal(slot.appointmentId, appointments[0].id)
  })
})

test('toutes les écritures CRUD brutes sont bloquées', async () => {
  await withTestServer(async ({ baseUrl }) => {
    const token = signTokenFor(1, 'alice.patient@munganga.cg')
    const attempts = [
      ['POST', '/appointments'],
      ['PATCH', '/appointments/1'],
      ['DELETE', '/appointments/1'],
      ['POST', '/availabilitySlots'],
      ['PATCH', '/availabilitySlots/1'],
      ['DELETE', '/availabilitySlots/1'],
    ]

    for (const [method, resource] of attempts) {
      const response = await fetch(`${baseUrl}${resource}`, {
        method,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: method === 'DELETE' ? undefined : JSON.stringify({}),
      })

      assert.equal(response.status, 405, `${method} ${resource}`)
    }
  })
})
