import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Alert, Spinner, Button, Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import BookService from '../services/bookService';
import AuthService from '../services/authService';
import BookCard from '../components/BookCard';
import { motion } from 'framer-motion';

const BookList = () => {
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
    <Container>
      <h1 className="mb-4">Bibliothèque</h1>
      
      <Row className="mb-4">
        <Col md={6}>
          <Form onSubmit={handleSearchSubmit}>
            <InputGroup>
              <Form.Control
                placeholder="Rechercher par titre, auteur ou description..."
                value={searchTerm}
                onChange={handleSearchChange}
                aria-label="Recherche"
              />
              <Button variant="primary" type="submit">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </Col>
        <Col md={3}>
          <Form.Select 
            name="genre" 
            value={filter.genre} 
            onChange={handleFilterChange}
            aria-label="Filtrer par genre"
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
            <option value="Essai">Essai</option>
            <option value="Conte">Conte</option>
            <option value="Théâtre">Théâtre</option>
            <option value="Autobiographie">Autobiographie</option>
            <option value="Autre">Autre</option>
          </Form.Select>
        </Col>
        <Col md={3}>
          <Form.Select 
            name="available" 
            value={filter.available} 
            onChange={handleFilterChange}
            aria-label="Filtrer par disponibilité"
          >
            <option value="">Tous les livres</option>
            <option value="true">Disponibles</option>
            <option value="false">Non disponibles</option>
          </Form.Select>
        </Col>
      </Row>

      {isAuthenticated && (
        <div className="mb-4 text-end">
          <Link to="/books/add">
            <Button variant="primary">
              <i className="bi bi-plus-circle me-2"></i>
              Ajouter un livre
            </Button>
          </Link>
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : filteredBooks.length === 0 ? (
        <Alert variant="info">Aucun livre trouvé.</Alert>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Row>
            {filteredBooks.map((book, index) => (
              <Col key={book._id} md={4} className="mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <BookCard book={book} />
                </motion.div>
              </Col>
            ))}
          </Row>
        </motion.div>
      )}
      
      {/* Pagination */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
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
        </div>
      )}
    </Container>
  );
};

export default BookList;
