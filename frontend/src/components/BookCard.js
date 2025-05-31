import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const BookCard = ({ book }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)'
      }}
    >
      <Card className="h-100">
        <Card.Img 
          variant="top" 
          src={book.coverImage ? 
            (book.coverImage.startsWith('http') ? 
              book.coverImage : 
              `http://localhost:5001/${book.coverImage}`
            ) : 
            'https://via.placeholder.com/150x200?text=Pas+d%27image'
          } 
          alt={book.title}
          className="book-cover"
          onError={(e) => {
            console.log('Erreur de chargement de l\'image:', book.coverImage);
            e.target.onerror = null;
            e.target.src = 'https://via.placeholder.com/150x200?text=Image+non+disponible';
          }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{book.title}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {book.author}
          </Card.Subtitle>
          <Card.Text>
            {book.description && book.description.length > 100
              ? `${book.description.substring(0, 100)}...`
              : book.description}
          </Card.Text>
          <div className="mt-auto">
            <div className="d-flex gap-2 mb-2">
              <Badge bg={book.available ? 'success' : 'danger'} className="py-2 px-3">
                {book.available ? 'Disponible' : 'Indisponible'}
              </Badge>
              {book.genre && (
                <Badge bg="info" className="py-2 px-3">
                  {book.genre}
                </Badge>
              )}
            </div>
          </div>
          <div className="mt-3">
            <Link to={`/books/${book._id}`}>
              <Button variant="outline-primary" className="w-100">
                <i className="bi bi-book me-2"></i>
                Voir les détails
              </Button>
            </Link>
          </div>
        </Card.Body>
      </Card>
    </motion.div>
  );
};

export default BookCard;
