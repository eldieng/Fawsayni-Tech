import React, { useContext } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const Footer = () => {
  const { theme } = useContext(ThemeContext);
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };
  
  return (
    <footer className={`footer mt-5 pt-5 pb-4 ${theme === 'dark' ? 'footer-dark' : 'footer-light'}`}>
      <Container>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <Row className="g-4">
            <Col lg={4} md={6} className="mb-4">
              <motion.div variants={itemVariants}>
                <div className="footer-brand mb-3">
                  <i className="bi bi-book-half fs-3 me-2 text-primary"></i>
                  <span className="fs-4 fw-bold">Fawsayni Tech</span>
                </div>
                <p className="footer-description">
                  Une application web moderne pour la gestion de votre bibliothèque personnelle.
                  Découvrez, partagez et organisez vos livres préférés en toute simplicité.
                </p>
                <div className="footer-social mt-3">
                  <a href="#!" className="social-icon" aria-label="Facebook">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#!" className="social-icon" aria-label="Twitter">
                    <i className="bi bi-twitter"></i>
                  </a>
                  <a href="#!" className="social-icon" aria-label="Instagram">
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a href="#!" className="social-icon" aria-label="LinkedIn">
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </motion.div>
            </Col>
            
            <Col lg={2} md={6} sm={6} className="mb-4">
              <motion.div variants={itemVariants}>
                <h5 className="footer-heading">Navigation</h5>
                <ul className="footer-links">
                  <li>
                    <Link to="/" className="footer-link">
                      <i className="bi bi-house-door me-2"></i>Accueil
                    </Link>
                  </li>
                  <li>
                    <Link to="/books" className="footer-link">
                      <i className="bi bi-collection me-2"></i>Bibliothèque
                    </Link>
                  </li>
                  <li>
                    <Link to="/books/add" className="footer-link">
                      <i className="bi bi-plus-circle me-2"></i>Ajouter un livre
                    </Link>
                  </li>
                </ul>
              </motion.div>
            </Col>
            
            <Col lg={2} md={6} sm={6} className="mb-4">
              <motion.div variants={itemVariants}>
                <h5 className="footer-heading">Compte</h5>
                <ul className="footer-links">
                  <li>
                    <Link to="/login" className="footer-link">
                      <i className="bi bi-box-arrow-in-right me-2"></i>Connexion
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="footer-link">
                      <i className="bi bi-person-plus me-2"></i>Inscription
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="footer-link">
                      <i className="bi bi-person me-2"></i>Mon Profil
                    </Link>
                  </li>
                </ul>
              </motion.div>
            </Col>
            
            <Col lg={4} md={6} className="mb-4">
              <motion.div variants={itemVariants}>
                <h5 className="footer-heading">Contactez-nous</h5>
                <div className="footer-contact">
                  <div className="contact-item">
                    <i className="bi bi-envelope me-2 text-primary"></i>
                    <a href="mailto:el.elhadji.dieng@gmail.com" className="footer-link">el.elhadji.dieng@gmail.com</a>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-telephone me-2 text-primary"></i>
                    <span>+221 77 454 86 61</span>
                  </div>
                  <div className="contact-item">
                    <i className="bi bi-geo-alt me-2 text-primary"></i>
                    <span>Parcelle Assannie U8, Dakar, Sénégal</span>
                  </div>
                </div>
                
                <div className="newsletter mt-3">
                  <h6 className="mb-2">Abonnez-vous à notre newsletter</h6>
                  <div className="d-flex">
                    <input type="email" className="form-control me-2" placeholder="Votre email" />
                    <Button variant="primary" className="form-btn">
                      <i className="bi bi-send"></i>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
          
          <motion.div variants={itemVariants}>
            <hr className="footer-divider" />
            <div className="footer-bottom d-flex flex-wrap justify-content-between align-items-center">
              <p className="copyright mb-0">
                © {currentYear} <span className="fw-bold">Fawsayni Tech</span>. Tous droits réservés.
              </p>
              <div className="footer-legal">
                <Link to="#" className="footer-legal-link">Conditions d'utilisation</Link>
                <Link to="#" className="footer-legal-link">Politique de confidentialité</Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </footer>
  );
};

export default Footer;
