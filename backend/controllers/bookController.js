const Book = require('../models/bookModel');

// Récupérer tous les livres
exports.getAllBooks = async (req, res) => {
  try {
    // Construire la requête
    const query = Book.find();

    // Filtrage
    if (req.query.genre) {
      query.where('genre').equals(req.query.genre);
    }
    if (req.query.available) {
      query.where('available').equals(req.query.available === 'true');
    }
    if (req.query.user) {
      query.where('user').equals(req.query.user);
    }
    if (req.query.search) {
      const searchRegex = new RegExp(req.query.search, 'i');
      query.or([
        { title: searchRegex },
        { author: searchRegex },
        { description: searchRegex }
      ]);
    }

    // Compter le nombre total de livres pour la pagination
    const totalBooks = await Book.countDocuments(query.getQuery());

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 9;
    const skip = (page - 1) * limit;

    query.skip(skip).limit(limit);

    // Tri
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query.sort(sortBy);
    } else {
      query.sort('-createdAt');
    }

    // Exécuter la requête
    const books = await query;

    // Calculer les informations de pagination
    const totalPages = Math.ceil(totalBooks / limit);

    // Envoyer la réponse
    res.status(200).json({
      status: 'success',
      results: books.length,
      totalBooks,
      totalPages,
      currentPage: page,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      data: {
        books
      }
    });
  } catch (err) {
    console.error('Erreur lors de la récupération des livres:', err);
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Récupérer un livre spécifique
exports.getBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'Aucun livre trouvé avec cet ID'
      });
    }

    res.status(200).json({
      status: 'success',
      data: {
        book
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Créer un nouveau livre
exports.createBook = async (req, res) => {
  try {
    // Pour le développement, utiliser un ID d'utilisateur par défaut
    // En production, décommentez la ligne ci-dessous
    // req.body.user = req.user.id;
    
    // Utiliser un ID d'utilisateur par défaut pour le développement
    req.body.user = req.user ? req.user.id : '6839d70be286b5d839cbf1c0'; // ID d'un utilisateur admin par défaut
    
    console.log('Création de livre avec les données:', req.body);
    
    const newBook = await Book.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        book: newBook
      }
    });
  } catch (err) {
    console.error('Erreur lors de la création du livre:', err);
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Mettre à jour un livre
exports.updateBook = async (req, res) => {
  try {
    console.log('Tentative de mise à jour du livre avec ID:', req.params.id);
    console.log('Données de mise à jour:', req.body);
    
    const book = await Book.findById(req.params.id);

    if (!book) {
      console.log('Livre non trouvé avec ID:', req.params.id);
      return res.status(404).json({
        status: 'fail',
        message: 'Aucun livre trouvé avec cet ID'
      });
    }

    console.log('Livre trouvé:', book);
    
    // Désactivé complètement pour le développement
    // En production, décommentez ce bloc pour activer la vérification des permissions
    /*
    if (book.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Vous n\'\u00eates pas autoris\u00e9 \u00e0 modifier ce livre'
      });
    }
    */
    
    // Log pour le débogage
    console.log('Modification du livre autorisée pour tous les utilisateurs (mode développement)');

    // Si l'utilisateur n'est pas défini, ne pas modifier le champ user
    if (!req.user) {
      delete req.body.user;
    }
    
    console.log('Données finales pour la mise à jour:', req.body);
    
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: 'success',
      data: {
        book: updatedBook
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};

// Supprimer un livre
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({
        status: 'fail',
        message: 'Aucun livre trouvé avec cet ID'
      });
    }

    // Désactivé temporairement pour le développement
    // En production, décommentez ce bloc pour activer la vérification des permissions
    /*
    if (book.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        status: 'fail',
        message: 'Vous n\'êtes pas autorisé à supprimer ce livre'
      });
    }
    */
    
    // Log pour le débogage
    console.log('Suppression du livre autorisée pour tous les utilisateurs (mode développement)');

    await Book.findByIdAndDelete(req.params.id);

    res.status(204).json({
      status: 'success',
      data: null
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message
    });
  }
};
