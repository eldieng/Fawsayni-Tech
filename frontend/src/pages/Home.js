import React, { useContext } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';
import './Home.css';

// Données pour les fonctionnalités
const features = [
  {
    title: 'Gestion de bibliothèque',
    description: 'Ajoutez, modifiez et organisez facilement tous vos livres en un seul endroit avec notre interface intuitive.',
    icon: 'bi-collection',
    iconBg: 'bg-primary',
    link: '/books',
    linkText: 'Explorer les livres'
  },
  {
    title: 'Profil personnalisé',
    description: 'Créez votre compte pour sauvegarder vos préférences et accéder à votre bibliothèque personnelle de n\'importe où.',
    icon: 'bi-person-badge',
    iconBg: 'bg-success',
    link: '/register',
    linkText: 'Créer un compte'
  },
  {
    title: 'Recherche avancée',
    description: 'Trouvez rapidement n\'importe quel livre grâce à notre système de recherche par titre, auteur ou genre.',
    icon: 'bi-search',
    iconBg: 'bg-info',
    link: '/books',
    linkText: 'Rechercher des livres'
  }
];

// Les données des genres ont été supprimées car elles ne sont plus nécessaires

const Home = () => {
  const { theme } = useContext(ThemeContext);
  
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.6 } }
  };
  
  const slideUp = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.6 } }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  return (
    <Container fluid className="p-0">
      {/* Section Hero - Design minimaliste */}
      <div className={`${theme === 'dark' ? 'bg-dark' : 'bg-white'} py-5`}>
        <Container>
          <Row className="align-items-center py-5">
            <Col lg={6} className="mb-5 mb-lg-0">
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={fadeIn}
              >
                <h1 className="display-4 fw-bold mb-4" style={{ lineHeight: 1.2 }}>
                  Découvrez la littérature
                  <span className="d-block text-primary">sénégalaise et mondiale</span>
                </h1>
                <p className="lead mb-4">
                  Une bibliothèque numérique moderne pour organiser, découvrir et partager vos livres préférés.  
                </p>
                <div className="d-flex flex-wrap gap-3">
                  <Link to="/books">
                    <Button variant="primary" size="lg" className="fw-semibold">
                      <i className="bi bi-collection me-2"></i>
                      Explorer la bibliothèque
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button variant="outline-secondary" size="lg">
                      <i className="bi bi-person-plus me-2"></i>
                      Créer un compte
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div 
                initial="hidden"
                animate="visible"
                variants={slideUp}
                className="text-center"
              >
                <img 
                  src="https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
                  alt="Bibliothèque" 
                  className="img-fluid rounded-4 shadow"
                  style={{ maxHeight: '500px', objectFit: 'cover' }}
                />
              </motion.div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Section Fonctionnalités - Design épuré */}
      <div className={`${theme === 'dark' ? 'bg-black' : 'bg-light'} py-5`}>
        <Container>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeIn}
            className="text-center mb-5"
          >
            <h2 className="display-6 fw-bold mb-3">Une expérience de lecture simplifiée</h2>
            <p className="lead text-muted">Découvrez les fonctionnalités qui font de Fawsayni Tech votre bibliothèque idéale</p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <Row className="g-4">
              {features.map((feature, index) => (
                <Col md={4} key={index}>
                  <motion.div variants={slideUp}>
                    <div className={`feature-card p-4 rounded-4 ${theme === 'dark' ? 'bg-dark' : 'bg-white'} shadow-sm h-100`}>
                      <div className="d-flex align-items-center mb-4">
                        <div className={`feature-icon rounded-circle d-flex align-items-center justify-content-center me-3 ${feature.iconBg}`}>
                          <i className={`bi ${feature.icon} text-white fs-4`}></i>
                        </div>
                        <h3 className="fs-5 fw-bold mb-0">{feature.title}</h3>
                      </div>
                      <p className="text-muted mb-4">{feature.description}</p>
                      <Link to={feature.link} className="btn btn-sm btn-link text-decoration-none p-0">
                        {feature.linkText} <i className="bi bi-arrow-right"></i>
                      </Link>
                    </div>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </motion.div>
        </Container>
      </div>

      {/* La section Explorez par genre a été supprimée */}

      {/* Section CTA - Design minimaliste */}
      <div className={`${theme === 'dark' ? 'bg-dark' : 'bg-light'} py-5`}>
        <Container>
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeIn}
          >
            <Row className="justify-content-center">
              <Col md={8} className="text-center">
                <h2 className="display-6 fw-bold mb-4">Prêt à commencer ?</h2>
                <p className="lead mb-4">Rejoignez notre communauté de lecteurs et commencez à gérer votre bibliothèque personnelle dès aujourd'hui.</p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Link to="/register">
                    <Button variant="primary" size="lg" className="fw-semibold px-4">
                      <i className="bi bi-person-plus me-2"></i>
                      S'inscrire gratuitement
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button variant="outline-secondary" size="lg" className="px-4">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Se connecter
                    </Button>
                  </Link>
                </div>
              </Col>
            </Row>
          </motion.div>
        </Container>
      </div>
    </Container>
  );
};

export default Home;
