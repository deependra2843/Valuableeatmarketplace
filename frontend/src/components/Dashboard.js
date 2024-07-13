import React, { useContext, useEffect ,useState} from 'react'
import { useNavigate } from 'react-router-dom';
import { LoginContext } from './ContextProvider/Context';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import './Dashboard.css'
import Footer from '../Footer';
const Dashboard = () => {

    const { logindata, setLoginData } = useContext(LoginContext);
    const [orders, setOrders] = useState([]);
    const [data, setData] = useState(false);


    const history = useNavigate();

    const DashboardValid = async () => {
        let token = localStorage.getItem("usersdatatoken");
console.log(token);
        const res = await fetch("/validuser", {
            method: "GET",
            credentials:'include',
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            }
        });

        const data = await res.json();
     console.log(data);
        if (data.status == 401 || !data) {
            history("*");
        } else {
            console.log("user verify");
            setLoginData(data)
            // history("/dash");
        }
    }


  
    const getOrders = async () => {
        try {
            const token = localStorage.getItem("usersdatatoken");
            const res = await fetch("/get-order", {
                method: "POST",
                credentials: 'include',
                headers: {
                    "Content-Type": "application/json"
                }
        
            });
            if (res.ok) {
                const data = await res.json();
                console.log(data.orders);
                setOrders(data.orders);
            }
        }
            catch (error) {
                console.error('Error fetching orders:', error);
            }

  }



    useEffect(() => {
        setTimeout(() => {
            DashboardValid();
            setData(true)

        }, 2000)

    }, [])

    useEffect(()=>{
        getOrders();
    },[])

    return (
        <>
        <div>
            {
                data ? <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <img src="./man.png" style={{ width: "200px", marginTop: 20 }} alt="" />
                    <h1>User Email:{logindata ? logindata.user.email : ""}</h1>
                </div> : <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", height: "100vh" }}>
                    Loading... &nbsp;
                    <CircularProgress />
                </Box>
            }
            </div>
            <div>
            
            {orders.length > 0 ? (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h3 className="text-center">My Orders</h3>
          </div>
          <div className="card-body">
            {orders.map(order => (
              <div key={order._id} className="order-item mb-4">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Total Amount:</strong> ${order.total_amount.toFixed(2)}</p>
                <p><strong>Order Date:</strong> {new Date(order.order_date).toLocaleString()}</p>
                <p><strong>Items:</strong></p>
                <ul className="list-group">
                  {order.cart.map(item => (
                    <li key={item.foodItemId} className="list-group-item">
                      <span><strong>Name:</strong> {item.Itemname}</span><br />
                      <span><strong>Price:</strong> {item.price}</span><br />
                      <span><strong>Quantity:</strong> {item.quantity}</span><br />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
) : (
  <div className="container mt-5">
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-primary text-white">
            <h3 className="text-center">Loading</h3>
          </div>
          <div className="card-body">
            <p className="text-center">No orders yet</p>
          </div>
        </div>
      </div>
    </div>
  </div>
)}

           </div>
           <Footer/>
        </>

    )
}

export default Dashboard