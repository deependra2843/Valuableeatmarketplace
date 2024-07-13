import React, { useState, useEffect, useRef } from 'react';
import './FilterCard.css';
import { useLocation } from 'react-router-dom';
import { toast,ToastContainer } from 'react-toastify';

const FilterCard = ({ filterData }) => {
  console.log(filterData);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [filteredItems, setFilteredItems] = useState([]);
  const loader = useRef(null);
  const location = useLocation();

  useEffect(() => {
    console.log(filterData); // Add this line to check the type of filterData

    setPage(1); 
    setFilteredItems(filterData.slice(0, 10)); 
  }, [filterData]);

  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 1.0,
    });

    if (loader.current) {
      observer.observe(loader.current);
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current);
      }
    };
  }, [filteredItems]);

  useEffect(() => {
    if (!isLoading) {
      // Ensure isLoading is false before updating filtered items
      setFilteredItems((prevItems) => {
        return [...prevItems, ...filterData.slice((page - 1) * 10, page * 10)];
      });
    }
  }, [isLoading]);

  const handleObserver = (entities) => {
    const target = entities[0];
    if (target.isIntersecting && !isLoading) {
      setIsLoading(true);
      setTimeout(() => {
        setPage((prevPage) => prevPage + 1); // Load next page
        setIsLoading(false);
      }, 1000); // Simulate loading delay
    }
  };


  const addToCart = async (restaurantId) => {
    const searchParams = new URLSearchParams(location.search);
       console.log(restaurantId);
    const city = searchParams.get('city');
    try {
      const response = await fetch('http://localhost:8009/user/update-cart', {
        method: 'POST',
        credentials:'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ restaurantId,city }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to add meal to cart');
      }
  
      const data = await response.json();
      console.log(data); 
      toast.success('Item added to cart successfully!', {
        position: "top-center", // Position the toast at top-middle
      });
    } catch (error) {
      console.error('Error adding meal to cart:', error);
    }
  };
  
  if (!Array.isArray(filterData)) {
    return null; 
  }
  return (
    <div>
      {filteredItems.map((item, index) => (
        <div key={index} className="row ml-auto mr-0 mt-3">
          <div className="col-md-11"> 
            <div className="card mb-3 w-100 border-dark filter-card">
              <div className="row g-0 mt-3">
                <div className="col-md-6">
                  <div className="card-body">
                    <h5 className="card-title mb-4 res-name">{item.restaurant}</h5>
                    <p className="card-text mt-3 res-item">{item.item}</p>
                    <p className="card-text mt-4 fo-price"><span style={{color:'white'}}>Price :  </span>{item.price}</p>
                    <p className="card-text mt-3 res-address">{item.address}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="row g-0 food-images">
                    {/* {item.images.map((image, imgIndex) => ( */}
                      <div className="col-md-4 mb-3"> 
                        <img src={item.image} alt="..." className="img-fluid" />
                      </div>
                    {/* ))} */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-1 d-flex align-items-center justify-content-center" style={{ width: 'auto' }}>
          <button type="button" className="add-btn" onClick={() => addToCart(item._id)}>Add Meal</button>
          </div>
        </div>
      ))}
      <div ref={loader} style={{ height: '10px', visibility: isLoading ? 'visible' : 'hidden' }} />
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

    </div>
  );
};

export default FilterCard;
