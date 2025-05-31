import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import AuthService from '../services/authService';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const Register = ({ onLogin, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Rediriger si déjà authentifié
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/books');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { name, email, password, passwordConfirm } = formData;
      
      // Validation basique
      if (!name || !email || !password || !passwordConfirm) {
        setError('Veuillez remplir tous les champs');
        setLoading(false);
        return;
      }

      if (password !== passwordConfirm) {
        setError('Les mots de passe ne correspondent pas');
        setLoading(false);
        return;
      }

      if (password.length < 8) {
        setError('Le mot de passe doit contenir au moins 8 caractères');
        setLoading(false);
        return;
      }

      // Appel au service d'authentification
      const result = await AuthService.register(formData);
      
      // Gérer l'inscription réussie
      onLogin(result.token, result.data.user);
      toast.success('Inscription réussie !');
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'inscription');
      toast.error('Échec de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  const { theme } = useContext(ThemeContext);
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <Container className="py-5">
      <motion.div 
        className="auth-form-container form-container form-animate"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="auth-form-logo">
          <i className="bi bi-person-plus"></i>
          <h2 className="form-title text-center">Rejoindre Fawsayni Tech</h2>
        </div>
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col md={12}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="name">
                  <Form.Label className="form-label">Nom complet</Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-person icon"></i>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Entrez votre nom complet"
                      className="form-control"
                      required
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={12}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="email">
                  <Form.Label className="form-label">Email</Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-envelope icon"></i>
                    <Form.Control
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Entrez votre email"
                      className="form-control"
                      required
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={6}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="password">
                  <Form.Label className="form-label">
                    Mot de passe
                    <span className="form-tooltip">
                      <i className="bi bi-info-circle ms-1"></i>
                      <span className="tooltip-text">Le mot de passe doit contenir au moins 8 caractères.</span>
                    </span>
                  </Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-lock icon"></i>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Minimum 8 caractères"
                      className="form-control"
                      required
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={6}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="passwordConfirm">
                  <Form.Label className="form-label">Confirmer</Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-shield-lock icon"></i>
                    <Form.Control
                      type="password"
                      name="passwordConfirm"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      placeholder="Confirmez votre mot de passe"
                      className="form-control"
                      required
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>
          </Row>

          <motion.div variants={itemVariants} className="mt-4">
            <Button 
              variant="primary" 
              type="submit" 
              className="form-btn form-btn-primary w-100" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Inscription en cours...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus-fill"></i>
                  Créer mon compte
                </>
              )}
            </Button>
          </motion.div>
        </Form>
        
        <motion.div variants={itemVariants} className="auth-form-footer">
          <p>
            Vous avez déjà un compte ? <Link to="/login" className="text-primary fw-bold">Se connecter</Link>
          </p>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Register;
