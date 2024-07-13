import React, { useState } from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import './Carousel.css';

const CustomNextArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow custom-next" onClick={onClick}>
      <FontAwesomeIcon icon={faChevronRight} />
    </div>
  );
};

const CustomPrevArrow = (props) => {
  const { onClick } = props;
  return (
    <div className="slick-arrow custom-prev" onClick={onClick}>
      <FontAwesomeIcon icon={faChevronLeft} />
    </div>
  );
};

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    beforeChange: (current, next) => setCurrentSlide(next),
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
        }
      }
    ]
  };

  return (
    <div className="carousel-container">
      <Slider {...settings} afterChange={(slideIndex) => setCurrentSlide(slideIndex)} className='custome-slider'>
        <div className="carousel-image" >
          <img src="./images/pizza-carousel.jpg" alt="Zomato Slide 1" />
          <div className="food-name">pizza</div>
        </div>
        <div className="carousel-image" >
        <img src="./images/burgerzomato.avif" alt="Zomato Slide 1" />
        <div className="food-name">burger</div>

        </div>
        <div className="carousel-image" >
        <img src="./images/FriedRice.avif" alt="Zomato Slide 1" />
          <div className="food-name">Fried Rice</div>
        </div>
        <div className="carousel-image" >
        <img src="./images/Noodles.avif" alt="Zomato Slide 1" />
          <div className="food-name">Noodles</div>
        </div>
        <div className="carousel-image" >
        <img src="./images/Paneer.avif" alt="Zomato Slide 1" />
          <div className="food-name">Paneer</div>
        </div>
        <div className="carousel-image" >
        <img src="./images/Rolls.avif" alt="Zomato Slide 1" />
          <div className="food-name">Rolls</div>
        </div>
      
       
      </Slider>
      
    </div>
  );
};

export default Carousel;
