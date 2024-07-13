// OrderDetailsCard.js

import React from 'react';
import './OrderDetailCard.css'; // Import CSS file for styling

const OrderDetailsCard = ({ items }) => {
    let orderno=1;
    return (
        <div className="order-details-card">
            <div className="header">
                <div className="label order">Order No</div>
                <div className="label item-No">Item</div>
                <div className="label price">Price</div>
                <div className='label quantity' >quantity</div>

            </div>
            <div className="item-list">
                {items.length>0 && items.map(item => (
                    <div key={item.orderNo} className="item">
                        <div className='order'>{orderno++}</div>
                        <div className='item-No'>{item.item}</div>
                        <div className='price'>{item.price}</div>
                        <div className='quantity'>{item.quantity}</div>

                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderDetailsCard;
