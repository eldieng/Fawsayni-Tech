# Fawsayni Tech - Application Web de Gestion de Bibliothèque

![Fawsayni Tech Logo](https://img.shields.io/badge/Fawsayni-Tech-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-MIT-blue)

## 📚 Présentation

Fawsayni Tech est une application web moderne et complète permettant de gérer une bibliothèque communautaire. Cette plateforme permet aux utilisateurs de découvrir, partager et gérer une collection de livres avec une interface utilisateur intuitive et élégante.

![Capture d'écran de l'application](https://via.placeholder.com/800x400?text=Fawsayni+Tech+Screenshot)

## ✨ Fonctionnalités

### Gestion des utilisateurs
- Inscription et connexion sécurisées
- Profils utilisateurs personnalisables
- Gestion des rôles (administrateur, utilisateur standard)
- Récupération de mot de passe

### Gestion des livres
- Affichage de tous les livres avec pagination et filtres
- Recherche avancée par titre, auteur, genre, etc.
- Ajout de nouveaux livres avec téléchargement d'images de couverture
- Modification et suppression des livres (avec vérification des permissions)
- Vue détaillée des informations de chaque livre

### Interface utilisateur
- Design moderne et responsive adapté à tous les appareils
- Thème clair/sombre personnalisable
- Animations et transitions fluides
- Formulaires intuitifs avec validation

## 🛠️ Technologies utilisées

### Backend
- **Node.js** - Environnement d'exécution JavaScript
- **Express.js** - Framework web pour Node.js
- **MongoDB** - Base de données NoSQL
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification basée sur les tokens
- **Multer** - Gestion du téléchargement de fichiers
- **Bcrypt** - Hachage sécurisé des mots de passe

### Frontend
- **React** - Bibliothèque JavaScript pour construire l'interface utilisateur
- **React Router** - Gestion des routes côté client
- **React Bootstrap** - Composants UI basés sur Bootstrap
- **Axios** - Client HTTP pour les requêtes API
- **Framer Motion** - Bibliothèque d'animations
- **React Toastify** - Notifications élégantes
- **Bootstrap Icons** - Icônes pour l'interface

## 📂 Structure du projet

```
/
├── backend/                # API Node.js/Express
│   ├── config/             # Configuration de l'application
│   ├── controllers/        # Contrôleurs pour gérer les requêtes
│   ├── middleware/         # Middleware (auth, validation, etc.)
│   ├── models/             # Modèles Mongoose
│   ├── routes/             # Routes de l'API
│   ├── uploads/            # Dossier pour les fichiers téléchargés
│   │   └── books/          # Images de couverture des livres
│   ├── utils/              # Utilitaires et fonctions d'aide
│   └── server.js           # Point d'entrée du serveur
│
├── frontend/               # Application React
│   ├── public/             # Fichiers statiques
│   └── src/                # Code source React
│       ├── components/     # Composants React réutilisables
│       │   ├── BookCard.js # Carte pour afficher un livre
│       │   ├── Footer.js   # Pied de page de l'application
│       │   ├── Navbar.js   # Barre de navigation
│       │   └── ...         # Autres composants
│       ├── contexts/       # Contextes React (thème, auth, etc.)
│       ├── pages/          # Pages de l'application
│       │   ├── Home.js     # Page d'accueil
│       │   ├── Login.js    # Page de connexion
│       │   ├── Register.js # Page d'inscription
│       │   ├── BookList.js # Liste des livres
│       │   ├── BookDetail.js # Détails d'un livre
│       │   ├── AddBook.js  # Ajout d'un livre
│       │   ├── EditBook.js # Modification d'un livre
│       │   ├── Profile.js  # Profil utilisateur
│       │   └── ...         # Autres pages
│       ├── services/       # Services pour les appels API
│       ├── styles/         # Fichiers CSS et styles
│       └── App.js          # Composant principal
│
└── README.md               # Documentation du projet
```

## 🚀 Installation et démarrage

### Prérequis
- Node.js (v14+)
- MongoDB (v4+)
- npm ou yarn

### Cloner le dépôt
```bash
git clone https://github.com/votre-username/fawsayni-tech.git
cd fawsayni-tech
```

### Variables d'environnement
Créez un fichier `.env` dans le dossier `backend` avec les variables suivantes :
```
MONGO_URI=votre_uri_mongodb
JWT_SECRET=votre_secret_jwt
PORT=5001
NODE_ENV=development
```

### Backend
```bash
cd backend
npm install

# Démarrer en mode développement
npm run dev

# Ou démarrer en mode production
npm start
```

### Frontend
```bash
cd frontend
npm install
npm start
```

L'application sera accessible à l'adresse [http://localhost:3000](http://localhost:3000) et l'API à l'adresse [http://localhost:5001](http://localhost:5001).

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription d'un nouvel utilisateur
- `POST /api/auth/login` - Connexion d'un utilisateur
- `GET /api/auth/me` - Récupérer le profil de l'utilisateur connecté
- `PUT /api/auth/updateMe` - Mettre à jour le profil de l'utilisateur
- `PUT /api/auth/updateMyPassword` - Mettre à jour le mot de passe
- `POST /api/auth/logout` - Déconnexion

### Livres
- `GET /api/books` - Récupérer tous les livres (avec pagination et filtres)
- `GET /api/books/:id` - Récupérer un livre spécifique
- `POST /api/books` - Créer un nouveau livre (authentification requise)
- `PUT /api/books/:id` - Mettre à jour un livre (authentification requise)
- `DELETE /api/books/:id` - Supprimer un livre (authentification requise)
- `GET /api/books/search` - Rechercher des livres par titre, auteur, etc.

## 📱 Captures d'écran

<div style="display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;">
  <img src="https://via.placeholder.com/250x400?text=Page+d'accueil" alt="Page d'accueil" width="250"/>
  <img src="https://via.placeholder.com/250x400?text=Liste+des+livres" alt="Liste des livres" width="250"/>
  <img src="https://via.placeholder.com/250x400?text=Détail+d'un+livre" alt="Détail d'un livre" width="250"/>
</div>

## 👨‍💻 Auteur

**El Hadji Dieng**
- Email: [el.elhadji.dieng@gmail.com](mailto:el.elhadji.dieng@gmail.com)
- Téléphone: +221 77 454 86 61
- Adresse: Parcelle Assannie U8, Dakar, Sénégal

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus d'informations.

## 🙏 Remerciements

- Merci à tous ceux qui ont contribué à ce projet
- Inspiration: diverses bibliothèques en ligne et applications de gestion de livres
