import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './SearchPage.css';
import axios from 'axios';
import { toast,ToastContainer } from 'react-toastify';

const SearchPage = () => {
    const [searchResults, setSearchResults] = useState([]);
    const [foodname, setfoodname] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(1);

    const location = useLocation();
    let searchQuery;

    // Reset page count when component is initially mounted
    useEffect(() => {
        setPage(1);
    }, []);

    // Reset page count when a new search is performed
    useEffect(() => {
        setPage(1);
    }, [location.search]);

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                const searchParams = new URLSearchParams(location.search);
                searchQuery = searchParams.get('foodName');
                setfoodname(searchParams.get('foodName'))
                const city = searchParams.get('city');

                if (searchQuery) {
                    const response = await fetchSearchResultsData(searchQuery, city);
                    setSearchResults(response);
                }
            } catch (error) {
                console.error('Error fetching search results:', error);
                // Handle error
            }
        };

        fetchSearchResults();
    }, [location.search]);

    const fetchSearchResultsData = async (searchQuery, city) => {
        const response = await axios.get(`http://localhost:8009/restaurant/food?foodName=${searchQuery}&city=${city}`);
        console.log(response.data);
        return response.data;
    };

    const loader = useRef(null);

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
    }, [searchResults]); // Ensure that the searchResults dependency is used

    const handleObserver = (entities) => {
        const target = entities[0];
        if (target.isIntersecting && !isLoading && searchResults.length > page * 10) {
            setIsLoading(true);
            setTimeout(() => {
                setPage((prevPage) => prevPage + 1);
                setIsLoading(false);
            }, 1000); // Simulate loading delay
        }
    };

    const handleAddToCart = async (restaurant) => {
        const searchParams = new URLSearchParams(location.search);
        console.log(restaurant._id);
        const city = searchParams.get('city');
        try {
            console.log(restaurant.city);
            const response = await fetch('http://localhost:8009/user/update-cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    restaurantId: restaurant._id,
                    city: city
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            const data = await response.json();
            toast.success('Item added to cart successfully!', {
                position: "top-center", // Position the toast at top-middle
              });
            console.log(data); // Handle success
        } catch (error) {
            console.error('Error adding item to cart:', error);
        }
    };
    

    return (
        <div className="search-page-container">
            <h2 className="search-page-heading">Search Results:</h2>
            {searchResults.length > 0 ? (
                <>
                    {searchResults.slice(0, page * 10).map((restaurant, index) => (
                        <div key={index} className="search-result-card">
                            <div className="card-details-search">
                                <h3 className="restaurant-name-food">{restaurant.restaurant}</h3>
                                <div className="item-details-search">
                                    <p className="item-info-search" ><span className="info-label" style={{ color: 'white', fontSize: "1rem" }}>Item:</span> {restaurant.item}</p>
                                    <p className="price-info-search"><span className="info-label" style={{ color: 'white' }}>Price:</span> {restaurant.price}</p>
                                    <p className="address-info-search"><span className="info-label" style={{ color: 'white' }}>Address:</span> {restaurant.address}</p>
                                </div>
                            </div>
                            <div className="card-actions">
                                <img src='/images/pizza-carousel.jpg' alt="food-img" className="food-image-search" />
                                <button className="add-to-cart-btn" onClick={() => handleAddToCart(restaurant)}>Add to Cart</button>
                            </div>
                        </div>
                    ))}
                    <div ref={loader} style={{ height: '10px', visibility: isLoading ? 'visible' : 'hidden' }} />
                    <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

                </>
            ) : (
                <p>No results found.</p>
            )}
        </div>
    );
};

export default SearchPage;
