import API from './api';

// Service pour la gestion des livres
const BookService = {
  // Récupérer tous les livres
  getAllBooks: async (params = {}) => {
    try {
      const response = await API.get('/books', { params });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Récupérer un livre par son ID
  getBookById: async (id) => {
    try {
      const response = await API.get(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Créer un nouveau livre
  createBook: async (bookData) => {
    try {
      const response = await API.post('/books', bookData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Mettre à jour un livre
  updateBook: async (id, bookData) => {
    try {
      const response = await API.patch(`/books/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  // Supprimer un livre
  deleteBook: async (id) => {
    try {
      const response = await API.delete(`/books/${id}`);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Créer un nouveau livre avec image
  createBookWithImage: async (formData) => {
    try {
      const response = await API.post('/books', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },
  
  // Mettre à jour un livre avec image
  updateBookWithImage: async (id, formData) => {
    try {
      console.log('Mise à jour du livre avec ID:', id);
      
      // Afficher le contenu du FormData
      console.log('Contenu du FormData:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + (pair[0] === 'coverImage' ? 'Fichier image' : pair[1]));
      }
      
      // Vérifier si l'image est présente dans le FormData
      const hasImage = formData.has('coverImage');
      console.log('Le FormData contient une image:', hasImage);
      
      const response = await API.patch(`/books/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Réponse du serveur:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour du livre:', error);
      if (error.response) {
        console.error('Détails de l\'erreur:', error.response.data);
      } else {
        console.error('Erreur complète:', error);
      }
      throw error.response ? error.response.data : error;
    }
  }
};

export default BookService;
