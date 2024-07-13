import React, { useEffect, useState } from 'react'
import Fooddata from './FoodData'
import "./style.css"
import Form from 'react-bootstrap/Form'
import Cards from './CardsRestaurant'
import Set from './Set'
import { BsSearch } from 'react-icons/bs';
import { Button } from 'react-bootstrap'
const Search = ({searchResults}) => {
    const [searchQuery, setSearchQuery] = useState('');
    const handleSearchInputChange = (event) => {
        setSearchQuery(event.target.value);
      };
    const [fdata, setFdata] = useState(Fooddata);
    // console.log(fdata);

    const [copydata, setCopyData] = useState([]);

 console.log(searchResults);

 const handleSearch = async () => {
    try {
    
    } catch (error) {
      console.error('Error searching for restaurants:', error);
      // Handle error, show message to user, etc.
    }
  };

  useEffect(() => {
    // Filter the restaurant data based on the search query
    const filteredData = searchResults.filter((item) =>
        item.restaurant.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setCopyData(filteredData);
}, [searchQuery, fdata]);

 
 const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
    handleSearch();
    }
  };


    const chanegData = (e) => {
        let getchangedata = e.toLowerCase();

        if (getchangedata == "") {
            setCopyData(fdata);
        } else {
            let storedata = copydata.filter((ele, k) => {
                return ele.rname.toLowerCase().match(getchangedata);
            });

            setCopyData(storedata)
        }
    }


    const zomatologo = "https://b.zmtcdn.com/web_assets/b40b97e677bc7b2ca77c58c61db266fe1603954218.png"


    useEffect(() => {

        setTimeout(() => {
            setCopyData(Fooddata);
        }, 3000);

    }, [])

    return (
        <>
            {/* <div className="container d-flex justify-content-between align-items-center">
                <img src={zomatologo} style={{ width: "8rem", position: "relative", left: "2%", cursor: "pointer" }} alt="" />
                <h2 style={{ color: "#1b1464", cursor: "pointer" }} className="mt-3">Search Filter App</h2>
            </div>


            <Form className='d-flex justify-content-center align-items-center mt-3'>
                <Form.Group className=" mx-2 col-lg-4" controlId="formBasicEmail">

                    <Form.Control type="text"
                        onChange={(e) => chanegData(e.target.value)}
                        placeholder="Search Restaurant" />
                </Form.Group>
                <button className='btn text-light col-lg-1' style={{ background: "#ed4c67" }}>Submit</button>
            </Form> */}



            <section className='iteam_section mt-4 container'>
               {searchResults.length>0 && <h2 className='px-4' style={{ fontWeight: 400 }}>Restaurants in {searchResults[0].city} Open now</h2>}
               {/* <div className="row mt-3">
                    <div className="col-lg-4">
                        <Form>
                            <Form.Group controlId="formBasicEmail">
                                <Form.Control
                                    type="text"
                                    onChange={(e) => handleSearchInputChange(e.target.value)}
                                    placeholder="Search your favourite Restaurant"
                                    style={{border: '0.8px solid black'}}
                                />
                            </Form.Group>
                        </Form>
                    </div>
                    <div className="col-lg-4 d-flex justify-content-start align-items-center">
                        <Button variant="outline-primary" onClick={handleSearch}><BsSearch /></Button>
                    </div>
                    </div> */}
                <div className="row mt-2 d-flex justify-content-around align-items-center">
                    {copydata && copydata.length ? <Cards data={searchResults} /> : <Set  sdata={fdata}/>}
                </div>
            </section>
            
        </>
    )
}

export default Search