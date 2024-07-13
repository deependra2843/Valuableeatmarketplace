import Header from "./components/Header";
import Login from "./Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

import Error from "./components/Error";

import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import { Routes, Route, useNavigate } from "react-router-dom"
import { useEffect, useContext, useState } from "react";
import { LoginContext } from "./components/ContextProvider/Context";

import Home from "./components/HomeComponent/Home.js";

import Search from "./components/Searchpage/Search.js";
import RestaurantSearch from "./components/RestaurantCity/RestaurantSearch.js";
import FilterComponent from "./components/Filter/FilterComponent.js";
import Logout from "./components/HomeComponent/Logout.js";
import Cart from "./components/CardComponent/Cart.js";
import SuccessPage from "./components/SucessPage.js";
// import PaymentSection from "./components/Payment/PaymentSection.js";





function App() {

  const [data, setData] = useState(false);

  const { logindata, setLoginData } = useContext(LoginContext);


  const history = useNavigate();


  

  const DashboardValid = async () => {
localStorage.removeItem('usersdatatoken');

    let token = localStorage.getItem("usersdatatoken");

    const res = await fetch("/validuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token
      }
    });

    const data = await res.json();

    if (data.status == 401 || !data) {
      console.log("user not valid");
    } else {
      console.log("user verify");
      setLoginData(data)

    }
  }

  useEffect(() => {
    setTimeout(()=>{
      DashboardValid();
      setData(true)
    },2000)

  }, [])




  return (
    <>
      {
        data ? (
          <>
   

            <Routes>
              <Route path="/" element={<Home/>} />
              <Route path="/login" element={<Login/>} />
              <Route path="/search" element={<Search/>} />
              <Route path="/register" element={<Register />} />
              <Route  path="/dash" element={<Dashboard />} />
              <Route path="/restaurant" element={<RestaurantSearch/>} />
              <Route path="/user/cart" element={<Cart/>} />
              <Route path="/restaurant/food/search" element={<Search/>} />
              <Route path="/filter/food" element={<FilterComponent/>} />
              <Route path="/logout" element={<Logout/>}/>
              <Route path="/sucess" element={<SuccessPage/>}/>
              {/* <Route path="/payment" element={<PaymentSection/>}/> */}
              <Route path="*" element={<Error />} />
            </Routes>

          </>

        ) : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
          Loading... &nbsp;
          <CircularProgress />
        </Box>
      }


    </>
  );
}

export default App;
