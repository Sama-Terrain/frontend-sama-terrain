// Génère la liste des créneaux horaires d'une heure entre l'ouverture et la fermeture d'un terrain.
// Ex: generateCreneaux('08:00', '11:00') -> [
//   { debut: '08:00', fin: '09:00', label: '08:00 - 09:00' },
//   { debut: '09:00', fin: '10:00', label: '09:00 - 10:00' },
//   { debut: '10:00', fin: '11:00', label: '10:00 - 11:00' },
// ]
export function generateCreneaux(ouverture, fermeture) {
  const [heureDebut] = ouverture.split(':').map(Number);
  const [heureFin] = fermeture.split(':').map(Number);

  const creneaux = [];
  for (let heure = heureDebut; heure < heureFin; heure += 1) {
    const debut = `${String(heure).padStart(2, '0')}:00`;
    const fin = `${String(heure + 1).padStart(2, '0')}:00`;
    creneaux.push({ debut, fin, label: `${debut} - ${fin}` });
  }
  return creneaux;
}
