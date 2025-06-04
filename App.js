import React, { useState } from 'react';

const productsData = [
  { id: 1, name: 'Mobile Phone', price: 15000 },
  { id: 2, name: 'Laptop', price: 55000 },
  { id: 3, name: 'Headphones', price: 2000 },
  { id: 4, name: 'Smart Watch', price: 8000 },
];

function App() {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>SnitchCart - Simple Shopping</h1>
      
      <h2>Products</h2>
      <ul>
        {productsData.map((prod) => (
          <li key={prod.id} style={{ marginBottom: '10px' }}>
            {prod.name} - ₹{prod.price} 
            <button onClick={() => addToCart(prod)} style={{ marginLeft: '10px' }}>Add to Cart</button>
          </li>
        ))}
      </ul>

      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Cart is empty</p>
      ) : (
        <ul>
          {cart.map((item, idx) => (
            <li key={idx}>
              {item.name} - ₹{item.price} 
              <button onClick={() => removeFromCart(idx)} style={{ marginLeft: '10px' }}>Remove</button>
            </li>
          ))}
        </ul>
      )}

      <h3>Total: ₹{total}</h3>

      <button disabled={cart.length === 0} onClick={() => alert('Checkout successful!')}>
        Checkout
      </button>
    </div>
  );
}

export default App;
