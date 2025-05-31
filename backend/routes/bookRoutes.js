const express = require('express');
const bookController = require('../controllers/bookController');
const authController = require('../controllers/authController');
const uploadMiddleware = require('../middleware/uploadMiddleware');

const router = express.Router();

// Routes publiques
router.get('/', bookController.getAllBooks);
router.get('/:id', bookController.getBook);

// Mode développement - Toutes les routes sont publiques
// En production, décommentez la ligne ci-dessous et commentez les routes publiques
// router.use(authController.protect);

// Routes publiques pour le développement
router.post('/', uploadMiddleware.uploadBookImage, uploadMiddleware.processUploadedFile, bookController.createBook);
router.patch('/:id', uploadMiddleware.uploadBookImage, uploadMiddleware.processUploadedFile, bookController.updateBook);
router.delete('/:id', bookController.deleteBook);

// En production, utilisez ces routes protégées
/*
router.use(authController.protect);
router.post('/', bookController.createBook);
router.patch('/:id', bookController.updateBook);
router.delete('/:id', bookController.deleteBook);
*/

module.exports = router;
