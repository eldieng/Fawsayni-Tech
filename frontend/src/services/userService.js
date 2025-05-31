import API from './api';
import AuthService from './authService';

// Service pour la gestion des utilisateurs
const UserService = {
  // Récupérer le profil de l'utilisateur actuel
  getCurrentUserProfile: async () => {
    try {
      const userId = AuthService.getCurrentUser()?.id;
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }
      
      const response = await API.get(`/auth/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Mettre à jour le profil de l'utilisateur
  updateUserProfile: async (userData) => {
    try {
      const userId = AuthService.getCurrentUser()?.id;
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }
      
      const response = await API.patch(`/auth/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Changer le mot de passe de l'utilisateur
  changePassword: async (passwordData) => {
    try {
      const userId = AuthService.getCurrentUser()?.id;
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }
      
      const response = await API.patch(`/auth/users/${userId}/password`, passwordData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Récupérer les livres de l'utilisateur
  getUserBooks: async () => {
    try {
      const userId = AuthService.getCurrentUser()?.id;
      if (!userId) {
        throw new Error('Utilisateur non connecté');
      }
      
      const response = await API.get(`/books?user=${userId}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  }
};

export default UserService;
