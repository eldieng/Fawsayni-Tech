import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar as BootstrapNavbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { motion } from 'framer-motion';
import ThemeToggler from './ThemeToggler';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const Navbar = ({ isAuthenticated, user, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useContext(ThemeContext);
  const [scrolled, setScrolled] = useState(false);

  // Gestion du scroll pour changer l'apparence de la navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };
  
  // Vérifier si le lien est actif
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  return (
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <BootstrapNavbar 
        expand="lg" 
        fixed="top"
        className={`custom-navbar ${scrolled ? 'navbar-scrolled' : ''}`}
        variant={theme === 'dark' ? 'dark' : 'light'}
      >
        <Container>
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', stiffness: 300 }}
          >
            <BootstrapNavbar.Brand as={Link} to="/" className="brand-logo">
              <i className="bi bi-book-half fs-4 me-2 text-primary"></i>
              <span className="brand-text">Fawsayni Tech</span>
            </BootstrapNavbar.Brand>
          </motion.div>
          
          <BootstrapNavbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggler-custom" />
          
          <BootstrapNavbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto nav-links">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link 
                  as={Link} 
                  to="/" 
                  className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
                >
                  <i className="bi bi-house-door me-1"></i> Accueil
                </Nav.Link>
              </motion.div>
              
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                <Nav.Link 
                  as={Link} 
                  to="/books" 
                  className={`nav-link-custom ${isActive('/books') ? 'active' : ''}`}
                >
                  <i className="bi bi-collection me-1"></i> Bibliothèque
                </Nav.Link>
              </motion.div>
              
              {isAuthenticated && (
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                  <Nav.Link 
                    as={Link} 
                    to="/books/add" 
                    className={`nav-link-custom ${isActive('/books/add') ? 'active' : ''}`}
                  >
                    <i className="bi bi-plus-circle me-1"></i> Ajouter un livre
                  </Nav.Link>
                </motion.div>
              )}
            </Nav>
            
            <Nav className="nav-right">
              <div className="theme-toggler-container me-3">
                <ThemeToggler />
              </div>
              
              {isAuthenticated ? (
                <div className="d-flex align-items-center">
                  <Dropdown align="end">
                    <Dropdown.Toggle variant="link" id="dropdown-user" className="nav-user-dropdown">
                      <div className="d-flex align-items-center">
                        <div className="user-avatar me-2">
                          <img 
                            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&color=fff&size=32`} 
                            alt="Avatar" 
                            className="rounded-circle"
                          />
                        </div>
                        <span className="d-none d-md-inline">{user.name}</span>
                      </div>
                    </Dropdown.Toggle>
                    
                    <Dropdown.Menu className="dropdown-menu-custom">
                      <Dropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                        <i className="bi bi-person me-2"></i> Mon Profil
                      </Dropdown.Item>
                      <Dropdown.Item as={Link} to="/books" className="dropdown-item-custom">
                        <i className="bi bi-book me-2"></i> Mes Livres
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item onClick={handleLogout} className="dropdown-item-custom text-danger">
                        <i className="bi bi-box-arrow-right me-2"></i> Déconnexion
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              ) : (
                <div className="auth-buttons">
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      as={Link} 
                      to="/login" 
                      variant="outline-primary" 
                      className="me-2 form-btn form-btn-outline btn-sm"
                    >
                      <i className="bi bi-box-arrow-in-right me-1"></i> Connexion
                    </Button>
                  </motion.div>
                  
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      as={Link} 
                      to="/register" 
                      variant="primary" 
                      className="form-btn btn-sm"
                    >
                      <i className="bi bi-person-plus me-1"></i> Inscription
                    </Button>
                  </motion.div>
                </div>
              )}
            </Nav>
          </BootstrapNavbar.Collapse>
        </Container>
      </BootstrapNavbar>
      {/* Spacer pour compenser la navbar fixed */}
      <div style={{ height: '70px' }}></div>
    </motion.div>
  );
};

export default Navbar;
