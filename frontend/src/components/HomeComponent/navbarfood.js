import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import Search from './RestaurantComponent/SearchRestaurant.js';
import { Navbar, Container, Nav, FormControl, Button, Dropdown, DropdownButton, Form } from 'react-bootstrap';
import { BsSearch, BsPersonCircle } from 'react-icons/bs';
import Carousel from './Carousel.js'
import CardServices from './Services.js';

const PrimarySearchAppBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };


  
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:8009/search?city=${searchQuery}`);


      console.log(response.data);
  

      setSearchResults(response.data);
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
        <Navbar.Brand href="#home" style={{color:'blue', fontFamily:'fantasy',fontSize:"1.5rem"}} >
          <img src='./images/food.png' alt="Logo" style={{ width: '90px', height: '90px', margin: '5px'}} />
          Valuable Eat's MarketPlace
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Button variant="outline-success" onClick={handleSearch} style={{marginRight:'10px',marginLeft:'15%'}}><BsSearch /></Button>
            <FormControl
              type="text"
              placeholder="Enter your city"
              className="me-sm-2 ms-sm-auto" 
              value={searchQuery}
              style={{ fontSize: '16px', width:'600px',border:'2px solid black'}}
              onChange={handleSearchInputChange}
              onKeyPress={handleKeyPress}
            />
          </Nav>
          <Nav className="ms"> 
            <Link to="/login" className="nav-link me-7" style={{color:'red',fontWeight:'bold', fontFamily:'cursive',marginRight:'20px',fontSize:'20px'}}>Login</Link> {/* Added margin to separate links */}
            <Link to="/register" className="nav-link" style={{color:'blue', fontWeight:'bold',fontFamily:'cursive', fontSize:'20px', marginRight:"15%"}}>Register</Link>

  
          </Nav>
              <DropdownButton id="dropdown-basic-button" title={<BsPersonCircle style={{color:'black'}}/>} style={{  fontWeight: 'bold', fontFamily: 'cursive' }} >
                <Dropdown.Item href="/dash">Profile</Dropdown.Item>
                <Dropdown.Item href="/logout">Logout</Dropdown.Item>
              </DropdownButton>
      
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Carousel/> 
        <CardServices city={searchQuery}/>

    <Search searchResults={searchResults}/>
   </>
  );
};

export default PrimarySearchAppBar;
