const fs = require('node:fs')
const path = require('node:path')

const root = path.resolve(__dirname, '..')
const packageJson = JSON.parse(
  fs.readFileSync(path.join(root, 'package.json'), 'utf8'),
)
const database = JSON.parse(fs.readFileSync(path.join(root, 'db.json'), 'utf8'))
const routes = JSON.parse(
  fs.readFileSync(path.join(root, 'routes.json'), 'utf8'),
)

const expectedCollections = [
  'users',
  'clinics',
  'doctors',
  'availabilitySlots',
  'appointments',
]
const expectedRules = {
  users: 600,
  clinics: 444,
  doctors: 644,
  availabilitySlots: 644,
  appointments: 600,
}

if (!/^0\.17\./.test(packageJson.dependencies['json-server'])) {
  throw new Error('json-server doit rester en version 0.17.x.')
}

if (
  JSON.stringify(Object.keys(database)) !== JSON.stringify(expectedCollections)
) {
  throw new Error(
    'Les collections de db.json ne correspondent pas au schéma figé.',
  )
}

for (const [resource, rule] of Object.entries(expectedRules)) {
  if (routes[resource] !== rule)
    throw new Error(`Permission incorrecte pour ${resource}.`)
}

for (const appointment of database.appointments) {
  if (
    !Object.hasOwn(appointment, 'userId') ||
    Object.hasOwn(appointment, 'patientId')
  ) {
    throw new Error(
      'Chaque rendez-vous doit utiliser userId et jamais patientId.',
    )
  }
}

for (const doctor of database.doctors) {
  if (
    !database.users.some(
      (user) => user.id === doctor.userId && user.role === 'doctor',
    )
  ) {
    throw new Error(`Le médecin ${doctor.id} doit être lié à un compte doctor.`)
  }
}

for (const slot of database.availabilitySlots) {
  const appointment = database.appointments.find(
    (item) => item.id === slot.appointmentId,
  )
  if (slot.status === 'unavailable' && !appointment) {
    throw new Error(
      `Le créneau ${slot.id} indisponible doit référencer un rendez-vous.`,
    )
  }
}

console.log('Structure, versions, permissions et relations : OK')
