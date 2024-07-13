// ImageInput.js
import React from 'react';
import './ImageInput.css'; // Import CSS file for styling

const ImageInput = () => {
  return (
    <div className="image-input-container">
      <img src="./images/upi.png"  className="image-input-icon" />
      <input
        type="text"
     
        placeholder="Enter Your UPI ID"
        className="image-input-field"
      />
    </div>
  );
};

export default ImageInput;
