import React, { useState, useContext } from 'react';
import { Container, Form, Button, Alert, Image, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import BookService from '../services/bookService';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const AddBook = ({ user }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    isbn: '',
    publishedYear: '',
    genre: '',
    available: true
  });
  const [coverImage, setCoverImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(file);
      // Créer un URL pour prévisualiser l'image
      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewImage(fileReader.result);
      };
      fileReader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation basique
      if (!formData.title || !formData.author) {
        setError('Le titre et l\'auteur sont obligatoires');
        setLoading(false);
        return;
      }

      // Validation de l'année de publication
      if (formData.publishedYear) {
        const year = parseInt(formData.publishedYear);
        const currentYear = new Date().getFullYear();
        if (isNaN(year) || year <= 0 || year > currentYear) {
          setError(`L'année de publication doit être un nombre entre 1 et ${currentYear}`);
          setLoading(false);
          return;
        }
      }

      // Créer un objet FormData pour envoyer les données du livre et l'image
      const bookFormData = new FormData();
      
      // Ajouter les données du livre
      Object.keys(formData).forEach(key => {
        bookFormData.append(key, formData[key]);
      });
      
      // Ajouter l'image si elle existe
      if (coverImage) {
        bookFormData.append('coverImage', coverImage);
      }
      
      // Appel au service pour créer le livre avec l'image
      await BookService.createBookWithImage(bookFormData);
      
      toast.success('Livre ajouté avec succès !');
      navigate('/books');
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de l\'ajout du livre');
      toast.error('Échec de l\'ajout du livre');
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
        className="book-form-container form-container form-animate"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2 className="form-title">Ajouter un nouveau livre</h2>
        
        {error && (
          <Alert variant="danger" className="d-flex align-items-center">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            {error}
          </Alert>
        )}
        
        {previewImage && (
          <motion.div 
            className="book-form-preview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Image 
              src={previewImage} 
              alt="Prévisualisation de la couverture" 
              style={{ maxHeight: '250px' }} 
              className="shadow"
            />
          </motion.div>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Row>
            <Col lg={6}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="title">
                  <Form.Label className="form-label">Titre <span className="text-danger">*</span></Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-book icon"></i>
                    <Form.Control
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Entrez le titre du livre"
                      className="form-control"
                      required
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col lg={6}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="author">
                  <Form.Label className="form-label">Auteur <span className="text-danger">*</span></Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-person-circle icon"></i>
                    <Form.Control
                      type="text"
                      name="author"
                      value={formData.author}
                      onChange={handleChange}
                      placeholder="Entrez le nom de l'auteur"
                      className="form-control"
                      required
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col lg={12}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="description">
                  <Form.Label className="form-label">Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={4}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Entrez une description du livre"
                    className="form-control"
                  />
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={6} lg={4}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="isbn">
                  <Form.Label className="form-label">ISBN</Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-upc-scan icon"></i>
                    <Form.Control
                      type="text"
                      name="isbn"
                      value={formData.isbn}
                      onChange={handleChange}
                      placeholder="Entrez le numéro ISBN"
                      className="form-control"
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={6} lg={4}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="publishedYear">
                  <Form.Label className="form-label">Année de publication</Form.Label>
                  <div className="input-with-icon">
                    <i className="bi bi-calendar-event icon"></i>
                    <Form.Control
                      type="number"
                      name="publishedYear"
                      value={formData.publishedYear}
                      onChange={handleChange}
                      placeholder="Année de publication"
                      className="form-control"
                    />
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={12} lg={4}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="genre">
                  <Form.Label className="form-label">Genre</Form.Label>
                  <Form.Select
                    name="genre"
                    value={formData.genre}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Sélectionnez un genre</option>
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
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={12}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="coverImage">
                  <Form.Label className="form-label">Image de couverture</Form.Label>
                  <div className="file-upload">
                    <Form.Control
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="form-control"
                    />
                    <small className="text-muted d-block mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Sélectionnez une image de couverture pour le livre (JPG, PNG, etc.)
                    </small>
                  </div>
                </Form.Group>
              </motion.div>
            </Col>

            <Col md={12}>
              <motion.div variants={itemVariants}>
                <Form.Group className="form-group" controlId="available">
                  <Form.Check
                    type="checkbox"
                    name="available"
                    checked={formData.available}
                    onChange={handleChange}
                    label="Livre disponible pour emprunt"
                    className="form-check"
                  />
                </Form.Group>
              </motion.div>
            </Col>
          </Row>

          <motion.div variants={itemVariants} className="mt-4">
            <Row className="g-3">
              <Col md={6}>
                <Button 
                  variant="primary" 
                  type="submit" 
                  className="form-btn form-btn-primary w-100" 
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Ajout en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-plus-circle"></i>
                      Ajouter le livre
                    </>
                  )}
                </Button>
              </Col>
              <Col md={6}>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate('/books')}
                  className="form-btn form-btn-outline w-100"
                >
                  <i className="bi bi-x-circle"></i>
                  Annuler
                </Button>
              </Col>
            </Row>
          </motion.div>
        </Form>
      </motion.div>
    </Container>
  );
};

export default AddBook;
