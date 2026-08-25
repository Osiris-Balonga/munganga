// Erreur métier "attendue" (droits refusés, créneau indisponible, etc.).
// On l'utilise dans les services pour signaler un problème avec un code
// HTTP précis, sans avoir à connaître `response` (les services ne
// manipulent jamais directement la réponse HTTP, voir ARCHITECTURE.md).
class ApiError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
  }
}

// Toutes les routes renvoient leurs erreurs avec la même forme JSON :
// { "message": "..." }. Ça garantit que le frontend (apiClient.js) peut
// toujours lire `payload.message` sans se soucier de quelle route a répondu.
function sendError(response, statusCode, message) {
  return response.status(statusCode).json({ message })
}

// Middleware d'erreur Express (4 arguments = signature reconnue par Express
// pour un error handler). Placé après toutes les routes dans server.js.
function errorHandler(error, _request, response, _next) {
  if (error instanceof ApiError) {
    return sendError(response, error.statusCode, error.message)
  }

  console.error(error)
  return sendError(response, 500, 'Erreur interne du serveur.')
}

module.exports = { ApiError, sendError, errorHandler }
