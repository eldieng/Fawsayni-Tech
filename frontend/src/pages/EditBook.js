import React, { useState, useEffect, useContext } from 'react';
import { Container, Form, Button, Alert, Spinner, Image, Row, Col } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import BookService from '../services/bookService';
import { ThemeContext } from '../contexts/ThemeContext';
import '../styles/FormStyles.css';

const EditBook = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const [fetchLoading, setFetchLoading] = useState(true);

  useEffect(() => {
    fetchBook();
  }, [id]);

  const fetchBook = async () => {
    try {
      setFetchLoading(true);
      console.log('Récupération du livre avec ID:', id);
      const response = await BookService.getBookById(id);
      const book = response.data.book;
      console.log('Livre récupéré:', book);
      
      // Désactivé pour le développement
      // En production, décommentez ce bloc pour activer la vérification des permissions
      /*
      if (user && user.role !== 'admin' && book.user !== user.id) {
        toast.error('Vous n\'\u00eates pas autoris\u00e9 \u00e0 modifier ce livre');
        navigate('/books');
        return;
      }
      */
      
      // Préparer les données du formulaire
      setFormData({
        title: book.title || '',
        author: book.author || '',
        description: book.description || '',
        isbn: book.isbn || '',
        publishedYear: book.publishedYear || '',
        genre: book.genre || '',
        available: book.available
      });
      
      // Initialiser l'aperçu de l'image si elle existe
      if (book.coverImage) {
        setPreviewImage(book.coverImage.startsWith('http') 
          ? book.coverImage 
          : `http://localhost:5001/${book.coverImage}`);
      }
      
      setError('');
    } catch (err) {
      setError('Erreur lors du chargement du livre');
      console.error('Erreur détaillée:', err);
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    
    if (name === 'coverImage' && files && files.length > 0) {
      setCoverImage(files[0]);
      setPreviewImage(URL.createObjectURL(files[0]));
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
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

      console.log('Soumission du formulaire avec les données:', formData);
      console.log('Image de couverture:', coverImage);
      
      // Créer un objet FormData pour envoyer les données et l'image
      const formDataToSend = new FormData();
      
      // Ajouter les champs du formulaire
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });
      
      // Ajouter l'image si elle existe
      if (coverImage) {
        formDataToSend.append('coverImage', coverImage);
      }
      
      // Appel au service pour mettre à jour le livre avec l'image
      await BookService.updateBookWithImage(id, formDataToSend);
      
      toast.success('Livre mis à jour avec succès !');
      navigate(`/books/${id}`);
    } catch (err) {
      console.error('Erreur détaillée lors de la mise à jour:', err);
      setError(err.message || 'Une erreur est survenue lors de la mise à jour du livre');
      toast.error('Échec de la mise à jour du livre');
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

  if (fetchLoading) {
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

  return (
    <Container className="py-5">
      <motion.div 
        className="book-form-container form-container form-animate"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <h2 className="form-title">Modifier le livre</h2>
        
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
              alt="Aperçu de la couverture" 
              style={{ maxHeight: '250px' }} 
              className="shadow"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://via.placeholder.com/150x200?text=Image+non+disponible';
              }}
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
                      name="coverImage"
                      onChange={handleChange}
                      accept="image/*"
                      className="form-control"
                    />
                    <small className="text-muted d-block mt-2">
                      <i className="bi bi-info-circle me-1"></i>
                      Sélectionnez une nouvelle image pour modifier la couverture actuelle
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
                      Mise à jour en cours...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-check2-circle"></i>
                      Mettre à jour le livre
                    </>
                  )}
                </Button>
              </Col>
              <Col md={6}>
                <Button 
                  variant="outline-secondary" 
                  onClick={() => navigate(`/books/${id}`)}
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

export default EditBook;
