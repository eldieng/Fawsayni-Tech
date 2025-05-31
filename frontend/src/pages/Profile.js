import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Alert, Spinner, Tab, Tabs, Badge, Image } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import AuthService from '../services/authService';
import BookService from '../services/bookService';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [userBooks, setUserBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    setFormData({
      ...formData,
      name: currentUser.name || '',
      email: currentUser.email || ''
    });

    // Charger les livres de l'utilisateur
    fetchUserBooks(currentUser.id);
  }, []);

  const fetchUserBooks = async (userId) => {
    try {
      setLoading(true);
      // Récupérer les livres ajoutés par l'utilisateur
      const response = await BookService.getAllBooks({ user: userId });
      setUserBooks(response.data.books || []);
    } catch (err) {
      console.error('Erreur lors du chargement des livres:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setUpdateLoading(true);

    // Validation
    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      setUpdateLoading(false);
      return;
    }

    try {
      // Ici, vous devriez appeler votre API pour mettre à jour les informations de l'utilisateur
      // Pour l'instant, nous simulons une mise à jour réussie
      setTimeout(() => {
        // Mise à jour simulée
        const updatedUser = {
          ...user,
          name: formData.name,
          email: formData.email
        };
        
        // Mettre à jour le localStorage
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        setSuccess('Profil mis à jour avec succès');
        setUpdateLoading(false);
        toast.success('Profil mis à jour avec succès');
      }, 1000);
    } catch (err) {
      setError('Erreur lors de la mise à jour du profil');
      setUpdateLoading(false);
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
  
  const tabVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 } 
    }
  };

  if (!user) {
    return (
      <Container className="text-center my-5">
        <div className="form-container p-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-3 text-muted">Chargement de votre profil...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="profile-form-container form-container mb-4"
      >
        <div className="text-center mb-4">
          <img 
            src={`https://ui-avatars.com/api/?name=${user.name}&background=random&size=100&font-size=0.33`} 
            alt="Avatar de profil" 
            className="profile-avatar"
          />
          <h2 className="form-title text-center mt-3">{user.name}</h2>
          <p className="text-muted">{user.email} • {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}</p>
        </div>
      
        <Tabs defaultActiveKey="info" className="mb-4 nav-tabs-custom">
          <Tab eventKey="info" title={<><i className="bi bi-person-fill me-2"></i>Informations</>}>
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              className="tab-content-custom"
            >
              {error && (
                <Alert variant="danger" className="d-flex align-items-center">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert variant="success" className="d-flex align-items-center">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  {success}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
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
                            placeholder="Votre nom complet"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </motion.div>
                  </Col>

                  <Col md={6}>
                    <motion.div variants={itemVariants}>
                      <Form.Group className="form-group" controlId="email">
                        <Form.Label className="form-label">Adresse email</Form.Label>
                        <div className="input-with-icon">
                          <i className="bi bi-envelope icon"></i>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Votre adresse email"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </motion.div>
                  </Col>
                </Row>

                <motion.div variants={itemVariants}>
                  <hr className="my-4" />
                  <h4 className="mb-3"><i className="bi bi-shield-lock me-2"></i>Changer de mot de passe</h4>
                  <p className="text-muted small">Laissez vide si vous ne souhaitez pas changer votre mot de passe</p>
                </motion.div>

                <Row>
                  <Col md={12}>
                    <motion.div variants={itemVariants}>
                      <Form.Group className="form-group" controlId="currentPassword">
                        <Form.Label className="form-label">Mot de passe actuel</Form.Label>
                        <div className="input-with-icon">
                          <i className="bi bi-key icon"></i>
                          <Form.Control
                            type="password"
                            name="currentPassword"
                            value={formData.currentPassword}
                            onChange={handleChange}
                            placeholder="Entrez votre mot de passe actuel"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </motion.div>
                  </Col>

                  <Col md={6}>
                    <motion.div variants={itemVariants}>
                      <Form.Group className="form-group" controlId="newPassword">
                        <Form.Label className="form-label">Nouveau mot de passe</Form.Label>
                        <div className="input-with-icon">
                          <i className="bi bi-lock icon"></i>
                          <Form.Control
                            type="password"
                            name="newPassword"
                            value={formData.newPassword}
                            onChange={handleChange}
                            placeholder="Nouveau mot de passe"
                            className="form-control"
                          />
                        </div>
                      </Form.Group>
                    </motion.div>
                  </Col>

                  <Col md={6}>
                    <motion.div variants={itemVariants}>
                      <Form.Group className="form-group" controlId="confirmPassword">
                        <Form.Label className="form-label">Confirmer</Form.Label>
                        <div className="input-with-icon">
                          <i className="bi bi-shield-lock icon"></i>
                          <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Confirmer le mot de passe"
                            className="form-control"
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
                    disabled={updateLoading}
                  >
                    {updateLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Mise à jour en cours...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check2-circle"></i>
                        Mettre à jour le profil
                      </>
                    )}
                  </Button>
                </motion.div>
              </Form>
            </motion.div>
          </Tab>
        
          <Tab eventKey="books" title={<><i className="bi bi-book-half me-2"></i>Mes Livres</>}>
            <motion.div
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              className="tab-content-custom"
            >
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h3 className="mb-0"><i className="bi bi-collection me-2"></i>Ma bibliothèque</h3>
                <Button 
                  variant="primary" 
                  onClick={() => navigate('/add-book')}
                  className="form-btn form-btn-primary"
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Ajouter un livre
                </Button>
              </div>
            
              {loading ? (
                <div className="text-center my-5">
                  <Spinner animation="border" role="status" variant="primary">
                    <span className="visually-hidden">Chargement...</span>
                  </Spinner>
                  <p className="mt-3 text-muted">Chargement de vos livres...</p>
                </div>
              ) : userBooks.length === 0 ? (
                <Alert variant="info" className="d-flex align-items-center">
                  <i className="bi bi-info-circle-fill me-2 fs-4"></i>
                  <div>
                    <p className="mb-0">Vous n'avez pas encore ajouté de livres.</p>
                    <Button 
                      variant="link" 
                      className="p-0 mt-2" 
                      onClick={() => navigate('/add-book')}
                    >
                      Ajouter votre premier livre
                    </Button>
                  </div>
                </Alert>
              ) : (
                <Row xs={1} md={2} lg={3} className="g-4">
                  {userBooks.map((book, index) => (
                    <Col key={book._id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                      >
                        <Card className="h-100 book-card shadow-sm">
                          <div className="book-image-container">
                            <Card.Img 
                              variant="top" 
                              src={book.coverImage?.startsWith('http') 
                                ? book.coverImage 
                                : `http://localhost:5001/${book.coverImage}`} 
                              style={{ height: '200px', objectFit: 'cover' }} 
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = 'https://via.placeholder.com/150x200?text=Image+non+disponible';
                              }}
                            />
                            <div className="book-overlay">
                              <Link to={`/books/${book._id}`} className="overlay-link">
                                <i className="bi bi-eye-fill"></i>
                              </Link>
                              <Link to={`/edit-book/${book._id}`} className="overlay-link">
                                <i className="bi bi-pencil-fill"></i>
                              </Link>
                            </div>
                          </div>
                          <Card.Body className="d-flex flex-column">
                            <Card.Title className="text-truncate">{book.title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted text-truncate">
                              {book.author}
                            </Card.Subtitle>
                            <div className="mt-auto">
                              <div className="d-flex gap-2 mb-2 flex-wrap">
                                <Badge bg={book.available ? 'success' : 'danger'} className="py-2 px-3">
                                  <i className={`bi ${book.available ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                                  {book.available ? 'Disponible' : 'Indisponible'}
                                </Badge>
                                {book.genre && (
                                  <Badge bg="info" className="py-2 px-3">
                                    <i className="bi bi-tag me-1"></i>
                                    {book.genre}
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <div className="mt-2">
                              <Button 
                                variant="outline-primary" 
                                className="form-btn form-btn-outline w-100"
                                onClick={() => navigate(`/books/${book._id}`)}
                              >
                                <i className="bi bi-book me-2"></i>
                                Voir les détails
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </motion.div>
                    </Col>
                  ))}
                </Row>
              )}
            </motion.div>
            
            {/* Statistiques */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={containerVariants}
              className="tab-content-custom"
            >
            <h3 className="mb-4"><i className="bi bi-bar-chart-line me-2"></i>Vos statistiques</h3>
            
            <Row>
              <Col md={4} className="mb-3">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <Card className="text-center h-100 shadow-sm stat-card">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                      <div className="stat-icon mb-3">
                        <i className="bi bi-collection-fill text-primary"></i>
                      </div>
                      <h1 className="display-4 fw-bold">{userBooks.length}</h1>
                      <p className="lead mb-0">Livres ajoutés</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              
              <Col md={4} className="mb-3">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <Card className="text-center h-100 shadow-sm stat-card">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                      <div className="stat-icon mb-3">
                        <i className="bi bi-check-circle-fill text-success"></i>
                      </div>
                      <h1 className="display-4 fw-bold">
                        {userBooks.filter(book => book.available).length}
                      </h1>
                      <p className="lead mb-0">Livres disponibles</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
              
              <Col md={4} className="mb-3">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <Card className="text-center h-100 shadow-sm stat-card">
                    <Card.Body className="d-flex flex-column align-items-center justify-content-center p-4">
                      <div className="stat-icon mb-3">
                        <i className="bi bi-x-circle-fill text-danger"></i>
                      </div>
                      <h1 className="display-4 fw-bold">
                        {userBooks.filter(book => !book.available).length}
                      </h1>
                      <p className="lead mb-0">Livres indisponibles</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            </Row>
            
            <motion.div 
              className="mt-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h4 className="mb-3"><i className="bi bi-pie-chart-fill me-2"></i>Répartition par genre</h4>
              <div className="genre-stats-container">
                {Array.from(new Set(userBooks.map(book => book.genre)))
                  .filter(genre => genre) // Filtrer les genres null ou undefined
                  .length === 0 ? (
                    <Alert variant="info" className="d-flex align-items-center">
                      <i className="bi bi-info-circle-fill me-2"></i>
                      Aucun genre spécifié pour vos livres.
                    </Alert>
                  ) : (
                    <ul className="list-group">
                      {Array.from(new Set(userBooks.map(book => book.genre)))
                        .filter(genre => genre) // Filtrer les genres null ou undefined
                        .map((genre, index) => (
                          <motion.li 
                            key={genre} 
                            className="list-group-item d-flex justify-content-between align-items-center genre-stat-item"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.4 + (index * 0.1), duration: 0.3 }}
                          >
                            <div className="d-flex align-items-center">
                              <i className="bi bi-tag-fill me-2 text-primary"></i>
                              {genre}
                            </div>
                            <Badge bg="primary" pill className="stat-badge">
                              {userBooks.filter(book => book.genre === genre).length}
                            </Badge>
                          </motion.li>
                        ))}
                    </ul>
                  )
                }
              </div>
            </motion.div>
          </motion.div>
        </Tab>
      </Tabs>
      </motion.div>
    </Container>
  );
};

export default Profile;
