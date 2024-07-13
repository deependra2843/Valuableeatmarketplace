import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useEffect } from 'react';
import Footer from '../Footer';
import Navbarcart from './CardComponent/Navbarcart';
const SuccessPage = () => {

  return (
    <>
    <Navbarcart/>
    
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }} className="text-center">
          <h2>Payment Successful!</h2>
          <p>Your order has been successfully placed.</p>
          <p>Thank you for choosing us!</p>
          <Button variant="primary" as={Link} to="/">Back to Home</Button>
        </Col>
      </Row>
    </Container>
    <Footer/>
    </>
  );
};

export default SuccessPage;
