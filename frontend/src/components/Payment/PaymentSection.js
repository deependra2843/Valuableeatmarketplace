import React, { useState } from 'react';
import './PaymentSection.css'
import ImageInput from './Upitextfield';
import CreditCardForm from './CreditCard';
import Navbarsearch from '../Searchpage/Navbarsearch';
import Footer from '../../Footer';
function  PaymentSection() {
  const [upiId, setUpiId] = useState('');
  const [payWithCard, setPayWithCard] = useState(false);

  const handleInputChange = (e) => {
    setUpiId(e.target.value);
  };

  const handlePayWithCard = () => {
    setPayWithCard(!payWithCard);
  };

  return (
   <>
   <Navbarsearch/>
   <div className='payment-container'>
    <div className="payment-card">
     <ImageInput/>
      <div className="pay-with-card">
        <p className='text styled-or'>Or Pay With your card</p>

      <CreditCardForm/>
      </div>
      <div className='payment'>
      <button className="Pay-btn">Proceed to Pay</button>
      <span className="styled-or"> Or</span>
         <button className="Proceed-btn" >Pay Offline</button>
         </div>
    </div>
    </div>
    <Footer/>
    </>
  );
}

export default PaymentSection;
