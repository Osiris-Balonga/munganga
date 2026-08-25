const { ApiError } = require('../utils/apiError')

// Un token JWT donne l'id de l'utilisateur connecté (request.auth.id),
// mais les rendez-vous et créneaux sont liés à un doctorId (voir db.json :
// la table "doctors" a un champ userId qui pointe vers "users").
// Cette fonction centralise cette résolution pour que chaque route n'ait
// pas à réécrire la même requête sur la base.
function findDoctorByUserId(db, userId) {
  return db.get('doctors').find({ userId }).value() || null
}

// Variante stricte : lève une ApiError 403 si l'utilisateur connecté
// n'est pas un médecin enregistré. Utile dans les routes réservées
// aux praticiens (confirm, refuse, doctor/appointments).
function requireDoctorProfile(db, auth) {
  if (auth.role !== 'doctor') {
    throw new ApiError(403, 'Accès réservé aux médecins.')
  }

  const doctor = findDoctorByUserId(db, auth.id)
  if (!doctor) {
    throw new ApiError(403, 'Profil médecin introuvable pour ce compte.')
  }

  return doctor
}

module.exports = { findDoctorByUserId, requireDoctorProfile }
