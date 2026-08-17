const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.resolve(__dirname, '..')
const readJson = (filename) =>
  JSON.parse(fs.readFileSync(path.join(root, filename), 'utf8'))

test('le schéma conserve les cinq collections attendues', () => {
  const database = readJson('db.json')
  assert.deepEqual(Object.keys(database), [
    'users',
    'clinics',
    'doctors',
    'availabilitySlots',
    'appointments',
  ])
})

test('les rendez-vous utilisent userId et jamais patientId', () => {
  const { appointments } = readJson('db.json')
  for (const appointment of appointments) {
    assert.ok(Object.hasOwn(appointment, 'userId'))
    assert.ok(!Object.hasOwn(appointment, 'patientId'))
  }
})

test('les versions backend imposées restent verrouillées', () => {
  const packageJson = readJson('package.json')
  assert.equal(packageJson.dependencies['json-server'], '0.17.4')
  assert.equal(packageJson.dependencies['json-server-auth'], '2.1.0')
})
