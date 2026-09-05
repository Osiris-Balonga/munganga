/**
 * Validation workflow — espace praticien (issues #13, #18, #19, #21).
 * Exécuter : node scripts/validate-doctor-workspace.js
 */
const fs = require('node:fs')
const os = require('node:os')
const path = require('node:path')
const { createApp } = require('../server.js')

const PASSWORD = 'Munganga2026!'

function createTempDbPath() {
  const source = path.resolve(__dirname, '..', 'db.json')
  const destination = path.join(
    os.tmpdir(),
    `munganga-validate-db-${Date.now()}-${Math.random().toString(36).slice(2)}.json`,
  )
  fs.copyFileSync(source, destination)
  return destination
}

async function login(baseUrl, email) {
  const response = await fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: PASSWORD }),
  })
  const body = await response.json()
  if (!response.ok) {
    throw new Error(
      `Login ${email} failed: ${response.status} ${JSON.stringify(body)}`,
    )
  }
  return body.accessToken
}

function assert(condition, message) {
  if (!condition) throw new Error(message)
}

async function main() {
  const dbPath = createTempDbPath()
  const app = createApp(dbPath)
  const server = app.listen(0)
  const { port } = server.address()
  const baseUrl = `http://127.0.0.1:${port}`
  const results = []
  let slotSequence = 0

  try {
    // 1) Sans JWT → 401 (pas de session factice côté API)
    {
      const response = await fetch(`${baseUrl}/api/doctor/appointments`)
      assert(
        response.status === 401,
        `Expected 401 without JWT, got ${response.status}`,
      )
      results.push('OK: GET /api/doctor/appointments sans JWT → 401')
    }

    // 2) Patient → 403
    {
      const patientToken = await login(baseUrl, 'alice.patient@munganga.cg')
      const response = await fetch(`${baseUrl}/api/doctor/appointments`, {
        headers: { Authorization: `Bearer ${patientToken}` },
      })
      assert(
        response.status === 403,
        `Expected 403 for patient, got ${response.status}`,
      )
      results.push('OK: patient sur route médecin → 403')
    }

    const doctorToken = await login(baseUrl, 'dr.makaya@munganga.cg')
    const auth = { Authorization: `Bearer ${doctorToken}` }

    // 3) Liste RDV métier
    {
      const response = await fetch(`${baseUrl}/api/doctor/appointments`, {
        headers: auth,
      })
      assert(
        response.status === 200,
        `Expected 200 doctor appointments, got ${response.status}`,
      )
      const list = await response.json()
      assert(Array.isArray(list), 'Appointments payload must be an array')
      assert(
        list.every((item) => item.doctorId === 1),
        'All appointments must belong to doctor 1',
      )
      results.push(`OK: GET /api/doctor/appointments → ${list.length} RDV`)
    }

    // 4) Disponibilités chargées à l’ouverture (GET métier)
    {
      const response = await fetch(`${baseUrl}/api/doctor/availability-slots`, {
        headers: auth,
      })
      assert(
        response.status === 200,
        `Expected 200 availability, got ${response.status}`,
      )
      const slots = await response.json()
      assert(Array.isArray(slots), 'Availability payload must be an array')
      assert(
        slots.every((slot) => slot.doctorId === 1),
        'All slots must belong to doctor 1',
      )
      results.push(
        `OK: GET /api/doctor/availability-slots → ${slots.length} créneaux`,
      )
    }

    // 5) Confirm / refuse + protection créneau réservé (parcours autonome)
    {
      async function createBookableSlot() {
        slotSequence += 1
        const start = new Date(
          Date.now() + slotSequence * 37 * 60 * 1000 + 4 * 24 * 60 * 60 * 1000,
        )
        start.setSeconds(0, 0)
        start.setMinutes(Math.floor(start.getMinutes() / 30) * 30, 0, 0)
        const end = new Date(start.getTime() + 30 * 60 * 1000)
        const createSlot = await fetch(
          `${baseUrl}/api/doctor/availability-slots`,
          {
            method: 'POST',
            headers: { ...auth, 'Content-Type': 'application/json' },
            body: JSON.stringify({
              startAt: start.toISOString(),
              endAt: end.toISOString(),
            }),
          },
        )
        const createBody = await createSlot.text()
        assert(
          createSlot.status === 201,
          `Create slot failed: ${createSlot.status} ${createBody}`,
        )
        return JSON.parse(createBody)
      }

      async function bookSlot(slotId, reason) {
        const patientToken = await login(baseUrl, 'alice.patient@munganga.cg')
        const book = await fetch(`${baseUrl}/api/book`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${patientToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ slotId, reason }),
        })
        const bookBody = await book.text()
        assert(book.status === 201, `Book failed: ${book.status} ${bookBody}`)
        return JSON.parse(bookBody)
      }

      const confirmSlot = await createBookableSlot()
      results.push(`OK: POST availability-slots → #${confirmSlot.id}`)

      const pending = await bookSlot(confirmSlot.id, 'Contrôle confirm')
      assert(
        pending.status === 'pending',
        `Booked appointment should be pending, got ${pending.status}`,
      )

      const confirmResponse = await fetch(
        `${baseUrl}/api/appointments/${pending.id}/confirm`,
        { method: 'PATCH', headers: auth },
      )
      assert(
        confirmResponse.status === 200,
        `Confirm failed: ${confirmResponse.status}`,
      )
      const confirmed = await confirmResponse.json()
      assert(
        confirmed.status === 'confirmed',
        'Appointment should be confirmed',
      )
      results.push(`OK: PATCH confirm #${pending.id}`)

      const refuseSlot = await createBookableSlot()
      results.push(`OK: POST availability-slots → #${refuseSlot.id}`)

      const booked = await bookSlot(refuseSlot.id, 'Contrôle refuse')

      const deleteReserved = await fetch(
        `${baseUrl}/api/doctor/availability-slots/${refuseSlot.id}`,
        { method: 'DELETE', headers: auth },
      )
      assert(
        deleteReserved.status === 409,
        `Reserved slot should be protected, got ${deleteReserved.status}`,
      )
      results.push('OK: DELETE créneau réservé → 409')

      const refuse = await fetch(
        `${baseUrl}/api/appointments/${booked.id}/refuse`,
        { method: 'PATCH', headers: auth },
      )
      assert(refuse.status === 200, `Refuse failed: ${refuse.status}`)
      results.push(`OK: PATCH refuse #${booked.id}`)

      const deleteFree = await fetch(
        `${baseUrl}/api/doctor/availability-slots/${refuseSlot.id}`,
        { method: 'DELETE', headers: auth },
      )
      assert(
        deleteFree.status === 200,
        `Delete free slot failed: ${deleteFree.status}`,
      )
      results.push(`OK: DELETE créneau libre #${refuseSlot.id}`)
    }

    // 6) CRUD direct /availabilitySlots bloqué (403 permissions ou 405 route métier)
    {
      const response = await fetch(`${baseUrl}/availabilitySlots`, {
        method: 'POST',
        headers: { ...auth, 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctorId: 1 }),
      })
      assert(
        [403, 405].includes(response.status),
        `Expected 403/405 on CRUD, got ${response.status}`,
      )
      results.push(`OK: POST /availabilitySlots → ${response.status}`)
    }

    // 7) Garde frontend : pas de token preview-doctor dans le code source
    {
      const root = path.join(__dirname, '..', 'src')
      const stack = [root]
      let hit = null
      while (stack.length) {
        const current = stack.pop()
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
          const full = path.join(current, entry.name)
          if (entry.isDirectory()) {
            stack.push(full)
            continue
          }
          if (!/\.(js|jsx|ts|tsx)$/.test(entry.name)) continue
          const text = fs.readFileSync(full, 'utf8')
          if (
            text.includes('preview-doctor') ||
            text.includes('ensureDoctorPreviewSession')
          ) {
            hit = full
            break
          }
        }
        if (hit) break
      }
      assert(!hit, `Preview session still referenced in ${hit}`)
      results.push('OK: aucune session preview-doctor dans src/')
    }

    console.log(results.join('\n'))
    console.log('\nValidation espace praticien : SUCCÈS')
  } finally {
    await new Promise((resolve) => server.close(resolve))
    fs.rmSync(dbPath, { force: true })
  }
}

main().catch((error) => {
  console.error('\nValidation espace praticien : ÉCHEC')
  console.error(error.message)
  process.exit(1)
})
