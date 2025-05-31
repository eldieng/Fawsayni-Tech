import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, InputGroup, Alert, Spinner, Button, Pagination, Card, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import BookService from '../services/bookService';
import AuthService from '../services/authService';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const BookList = () => {
  const navigate = useNavigate();
  const { theme } = useContext(ThemeContext);
  
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState({ genre: '', available: '' });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalBooks: 0,
    hasNextPage: false,
    hasPrevPage: false
  });
  
  const isAuthenticated = AuthService.isAuthenticated();
  const currentUser = AuthService.getCurrentUser();
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3 }
    }
  };

  useEffect(() => {
    fetchBooks(1);
  }, [filter]);

  const fetchBooks = async (page = 1) => {
    try {
      setLoading(true);
      const params = {
        page,
        limit: 9 // Nombre de livres par page
      };
      
      if (filter.genre) params.genre = filter.genre;
      if (filter.available) params.available = filter.available;
      if (searchTerm.trim()) params.search = searchTerm.trim();
      
      const response = await BookService.getAllBooks(params);
      
      setBooks(response.data.books);
      setPagination({
        currentPage: response.currentPage || page,
        totalPages: response.totalPages || 1,
        totalBooks: response.totalBooks || response.data.books.length,
        hasNextPage: response.hasNextPage || false,
        hasPrevPage: response.hasPrevPage || false
      });
      
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement des livres');
      console.error('Erreur détaillée:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchBooks(1); // Rechercher avec le terme de recherche actuel
  };

  const handleFilterChange = (e) => {
    setFilter({
      ...filter,
      [e.target.name]: e.target.value
    });
  };

  const handlePageChange = (page) => {
    fetchBooks(page);
    // Faire défiler vers le haut de la page
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  // Utiliser les livres directement depuis l'API avec pagination
  // Plus besoin de filtrer côté client car c'est géré par l'API
  const filteredBooks = books;

  return (
    <Container className="py-4">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="form-container mb-4 p-4"
      >
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="display-5 fw-bold mb-0">
            <i className="bi bi-book me-2 text-primary"></i>
            Bibliothèque
          </h1>
          
          {isAuthenticated && (
            <Link to="/books/add">
              <Button variant="primary" className="form-btn">
                <i className="bi bi-plus-circle me-2"></i>
                Ajouter un livre
              </Button>
            </Link>
          )}
        </div>
        
        <motion.div 
          variants={itemVariants} 
          className="search-filter-container p-3 rounded mb-4"
        >
          <Row className="g-3">
            <Col md={6}>
              <Form onSubmit={handleSearchSubmit}>
                <InputGroup className="search-input-group">
                  <InputGroup.Text className="search-icon">
                    <i className="bi bi-search"></i>
                  </InputGroup.Text>
                  <Form.Control
                    placeholder="Rechercher par titre, auteur ou description..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    aria-label="Recherche"
                    className="search-input"
                  />
                  <Button variant="primary" type="submit" className="form-btn">
                    Rechercher
                  </Button>
                </InputGroup>
              </Form>
            </Col>
            <Col md={3}>
              <div className="filter-group">
                <div className="filter-label">
                  <i className="bi bi-tag me-2"></i>
                  Genre
                </div>
                <Form.Select 
                  name="genre" 
                  value={filter.genre} 
                  onChange={handleFilterChange}
                  aria-label="Filtrer par genre"
                  className="filter-select"
                >
                  <option value="">Tous les genres</option>
                  <option value="Fiction">Fiction</option>
                  <option value="Non-fiction">Non-fiction</option>
                  <option value="Science-fiction">Science-fiction</option>
                  <option value="Fantaisie">Fantaisie</option>
                  <option value="Biographie">Biographie</option>
                  <option value="Histoire">Histoire</option>
                  <option value="Roman">Roman</option>
                  <option value="Littérature africaine">Littérature africaine</option>
                  <option value="Poésie">Poésie</option>
                  <option value="Théâtre">Théâtre</option>
                  <option value="Autobiographie">Autobiographie</option>
                  <option value="Autre">Autre</option>
                </Form.Select>
              </div>
            </Col>
            <Col md={3}>
              <div className="filter-group">
                <div className="filter-label">
                  <i className="bi bi-bookmark-check me-2"></i>
                  Disponibilité
                </div>
                <Form.Select 
                  name="available" 
                  value={filter.available} 
                  onChange={handleFilterChange}
                  aria-label="Filtrer par disponibilité"
                  className="filter-select"
                >
                  <option value="">Tous les livres</option>
                  <option value="true">Disponibles</option>
                  <option value="false">Non disponibles</option>
                </Form.Select>
              </div>
            </Col>
          </Row>
        </motion.div>

        {loading ? (
          <div className="text-center my-5 p-5">
            <Spinner animation="border" role="status" variant="primary" style={{ width: '3rem', height: '3rem' }}>
              <span className="visually-hidden">Chargement...</span>
            </Spinner>
            <p className="mt-3 text-muted">Chargement des livres...</p>
          </div>
        ) : error ? (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2 fs-4"></i>
            <div>
              <h4>Erreur</h4>
              <p className="mb-0">{error}</p>
            </div>
          </Alert>
        ) : filteredBooks.length === 0 ? (
          <div className="text-center my-5 p-5">
            <div className="empty-state-icon mb-3">
              <i className="bi bi-search text-muted"></i>
            </div>
            <h4>Aucun livre trouvé</h4>
            <p className="text-muted">Essayez de modifier vos critères de recherche ou de filtrage.</p>
            <Button 
              variant="outline-primary" 
              className="form-btn form-btn-outline mt-3"
              onClick={() => {
                setSearchTerm('');
                setFilter({ genre: '', available: '' });
                fetchBooks(1);
              }}
            >
              <i className="bi bi-arrow-repeat me-2"></i>
              Réinitialiser les filtres
            </Button>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="books-count mb-3">
              <Badge bg="light" text="dark" className="p-2">
                <i className="bi bi-book me-1"></i>
                {pagination.totalBooks} livre{pagination.totalBooks > 1 ? 's' : ''} trouvé{pagination.totalBooks > 1 ? 's' : ''}
              </Badge>
            </div>
            
            <Row className="g-4">
              {filteredBooks.map((book, index) => (
                <Col key={book._id} lg={4} md={6} className="mb-4">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{ y: -5, transition: { duration: 0.2 } }}
                    className="h-100"
                  >
                    <Card className="book-card h-100 shadow-sm border-0">
                      <div className="position-relative">
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
                          className="book-cover-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/300x400?text=Image+non+disponible';
                          }}
                        />
                        <Badge 
                          bg={book.available ? 'success' : 'danger'} 
                          className="position-absolute top-0 end-0 m-2 py-2 px-3"
                        >
                          <i className={`bi ${book.available ? 'bi-check-circle' : 'bi-x-circle'} me-1`}></i>
                          {book.available ? 'Disponible' : 'Indisponible'}
                        </Badge>
                      </div>
                      <Card.Body className="d-flex flex-column">
                        <Card.Title className="book-title">{book.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted book-author">par {book.author}</Card.Subtitle>
                        
                        <div className="book-badges mb-2">
                          {book.genre && (
                            <Badge bg="info" className="me-1">
                              <i className="bi bi-tag-fill me-1"></i>
                              {book.genre}
                            </Badge>
                          )}
                          {book.publishedYear && (
                            <Badge bg="secondary" className="me-1">
                              <i className="bi bi-calendar-event me-1"></i>
                              {book.publishedYear}
                            </Badge>
                          )}
                        </div>
                        
                        <Card.Text className="book-description flex-grow-1">
                          {book.description && book.description.length > 100 
                            ? `${book.description.substring(0, 100)}...` 
                            : book.description || 'Aucune description disponible.'}
                        </Card.Text>
                        
                        <div className="mt-auto pt-3">
                          <Button 
                            variant="primary" 
                            className="form-btn w-100"
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
          </motion.div>
        )}
      
        {/* Pagination */}
        {!loading && !error && filteredBooks.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="d-flex flex-column align-items-center mt-5"
          >
            <div className="pagination-info mb-3 text-muted">
              Page {pagination.currentPage} sur {pagination.totalPages}
            </div>
            <Pagination className="custom-pagination">
              <Pagination.First 
                onClick={() => handlePageChange(1)} 
                disabled={!pagination.hasPrevPage}
              />
              <Pagination.Prev 
                onClick={() => handlePageChange(pagination.currentPage - 1)} 
                disabled={!pagination.hasPrevPage}
              />
              
              {/* Afficher les pages */}
              {[...Array(pagination.totalPages).keys()].map(x => {
                const pageNumber = x + 1;
                // Afficher seulement quelques pages autour de la page courante
                if (
                  pageNumber === 1 || 
                  pageNumber === pagination.totalPages || 
                  (pageNumber >= pagination.currentPage - 1 && 
                   pageNumber <= pagination.currentPage + 1)
                ) {
                  return (
                    <Pagination.Item 
                      key={pageNumber} 
                      active={pageNumber === pagination.currentPage}
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </Pagination.Item>
                  );
                } else if (
                  pageNumber === pagination.currentPage - 2 || 
                  pageNumber === pagination.currentPage + 2
                ) {
                  return <Pagination.Ellipsis key={`ellipsis-${pageNumber}`} />;
                }
                return null;
              })}
              
              <Pagination.Next 
                onClick={() => handlePageChange(pagination.currentPage + 1)} 
                disabled={!pagination.hasNextPage}
              />
              <Pagination.Last 
                onClick={() => handlePageChange(pagination.totalPages)} 
                disabled={!pagination.hasNextPage}
              />
            </Pagination>
          </motion.div>
        )}
      </motion.div>
    </Container>
  );
};

export default BookList;
