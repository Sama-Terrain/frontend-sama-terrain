import { mockUser } from '../data/mockUser';

export const authService = {
  login: async (email, password) => {
    // Simulation réseau
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (email.toLowerCase() === mockUser.email.toLowerCase() && password === mockUser.password) {
      return { success: true, user: mockUser };
    }
    return { success: false, error: 'Identifiants incorrects' };
  },

  verifyCode: async (code) => {
    await new Promise((resolve) => setTimeout(resolve, 300));

    if (code === mockUser.verificationCode) {
      return { success: true, user: mockUser };
    }
    return { success: false, error: 'Code de vérification invalide' };
  },

  register: async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { success: true, user: data };
  }
};
