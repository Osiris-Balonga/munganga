/**
 * Fixtures DÉCORATIVES uniquement pour l’espace praticien.
 *
 * Ne jamais utiliser ce module pour :
 * - les rendez-vous métier
 * - les créneaux / horaires disponibles
 * - les actions confirm / refuse / create / delete
 *
 * Les données métier viennent exclusivement des routes API
 * (`/api/doctor/appointments`, `/api/doctor/availability-slots`, …).
 */

export const practitionerDefaults = {
  specialty: 'Médecine générale',
  clinic: 'Clinique Mère et Enfant',
  district: 'Poto-Poto',
  address: 'Avenue de la Paix, Brazzaville',
  phone: '+242 06 555 10 10',
  bio: 'Consultations de médecine générale pour adultes et enfants, suivi des pathologies courantes et prévention.',
}

/** Répartition illustrative pour le graphique donut du dashboard. */
export const consultationMix = [
  { label: 'Consultation générale', value: 42, color: '#1d4ed8' },
  { label: 'Suivi chronique', value: 28, color: '#0ea5e9' },
  { label: 'Pédiatrie', value: 18, color: '#38bdf8' },
  { label: 'Autre', value: 12, color: '#93c5fd' },
]

/** Événements clinique purement illustratifs (widgets secondaires). */
export const upcomingClinicEvents = [
  {
    id: 1,
    title: 'Réunion de service',
    when: 'Demain · 07:30',
    place: 'Salle staff',
  },
  {
    id: 2,
    title: 'Formation diabète',
    when: 'Vendredi · 15:00',
    place: 'Amphi clinique',
  },
]

/** Fil de notifications UI (chrome) — non branché sur une API. */
export const decorativeNotifications = [
  {
    id: 1,
    type: 'request',
    title: 'Nouveau rendez-vous',
    message: 'Une demande de consultation vient d’arriver.',
    time: 'Il y a 12 min',
    unread: true,
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Rappel',
    message: 'Pensez à confirmer les demandes en attente.',
    time: 'Il y a 40 min',
    unread: true,
  },
  {
    id: 3,
    type: 'cancelled',
    title: 'Information',
    message: 'Les créneaux passés ne peuvent plus être annulés.',
    time: 'Hier',
    unread: false,
  },
]

/** Messages UI décoratifs (vue Messages placeholder). */
export const decorativeMessages = [
  {
    id: 1,
    from: 'Secrétariat',
    preview: 'Bienvenue sur l’espace praticien Munganga.',
    time: 'Aujourd’hui',
    unread: true,
  },
  {
    id: 2,
    from: 'Direction',
    preview: 'Rappel : réunion de service demain à 07:30.',
    time: 'Hier',
    unread: true,
  },
]
