const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuration du stockage des images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads/books');
    
    // Créer le répertoire s'il n'existe pas
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Générer un nom de fichier unique avec timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'book-' + uniqueSuffix + ext);
  }
});

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
  // Accepter uniquement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Seules les images sont autorisées!'), false);
  }
};

// Configuration de multer
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limite à 5MB
  }
});

// Middleware pour télécharger une seule image
exports.uploadBookImage = upload.single('coverImage');

// Middleware pour traiter le fichier téléchargé
exports.processUploadedFile = (req, res, next) => {
  console.log('Requête reçue pour traiter un fichier:', req.method, req.originalUrl);
  console.log('Contenu de req.body avant traitement:', req.body);
  console.log('Fichier téléchargé:', req.file);
  
  if (req.file) {
    // Stocker le chemin relatif de l'image dans req.body
    req.body.coverImage = `uploads/books/${req.file.filename}`;
    console.log('Image traitée avec succès. Nouveau chemin:', req.body.coverImage);
  } else {
    console.log('Aucun fichier n\'a été téléchargé');
  }
  
  console.log('Contenu final de req.body:', req.body);
  next();
};
