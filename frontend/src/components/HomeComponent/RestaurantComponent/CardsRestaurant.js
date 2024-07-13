import React, { useState, useEffect, useRef } from 'react';
import Card from 'react-bootstrap/Card';
import { Link, useNavigate } from 'react-router-dom';

const Cards = ({ data }) => {
  const [visibleItems, setVisibleItems] = useState([]);
  const observer = useRef(null);
  const observerTargetRef = useRef(null);
  const history = useNavigate();

  const generateRandomRating = () => {
    // Generate a random rating between 3 and 5
    return (Math.random() * (5 - 3) + 3).toFixed(1);
  };


  useEffect(() => {
    loadInitialItems();
  }, [data]);

  useEffect(() => {
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        loadMoreItems();
      }
    });

    if (observerTargetRef.current) {
      observer.current.observe(observerTargetRef.current);
    }

    return () => {
      if (observer.current && observerTargetRef.current) {
        observer.current.unobserve(observerTargetRef.current);
      }
    };
  }, [visibleItems]);

  const loadInitialItems = () => {
    const initialItems = data.slice(0, 10); // Load initial 10 items
    setVisibleItems(initialItems);
  };

  const loadMoreItems = () => {
    const startIndex = visibleItems.length;
    const endIndex = Math.min(startIndex + 10, data.length);
    const newItems = data.slice(startIndex, endIndex);
    setVisibleItems(prevItems => [...prevItems, ...newItems]);
  };

  const handleRestaurantClick = (element) => {
    if (!isLoggedIn()) {
      // If user is not logged in, redirect to login page
      history.push('/login');
    } else {
      // If user is logged in, handle the click event
      // Here you can implement the logic to navigate to the restaurant page
      // For now, just log the clicked element
      console.log("User is logged in, handle restaurant click:", element);
    }
  };

  const isLoggedIn = () => {
   
    console.log("Token:", localStorage.getItem("usersdatatoken"));

    return !!localStorage.getItem('usersdatatoken');
  };

  return (
    <div className="card-container d-flex flex-wrap justify-content-start">
      {visibleItems.map((element, index) => (
        <Link key={index} to={isLoggedIn() ? `/restaurant/?name=${element.restaurantName}&city=${element.city}` : '/login'} style={{ textDecoration: 'none', cursor: 'pointer' }}>
          <div onClick={() => handleRestaurantClick(element)}>
            <Card key={element.id} style={{ width: '22rem', border: "none", backgroundColor: 'white', marginRight: '80px', marginBottom: '60px' }} className="card hover mb-4">
              <Card.Img variant="top" className='cd' src={element.image} alt='food img' />
              <div className="card-body">
                <div className="upper_data d-flex justify-content-between align-items-center">
                  <h4 className='mt-2'>{element.restaurantName}</h4>
                   <span>{ generateRandomRating()}&nbsp;★</span> </div>
                <div className="lower_data d-flex justify-content-between">
                  <h5>{element.address}</h5>
                  {/* <span>{element.price}</span> */}
                </div>
                <div className="extra"></div>
            
              </div>
            </Card>
          </div>
        </Link>
      ))}
      {visibleItems.length < data.length && (
        <div ref={observerTargetRef} style={{ height: '1px', width: '33%', minWidth: '280px' }}></div> // Observer target
      )}
    </div>
  );
}

export default Cards;
