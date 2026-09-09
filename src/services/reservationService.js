import { mockReservations } from '../data/mockReservations';

export const reservationService = {
  getUserReservations: async () => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return mockReservations;
  },

  annulerReservation: async (resId) => {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const index = mockReservations.findIndex((r) => r.id === resId);
    if (index !== -1) {
      mockReservations[index].status = 'Annulée';
      mockReservations[index].statusBadgeClass = 'bg-red-100 text-red-700';
      mockReservations[index].tabCategory = 'annulees';
    }
    return { success: true };
  }
};
