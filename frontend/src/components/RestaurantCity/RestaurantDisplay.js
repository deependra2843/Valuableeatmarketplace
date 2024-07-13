import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import './RestaurantDisplay.css';
import { toast,ToastContainer } from 'react-toastify';

const RestaurantDisplay = () => {
  const location = useLocation();
  const restaurantName = new URLSearchParams(location.search).get('name');
  const cityName = new URLSearchParams(location.search).get('city');
  const [menuItems, setMenuItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  useEffect(() => {
    fetchMenuItemData();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        fetchMoreItems();
      }
    });

    if (observer.current && menuItems.length > 0) {
      observer.current.observe(document.querySelector('.observer-element'));
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, []);

  useEffect(() => {
    setPage(1); 
  }, [location.search]);

  useEffect(() => {
    if (observer.current && menuItems.length > 0) {
      observer.current.observe(document.querySelector('.observer-element'));
    }
  }, [menuItems]);

  const fetchMenuItemData = () => {
    // Fetch menu item data from the backend
    fetch(`http://localhost:8009/restaurant/?name=${restaurantName}&city=${cityName}&page=${page}`)
      .then(response => response.json())
      .then(data => {
        const menuItemsWithQuantity = data.map(item => ({ ...item, quantity: 1 }));
        setMenuItems(prevItems => [...prevItems, ...menuItemsWithQuantity]);
        console.log(menuItems);
        setIsLoading(false); // Data fetching complete
        setPage(prevPage => prevPage + 1); // Increment page for next fetch
      })
      .catch(error => console.error('Error fetching menu item data:', error));
  };

  const fetchMoreItems = () => {
    // Fetch more items from the backend when intersection occurs
    fetchMenuItemData();
  };

  const incrementQuantity = (index) => {
    const newMenuItems = [...menuItems];
    newMenuItems[index] = { ...newMenuItems[index], quantity: newMenuItems[index].quantity + 1 };
    setMenuItems(newMenuItems);
  };

  const decrementQuantity = (index) => {
    const newMenuItems = [...menuItems];
    if (newMenuItems[index].quantity > 1) {
      newMenuItems[index] = { ...newMenuItems[index], quantity: newMenuItems[index].quantity - 1 };
      setMenuItems(newMenuItems);
    }
  };


  const handleAddToCart = async (menuItem) => {
    const searchParams = new URLSearchParams(location.search);
       
    const city = searchParams.get('city');
    try {
      const response = await fetch('http://localhost:8009/user/update-cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          restaurantId: menuItem._id,
          city: city
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }
      toast.success('Item added to cart successfully!', {
        position: "top-center", // Position the toast at top-middle
      });
      console.log('Item added to cart successfully');
    } catch (error) {
      console.error('Error adding item to cart:', error);
    }
  };



  return (
    <Container>
      <Row>
        <Col lg={10}>
          <div style={{ width: '100%', margin: '0 auto' }}>
            {isLoading ? (
              <p>Loading...</p>
            ) : (
              <>
                <Card className="mb-4 custom-card" style={{ width: '130%', height: '230px' }}>
                  <Card.Body>
                    <Card.Title className="restaurant-name">{menuItems[0].restaurantName}</Card.Title>
                    <Card.Text className="restaurant-address">{menuItems[0].address}</Card.Text>
                  </Card.Body>
                </Card>

                <Card className="mb-4 custom-card" style={{ width: '130%', height: 'auto' }}>
  <Card.Body>
    <Card.Title className="menu-item">Menu</Card.Title>
    <hr className="bg-dark" />

    {menuItems.slice(0, page * 10).map((menuItem, index) => (
      <div key={index}>
        <Row className="mb-3">
          <Col lg={6}>
            <h5 className='item-name'>{menuItem.item}</h5>
            <p className='item-price'>{menuItem.price}</p>
          </Col>
          <Col lg={6} className="d-flex align-items-center">
            <img src={menuItem.image} alt={menuItem.name} className="img-fluid" style={{ maxWidth: '45%', maxHeight: '70%', borderRadius: '4px' }} />
          
            <button className="custom-add-item" onClick={() => handleAddToCart(menuItem)}>Add Item</button>
              {/* <div className="d-flex align-items-center custom-quantity">
                <Button onClick={() => decrementQuantity(index)} className="plus-minus-button">-</Button>
                <div className="quantity-square">{menuItem.quantity}</div>
                <Button onClick={() => incrementQuantity(index)} className="plus-minus-button">+</Button>
              </div> */}
                  <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

          </Col>
        </Row>
        {index !== menuItems.length - 1 && <div className="custom-line"></div>}
      </div>
    ))}
    <div className="observer-element"></div>
  </Card.Body>
</Card>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default RestaurantDisplay;
