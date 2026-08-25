const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')

// Vérifie le token JWT envoyé dans le header "Authorization: Bearer ...".
// En cas de succès, `request.auth` contient le payload décodé du token
// (id, email, role...) et les routes/services peuvent s'y fier.
function requireJwt(request, response, next) {
  const authorization = request.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authentification requise.' })
  }

  try {
    request.auth = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] })
    return next()
  } catch {
    return response
      .status(401)
      .json({ message: 'Session invalide ou expirée.' })
  }
}

module.exports = { requireJwt }
