"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Container, Row, Col, Card, Badge, Carousel } from "react-bootstrap"
import { motion } from "framer-motion"
import "../../Pages/ClientePages/sobre-nosotros-page.scss"

const SobreNosotrosPage = () => {
  const [historiaImagenes, setHistoriaImagenes] = useState([
    "https://images.unsplash.com/photo-1593620659530-7f98c53de278?q=80&w=1000",
    "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=1000",
    "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=1000",
  ])

  return (
    <div className="sobre-nosotros-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-overlay"></div>
        <Container>
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1>Sobre Nosotros</h1>
            <p className="lead">Comprometidos con el bienestar de tu mascota desde 2018</p>
            <div className="hero-badges">
              <Badge className="hero-badge">Calidad</Badge>
              <Badge className="hero-badge">Confianza</Badge>
              <Badge className="hero-badge">Pasión</Badge>
            </div>
          </motion.div>
        </Container>
      </div>

      {/* Historia Section */}
      <section className="historia-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="section-header">
                  <h6 className="section-subtitle">NUESTRA HISTORIA</h6>
                  <h2 className="section-title">Una pasión que comenzó con dos mascotas</h2>
                </div>
                <div className="historia-content">
                  <p>
                    Teo/Cat nació en 2018 en Medellín, Colombia, como un pequeño negocio familiar impulsado por el amor
                    a las mascotas. Fundada por los hermanos Alejandro y Carolina Martínez, quienes compartían la pasión
                    por los animales y la visión de crear un espacio donde las mascotas y sus dueños pudieran encontrar
                    todo lo necesario para su bienestar.
                  </p>
                  <p>
                    Lo que comenzó como una pequeña tienda con productos básicos, rápidamente se transformó en un centro
                    integral para mascotas, añadiendo servicios de peluquería, veterinaria y adiestramiento. El nombre
                    "Teo/Cat" surgió de la combinación de los nombres de las mascotas de los fundadores: Teo, un
                    labrador juguetón, y Cat, una gata siamés con personalidad única.
                  </p>
                  <p>
                    Hoy, Teo/Cat se ha convertido en un referente en Medellín para todos los amantes de las mascotas,
                    manteniendo siempre su esencia familiar y el compromiso con el bienestar animal.
                  </p>
                </div>
              </motion.div>
            </Col>
            <Col lg={6}>
              <motion.div
                className="historia-image-container"
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Carousel fade interval={5000} className="historia-carousel">
                  {historiaImagenes.map((imagen, index) => (
                    <Carousel.Item key={index}>
                      <img
                        src={imagen || "/placeholder.svg"}
                        alt={`Historia de Teo/Cat ${index + 1}`}
                        className="historia-image"
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
                <div className="historia-image-accent"></div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Misión, Visión y Valores Section */}
      <section className="mvv-section">
        <Container>
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h6 className="section-subtitle">NUESTRA FILOSOFÍA</h6>
            <h2 className="section-title">Misión, Visión y Valores</h2>
            <p className="section-description">
              Estos son los pilares que guían nuestro trabajo diario y nos ayudan a ofrecer el mejor servicio
            </p>
          </motion.div>

          <Row className="mvv-cards">
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="h-100"
              >
                <Card className="mvv-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="mvv-icon">
                      <i className="bi bi-bullseye"></i>
                    </div>
                    <h3>Misión</h3>
                    <p className="flex-grow-1">
                      Proporcionar productos y servicios de alta calidad para mascotas, contribuyendo a su bienestar y
                      felicidad, mientras creamos una comunidad de dueños responsables y comprometidos con el cuidado
                      animal.
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-100"
              >
                <Card className="mvv-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="mvv-icon">
                      <i className="bi bi-eye"></i>
                    </div>
                    <h3>Visión</h3>
                    <p className="flex-grow-1">
                      Ser reconocidos como la empresa líder en el cuidado integral de mascotas en Colombia, expandiendo
                      nuestra presencia a nivel nacional y siendo referentes en innovación, calidad y servicio.
                    </p>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-100"
              >
                <Card className="mvv-card h-100">
                  <Card.Body className="d-flex flex-column">
                    <div className="mvv-icon">
                      <i className="bi bi-heart"></i>
                    </div>
                    <h3>Valores</h3>
                    <ul className="valores-list flex-grow-1">
                      <li>
                        <i className="bi bi-check-circle-fill"></i> Amor por los animales
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i> Compromiso con la calidad
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i> Responsabilidad social
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i> Innovación constante
                      </li>
                      <li>
                        <i className="bi bi-check-circle-fill"></i> Atención personalizada
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Instalaciones Section */}
      <section className="instalaciones-section">
        <Container>
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h6 className="section-subtitle">NUESTRO ESPACIO</h6>
            <h2 className="section-title">Instalaciones de Primer Nivel</h2>
            <p className="section-description">Espacios diseñados pensando en la comodidad y bienestar de tu mascota</p>
          </motion.div>

          <Row className="instalaciones-cards">
            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="h-100"
              >
                <div className="instalacion-card h-100">
                  <div className="instalacion-image-container">
                    <img
                      src="https://images.unsplash.com/photo-1603189343302-e603f7add05a?q=80&w=500"
                      alt="Tienda"
                      className="instalacion-image"
                    />
                  </div>
                  <div className="instalacion-content d-flex flex-column">
                    <h4>Tienda</h4>
                    <p className="flex-grow-1">
                      Nuestra tienda cuenta con más de 500 productos seleccionados cuidadosamente para satisfacer todas
                      las necesidades de tu mascota.
                    </p>
                    <Link to="/catalogo" className="instalacion-link">
                      Ver Productos <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="h-100"
              >
                <div className="instalacion-card h-100">
                  <div className="instalacion-image-container">
                    <img
                      src="https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=500"
                      alt="Clínica Veterinaria"
                      className="instalacion-image"
                    />
                  </div>
                  <div className="instalacion-content d-flex flex-column">
                    <h4>Clínica Veterinaria</h4>
                    <p className="flex-grow-1">
                      Equipada con tecnología de punta para ofrecer diagnósticos precisos y tratamientos efectivos para
                      tu mascota.
                    </p>
                    <Link to="/servicios" className="instalacion-link">
                      Ver Servicios <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Col>

            <Col md={4}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="h-100"
              >
                <div className="instalacion-card h-100">
                  <div className="instalacion-image-container">
                    <img
                      src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500"
                      alt="Sala de Peluquería"
                      className="instalacion-image"
                    />
                  </div>
                  <div className="instalacion-content d-flex flex-column">
                    <h4>Sala de Peluquería</h4>
                    <p className="flex-grow-1">
                      Espacio diseñado para que tu mascota se sienta cómoda mientras recibe los mejores cuidados
                      estéticos.
                    </p>
                    <Link to="/servicios" className="instalacion-link">
                      Agendar Cita <i className="bi bi-arrow-right"></i>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Compromiso Ambiental Section */}
      <section className="compromiso-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="order-lg-2">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="section-header">
                  <h6 className="section-subtitle">NUESTRO COMPROMISO</h6>
                  <h2 className="section-title">Responsabilidad Ambiental</h2>
                </div>
                <div className="compromiso-content">
                  <p>
                    En Teo/Cat entendemos que el cuidado de las mascotas debe ir de la mano con el cuidado del planeta.
                    Por eso, hemos implementado diversas iniciativas para reducir nuestro impacto ambiental:
                  </p>
                  <ul className="compromiso-list">
                    <li>
                      <i className="bi bi-recycle"></i>
                      <div>
                        <h5>Productos Eco-amigables</h5>
                        <p>Priorizamos productos con empaques biodegradables y materiales sostenibles.</p>
                      </div>
                    </li>
                    <li>
                      <i className="bi bi-droplet"></i>
                      <div>
                        <h5>Uso Responsable del Agua</h5>
                        <p>Sistemas de ahorro de agua en nuestros servicios de peluquería y limpieza.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </motion.div>
            </Col>
            <Col lg={6} className="order-lg-1">
              <motion.div
                className="compromiso-image-container"
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000"
                  alt="Compromiso Ambiental"
                  className="compromiso-image"
                />
                <div className="compromiso-stats">
                  <div className="stat-item">
                    <span className="stat-number">85%</span>
                    <span className="stat-text">Productos Eco-amigables</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">40%</span>
                    <span className="stat-text">Reducción de Plásticos</span>
                  </div>
                </div>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Galería de Imágenes - Nueva sección interactiva */}
      <section className="galeria-section">
        <Container>
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h6 className="section-subtitle">GALERÍA</h6>
            <h2 className="section-title">Momentos Especiales</h2>
            <p className="section-description">Algunos momentos capturados en nuestras instalaciones</p>
          </motion.div>

          <div className="galeria-container">
            <Row className="g-3">
              {[
                "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500",
                "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500",
                "https://images.unsplash.com/photo-1548767797-d8c844163c4c?q=80&w=500",
                "https://images.unsplash.com/photo-1541364983171-a8ba01e95cfc?q=80&w=500",
                "https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?q=80&w=500",
                "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=500",
              ].map((imagen, index) => (
                <Col xs={6} md={4} key={index}>
                  <motion.div className="galeria-item" whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                    <img src={imagen || "/placeholder.svg"} alt={`Galería ${index + 1}`} className="galeria-imagen" />
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default SobreNosotrosPage

