import React from 'react';
import './CreditCard.css'; // Import CSS file for styling

const CreditCardForm = () => {
  return (
    <div className="credit-card">
      <div className="card-line">
        <input type="text" placeholder="Enter Card Number" />
      </div>
      <div className="card-line valid">
        <input type="text"  placeholder="Valid Through (MM/YY)" />
        </div>
        <div className="card-line cvv">
        <input type="text" maxLength={2} placeholder="CVV" />
      </div>
      <div className="card-line">
        <input type="text" placeholder="Enter Name on Your Card" />
      </div>
      <div className="card-line amount">
        <input type="text" placeholder="Amount" />
      </div>
    </div>
  );
};

export default CreditCardForm;
