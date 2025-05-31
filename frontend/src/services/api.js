import axios from 'axios';

// Créer une instance axios avec l'URL de base
const API = axios.create({
  baseURL: 'http://localhost:5001/api'
});

// Intercepteur pour ajouter le token d'authentification à chaque requête
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
