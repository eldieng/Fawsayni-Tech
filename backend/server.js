const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

// Charger les variables d'environnement
dotenv.config({ path: './config/.env' });

// Importer les routes
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

// Initialiser l'application Express
const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(morgan('dev'));

// Servir les fichiers statiques depuis le dossier uploads
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
console.log('Dossier uploads configuré pour les fichiers statiques:', path.join(__dirname, 'uploads'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Route de base
app.get('/', (req, res) => {
  res.send('API de gestion de bibliothèque fonctionne correctement');
});

// Gestion des erreurs 404
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// Connexion à la base de données et démarrage du serveur
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bibliotheque';

mongoose
  .connect(DB_URI)
  .then(() => {
    console.log('Connexion à MongoDB établie avec succès');
    app.listen(PORT, () => {
      console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur de connexion à MongoDB:', err.message);
    process.exit(1);
  });
