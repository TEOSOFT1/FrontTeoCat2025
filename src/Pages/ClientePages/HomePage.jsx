"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Container, Card, Button, Row, Col } from "react-bootstrap"
import { Swiper, SwiperSlide } from "swiper/react"
import { Pagination, Navigation, Autoplay, EffectFade } from "swiper/modules"
import { motion } from "framer-motion"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"
import HeroSection from "../../Components/ClienteComponents/HeroSection"
import ProductCard from "../../Components/ClienteComponents/ProductCard"
import ServiceCard from "../../Components/ClienteComponents/ServiceCard"
import "./HomePage.scss"

const HomePage = () => {
  // Estado para productos destacados (simulados)
  const [featuredProducts, setFeaturedProducts] = useState([])
  // Estado para servicios populares (simulados)
  const [popularServices, setPopularServices] = useState([])
  // Estado para controlar animaciones
  const [isVisible, setIsVisible] = useState({
    categories: false,
    products: false,
    services: false,
    map: false,
  })

  useEffect(() => {
    // Simulación de carga de datos desde API
    // En producción, aquí harías fetch a tu API

    // Productos destacados simulados
    const mockProducts = [
      {
        id: 1,
        name: "Alimento Premium para Perros",
        category: "Alimentos",
        price: 75000,
        originalPrice: 85000,
        discount: 12,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=500",
      },
      {
        id: 2,
        name: "Juguete Interactivo para Gatos",
        category: "Juguetes",
        price: 35000,
        originalPrice: 35000,
        discount: 0,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500",
      },
      {
        id: 3,
        name: "Cama Ortopédica para Mascotas",
        category: "Accesorios",
        price: 120000,
        originalPrice: 150000,
        discount: 20,
        rating: 4.9,
        image: "https://images.unsplash.com/photo-1567612529009-afe25813a308?q=80&w=500",
      },
      {
        id: 4,
        name: "Collar Ajustable con GPS",
        category: "Accesorios",
        price: 89000,
        originalPrice: 89000,
        discount: 0,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500",
      },
    ]

    // Servicios populares simulados
    const mockServices = [
      {
        id: 1,
        name: "Peluquería Canina",
        description: "Corte y arreglo profesional para tu perro",
        price: 45000,
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500",
      },
      {
        id: 2,
        name: "Baño y Spa",
        description: "Baño completo con productos premium",
        price: 35000,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500",
      },
      {
        id: 3,
        name: "Paseo de Mascotas",
        description: "Paseos diarios con personal capacitado",
        price: 25000,
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=500",
      },
    ]

    setFeaturedProducts(mockProducts)
    setPopularServices(mockServices)

    // Configurar observadores de intersección para animaciones
    const observerOptions = {
      threshold: 0.2,
      rootMargin: "0px 0px -100px 0px",
    }

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.dataset.section]: true,
          }))
        }
      })
    }, observerOptions)

    // Observar secciones
    const sections = document.querySelectorAll(".animate-section")
    sections.forEach((section) => {
      sectionObserver.observe(section)
    })

    return () => {
      sections.forEach((section) => {
        sectionObserver.unobserve(section)
      })
    }
  }, [])

  return (
    <div className="home-page">
      <HeroSection />

      {/* Sección de Categorías */}
      <section className="categories-section py-5 animate-section" data-section="categories">
        <Container>
          <motion.div
            className="section-header text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.categories ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title mb-2">Explora Nuestras Categorías</h2>
            <p className="section-subtitle mb-5">Encuentra todo lo que tu mascota necesita en un solo lugar</p>
          </motion.div>

          <div className="categories-grid">
            <Row className="g-4">
              {[
                {
                  id: 1,
                  name: "Alimentos",
                  description: "Nutrición premium para tu mascota",
                  icon: "bi-basket",
                  image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=500",
                  color: "#7ab51d",
                },
                {
                  id: 2,
                  name: "Juguetes",
                  description: "Diversión y entretenimiento",
                  icon: "bi-controller",
                  image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500",
                  color: "#e67e22",
                },
                {
                  id: 3,
                  name: "Accesorios",
                  description: "Comodidad y estilo para tu mascota",
                  icon: "bi-tag",
                  image: "https://images.unsplash.com/photo-1567612529009-afe25813a308?q=80&w=500",
                  color: "#3498db",
                },
                {
                  id: 4,
                  name: "Higiene",
                  description: "Cuidado y limpieza",
                  icon: "bi-droplet",
                  image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?q=80&w=500",
                  color: "#9b59b6",
                },
              ].map((category, index) => (
                <Col md={6} lg={3} key={category.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={isVisible.categories ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                  >
                    <Link to={`/catalogo?categoria=${category.name.toLowerCase()}`} className="text-decoration-none">
                      <Card className="category-card h-100 border-0 shadow-hover">
                        <div className="category-icon-wrapper" style={{ backgroundColor: category.color }}>
                          <i className={`bi ${category.icon}`}></i>
                        </div>
                        <Card.Body className="text-center">
                          <Card.Title className="category-title">{category.name}</Card.Title>
                          <Card.Text className="category-description">{category.description}</Card.Text>
                          <div className="category-link">
                            Explorar <i className="bi bi-arrow-right ms-1"></i>
                          </div>
                        </Card.Body>
                      </Card>
                    </Link>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </Container>
      </section>

      {/* Banner promocional */}
      <section className="promo-banner">
        <Container fluid className="p-0">
          <div className="promo-content">
            <Row className="g-0 align-items-center">
              <Col lg={6} className="promo-image-col">
                <div className="promo-image-container">
                  <img
                    src="https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=1920"
                    alt="Promoción especial"
                    className="promo-image"
                  />
                </div>
              </Col>
              <Col lg={6} className="promo-text-col">
                <div className="promo-text-container">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <h2 className="promo-title">15% de Descuento en tu Primera Compra</h2>
                    <p className="promo-description">
                      Regístrate hoy y recibe un 15% de descuento en tu primera compra. Además, obtén envío gratis en
                      pedidos superiores a $100.000.
                    </p>
                    <div className="promo-cta">
                      <Button as={Link} to="/register" className="btn-lg promo-button">
                        Registrarse Ahora
                      </Button>
                      <p className="promo-terms">*Aplican términos y condiciones</p>
                    </div>
                  </motion.div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* Sección de Productos Destacados */}
      <section className="featured-products-section py-5 animate-section" data-section="products">
        <Container>
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.products ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h2 className="section-title">Productos Destacados</h2>
                <p className="section-subtitle">Seleccionados especialmente para tu mascota</p>
              </div>
              <div className="view-all-button-wrapper">
                <Button as={Link} to="/catalogo" variant="outline-primary" className="view-all-btn">
                  Ver Todos <i className="bi bi-arrow-right ms-1"></i>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Carrusel para productos destacados */}
          <Swiper
            modules={[Pagination, Navigation, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            className="products-swiper"
          >
            {featuredProducts.map((product, index) => (
              <SwiperSlide key={product.id}>
                <motion.div
                  className="product-card-wrapper"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible.products ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>

      {/* Sección de beneficios */}
      <section className="benefits-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">¿Por qué elegir Teo/Cat?</h2>
            <p className="section-subtitle">Nos diferenciamos por nuestro compromiso con tu mascota</p>
          </div>

          <Row className="g-4">
            {[
              {
                icon: "bi-truck",
                title: "Envío Rápido",
                description: "Entrega en 24-48 horas en Medellín y área metropolitana",
              },
              {
                icon: "bi-shield-check",
                title: "Productos de Calidad",
                description: "Seleccionamos cuidadosamente cada producto para tu mascota",
              },
              {
                icon: "bi-heart",
                title: "Atención Personalizada",
                description: "Asesoramiento profesional para el cuidado de tu mascota",
              },
              {
                icon: "bi-arrow-return-left",
                title: "Devoluciones Sencillas",
                description: "30 días para cambios y devoluciones sin complicaciones",
              },
            ].map((benefit, index) => (
              <Col md={6} lg={3} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="benefit-card h-100 border-0 shadow-sm text-center">
                    <Card.Body>
                      <div className="benefit-icon">
                        <i className={`bi ${benefit.icon}`}></i>
                      </div>
                      <h3 className="benefit-title">{benefit.title}</h3>
                      <p className="benefit-description mb-0">{benefit.description}</p>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sección de Servicios */}
      <section className="services-section py-5 animate-section" data-section="services">
        <Container>
          <motion.div
            className="section-header"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <div className="d-flex justify-content-between align-items-center mb-5">
              <div>
                <h2 className="section-title">Servicios Profesionales</h2>
                <p className="section-subtitle">Cuidamos de tu mascota con amor y dedicación</p>
              </div>
              <div className="view-all-button-wrapper">
                <Button as={Link} to="/servicios" variant="outline-primary" className="view-all-btn">
                  Ver Todos <i className="bi bi-arrow-right ms-1"></i>
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Carrusel para servicios */}
          <Swiper
            modules={[Pagination, Navigation, Autoplay, EffectFade]}
            spaceBetween={20}
            slidesPerView={1}
            breakpoints={{
              576: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            navigation={true}
            className="services-swiper"
          >
            {popularServices.map((service, index) => (
              <SwiperSlide key={service.id}>
                <motion.div
                  className="service-card-wrapper"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isVisible.services ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ServiceCard service={service} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="text-center mt-5">
            <Button as={Link} to="/agendar-cita" className="btn-lg schedule-btn">
              <i className="bi bi-calendar-check me-2"></i>
              Agendar una Cita
            </Button>
          </div>
        </Container>
      </section>

      {/* Testimonios */}
      <section className="testimonials-section py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="section-title">Lo que dicen nuestros clientes</h2>
            <p className="section-subtitle">Experiencias reales de quienes confían en nosotros</p>
          </div>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={30}
            slidesPerView={1}
            breakpoints={{
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            pagination={{ clickable: true, dynamicBullets: true }}
            className="testimonials-swiper"
          >
            {[
              {
                name: "Carolina Ramírez",
                image: "https://randomuser.me/api/portraits/women/12.jpg",
                rating: 5,
                text: "Desde que descubrí Teo/Cat, mi perro Max está más feliz y saludable. El personal es increíblemente amable y profesional.",
                pet: "Perro - Labrador",
              },
              {
                name: "Andrés Gómez",
                image: "https://randomuser.me/api/portraits/men/32.jpg",
                rating: 5,
                text: "La atención veterinaria es excelente. Diagnosticaron rápidamente a mi gata y el tratamiento fue efectivo. Ahora compramos todos sus productos aquí.",
                pet: "Gato - Siamés",
              },
              {
                name: "Valentina Mejía",
                image: "https://randomuser.me/api/portraits/women/65.jpg",
                rating: 4.5,
                text: "Los servicios de peluquería son los mejores de la ciudad. Mi perrita siempre queda hermosa y se nota que la tratan con mucho cariño.",
                pet: "Perro - Poodle",
              },
              {
                name: "Santiago López",
                image: "https://randomuser.me/api/portraits/men/67.jpg",
                rating: 5,
                text: "Excelente variedad de productos y precios muy competitivos. El envío llegó antes de lo esperado y todo en perfectas condiciones.",
                pet: "Gato - Persa",
              },
            ].map((testimonial, index) => (
              <SwiperSlide key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="testimonial-card h-100 border-0 shadow-sm">
                    <Card.Body>
                      <div className="testimonial-rating mb-3">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${i < Math.floor(testimonial.rating) ? "bi-star-fill" : i < testimonial.rating ? "bi-star-half" : "bi-star"} text-warning`}
                          ></i>
                        ))}
                      </div>
                      <p className="testimonial-text mb-4">"{testimonial.text}"</p>
                      <div className="d-flex align-items-center">
                        <div className="testimonial-image-container me-3">
                          <img
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="testimonial-image"
                          />
                        </div>
                        <div>
                          <h5 className="testimonial-name mb-0">{testimonial.name}</h5>
                          <p className="testimonial-pet mb-0">{testimonial.pet}</p>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </Container>
      </section>

      {/* Sección de Mapa de Google */}
      <section className="map-section py-5 animate-section" data-section="map">
        <Container>
          <motion.div
            className="section-header text-center mb-5"
            initial={{ opacity: 0, y: 30 }}
            animate={isVisible.map ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Encuéntranos</h2>
            <p className="section-subtitle">Visítanos en nuestra tienda física</p>
          </motion.div>

          <Row className="g-4">
            <Col lg={4} className="mb-4 mb-lg-0">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={isVisible.map ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="location-card border-0 shadow-sm h-100">
                  <Card.Body>
                    <h3 className="location-title mb-4">Nuestra Ubicación</h3>
                    <p className="location-description">
                      Visítanos en nuestra tienda física y descubre todos nuestros productos y servicios para tu
                      mascota.
                    </p>

                    <div className="location-info">
                      <div className="location-info-item">
                        <div className="location-icon">
                          <i className="bi bi-geo-alt"></i>
                        </div>
                        <div className="location-text">
                          <h5>Dirección</h5>
                          <p>Calle 34B #66A-18 / sector Unicentro, Medellín, Antioquia</p>
                        </div>
                      </div>

                      <div className="location-info-item">
                        <div className="location-icon">
                          <i className="bi bi-clock"></i>
                        </div>
                        <div className="location-text">
                          <h5>Horario</h5>
                          <p>Lunes a Sábado: 9:00 AM - 7:00 PM</p>
                          <p>Domingos: 10:00 AM - 4:00 PM</p>
                        </div>
                      </div>

                      <div className="location-info-item">
                        <div className="location-icon">
                          <i className="bi bi-telephone"></i>
                        </div>
                        <div className="location-text">
                          <h5>Contacto</h5>
                          <p>(604) 123-4567</p>
                          <p>+57 300 123 4567</p>
                        </div>
                      </div>
                    </div>

                    <div className="location-cta mt-4">
                      <Button
                        as="a"
                        href="https://goo.gl/maps/1JKzJZYqXZHvBQmS6"
                        target="_blank"
                        className="btn-block directions-btn"
                      >
                        <i className="bi bi-map me-2"></i>
                        Cómo Llegar
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </motion.div>
            </Col>

            <Col lg={8}>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={isVisible.map ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="map-container rounded shadow-sm overflow-hidden"
              >
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.2124445750146!2d-75.59143232426036!3d6.2329699271639!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4429a5bfb9e0d7%3A0x4812b922f0ad8f19!2sCl.%2034b%20%2366a-18%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses!2sco!4v1711585200000!5m2!1ses!2sco"
                  width="100%"
                  height="450"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Ubicación de Teo/Cat"
                ></iframe>
              </motion.div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta-section">
        <Container>
          <div className="cta-container">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="cta-content text-center"
            >
              <h2 className="cta-title">¡Únete a la familia Teo/Cat!</h2>
              <p className="cta-description">
                Regístrate para recibir ofertas exclusivas, consejos para el cuidado de tu mascota y novedades sobre
                nuestros productos y servicios.
              </p>
              <div className="cta-buttons">
                <Button as={Link} to="/catalogo" className="cta-button me-3">
                  <i className="bi bi-bag me-2"></i>
                  Explorar Productos
                </Button>
                <Button as={Link} to="/register" variant="outline-light" className="cta-button-outline">
                  <i className="bi bi-person-plus me-2"></i>
                  Registrarse
                </Button>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>
    </div>
  )
}

export default HomePage

