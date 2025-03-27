"use client"

import { Link } from "react-router-dom"
import { Container, Row, Col } from "react-bootstrap"
import "./Footer.scss"

const Footer = () => {
  return (
    <footer className="footer">
      <Container>
        <Row className="g-4">
          <Col lg={3} md={6}>
            <div className="text-center text-md-start mb-4">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Logo2.jpg-KEo5YRO1SwydScSYxiiPG92bVBqOnm.jpeg"
                alt="Teo/Cat Logo"
                height="80"
                className="mb-3 footer-logo"
              />
              <p className="mb-0">Tu tienda de confianza para todo lo que tu mascota necesita en Medellín, Colombia.</p>
            </div>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="footer-heading mb-4">Enlaces Rápidos</h5>
            <ul className="footer-links">
              <li className="footer-link-item">
                <Link to="/">Inicio</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/catalogo">Catálogo</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/servicios">Servicios</Link>
              </li>
              <li className="footer-link-item">
                <Link to="/sobre-nosotros">Sobre Nosotros</Link>
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="footer-heading mb-4">Contacto</h5>
            <ul className="footer-contact">
              <li>
                <i className="bi bi-geo-alt me-2"></i> Calle 34B #66A-18, Medellín
              </li>
              <li>
                <i className="bi bi-telephone me-2"></i> (604) 123-4567
              </li>
              <li>
                <i className="bi bi-envelope me-2"></i> contacto@teocat.com
              </li>
              <li>
                <i className="bi bi-clock me-2"></i> Lun-Sáb: 9AM - 7PM
              </li>
            </ul>
          </Col>

          <Col lg={3} md={6}>
            <h5 className="footer-heading mb-4">Síguenos</h5>
            <div className="social-icons">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-facebook"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-instagram"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-twitter-x"></i>
              </a>
              <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer" className="social-icon">
                <i className="bi bi-whatsapp"></i>
              </a>
            </div>
          </Col>
        </Row>

        <hr className="footer-divider my-4" />

        <Row>
          <Col md={6} className="text-center text-md-start">
            <p className="mb-0">&copy; {new Date().getFullYear()} Teo/Cat. Todos los derechos reservados.</p>
          </Col>
          <Col md={6} className="text-center text-md-end">
            <ul className="footer-bottom-links">
              <li>
                <Link to="/terminos">Términos y Condiciones</Link>
              </li>
              <li>
                <Link to="/privacidad">Política de Privacidad</Link>
              </li>
            </ul>
          </Col>
        </Row>
      </Container>
    </footer>
  )
}

export default Footer

