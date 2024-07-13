import React, { useState, useEffect,useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './FilterComponent.css';
import FilterCard from './FilterCard';
import Navbarsearch from '../Searchpage/Navbarsearch';
import BreakfastComponent from './BreakfastComponent';
import LunchComponent from './LunchComponent';
import DinnerComponent from './DinnerComponent';
import DayComponent from './DayComponent';
import Footer from '../../Footer';

const FilterComponent = () => {

  const [amount, setAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Define isLoading state
  const [isAddToCartClicked, setIsAddToCartClicked] = useState(false); // Track if add to cart is clicked
    const [label,setlabel]=useState('Meal');
    const amountRef = useRef(amount);

  const [filterData, setFilterData] = useState([]); 
  const [selectedOptions, setSelectedOptions] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
    day: false,
  });
  const [showBreakfast, setShowBreakfast] = useState(false);
  const [showLunch, setShowLunch] = useState(false);
  const [showDinner, setShowDinner] = useState(false);
  const [showDay, setShowDay] = useState(false);

  const location = useLocation(); 
  // Extract city from the URL parameters
  const searchParams = new URLSearchParams(location.search);
  const city = searchParams.get('city');

  const handleChange = (e) => {
    setAmount(e.target.value);
  };
 
  const fetchCheckboxData = (option,price) => {
  
if(selectedOptions.day===true){
  fetch(`http://localhost:8009/filter/${option}?city=${city}&price=${price}`)
  .then(response => response.json())
  .then(data => {
    setFilterData(data);
    setIsLoading(false); 
  })
  .catch(error => {
    console.error('Error fetching data:', error);
    setFilterData([]); 
    setIsLoading(false); 
  });
}

else{
    fetch(`http://localhost:8009/filter/${option}?city=${city}&price=${amount}`)
      .then(response => response.json())
      .then(data => {
        setFilterData(data);
        setIsLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        setFilterData([]); 
        setIsLoading(false); 
      });
    }
  
}


  
  // useEffect(() => {
  //   if (selectedOptions.breakfast || selectedOptions.lunch || selectedOptions.dinner) {
  //     fetchCheckboxData(selectedOptions);
  //   } else {
  //     // Reset filterData when no checkboxes are selected
  //     if(!selectedOptions.day){
  //     fetchFilteredData();
  //     }
  //   }
  // }, [selectedOptions]);





  const fetchdaydata = async (isclicked,price) => {

    try {
      if(isclicked==='0'){
      await fetchCheckboxData('breakfast',price);
      setlabel('Breakfast');
      }
      else if(isclicked==='1'){
      await fetchCheckboxData('lunch',price);
      setlabel('Lunch and dinner')
      }
      else{
      await fetchCheckboxData('dinner',price);
      }
    } catch (error) {
      console.error('Error fetching data for the day:', error);
      setIsLoading(false);
    }
  };
  





  const handleCheckboxChange = (option) => {
    setSelectedOptions((prevOptions) => {
      // Deselect all other options if the selected option is true
      const updatedOptions = Object.keys(prevOptions).reduce((acc, key) => {
        acc[key] = key === option ? !prevOptions[key] : false;
        return acc;
      }, {});
  
      // Show or hide the corresponding component based on the updated state of the selected option
      setShowBreakfast(updatedOptions.breakfast);
      setShowLunch(updatedOptions.lunch);
      setShowDinner(updatedOptions.dinner);
      setShowDay(updatedOptions.day);

    
      // Fetch data if the selected option is true
      if (updatedOptions[option]) {
        if(option!=='day'){
        fetchCheckboxData(option);
        }
        else{
          console.log("day");
          fetchdaydata('0',amount);
        }
      }
  
      return updatedOptions;
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Fetch data when the button is clicked
    fetchFilteredData();
  };

  const updateAmount = (price) => {
    setAmount(prevAmount => prevAmount - price);
  };


  

  const fetchDataForDay = (variable, price) => {
 
    // This will reflect the updated value immediately
updateAmount(price);
      setIsAddToCartClicked(variable);
    fetchdaydata(variable,amount-price); 
  };
  
  
  


  const fetchFilteredData = () => {
    fetch(`http://localhost:8009/restaurant/filter/pricerange?city=${city}&price=${amount}`)
      .then(response => response.json())
      .then(data => setFilterData(data))
      .catch(error => console.error('Error fetching data:', error));
  };

  return (
    <div>
      <Navbarsearch/>
      <form className='filter-form' onSubmit={handleSubmit}>
        <div className="filter-input">
          <input
            type="text"
            placeholder="Enter Your Amount"
            value={amount}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="filter-button">
          Find my meal
        </button>
      </form>
      <div className="checkbox-group">
        <CheckboxWithBorder
          label="Breakfast"
          checked={selectedOptions.breakfast}
          onChange={() => handleCheckboxChange('breakfast')}
          identifier="breakfast"
        />
        <CheckboxWithBorder
          label="Lunch"
          checked={selectedOptions.lunch}
          onChange={() => handleCheckboxChange('lunch')}
          identifier="lunch"
        />
        <CheckboxWithBorder
          label="Dinner"
          checked={selectedOptions.dinner}
          onChange={() => handleCheckboxChange('dinner')}
          identifier="dinner"
        />
        <CheckboxWithBorder
          label="Day"
          checked={selectedOptions.day}
          onChange={() => handleCheckboxChange('day')}
          identifier="day"
        />
      </div>
      <h3 style={{marginTop:"40px"}}>Select Your {label}</h3>
      {showBreakfast &&  <BreakfastComponent items={filterData} updateAmount={updateAmount} option={selectedOptions}/>}
      {showLunch && <LunchComponent items={filterData}/>}
      {showDinner && <DinnerComponent items={filterData}/>}
      {showDay && <DayComponent items={filterData} updateAmount={updateAmount} option={selectedOptions} fetchDataForDay={fetchDataForDay}/>}
      {filterData.length>0 && !selectedOptions.breakfast && !selectedOptions.lunch && !selectedOptions.dinner && !selectedOptions.day && <FilterCard filterData={filterData} />}
    <Footer/>
    </div>
  );
};

const CheckboxWithBorder = ({ label, checked, onChange, identifier ,option}) => {
  return (
    <div className={`checkbox-wrapper ${identifier}-checkbox`}>
      <label className="checkbox-label">
        <input
          type="checkbox"
          checked={checked}
          onChange={() => onChange(option)} // Pass the option to the onChange handler
        />
        {label}
      </label>
    </div>
  );
};


export default FilterComponent;
