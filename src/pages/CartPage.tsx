import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useCart } from '../context/CartContext';
import './CartPage.css';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <>
      <Navbar />
      <main className="cart-page-container">
        <h2 style={{ fontSize: '1.5rem', marginBottom: 24 }}>Your Cart</h2>
        {cart.length === 0 ? (
          <div style={{ color: '#888', fontSize: '1.1rem' }}>Your cart is empty.</div>
        ) : (
          <>
            <table className="cart-table">
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid #eee' }}>
                  <th style={{ padding: 8 }}>Product</th>
                  <th style={{ padding: 8 }}>Price</th>
                  <th style={{ padding: 8 }}>Quantity</th>
                  <th style={{ padding: 8 }}>Subtotal</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item._id} style={{ borderBottom: '1px solid #f3f3f3' }}>
                    <td className="cart-product-cell" data-label="Product">
                      <img src={(item.images && item.images[0]) || 'https://via.placeholder.com/60'} alt={item.name} />
                      <span>{item.name}</span>
                    </td>
                    <td data-label="Price">
                      {typeof item.price === 'number' ? `$${item.price.toFixed(2)}` : 'N/A'}
                    </td>
                    <td data-label="Quantity">
                      <input
                        aria-label={`Quantity for ${item.name}`}
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={e => updateQuantity(item._id, Number(e.target.value))}
                        style={{ width: 50, padding: 4 }}
                      />
                    </td>
                    <td data-label="Subtotal">
                      {typeof item.price === 'number' && typeof item.quantity === 'number'
                        ? `$${(item.price * item.quantity).toFixed(2)}`
                        : 'N/A'}
                    </td>
                    <td className="cart-remove-cell" data-label="Action">
                      <button onClick={() => removeFromCart(item._id)} style={{ background: 'none', border: 'none', color: '#b94a48', cursor: 'pointer', fontWeight: 600 }}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="cart-total" style={{ textAlign: 'right', fontSize: '1.15rem', fontWeight: 600, marginBottom: 24 }}>
              Total: {typeof total === 'number' && !isNaN(total) ? `$${total.toFixed(2)}` : 'N/A'}
            </div>
            <button
              className="cart-checkout-button"
              style={{ background: '#222', color: '#fff', border: 'none', borderRadius: 24, padding: '12px 32px', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </button>
          </>
        )}
      </main>
    </>
  );
};

export default CartPage; 