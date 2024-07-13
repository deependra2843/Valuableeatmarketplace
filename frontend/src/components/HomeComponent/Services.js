import React from 'react';
import './Services.css'; // Styles for the cards

const Card = ({ title, imgUrl, description, linkTo }) => {
  return (
    <div className="card-services">
      <h2 className="card-title-services">{title}</h2>
      <a href={linkTo}>
        <img src={imgUrl} alt="Logo" className="card-logo" />
        <p className="card-description" id='budget'>{description}</p>
      </a>
    </div>
  );
};

const CardServices = ({city}) => {

  const budgetMealLink = `/filter/food?city=${city}`;
  return (
    <div className="services-container">
      <h2>Our Services</h2>
      <div className="three-cards-container">
        <div className="card-wrapper">
          <Card
            title="Diverse Menu Selection"
            imgUrl='./images/logo3.png'
            description="Users can explore accurate selection of high quality Meals, snacks and diverse culinary options from various cooking entrepreneurs."
            linkTo="/menu-selection"
          />
        </div>
        <div className="card-wrapper">
          <Card
            title="Scheduling Orders"
            imgUrl='./images/logo2.png'
            description="The valuable eat Marketplace allows user to schedule meal for the  day providing flexibility in meal planning"
            linkTo="/schedule-orders"
          />
        </div>
        <div className="card-wrapper" >
          <Card
            title="Filter For Budget Meals"
            imgUrl='./images/logo1.png'
            description="Users can use a dedicated filter or a category to explore meals that align with their budget"
            linkTo={budgetMealLink}
          />
        </div>
      </div>
    </div>
  );
};

export default CardServices;
