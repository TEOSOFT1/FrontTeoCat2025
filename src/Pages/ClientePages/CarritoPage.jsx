"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"

const CarritoPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [total, setTotal] = useState(0)
  const [couponCode, setCouponCode] = useState("")
  const [discount, setDiscount] = useState(0)
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponError, setCouponError] = useState("")

  useEffect(() => {
    // Cargar items del carrito desde localStorage
    const storedCart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(storedCart)

    // Calcular subtotal
    const calculatedSubtotal = storedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setSubtotal(calculatedSubtotal)

    // Establecer costo de envío (gratis si el subtotal es mayor a 100000)
    const shippingCost = calculatedSubtotal > 100000 ? 0 : 12000
    setShipping(shippingCost)

    // Calcular total
    setTotal(calculatedSubtotal + shippingCost - discount)
  }, [cartItems, discount])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return

    const updatedCart = cartItems.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item))

    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const removeItem = (id) => {
    const updatedCart = cartItems.filter((item) => item.id !== id)
    setCartItems(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
  }

  const clearCart = () => {
    setCartItems([])
    localStorage.setItem("cart", JSON.stringify([]))
  }

  const applyCoupon = () => {
    // Simulación de validación de cupón
    // En producción, esto sería una llamada a la API

    setCouponError("")
    setCouponApplied(false)

    if (!couponCode.trim()) {
      setCouponError("Por favor ingresa un código de cupón")
      return
    }

    // Cupones de ejemplo
    const validCoupons = {
      WELCOME10: { type: "percentage", value: 10 },
      TEOCAT20: { type: "percentage", value: 20 },
      FREESHIP: { type: "shipping", value: "free" },
    }

    const coupon = validCoupons[couponCode.toUpperCase()]

    if (!coupon) {
      setCouponError("Cupón inválido o expirado")
      return
    }

    if (coupon.type === "percentage") {
      const discountAmount = (subtotal * coupon.value) / 100
      setDiscount(discountAmount)
      setCouponApplied(true)
    } else if (coupon.type === "shipping" && coupon.value === "free") {
      setShipping(0)
      setCouponApplied(true)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="mb-4">
          <i className="bi bi-cart-x" style={{ fontSize: "5rem", color: "#7ab51d" }}></i>
        </div>
        <h2 style={{ color: "#5a3921" }}>Tu carrito está vacío</h2>
        <p className="mb-4">Parece que aún no has añadido productos a tu carrito.</p>
        <Link to="/catalogo" className="btn btn-lg" style={{ backgroundColor: "#7ab51d", color: "white" }}>
          Ir al Catálogo
        </Link>
      </div>
    )
  }

  return (
    <div className="container py-5 mt-5">
      <h1 className="mb-4" style={{ color: "#5a3921" }}>
        Carrito de Compras
      </h1>

      <div className="row g-4">
        {/* Productos en el carrito */}
        <div className="col-lg-8">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th scope="col">Producto</th>
                      <th scope="col">Precio</th>
                      <th scope="col">Cantidad</th>
                      <th scope="col">Subtotal</th>
                      <th scope="col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="me-3" style={{ width: "60px", height: "60px" }}>
                              <img
                                src={item.image || "/placeholder.svg"}
                                alt={item.name}
                                className="img-fluid rounded"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            </div>
                            <div>
                              <h6 className="mb-0" style={{ color: "#5a3921" }}>
                                {item.name}
                              </h6>
                              {item.category && <small className="text-muted">{item.category}</small>}
                            </div>
                          </div>
                        </td>
                        <td>${item.price.toLocaleString()}</td>
                        <td>
                          <div className="input-group" style={{ width: "120px" }}>
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <i className="bi bi-dash"></i>
                            </button>
                            <input type="text" className="form-control text-center" value={item.quantity} readOnly />
                            <button
                              className="btn btn-sm btn-outline-secondary"
                              type="button"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              <i className="bi bi-plus"></i>
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold">${(item.price * item.quantity).toLocaleString()}</td>
                        <td>
                          <button className="btn btn-sm text-danger" onClick={() => removeItem(item.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            <button className="btn" onClick={clearCart} style={{ backgroundColor: "#5a3921", color: "white" }}>
              <i className="bi bi-trash me-2"></i> Vaciar Carrito
            </button>
            <Link to="/catalogo" className="btn" style={{ backgroundColor: "#7ab51d", color: "white" }}>
              <i className="bi bi-arrow-left me-2"></i> Seguir Comprando
            </Link>
          </div>
        </div>

        {/* Resumen de la orden */}
        <div className="col-lg-4">
          <div className="card border-0 shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4" style={{ color: "#5a3921" }}>
                Resumen de la Orden
              </h5>

              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${subtotal.toLocaleString()}</span>
              </div>

              {discount > 0 && (
                <div className="d-flex justify-content-between mb-2 text-success">
                  <span>Descuento</span>
                  <span>-${discount.toLocaleString()}</span>
                </div>
              )}

              <div className="d-flex justify-content-between mb-2">
                <span>Envío</span>
                <span>
                  {shipping === 0 ? <span className="text-success">Gratis</span> : `$${shipping.toLocaleString()}`}
                </span>
              </div>

              <hr />

              <div className="d-flex justify-content-between mb-4">
                <span className="fw-bold">Total</span>
                <span className="fw-bold" style={{ color: "#7ab51d", fontSize: "1.2rem" }}>
                  ${total.toLocaleString()}
                </span>
              </div>

              {/* Cupón de descuento */}
              <div className="mb-4">
                <label htmlFor="coupon" className="form-label">
                  Cupón de descuento
                </label>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    id="coupon"
                    placeholder="Ingresa tu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <button
                    className="btn"
                    type="button"
                    onClick={applyCoupon}
                    style={{ backgroundColor: "#5a3921", color: "white" }}
                  >
                    Aplicar
                  </button>
                </div>
                {couponError && <small className="text-danger">{couponError}</small>}
                {couponApplied && <small className="text-success">¡Cupón aplicado correctamente!</small>}
              </div>

              {/* Botón de finalizar compra */}
              <button className="btn w-100" style={{ backgroundColor: "#7ab51d", color: "white" }}>
                Finalizar Compra
              </button>
            </div>
          </div>

          {/* Información adicional */}
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title mb-3" style={{ color: "#5a3921" }}>
                Información
              </h5>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-truck me-2" style={{ color: "#7ab51d" }}></i>
                  <span className="fw-bold">Envío</span>
                </div>
                <p className="small mb-0">Envío gratis en compras superiores a $100.000</p>
              </div>

              <div className="mb-3">
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-shield-check me-2" style={{ color: "#7ab51d" }}></i>
                  <span className="fw-bold">Pago Seguro</span>
                </div>
                <p className="small mb-0">Todas las transacciones están protegidas</p>
              </div>

              <div>
                <div className="d-flex align-items-center mb-2">
                  <i className="bi bi-arrow-return-left me-2" style={{ color: "#7ab51d" }}></i>
                  <span className="fw-bold">Devoluciones</span>
                </div>
                <p className="small mb-0">30 días para devoluciones en productos sin abrir</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CarritoPage

