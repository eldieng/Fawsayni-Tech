import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container className="py-5 text-center">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-1">404</h1>
          <h2 className="mb-4">Page non trouvée</h2>
          <p className="lead mb-5">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Button as={Link} to="/" variant="primary" size="lg">
            Retour à l'accueil
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default NotFound;
