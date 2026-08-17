import { PlaceholderPage } from '../components/PlaceholderPage'

export const HomePage = () => (
  <PlaceholderPage
    eyebrow="MVP médical à Brazzaville"
    title="Bienvenue sur Munganga"
    description="Le socle technique est prêt. Les parcours complets seront construits lors de la prochaine étape."
  />
)
export const DoctorsPage = () => (
  <PlaceholderPage
    title="Trouver un médecin"
    description="La liste, la recherche et les filtres seront ajoutés ici."
  />
)
export const DoctorPage = () => (
  <PlaceholderPage
    title="Fiche du médecin"
    description="Les informations du praticien et ses créneaux seront affichés ici."
  />
)
export const BookPage = () => (
  <PlaceholderPage
    title="Demander un rendez-vous"
    description="La réservation utilisera exclusivement la route métier POST /api/book."
  />
)
export const ClinicsPage = () => (
  <PlaceholderPage
    title="Cliniques"
    description="L'annuaire des cliniques sera affiché ici."
  />
)
export const ClinicPage = () => (
  <PlaceholderPage
    title="Fiche de la clinique"
    description="Les informations et médecins associés seront affichés ici."
  />
)
export const LoginPage = () => (
  <PlaceholderPage
    title="Connexion"
    description="Le formulaire utilisera le JWT réel fourni par json-server-auth."
  />
)
export const RegisterPage = () => (
  <PlaceholderPage
    title="Créer un compte patient"
    description="Seuls les patients pourront s'inscrire depuis cette page."
  />
)
export const PatientAppointmentsPage = () => (
  <PlaceholderPage
    eyebrow="Espace patient"
    title="Mes rendez-vous"
    description="Les rendez-vous futurs, passés, refusés et annulés seront listés ici."
  />
)
export const PatientAppointmentPage = () => (
  <PlaceholderPage
    eyebrow="Espace patient"
    title="Détail du rendez-vous"
    description="Le détail et l'annulation autorisée seront ajoutés ici."
  />
)
export const DoctorAgendaPage = () => (
  <PlaceholderPage
    eyebrow="Espace médecin"
    title="Agenda"
    description="Les vues Jour, Semaine et Mois seront ajoutées ici."
  />
)
export const DoctorAppointmentsPage = () => (
  <PlaceholderPage
    eyebrow="Espace médecin"
    title="Demandes de rendez-vous"
    description="La confirmation et le refus passeront par les routes métier protégées."
  />
)
export const DoctorAvailabilityPage = () => (
  <PlaceholderPage
    eyebrow="Espace médecin"
    title="Disponibilités"
    description="La gestion des créneaux sera implémentée via des routes métier protégées."
  />
)
