import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, Modal } from 'react-bootstrap';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import BookService from '../services/bookService';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const BookDetail = ({ isAuthenticated, user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      const response = await BookService.getBookById(id);
      setBook(response.data.book);
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement du livre');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await BookService.deleteBook(id);
      toast.success('Livre supprimé avec succès');
      navigate('/books');
    } catch (err) {
      toast.error('Erreur lors de la suppression du livre');
      console.error(err);
    }
  };

  // Vérifier si l'utilisateur est connecté et a le droit de modifier/supprimer
  // Pour le développement, on vérifie uniquement si l'utilisateur est connecté
  // En production, on vérifiera aussi si c'est le propriétaire ou un admin
  const canEditDelete = isAuthenticated && user;

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

  if (loading) {
    return (
      <Container className="text-center my-5">
        <div className="form-container p-5">
          <div className="d-flex flex-column align-items-center justify-content-center">
            <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-3 text-muted">Chargement des informations du livre...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !book) {
    return (
      <Container className="my-5">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="form-container"
        >
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
            <div>
              <h4>Erreur</h4>
              <p className="mb-0">{error || 'Livre non trouvé'}</p>
            </div>
          </Alert>
          <div className="text-center mt-4">
            <Button as={Link} to="/books" variant="primary" className="form-btn form-btn-primary">
              <i className="bi bi-arrow-left me-2"></i>
              Retour à la liste des livres
            </Button>
          </div>
        </motion.div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="form-container"
      >
        <Row className="g-4">
          <Col lg={4} className="mb-4">
            <motion.div variants={itemVariants}>
              <Card className="book-detail-card shadow-sm border-0 h-100">
                <div className="book-image-container position-relative">
                  <Card.Img 
                    variant="top" 
                    src={book.coverImage ? 
                      (book.coverImage.startsWith('http') ? 
                        book.coverImage : 
                        `http://localhost:5001/${book.coverImage}`
                      ) : 
                      'https://via.placeholder.com/300x400?text=Pas+d%27image'
                    } 
                    alt={book.title}
                    className="img-fluid book-cover-image"
                    onError={(e) => {
                      console.log('Erreur de chargement de l\'image:', book.coverImage);
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/300x400?text=Image+non+disponible';
                    }}
                  />
                  <div className="book-status-badge">
                    <Badge 
                      bg={book.available ? 'success' : 'danger'} 
                      className="position-absolute top-0 end-0 m-2 py-2 px-3"
                    >
                      <i className={`bi ${book.available ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                      {book.available ? 'Disponible' : 'Indisponible'}
                    </Badge>
                  </div>
                </div>
                {canEditDelete && (
                  <Card.Footer className="d-flex justify-content-between p-3 border-0">
                    <Button 
                      as={Link} 
                      to={`/books/edit/${book._id}`} 
                      variant="warning" 
                      className="form-btn w-100 me-2"
                      size="sm"
                    >
                      <i className="bi bi-pencil-square me-1"></i> Modifier
                    </Button>
                    
                    <Button 
                      variant="danger" 
                      onClick={() => setShowDeleteModal(true)}
                      className="form-btn w-100"
                      size="sm"
                    >
                      <i className="bi bi-trash me-1"></i> Supprimer
                    </Button>
                  </Card.Footer>
                )}
              </Card>
            </motion.div>
          </Col>
          
          <Col lg={8}>
            <motion.div variants={itemVariants}>
              <div className="book-detail-content">
                <h1 className="book-title display-5 fw-bold">{book.title}</h1>
                <h4 className="text-muted mb-3 fst-italic">par {book.author}</h4>
                
                <div className="book-badges mb-4">
                  {book.genre && (
                    <Badge bg="info" className="me-2 py-2 px-3">
                      <i className="bi bi-tag-fill me-1"></i>
                      {book.genre}
                    </Badge>
                  )}
                  {book.publishedYear && (
                    <Badge bg="secondary" className="me-2 py-2 px-3">
                      <i className="bi bi-calendar-event me-1"></i>
                      {book.publishedYear}
                    </Badge>
                  )}
                </div>
                
                <div className="book-details mb-4">
                  <div className="row g-3">
                    {book.isbn && (
                      <div className="col-md-6">
                        <div className="detail-item d-flex align-items-center">
                          <div className="detail-icon me-2">
                            <i className="bi bi-upc-scan text-primary"></i>
                          </div>
                          <div className="detail-content">
                            <div className="detail-label text-muted">ISBN</div>
                            <div className="detail-value fw-bold">{book.isbn}</div>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="col-md-6">
                      <div className="detail-item d-flex align-items-center">
                        <div className="detail-icon me-2">
                          <i className="bi bi-bookmark-check text-primary"></i>
                        </div>
                        <div className="detail-content">
                          <div className="detail-label text-muted">Statut</div>
                          <div className="detail-value fw-bold">
                            <span className={`text-${book.available ? 'success' : 'danger'}`}>
                              {book.available ? 'Disponible pour emprunt' : 'Indisponible'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="book-description mb-4">
                  <h5 className="section-title"><i className="bi bi-file-text me-2"></i>Description</h5>
                  <div className="description-content p-3 rounded">
                    {book.description ? (
                      <p className="mb-0">{book.description}</p>
                    ) : (
                      <p className="text-muted fst-italic mb-0">Aucune description disponible pour ce livre.</p>
                    )}
                  </div>
                </div>
                
                <div className="book-actions mt-4 d-flex flex-wrap gap-2">
                  <Button 
                    as={Link} 
                    to="/books" 
                    variant="outline-primary"
                    className="form-btn form-btn-outline"
                  >
                    <i className="bi bi-arrow-left me-2"></i> Retour à la liste
                  </Button>
                </div>
              </div>
            </motion.div>
          </Col>
        </Row>
      </motion.div>

      {/* Modal de confirmation de suppression */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        centered
        className="delete-confirmation-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Confirmer la suppression
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <div className="text-center mb-3">
            <div className="delete-icon mb-3">
              <i className="bi bi-trash-fill text-danger"></i>
            </div>
            <h5>Êtes-vous sûr de vouloir supprimer ce livre ?</h5>
            <p className="text-muted mb-0">Vous êtes sur le point de supprimer <strong>"{book.title}"</strong>.</p>
            <p className="text-danger">Cette action est irréversible.</p>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0 pt-0">
          <Button 
            variant="outline-secondary" 
            onClick={() => setShowDeleteModal(false)}
            className="form-btn form-btn-outline me-2"
          >
            <i className="bi bi-x-circle me-2"></i>
            Annuler
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            className="form-btn"
          >
            <i className="bi bi-trash me-2"></i>
            Supprimer définitivement
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default BookDetail;
