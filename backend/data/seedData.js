const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

// Charger les variables d'environnement
dotenv.config({ path: '../config/.env' });

// Connexion à MongoDB
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bibliotheque';

// Utilisateur admin par défaut
const defaultAdmin = {
  name: 'Admin',
  email: 'admin@fawsaynitech.com',
  password: 'Admin123!',
  passwordConfirm: 'Admin123!',
  role: 'admin'
};

// Livres par défaut
const defaultBooks = [
  {
    title: 'L\'Alchimiste',
    author: 'Paulo Coelho',
    description: 'L\'Alchimiste est un roman qui suit le voyage d\'un jeune berger andalou nommé Santiago. Obsédé par un rêve récurrent, il décide de consulter une bohémienne pour l\'interpréter. Elle lui dit qu\'il découvrira un trésor caché près des pyramides d\'Égypte.',
    isbn: '9782290004448',
    publishedYear: 1988,
    genre: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71zZJWVcuRL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Dune',
    author: 'Frank Herbert',
    description: 'Dune est un roman de science-fiction qui se déroule dans un futur lointain de l\'humanité, dans lequel les puissances féodales se disputent le contrôle de la planète désertique Arrakis, également connue sous le nom de "Dune".',
    isbn: '9782266233200',
    publishedYear: 1965,
    genre: 'Science-fiction',
    coverImage: 'https://m.media-amazon.com/images/I/81ym3QUd3KL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Sapiens : Une brève histoire de l\'humanité',
    author: 'Yuval Noah Harari',
    description: 'Sapiens retrace l\'histoire de l\'humanité, depuis l\'apparition de l\'Homo sapiens jusqu\'à aujourd\'hui, et examine les façons dont la biologie et l\'histoire ont défini notre compréhension de ce que signifie être "humain".',
    isbn: '9782226257017',
    publishedYear: 2011,
    genre: 'Non-fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71Zb9UobS5L._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Harry Potter à l\'école des sorciers',
    author: 'J.K. Rowling',
    description: 'Le jour de ses onze ans, Harry Potter, un orphelin élevé par un oncle et une tante qui le détestent, voit son existence bouleversée. Un géant vient le chercher pour l\'emmener à Poudlard, une école de sorcellerie.',
    isbn: '9782070643028',
    publishedYear: 1997,
    genre: 'Fantaisie',
    coverImage: 'https://m.media-amazon.com/images/I/710ESoXza5L._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    description: 'Le Petit Prince est une œuvre poétique et philosophique sous l\'apparence d\'un conte pour enfants. Le narrateur, un aviateur, raconte sa rencontre avec le petit prince qui vient d\'une autre planète.',
    isbn: '9782070612758',
    publishedYear: 1943,
    genre: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71OZY035QKL._AC_UF1000,1000_QL80_.jpg',
    available: true
  }
];

// Fonction pour ajouter les données par défaut
const seedDatabase = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(DB_URI);
    console.log('Connexion à MongoDB établie avec succès');

    // Supprimer les données existantes
    await Book.deleteMany();
    console.log('Livres existants supprimés');

    // Créer l'utilisateur admin s'il n'existe pas déjà
    const adminExists = await User.findOne({ email: defaultAdmin.email });
    let adminUser;
    
    if (!adminExists) {
      adminUser = await User.create(defaultAdmin);
      console.log('Utilisateur admin créé:', adminUser.name);
    } else {
      adminUser = adminExists;
      console.log('Utilisateur admin existe déjà:', adminUser.name);
    }

    // Ajouter l'ID de l'utilisateur admin aux livres
    const booksWithUser = defaultBooks.map(book => ({
      ...book,
      user: adminUser._id
    }));

    // Créer les livres par défaut
    const createdBooks = await Book.insertMany(booksWithUser);
    console.log(`${createdBooks.length} livres ajoutés avec succès`);

    console.log('Données initiales ajoutées avec succès !');
    process.exit();
  } catch (error) {
    console.error('Erreur lors de l\'ajout des données initiales:', error);
    process.exit(1);
  }
};

// Exécuter la fonction
seedDatabase();
