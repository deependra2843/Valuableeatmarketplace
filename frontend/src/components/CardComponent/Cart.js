import React, { useState, useEffect } from 'react';
import './Cart.css';
import AdditionalDetailsComponent from './AdditionalDetailsComponent';
import OrderDetailsCard from './OrderComponent';
import Footer from '../../Footer';
import { useLocation } from 'react-router-dom';
import {loadStripe} from '@stripe/stripe-js';
import Navbarcart from './Navbarcart';
const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);


    const makePayment = async()=>{
        

        console.log(cartItems);
        try {
     
            const response = await fetch('/api/save-orders', {
              method: 'POST',
              credentials:'include',
              headers: {
                'Content-Type': 'application/json'
                // You can add other headers if needed
              },
              body: JSON.stringify({
                cartItems: cartItems, // Assuming `cartItems` is your state containing the cart items
                price:totalPrice
            })
             
            });
          } catch (error) {
            console.error('Error saving order:', error);
          }



        const stripe = await loadStripe("pk_test_51OubQfSFJtNK47N3iftnjRu7DufdxlQUqEExP8CF9xK9ohcHPePEymHsW9hnFuFKJcY0RAXVsqRJUtaQwWLmb4YO00QQp6MFXh");

        const body = {
            products:cartItems
        }
        const headers = {
            "Content-Type":"application/json"
        }
        const response = await fetch("http://localhost:8009/api/create-checkout-session",{
            method:"POST",
            headers:headers,
            body:JSON.stringify(body)
        });

        const session = await response.json();

        const result = stripe.redirectToCheckout({
            sessionId:session.id
        });
        
        if(result.error){
            console.log(result.error);
        }
    }


    useEffect(() => {
        fetch('/user/get-cart', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            setCartItems(data);
           
            updateTotalPrice(data); // Update total price when cart items are fetched
        })
        .catch(error => {
            console.error('Error fetching cart items:', error);
        });
    }, []);


    const removeFromCart = async (itemId) => {
        try {
           const response= await fetch('http://localhost:8009/remove-from-cart', {
                method: 'POST',
                credentials:'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    itemId
                })
            });
            const updatedCartItems = await response.json();
        
            setCartItems(updatedCartItems);
            
            updateTotalPrice(updatedCartItems);
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };



    const updateTotalPrice = (items) => {
        const totalPrice = items.reduce((total, item) => total + parseFloat(item.price) * item.quantity, 0);
        setTotalPrice(totalPrice);
    };

    const calculateTotalPrice = () => {
        return totalPrice;
    };

    const updateTotalPriceAndItems = (updatedItems) => {
        setCartItems(updatedItems);
        updateTotalPrice(updatedItems);
    };

    return (
        <>
     <Navbarcart/>
        <div id='cart'>
        <div className="cart-container">
            <div className="cart-details">
                <h3 className='Bill'>Bill Details</h3>
                <OrderDetailsCard items={cartItems} /> {/* Pass cartItems as props to the inner card component */}
                <div className="Bill-line"></div>
                <div className="total-price">
                    <p className='to-pay'>To Pay:</p>
                    <p className='total-price'>{calculateTotalPrice()}</p>
                </div>
            </div>
                 <div className="cart-actions">
                    <button className="proceed-btn btn-container" onClick={() => makePayment()}>Proceed to Pay</button>
                    {/* <button className="schedule-btn btn-container" >Schedule Order <img src='/images/buttonlogo.png' className='schedule-img'></img></button> */}
                </div>
            </div>
            
            <div>
            <div className="additional-details-container">
                    <AdditionalDetailsComponent items={cartItems} updateTotalPriceAndItems={updateTotalPriceAndItems} removeFromCart={removeFromCart}   /> {/* Pass cartItems as props to the additional details component */}
                </div>
                <button className="Add-items">Add Items</button>
            </div>
        </div>
        <Footer/>
        </>
    );
};

export default Cart;
