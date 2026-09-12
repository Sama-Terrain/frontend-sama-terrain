// Mock : comptes de connexion de test + liste des utilisateurs gérée par l'admin.
// Contexte sénégalais : noms, quartiers de Dakar, numéros au format +221.

// Compte de test "Amateur" (joueur)
export const MOCK_AMATEUR = {
  id: 'user-amateur-1',
  email: 'mariegodmer@gmail.com',
  password: 'password123',
  prenom: 'Moussa',
  nom: 'Diallo',
  role: 'amateur',
  verificationCode: '4821',
  initiales: 'MD',
};

// Compte de test "Administrateur"
export const MOCK_ADMIN = {
  id: 'user-admin-1',
  email: 'admin@samaterrain.sn',
  password: 'admin123',
  prenom: 'Alioune',
  nom: 'Diop',
  role: 'admin',
  verificationCode: '0000',
  initiales: 'AD',
};

// Profil affiché dans l'en-tête de l'espace admin
export const MOCK_ADMIN_PROFILE = {
  name: 'Alioune Diop',
  role: 'Super Admin',
  initials: 'AD',
};

// Liste des utilisateurs affichée dans l'espace admin (page "Utilisateurs")
export const MOCK_UTILISATEURS = [
  { id: 1, name: 'Fatoumata Sarr', email: 'fatoumata.sarr@email.com', phone: '+221 77 123 45 67', city: 'Dakar', role: 'Amateur', status: 'actif', initials: 'FS', registeredAt: '15 Jan 2024' },
  { id: 2, name: 'Ibrahima Fall', email: 'ibrahima.fall@email.com', phone: '+221 78 234 56 78', city: 'Mermoz', role: 'Gérant', status: 'actif', initials: 'IF', registeredAt: '22 Jan 2024' },
  { id: 3, name: 'Omar Sy', email: 'omar.sy@email.com', phone: '+221 77 345 67 89', city: 'Guédiawaye', role: 'Amateur', status: 'suspendu', initials: 'OS', registeredAt: '08 Fév 2024' },
  { id: 4, name: 'Amadou Diouf', email: 'amadou.diouf@email.com', phone: '+221 78 456 78 90', city: 'Almadies', role: 'Gérant', status: 'actif', initials: 'AD', registeredAt: '12 Fév 2024' },
  { id: 5, name: 'Awa Ndiaye', email: 'awa.ndiaye@email.com', phone: '+221 77 567 89 01', city: 'Yoff', role: 'Amateur', status: 'inactif', initials: 'AN', registeredAt: '01 Mar 2024' },
  { id: 6, name: 'Moussa Koné', email: 'moussa.kone@email.com', phone: '+221 78 678 90 12', city: 'Dakar', role: 'Amateur', status: 'actif', initials: 'MK', registeredAt: '15 Mar 2024' },
  { id: 7, name: 'Bineta Diao', email: 'bineta.diao@email.com', phone: '+221 77 789 01 23', city: 'Mermoz', role: 'Gérant', status: 'actif', initials: 'BD', registeredAt: '22 Mar 2024' },
  { id: 8, name: 'Cheikh Tidiane', email: 'cheikh.tidiane@email.com', phone: '+221 78 890 12 34', city: 'Guédiawaye', role: 'Amateur', status: 'actif', initials: 'CT', registeredAt: '05 Avr 2024' },
  { id: 9, name: 'Mariama Ba', email: 'mariama.ba@email.com', phone: '+221 77 901 23 45', city: 'Almadies', role: 'Amateur', status: 'actif', initials: 'MB', registeredAt: '10 Avr 2024' },
  { id: 10, name: 'Pape Mbaye', email: 'pape.mbaye@email.com', phone: '+221 78 012 34 56', city: 'Yoff', role: 'Gérant', status: 'actif', initials: 'PM', registeredAt: '18 Avr 2024' },
  { id: 11, name: 'Rokhaya Lo', email: 'rokhaya.lo@email.com', phone: '+221 77 123 45 68', city: 'Dakar', role: 'Amateur', status: 'inactif', initials: 'RL', registeredAt: '25 Avr 2024' },
  { id: 12, name: 'Sidy Ndiaye', email: 'sidy.ndiaye@email.com', phone: '+221 78 234 56 79', city: 'Mermoz', role: 'Amateur', status: 'actif', initials: 'SN', registeredAt: '02 Mai 2024' },
];
