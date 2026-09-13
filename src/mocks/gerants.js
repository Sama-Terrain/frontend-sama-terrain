// Mock : ce qui concerne les gérants côté admin, pas encore branché sur le
// vrai backend (le profil, les terrains et les créneaux du gérant connecté
// sont eux déjà branchés, voir services/gerantService.js).

// Demandes d'inscription de gérants en attente de validation par l'admin
export const MOCK_DEMANDES_VALIDATION_GERANT = [
  { id: 1, name: 'Amadou Diouf', phone: '+221 77 111 22 33', city: 'Dakar', initials: 'AD', terrainName: 'Dakar Soccer Center', terrainCity: 'Dakar', documentName: 'Reg_Commerce_Diouf.pdf', submittedAt: '28 Nov 2026', status: 'pending' },
  { id: 2, name: 'Ibrahima Fall', phone: '+221 78 222 33 44', city: 'Mermoz', initials: 'IF', terrainName: 'Elite Arena', terrainCity: 'Mermoz', documentName: 'CNI_Fall.pdf', submittedAt: '25 Nov 2026', status: 'pending' },
  { id: 3, name: 'Omar Sy', phone: '+221 77 333 44 55', city: 'Guédiawaye', initials: 'OS', terrainName: 'Saly Foot Arena', terrainCity: 'Saly', documentName: 'RCCM_Sy.pdf', submittedAt: '22 Nov 2026', status: 'pending' },
  { id: 4, name: 'Fatoumata Sarr', phone: '+221 78 444 55 66', city: 'Almadies', initials: 'FS', terrainName: 'Dakar Premier Field', terrainCity: 'Dakar', documentName: 'CNI_Sarr.pdf', submittedAt: '20 Nov 2026', status: 'pending' },
  { id: 5, name: 'Awa Ndiaye', phone: '+221 77 555 66 77', city: 'Yoff', initials: 'AN', terrainName: 'Yoff Municipal Stadium', terrainCity: 'Yoff', documentName: 'Reg_Commerce_Ndiaye.pdf', submittedAt: '18 Nov 2026', status: 'pending' },
];
