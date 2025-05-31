const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Routes publiques
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Routes protégées (nécessitent une authentification)
router.use(authController.protect); // Middleware de protection pour toutes les routes ci-dessous

// Routes pour le profil utilisateur
router.get('/me', authController.getMe);
router.patch('/updateMe', authController.updateMe);
router.patch('/updateMyPassword', authController.updatePassword);

// Routes pour la gestion des utilisateurs (accès par ID)
router.get('/users/:id', authController.getUser);

module.exports = router;
