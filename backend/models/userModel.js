const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Veuillez fournir votre nom'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Veuillez fournir votre email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Veuillez fournir un email valide']
    },
    password: {
      type: String,
      required: [true, 'Veuillez fournir un mot de passe'],
      minlength: 8,
      select: false
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Veuillez confirmer votre mot de passe'],
      validate: {
        // Cette validation fonctionne uniquement lors de CREATE et SAVE
        validator: function(el) {
          return el === this.password;
        },
        message: 'Les mots de passe ne correspondent pas'
      }
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

// Middleware pour hacher le mot de passe avant de l'enregistrer
userSchema.pre('save', async function(next) {
  // Exécuter cette fonction uniquement si le mot de passe a été modifié
  if (!this.isModified('password')) return next();

  // Hacher le mot de passe avec un coût de 12
  this.password = await bcrypt.hash(this.password, 12);

  // Supprimer le champ passwordConfirm
  this.passwordConfirm = undefined;
  next();
});

// Méthode d'instance pour vérifier si le mot de passe est correct
userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
