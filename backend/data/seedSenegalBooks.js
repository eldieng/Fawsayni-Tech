const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Book = require('../models/bookModel');
const User = require('../models/userModel');

// Charger les variables d'environnement
dotenv.config({ path: '../config/.env' });

// Connexion à MongoDB
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/bibliotheque';

// Livres sénégalais
const senegalBooks = [
  {
    title: 'Les Bouts de Bois de Dieu',
    author: 'Ousmane Sembène',
    description: 'Ce roman historique raconte la grève des cheminots du Dakar-Niger en 1947-1948. Il s\'agit d\'une fresque sociale qui décrit la lutte des travailleurs africains contre l\'administration coloniale française.',
    isbn: '9782266152600',
    publishedYear: 1960,
    genre: 'Fiction historique',
    coverImage: 'https://m.media-amazon.com/images/I/61JOgbmj8HL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Une si longue lettre',
    author: 'Mariama Bâ',
    description: 'Sous forme épistolaire, ce roman raconte l\'histoire de Ramatoulaye, une veuve sénégalaise qui écrit à son amie Aïssatou pour lui raconter son deuil et ses réflexions sur la condition des femmes dans la société sénégalaise.',
    isbn: '9782842613303',
    publishedYear: 1979,
    genre: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71Eo8vnP4nL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Le Baobab fou',
    author: 'Ken Bugul',
    description: 'Ce roman semi-autobiographique raconte l\'histoire d\'une jeune Sénégalaise qui part étudier en Belgique et y découvre le racisme, la solitude et la difficulté de s\'intégrer dans une société occidentale.',
    isbn: '9782708704206',
    publishedYear: 1982,
    genre: 'Autobiographie',
    coverImage: 'https://m.media-amazon.com/images/I/51NWGR3VDTL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'La Grève des Bàttu',
    author: 'Aminata Sow Fall',
    description: 'Ce roman satirique raconte l\'histoire d\'une fonctionnaire chargée de nettoyer les rues de la ville des mendiants, mais qui se heurte à leur résistance quand ils décident de faire grève.',
    isbn: '9782708703391',
    publishedYear: 1979,
    genre: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/51YJMWVJ0QL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Xala',
    author: 'Ousmane Sembène',
    description: 'Ce roman satirique raconte l\'histoire d\'El Hadji Abdou Kader Beye, un homme d\'affaires sénégalais qui est frappé d\'impuissance sexuelle (xala) le jour de son troisième mariage.',
    isbn: '9782708703414',
    publishedYear: 1973,
    genre: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/51KFVX9VQKL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Le Ventre de l\'Atlantique',
    author: 'Fatou Diome',
    description: 'Ce roman raconte l\'histoire de Salie, une jeune Sénégalaise qui vit en France et qui tente de dissuader son frère de la rejoindre, lui expliquant les difficultés de l\'immigration et la réalité de la vie en Europe.',
    isbn: '9782253109761',
    publishedYear: 2003,
    genre: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/71YWZH7YFFL._AC_UF1000,1000_QL80_.jpg',
    available: true
  },
  {
    title: 'Doomi Golo',
    author: 'Boubacar Boris Diop',
    description: 'Écrit en wolof, ce roman raconte l\'histoire d\'un grand-père qui écrit un cahier pour son petit-fils émigré en France, lui racontant la vie quotidienne au Sénégal et l\'histoire de leur famille.',
    isbn: '9782708708075',
    publishedYear: 2003,
    genre: 'Fiction',
    coverImage: 'https://m.media-amazon.com/images/I/51VDNW2VBFL._AC_UF1000,1000_QL80_.jpg',
    available: true
  }
];

// Fonction pour ajouter les livres sénégalais
const seedSenegalBooks = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(DB_URI);
    console.log('Connexion à MongoDB établie avec succès');

    // Trouver l'utilisateur admin
    const admin = await User.findOne({ role: 'admin' });
    
    if (!admin) {
      console.error('Aucun utilisateur admin trouvé. Veuillez d\'abord exécuter le script seedData.js');
      process.exit(1);
    }

    // Ajouter l'ID de l'utilisateur admin aux livres
    const booksWithUser = senegalBooks.map(book => ({
      ...book,
      user: admin._id
    }));

    // Créer les livres sénégalais
    const createdBooks = await Book.insertMany(booksWithUser);
    console.log(`${createdBooks.length} livres sénégalais ajoutés avec succès`);

    console.log('Livres sénégalais ajoutés avec succès !');
    process.exit();
  } catch (error) {
    console.error('Erreur lors de l\'ajout des livres sénégalais:', error);
    process.exit(1);
  }
};

// Exécuter la fonction
seedSenegalBooks();
