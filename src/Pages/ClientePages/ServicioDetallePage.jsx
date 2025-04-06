"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Container, Row, Col, Button, Tabs, Tab, Form } from "react-bootstrap"
import { toast } from "react-toastify"
import "./ServicioDetallePage.scss"

const ServicioDetallePage = () => {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("descripcion")
  const [relatedServices, setRelatedServices] = useState([])

  useEffect(() => {
    // Simulación de carga de datos desde API
    // En producción, aquí harías fetch a tu API con el ID del servicio

    setTimeout(() => {
      const mockService = {
        id: Number.parseInt(id),
        name: "Peluquería Canina",
        category: "Servicios",
        price: 45000,
        duration: "1 hora",
        rating: 4.9,
        availability: true,
        description:
          "Nuestro servicio de peluquería canina profesional está diseñado para mantener a tu mascota limpia, saludable y con un aspecto impecable. Utilizamos productos de alta calidad y técnicas modernas para garantizar el mejor resultado. Nuestros estilistas están capacitados para trabajar con todas las razas y tamaños de perros, adaptando el corte a las necesidades específicas de cada mascota.",
        benefits: [
          "Mejora la higiene y salud de tu mascota",
          "Previene problemas de piel y parásitos",
          "Reduce la caída de pelo en casa",
          "Detecta a tiempo posibles problemas de salud",
          "Proporciona una experiencia relajante para tu mascota",
        ],
        includes: {
          "Baño completo": "Con champú y acondicionador específicos para cada tipo de pelo",
          "Secado profesional": "Con secadores de baja temperatura para mayor comodidad",
          "Corte de pelo": "Según la raza o preferencia del dueño",
          "Limpieza de oídos": "Eliminación de cera y prevención de infecciones",
          "Corte de uñas": "Para prevenir problemas al caminar",
          "Limpieza dental": "Cepillado con pasta dental canina",
        },
        images: [
          "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1200",
          "https://images.unsplash.com/photo-1535930891776-0c2dfb7fda1a?q=80&w=1200",
          "https://images.unsplash.com/photo-1596492784531-6e6eb5ea9993?q=80&w=1200",
        ],
        professionals: [
          {
            id: 1,
            name: "Ana Martínez",
            position: "Estilista Canina Senior",
            experience: "8 años de experiencia",
            image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=300",
          },
          {
            id: 2,
            name: "Carlos Pérez",
            position: "Estilista Canino",
            experience: "5 años de experiencia",
            image: "https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=300",
          },
        ],
        reviews: [
          {
            id: 1,
            user: "María González",
            rating: 5,
            date: "15/02/2024",
            comment: "Excelente servicio. Mi perro quedó hermoso y se nota que lo trataron con mucho cariño.",
          },
          {
            id: 2,
            user: "Juan Rodríguez",
            rating: 5,
            date: "28/01/2024",
            comment: "Muy profesionales. Mi mascota estaba nerviosa al principio pero la tranquilizaron rápidamente.",
          },
          {
            id: 3,
            user: "Laura Sánchez",
            rating: 4,
            date: "10/01/2024",
            comment:
              "Buen servicio, aunque tuve que esperar un poco más de lo acordado. El resultado final fue muy bueno.",
          },
        ],
      }

      setService(mockService)

      // Servicios relacionados simulados
      const mockRelatedServices = [
        {
          id: 2,
          name: "Baño y Spa",
          category: "Servicios",
          price: 35000,
          rating: 4.7,
          image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500",
        },
        {
          id: 5,
          name: "Guardería Canina",
          category: "Servicios",
          price: 40000,
          rating: 4.8,
          image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500",
        },
        {
          id: 6,
          name: "Consulta Veterinaria",
          category: "Servicios",
          price: 50000,
          rating: 4.9,
          image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=500",
        },
      ]

      setRelatedServices(mockRelatedServices)
      setLoading(false)
    }, 800)
  }, [id])

  const handleBookService = () => {
    // Redirigir a la página de agendar cita con el ID del servicio como parámetro de consulta
    window.location.href = `/agendar-cita?servicio=${id}`

    // Mostrar notificación
    toast.success(`Servicio preseleccionado para agendar cita`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    })
  }

  if (loading) {
    return (
      <div className="servicio-detalle-page loading-container">
        <Container className="py-5 mt-5 text-center">
          <div className="spinner-border" role="status" style={{ color: "#7ab51d" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando detalles del servicio...</p>
        </Container>
      </div>
    )
  }

  if (!service) {
    return (
      <div className="servicio-detalle-page error-container">
        <Container className="py-5 mt-5 text-center">
          <div className="mb-4">
            <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "3rem", color: "#dc3545" }}></i>
          </div>
          <h2>Servicio no encontrado</h2>
          <p className="mb-4">Lo sentimos, el servicio que estás buscando no existe o ha sido eliminado.</p>
          <Link to="/servicios" className="btn btn-success">
            Volver a Servicios
          </Link>
        </Container>
      </div>
    )
  }

  return (
    <div className="servicio-detalle-page">
      <Container className="py-5 mt-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/servicios">Servicios</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {service.name}
            </li>
          </ol>
        </nav>

        <Row className="mb-5">
          {/* Galería de imágenes */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="service-gallery">
              <div className="main-image-container mb-3">
                <img
                  src={service.images[0] || "/placeholder.svg"}
                  alt={service.name}
                  className="main-image img-fluid rounded"
                />
                {service.availability ? (
                  <div className="availability-badge available">Disponible</div>
                ) : (
                  <div className="availability-badge unavailable">No Disponible</div>
                )}
              </div>

              <div className="thumbnail-container">
                {service.images.map((image, index) => (
                  <div key={index} className="thumbnail-item">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${service.name} - Vista ${index + 1}`}
                      className="thumbnail-image img-fluid rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Información del servicio */}
          <Col lg={6}>
            <div className="service-info">
              <h1 className="service-title">{service.name}</h1>

              <div className="service-meta d-flex align-items-center mb-3">
                <div className="service-rating me-3">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi ${i < Math.floor(service.rating) ? "bi-star-fill" : i < service.rating ? "bi-star-half" : "bi-star"} text-warning`}
                    ></i>
                  ))}
                  <span className="ms-2">{service.rating}</span>
                </div>

                <div className="service-reviews-count">
                  <Link to="#reviews" onClick={() => setActiveTab("reviews")}>
                    {service.reviews.length} reseñas
                  </Link>
                </div>
              </div>

              <div className="service-price-duration mb-4 d-flex align-items-center">
                <div className="service-price me-4">
                  <span className="current-price">${service.price.toLocaleString()}</span>
                </div>
                <div className="service-duration">
                  <i className="bi bi-clock me-2"></i>
                  <span>{service.duration}</span>
                </div>
              </div>

              <div className="service-short-description mb-4">
                <p>{service.description.substring(0, 150)}...</p>
              </div>

              <div className="service-availability mb-4">
                <span className={`availability-status ${service.availability ? "available" : "unavailable"}`}>
                  <i className={`bi ${service.availability ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-2`}></i>
                  {service.availability ? "Servicio disponible para agendar" : "Servicio temporalmente no disponible"}
                </span>
              </div>

              <div className="service-actions mb-4">
                <div className="d-grid gap-2 d-md-flex">
                  <Button
                    variant="success"
                    size="lg"
                    className="flex-grow-1"
                    onClick={handleBookService}
                    disabled={!service.availability}
                  >
                    <i className="bi bi-calendar-check me-2"></i>
                    Agendar Cita
                  </Button>
                </div>
              </div>

              <div className="service-professionals mb-4">
                <h5 className="mb-3">Profesionales a cargo:</h5>
                <div className="professionals-list d-flex flex-wrap">
                  {service.professionals.map((professional) => (
                    <div key={professional.id} className="professional-item me-3 mb-2 d-flex align-items-center">
                      <img
                        src={professional.image || "/placeholder.svg"}
                        alt={professional.name}
                        className="professional-image rounded-circle me-2"
                        width="40"
                        height="40"
                      />
                      <div>
                        <div className="professional-name">{professional.name}</div>
                        <div className="professional-position small text-muted">{professional.position}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="service-share">
                <span className="text-muted me-2">Compartir:</span>
                <div className="social-icons d-inline-block">
                  <a href="#" className="social-icon me-2">
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a href="#" className="social-icon me-2">
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a href="#" className="social-icon me-2">
                    <i className="bi bi-whatsapp"></i>
                  </a>
                  <a href="#" className="social-icon">
                    <i className="bi bi-envelope"></i>
                  </a>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Tabs de información adicional */}
        <div className="service-tabs mb-5">
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="descripcion" title="Descripción">
              <div className="tab-content-container">
                <h3 className="mb-4">Descripción del Servicio</h3>
                <p>{service.description}</p>

                <h4 className="mt-4 mb-3">Beneficios</h4>
                <ul className="benefits-list">
                  {service.benefits.map((benefit, index) => (
                    <li key={index}>
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#7ab51d" }}></i>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </Tab>

            <Tab eventKey="includes" title="¿Qué incluye?">
              <div className="tab-content-container">
                <h3 className="mb-4">¿Qué incluye este servicio?</h3>
                <table className="table includes-table">
                  <tbody>
                    {Object.entries(service.includes).map(([key, value], index) => (
                      <tr key={index}>
                        <th>{key}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>

            <Tab eventKey="reviews" title={`Reseñas (${service.reviews.length})`}>
              <div className="tab-content-container" id="reviews">
                <h3 className="mb-4">Opiniones de Clientes</h3>

                <div className="reviews-summary mb-4">
                  <div className="d-flex align-items-center">
                    <div className="overall-rating me-4">
                      <span className="rating-value">{service.rating}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${i < Math.floor(service.rating) ? "bi-star-fill" : i < service.rating ? "bi-star-half" : "bi-star"} text-warning`}
                          ></i>
                        ))}
                      </div>
                      <span className="total-reviews">{service.reviews.length} reseñas</span>
                    </div>

                    <div className="rating-bars flex-grow-1">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = service.reviews.filter((review) => Math.floor(review.rating) === stars).length
                        const percentage = (count / service.reviews.length) * 100

                        return (
                          <div key={stars} className="rating-bar-item d-flex align-items-center mb-1">
                            <div className="stars-label me-2">
                              {stars} <i className="bi bi-star-fill text-warning small"></i>
                            </div>
                            <div className="progress flex-grow-1 me-2" style={{ height: "8px" }}>
                              <div
                                className="progress-bar bg-success"
                                role="progressbar"
                                style={{ width: `${percentage}%` }}
                                aria-valuenow={percentage}
                                aria-valuemin="0"
                                aria-valuemax="100"
                              ></div>
                            </div>
                            <div className="count-label small">{count}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>

                <div className="reviews-list">
                  {service.reviews.map((review) => (
                    <div key={review.id} className="review-item mb-4 pb-4 border-bottom">
                      <div className="d-flex justify-content-between mb-2">
                        <h5 className="review-author mb-0">{review.user}</h5>
                        <span className="review-date text-muted">{review.date}</span>
                      </div>

                      <div className="review-rating mb-2">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${i < review.rating ? "bi-star-fill" : "bi-star"} text-warning`}
                          ></i>
                        ))}
                      </div>

                      <p className="review-content mb-0">{review.comment}</p>
                    </div>
                  ))}
                </div>

                <div className="write-review mt-4">
                  <h4 className="mb-3">Escribe una Reseña</h4>
                  <p className="text-muted mb-3">
                    Debes estar logueado y haber recibido este servicio para dejar una reseña.
                  </p>

                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Tu valoración *</Form.Label>
                      <div className="rating-selector">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className="bi bi-star rating-star"></i>
                        ))}
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Tu reseña *</Form.Label>
                      <Form.Control as="textarea" rows={4} />
                    </Form.Group>

                    <Button variant="success" type="submit">
                      Enviar Reseña
                    </Button>
                  </Form>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Servicios relacionados */}
        <div className="related-services">
          <h3 className="section-title mb-4">Servicios Relacionados</h3>

          <Row className="g-4">
            {relatedServices.map((relatedService) => (
              <Col md={4} key={relatedService.id}>
                <div className="related-service-card card h-100 border-0 shadow-sm">
                  <Link to={`/servicio/${relatedService.id}`} className="text-decoration-none">
                    <div className="position-relative">
                      <img
                        src={relatedService.image || "/placeholder.svg"}
                        alt={relatedService.name}
                        className="card-img-top related-service-image"
                      />
                    </div>

                    <div className="card-body">
                      <h5 className="card-title related-service-title">{relatedService.name}</h5>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="related-service-price">
                          <span className="current-price">${relatedService.price.toLocaleString()}</span>
                        </div>

                        <div className="related-service-rating">
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          <span>{relatedService.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              </Col>
            ))}
          </Row>
        </div>
      </Container>
    </div>
  )
}

export default ServicioDetallePage

