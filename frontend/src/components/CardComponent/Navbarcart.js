import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { Navbar, Container, Nav, FormControl, Button, Form } from 'react-bootstrap';
import { BsSearch, BsPersonCircle } from 'react-icons/bs';
const Navbarcart = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = async () => {
    try {
      // Redirect to search page with query parameter and city name
      const queryParams = new URLSearchParams(window.location.search);
      const city = queryParams.get('city');
      window.location.href = `/restaurant/food/search?foodName=${searchQuery}&city=${city}`;
    } catch (error) {
      console.error('Error searching for restaurants:', error);
      // Handle error, show message to user, etc.
    }
  };
  
 

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
    handleSearch();
    }
  };

  return (
    <>
    <Navbar    style={{   height:'80px', padding:'0px'   ,background: 'linear-gradient(to right, yellow, grey)'}}>
      <Container style={{margin:'0px'}}>
        <Navbar.Brand href="#home" style={{color:'blue', fontFamily:'fantasy', fontWeight:'bold'}} >
        <img src='/images/food.png' alt="Logo" style={{ width: '90px', height: '90px', margin: '5px'}} />
          Valuable Eat's MarketPlace
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* <Nav className="me-auto">
            <Button variant="outline-success" onClick={handleSearch} style={{marginRight:'10px',marginLeft:'20%'}}><BsSearch /></Button>
            <FormControl
              type="text"
              placeholder="Enter your favourite food"
              className="me-sm-2 ms-sm-auto" 
              value={searchQuery}
              style={{ fontSize: '16px', width:'600px',border:'2px solid black'}}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </Nav>
          <Nav className="ms"> 
       */}


          {/* </Nav> */}
          <Nav className="ms"> 
            
            <a href="/user/cart" style={{color:'none',marginLeft:'900px'}}>
       <svg xmlns="http://www.w3.org/2000/svg" width="24" style={{color:'black'}} height="24" fill="currentColor"  class="bi bi-cart-fill" viewBox="0 0 16 16">
         <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
       </svg>
            </a>
            </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>

   </>
  );
};

export default Navbarcart;
