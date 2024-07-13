import React from 'react';
import './footer.css'; // You can create a CSS file to style your footer

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="logo">
          {/* Your logo */}
          <img src="/images/food.png" alt="Logo" />
        </div>
        <div className="footer-content">
          <h2>Valuable Eat's MarketPlace</h2>
        </div>
        <div className="description">
  <div className="description-text">
    <p>Discover Your Perfect Bite: Find Your Own Suitable Meal with</p>
    <p>Valuable Eats Marketplace!</p>
  </div>
</div>

      </div>

    </footer>
  );
}

export default Footer;
