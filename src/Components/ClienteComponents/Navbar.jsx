"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { Navbar as BSNavbar, Container, Nav, Button, Badge, Dropdown } from "react-bootstrap"
import "./Navbar.scss"

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    // Verificar si el usuario está autenticado
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)

    // Obtener cantidad de productos en el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)

    // Efecto de scroll para el navbar
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Actualizar el contador del carrito cuando cambia
  useEffect(() => {
    const handleStorageChange = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.length)
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  return (
    <BSNavbar expand="lg" fixed="top" className={`custom-navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <Container>
        <BSNavbar.Brand as={Link} to="/" className="navbar-logo">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo2.jpg-KEo5YRO1SwydScSYxiiPG92bVBqOnm.jpeg"
            alt="Teo/Cat Logo"
            className="logo-image"
          />
        </BSNavbar.Brand>

        <BSNavbar.Toggle aria-controls="basic-navbar-nav" />

        <BSNavbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/" className={location.pathname === "/" ? "active" : ""}>
              Inicio
            </Nav.Link>
            <Nav.Link as={Link} to="/catalogo" className={location.pathname === "/catalogo" ? "active" : ""}>
              Catálogo
            </Nav.Link>
            <Nav.Link as={Link} to="/servicios" className={location.pathname === "/servicios" ? "active" : ""}>
              Servicios
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/sobre-nosotros"
              className={`sobre-nosotros-link ${location.pathname === "/sobre-nosotros" ? "active" : ""}`}
            >
              Sobre Nosotros
            </Nav.Link>
          </Nav>

          <div className="d-flex align-items-center">
            <div className="cart-icon-container">
              <Link to="/carrito" className="cart-icon position-relative me-3">
                <i className="bi bi-cart3 fs-4"></i>
                {cartCount > 0 && (
                  <Badge pill bg="success" className="position-absolute top-0 start-100 translate-middle">
                    {cartCount}
                  </Badge>
                )}
              </Link>
            </div>

            <div className="auth-button-container">
              {isLoggedIn ? (
                <Dropdown>
                  <Dropdown.Toggle variant="success" id="dropdown-user" className="user-dropdown">
                    <i className="bi bi-person-circle"></i>
                  </Dropdown.Toggle>

                  <Dropdown.Menu align="end">
                    <Dropdown.Item as={Link} to="/perfil">
                      <i className="bi bi-person me-2"></i> Mi Perfil
                    </Dropdown.Item>
                    <Dropdown.Item as={Link} to="/perfil?tab=orders">
                      <i className="bi bi-box-seam me-2"></i> Mis Pedidos
                    </Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item
                      as={Link}
                      to="/login"
                      onClick={() => localStorage.removeItem("token")}
                      className="text-danger"
                    >
                      <i className="bi bi-box-arrow-right me-2"></i> Cerrar Sesión
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button as={Link} to="/login" variant="success" className="login-btn">
                  <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
                </Button>
              )}
            </div>
          </div>
        </BSNavbar.Collapse>
      </Container>
    </BSNavbar>
  )
}

export default Navbar

