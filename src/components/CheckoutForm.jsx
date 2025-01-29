import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import "./CheckoutForm.css";

const CheckoutForm = () => {
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [purchaseCompleted, setPurchaseCompleted] = useState(false);
  const [countdown, setCountdown] = useState(15);
  const [orderNumber, setOrderNumber] = useState(null);
  const navigate = useNavigate();
  const { clearCart } = useCart();

  const generateOrderNumber = () => {
    return Math.floor(Math.random() * 1000000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "name" && !/^[a-zA-Z\s]*$/.test(value)) {
      return;
    }
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    setOrderNumber(generateOrderNumber());
    setPurchaseCompleted(true);

    clearCart();
  };

  useEffect(() => {
    if (purchaseCompleted && countdown > 0) {
      const timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    } else if (purchaseCompleted && countdown === 0) {
      navigate("/");
    }
  }, [purchaseCompleted, countdown, navigate]);

  return (
    <div>
      {purchaseCompleted ? (
        <div className="checkout-success">
          <h2>¡Compra exitosa!</h2>
          <p>Tu número de compra es: {orderNumber} y será enviado a tu e-mail junto con tu código de canje.</p>
          <p>Serás redirigido a la página principal en {countdown} segundos...</p>
        </div>
      ) : (
        <div className="checkout-form">
          <h2>Formulario de Compra</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">Nombre:</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Correo electrónico:</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">Finalizar compra</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default CheckoutForm;