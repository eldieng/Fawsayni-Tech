import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Card, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import AuthService from '../services/authService';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const Login = ({ onLogin, isAuthenticated }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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
      const { email, password } = formData;
      
      // Validation basique
      if (!email || !password) {
        setError('Veuillez remplir tous les champs');
        setLoading(false);
        return;
      }

      // Appel au service d'authentification
      const result = await AuthService.login(formData);
      
      // Gérer la connexion réussie
      onLogin(result.token, result.data.user);
      toast.success('Connexion réussie !');
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion');
      toast.error('Échec de la connexion');
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
          <i className="bi bi-book-half"></i>
          <h2 className="form-title text-center">Connexion à Fawsayni Tech</h2>
        </div>
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
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

          <motion.div variants={itemVariants}>
            <Form.Group className="form-group" controlId="password">
              <Form.Label className="form-label">Mot de passe</Form.Label>
              <div className="input-with-icon">
                <i className="bi bi-lock icon"></i>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Entrez votre mot de passe"
                  className="form-control"
                  required
                />
              </div>
            </Form.Group>
          </motion.div>

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
                  Connexion en cours...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right"></i>
                  Se connecter
                </>
              )}
            </Button>
          </motion.div>
        </Form>
        
        <motion.div variants={itemVariants} className="auth-form-footer">
          <p>
            Vous n'avez pas de compte ? <Link to="/register" className="text-primary fw-bold">S'inscrire</Link>
          </p>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default Login;
