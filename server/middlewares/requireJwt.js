const jwt = require('jsonwebtoken')
const { JWT_SECRET_KEY } = require('json-server-auth/dist/constants')

// Vérifie le token JWT envoyé dans le header "Authorization: Bearer ...".
//
// json-server-auth signe le token avec seulement { email } comme payload et
// place l'id utilisateur dans la claim standard "sub" (ex. sub: "10"), pas
// dans un champ "id". Il n'y a pas non plus de "role" dans le token : le
// rôle doit être résolu depuis la base (voir doctorsService.requireDoctorProfile).
//
// En cas de succès, `request.auth` contient le payload décodé, complété par
// `userId` (l'id utilisateur normalisé en nombre) — c'est CE champ que les
// routes et services doivent utiliser, jamais `request.auth.id`.
function requireJwt(request, response, next) {
  const authorization = request.get('authorization') || ''
  const [scheme, token] = authorization.split(' ')

  if (scheme !== 'Bearer' || !token) {
    return response.status(401).json({ message: 'Authentification requise.' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY, { algorithms: ['HS256'] })
    const userId = Number(payload.sub)

    if (!Number.isInteger(userId)) {
      return response
        .status(401)
        .json({ message: 'Session invalide ou expirée.' })
    }

    request.auth = { ...payload, userId }
    return next()
  } catch {
    return response
      .status(401)
      .json({ message: 'Session invalide ou expirée.' })
  }
}

module.exports = { requireJwt }
