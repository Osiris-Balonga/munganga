const assert = require('node:assert/strict')
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')

const root = path.resolve(__dirname, '..')
const fromRoot = (...segments) => path.join(root, ...segments)

test('TanStack Router génère les routes depuis les fichiers', () => {
  assert.equal(fs.existsSync(fromRoot('src', 'routes', '__root.jsx')), true)
  assert.equal(fs.existsSync(fromRoot('src', 'routes', 'index.jsx')), true)
  assert.equal(fs.existsSync(fromRoot('src', 'routeTree.gen.js')), true)
  assert.equal(fs.existsSync(fromRoot('src', 'routes', 'pages.jsx')), false)
})

test('la route UI kit est séparée de ses fichiers internes', () => {
  const routeSource = fs.readFileSync(
    fromRoot('src', 'routes', 'ui-kit.jsx'),
    'utf8',
  )
  const generatedTree = fs.readFileSync(
    fromRoot('src', 'routeTree.gen.js'),
    'utf8',
  )

  assert.match(routeSource, /createFileRoute\('\/ui-kit'\)/)
  assert.match(routeSource, /\.\/-ui-kit\/UiKitPage/)
  assert.match(generatedTree, /id: '\/ui-kit'/)
  assert.doesNotMatch(generatedTree, /routes\/-ui-kit/)
})
