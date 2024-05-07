import { useContext, useEffect, useState } from 'react';
import './PlaceOrder.css';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
  const { getTotalCartAmount, token, food_list, cartItems, url } = useContext(StoreContext);

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: ""
  });

  const onchangeHandler = (event) => {
    const { name, value } = event.target;
    setData(prevData => ({ ...prevData, [name]: value }));
  };

  const placeOrder = async (event) => {
    event.preventDefault();
    const orderItems = food_list.filter(item => cartItems[item._id] > 0)
                               .map(item => ({ ...item, quantity: cartItems[item._id] }));

    const orderData = {
      userId: "userId", // You should replace this with the actual userId
      address: data,
      items: orderItems,
      amount: getTotalCartAmount() + 2,
    };

    try {
      const response = await axios.post(`${url}/api/order/place`, orderData, { headers: { token } });
      if (response.data.success) {
        const { session_url } = response.data;
        window.location.replace(session_url);
      } else {
        alert("Error placing order: " + response.data.message);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Error placing order: " + error.message);
    }
  };
  const navigate = useNavigate();

  useEffect(() => {
    if(!token){
     navigate('/cart')
    }
    else if(getTotalCartAmount()===0)
    {
      navigate('/cart')
    }
  },[token])

  // Calculate totals
  const subtotal = getTotalCartAmount();
  const deliveryFee = subtotal === 0 ? 0 : 2;
  const total = subtotal + deliveryFee;

  return (
    <form onSubmit={placeOrder} className='place-order'>
      <div className="place-order-left">
        <p className='title'>Delivery Information</p>
        <div className='multi-fields'>
          <input required name='firstName' onChange={onchangeHandler} value={data.firstName} type="text" placeholder='First Name' />
          <input required name='lastName' onChange={onchangeHandler} value={data.lastName} type="text" placeholder="Last Name" />
        </div>
        <input required name='email' onChange={onchangeHandler} value={data.email} type="email" placeholder='Email Address' />
        <input required name='street' onChange={onchangeHandler} value={data.street} type="text" placeholder='Street' />
        <div className='multi-fields'>
          <input required name='city' onChange={onchangeHandler} value={data.city} type="text" placeholder='City' />
          <input required name='state' onChange={onchangeHandler} value={data.state} type="text" placeholder="State" />
        </div>
        <div className='multi-fields'>
          <input required name='zipcode' onChange={onchangeHandler} value={data.zipcode} type="text" placeholder='Zip Code' />
          <input required name='country' onChange={onchangeHandler} value={data.country} type="text" placeholder="Country" />
        </div>
        <input name='phone' onChange={onchangeHandler} value={data.phone} type="text" placeholder="Phone" />
      </div>
      <div className='place-order-right'>
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <hr />
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>${subtotal}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Delivery Fee</p>
              <p>${deliveryFee}</p>
            </div>
            <hr />
            <div className="cart-total-details">
              <p>Total</p>
              <p>${total}</p>
            </div>
            <hr />
          </div>
          <button type='submit'>Proceed to Payment</button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;
