import React, { useState, useEffect } from 'react';
import './AdditionalComponent.css'; // Import CSS file for styling

const AdditionalDetailsComponent = ({ items, updateTotalPriceAndItems , removeFromCart }) => {
    const [quantities, setQuantities] = useState(items.map(item => item.quantity)); // Initialize quantities state with the quantity from each item or default to 1
   
    useEffect(() => {
        setQuantities(items.map(item => item.quantity || 1)); // Set quantities to the quantity from each item, defaulting to 1 if quantity is not provided
    }, [items]);
    

    const handleRemove = async (index, itemId) => {
     
        removeFromCart(itemId); 
    };



    const increaseQuantity = async (index, itemId) => {
        if (items && items.length > 0) {
            const updatedQuantities = [...quantities];
            updatedQuantities[index] = parseInt(updatedQuantities[index]) + 1;
            setQuantities(updatedQuantities);
            const updatedItems = items.map((item, i) => i === index ? { ...item, quantity: updatedQuantities[index] } : item);

            updateTotalPriceAndItems(updatedItems)
            try {
                await fetch('http://localhost:8009/update-quantity', {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        itemId,
                        newQuantity: updatedQuantities[index]
                    })
                });
            } catch (error) {
                console.error('Error updating quantity:', error);
                // Handle error
            }
        }
    };

    const decreaseQuantity = async (index, itemId) => {
        if (items && items.length > 0) {
            const updatedQuantities = [...quantities];

            if (updatedQuantities[index] > 1) {
                updatedQuantities[index] -= 1;
                setQuantities(updatedQuantities);
                const updatedItems = items.map((item, i) => i === index ? { ...item, quantity: updatedQuantities[index] } : item);
    
                updateTotalPriceAndItems(updatedItems)
                try {
                    await fetch('/update-quantity', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            itemId,
                            newQuantity: updatedQuantities[index]
                        })
                    });
                } catch (error) {
                    console.error('Error updating quantity:', error);
                    // Handle error
                }
            }
        }
    };

    return (
        <div className="additional-details-container">
            <h3 className='cart-item-heading'>Your Items</h3>
            <div class="line"></div>
            <div className="items-list">
                {items.length>0 && items.map((item, index) => (
                    <div key={index} className="item-details">
                        <div className="item-info">
                            <h4 className='restaurant-cart-name'>{item.restaurant}</h4>
                            <p className='item-cart-name'>{item.item}</p>
                            <p className='item-cart-price'>{item.price}</p>
                            <hr className='linel'/>
                        </div>
                        <div className="item-controls">
                            <img src={item.image} alt="Food" className="food-image" />
                            <button className="plus-button" onClick={() => increaseQuantity(index, item._id)}>+</button>
                            <div className="quantity-box">{quantities[index]}</div> 
                            <button className="minus-button" onClick={() => decreaseQuantity(index, item._id)}>-</button>
                            <button className='Remove-cart-btn' onClick={() => handleRemove(index, item._id)}>Remove</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AdditionalDetailsComponent;
