const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Un livre doit avoir un titre'],
      trim: true,
      maxlength: [100, 'Un titre ne peut pas dépasser 100 caractères']
    },
    author: {
      type: String,
      required: [true, 'Un livre doit avoir un auteur'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    isbn: {
      type: String,
      unique: true,
      trim: true
    },
    publishedYear: {
      type: Number,
      validate: {
        validator: function(val) {
          return val <= new Date().getFullYear();
        },
        message: "L'année de publication ne peut pas être dans le futur"
      }
    },
    genre: {
      type: String,
      trim: true
    },
    coverImage: {
      type: String,
      default: 'default-book.jpg'
    },
    available: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Un livre doit appartenir à un utilisateur']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Index pour améliorer les performances des requêtes
bookSchema.index({ title: 1, author: 1 });

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
