/**
 * Présentation UI des rendez-vous médecin.
 * Le contrat HTTP GET /api/doctor/appointments (#41) renvoie les enregistrements
 * bruts. Les horaires viennent des créneaux API ; aucun mock métier ici.
 */
export function presentDoctorAppointments(appointments = [], slots = []) {
  const slotsById = new Map(slots.map((slot) => [slot.id, slot]))

  return appointments
    .map((appointment) => {
      const slot = slotsById.get(appointment.slotId)
      return {
        ...appointment,
        startAt: slot?.startAt ?? appointment.createdAt,
        endAt: slot?.endAt ?? appointment.createdAt,
        patientName: `Patient #${appointment.userId}`,
        phone: '',
        clinic: '',
        district: '',
      }
    })
    .sort((left, right) => new Date(left.startAt) - new Date(right.startAt))
}
