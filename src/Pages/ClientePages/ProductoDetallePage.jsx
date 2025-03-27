"use client"

import { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { Container, Row, Col, Button, Tabs, Tab, Form, Badge } from "react-bootstrap"
import { toast } from "react-toastify"
import "./ProductoDetallePage.scss"

const ProductoDetallePage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("descripcion")
  const [relatedProducts, setRelatedProducts] = useState([])

  useEffect(() => {
    // Simulación de carga de datos desde API
    // En producción, aquí harías fetch a tu API con el ID del producto

    setTimeout(() => {
      const mockProduct = {
        id: Number.parseInt(id),
        name: "Alimento Premium para Perros",
        category: "Alimentos",
        price: 75000,
        originalPrice: 85000,
        discount: 12,
        rating: 4.8,
        stock: 15,
        description:
          "Alimento premium para perros adultos de todas las razas. Formulado con ingredientes naturales de alta calidad que proporcionan una nutrición completa y balanceada para tu mascota. Contiene proteínas de primera calidad, vitaminas y minerales esenciales para mantener la salud y vitalidad de tu perro.",
        features: [
          "Ingredientes 100% naturales",
          "Sin conservantes artificiales",
          "Alto contenido proteico",
          "Mejora el sistema inmunológico",
          "Promueve un pelaje brillante y saludable",
        ],
        specifications: {
          Peso: "15 kg",
          Tipo: "Alimento seco",
          "Etapa de vida": "Adulto",
          "Tamaño de raza": "Todas las razas",
          Sabor: "Pollo y arroz",
          "Ingredientes principales": "Pollo, arroz, maíz, aceite de pescado",
        },
        images: [
          "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=1200",
          "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=1200",
          "https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?q=80&w=1200",
        ],
        reviews: [
          {
            id: 1,
            user: "Carlos Rodríguez",
            rating: 5,
            date: "15/02/2024",
            comment: "Excelente producto. Mi perro lo adora y he notado mejoras en su pelaje y energía.",
          },
          {
            id: 2,
            user: "María López",
            rating: 4,
            date: "28/01/2024",
            comment: "Buena calidad, aunque el precio es un poco elevado. Mi mascota lo come sin problemas.",
          },
          {
            id: 3,
            user: "Juan Pérez",
            rating: 5,
            date: "10/01/2024",
            comment: "Llevo varios meses comprando este alimento y mi perro está más saludable que nunca.",
          },
        ],
      }

      setProduct(mockProduct)

      // Productos relacionados simulados
      const mockRelatedProducts = [
        {
          id: 5,
          name: "Alimento Húmedo para Perros",
          category: "Alimentos",
          price: 45000,
          originalPrice: 50000,
          discount: 10,
          rating: 4.6,
          image: "https://images.unsplash.com/photo-1600357077527-930ccbaf7773?q=80&w=500",
        },
        {
          id: 8,
          name: "Snacks Naturales para Perros",
          category: "Alimentos",
          price: 30000,
          originalPrice: 30000,
          discount: 0,
          rating: 4.5,
          image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=500",
        },
        {
          id: 10,
          name: "Champú Hipoalergénico",
          category: "Higiene",
          price: 28000,
          originalPrice: 28000,
          discount: 0,
          rating: 4.4,
          image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?q=80&w=500",
        },
      ]

      setRelatedProducts(mockRelatedProducts)
      setLoading(false)
    }, 800)
  }, [id])

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1 || (product && newQuantity > product.stock)) return
    setQuantity(newQuantity)
  }

  const addToCart = () => {
    if (!product) return

    // Obtener el carrito actual del localStorage
    const currentCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Verificar si el producto ya está en el carrito
    const existingProductIndex = currentCart.findIndex((item) => item.id === product.id)

    if (existingProductIndex >= 0) {
      // Si el producto ya está en el carrito, incrementar la cantidad
      currentCart[existingProductIndex].quantity += quantity
    } else {
      // Si no, añadir el producto con la cantidad seleccionada
      currentCart.push({
        ...product,
        quantity: quantity,
      })
    }

    // Guardar el carrito actualizado en localStorage
    localStorage.setItem("cart", JSON.stringify(currentCart))

    // Disparar evento para actualizar contador del carrito
    window.dispatchEvent(new Event("storage"))

    // Mostrar notificación
    toast.success(`${quantity} ${quantity > 1 ? "unidades" : "unidad"} añadidas al carrito`, {
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
      <div className="producto-detalle-page loading-container">
        <Container className="py-5 mt-5 text-center">
          <div className="spinner-border" role="status" style={{ color: "#7ab51d" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando detalles del producto...</p>
        </Container>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="producto-detalle-page error-container">
        <Container className="py-5 mt-5 text-center">
          <div className="mb-4">
            <i className="bi bi-exclamation-circle-fill" style={{ fontSize: "3rem", color: "#dc3545" }}></i>
          </div>
          <h2>Producto no encontrado</h2>
          <p className="mb-4">Lo sentimos, el producto que estás buscando no existe o ha sido eliminado.</p>
          <Link to="/catalogo" className="btn btn-success">
            Volver al Catálogo
          </Link>
        </Container>
      </div>
    )
  }

  return (
    <div className="producto-detalle-page">
      <Container className="py-5 mt-5">
        {/* Breadcrumb */}
        <nav aria-label="breadcrumb" className="mb-4">
          <ol className="breadcrumb">
            <li className="breadcrumb-item">
              <Link to="/">Inicio</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to="/catalogo">Catálogo</Link>
            </li>
            <li className="breadcrumb-item">
              <Link to={`/catalogo?categoria=${product.category.toLowerCase()}`}>{product.category}</Link>
            </li>
            <li className="breadcrumb-item active" aria-current="page">
              {product.name}
            </li>
          </ol>
        </nav>

        <Row className="mb-5">
          {/* Galería de imágenes */}
          <Col lg={6} className="mb-4 mb-lg-0">
            <div className="product-gallery">
              <div className="main-image-container mb-3">
                <img
                  src={product.images[0] || "/placeholder.svg"}
                  alt={product.name}
                  className="main-image img-fluid rounded"
                />
                {product.discount > 0 && <div className="discount-badge">-{product.discount}%</div>}
              </div>

              <div className="thumbnail-container">
                {product.images.map((image, index) => (
                  <div key={index} className="thumbnail-item">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${product.name} - Vista ${index + 1}`}
                      className="thumbnail-image img-fluid rounded"
                    />
                  </div>
                ))}
              </div>
            </div>
          </Col>

          {/* Información del producto */}
          <Col lg={6}>
            <div className="product-info">
              <h1 className="product-title">{product.name}</h1>

              <div className="product-meta d-flex align-items-center mb-3">
                <div className="product-rating me-3">
                  {[...Array(5)].map((_, i) => (
                    <i
                      key={i}
                      className={`bi ${i < Math.floor(product.rating) ? "bi-star-fill" : i < product.rating ? "bi-star-half" : "bi-star"} text-warning`}
                    ></i>
                  ))}
                  <span className="ms-2">{product.rating}</span>
                </div>

                <div className="product-reviews-count">
                  <Link to="#reviews" onClick={() => setActiveTab("reviews")}>
                    {product.reviews.length} reseñas
                  </Link>
                </div>
              </div>

              <div className="product-price mb-4">
                {product.discount > 0 ? (
                  <>
                    <span className="original-price">${product.originalPrice.toLocaleString()}</span>
                    <span className="current-price">${product.price.toLocaleString()}</span>
                  </>
                ) : (
                  <span className="current-price">${product.price.toLocaleString()}</span>
                )}
              </div>

              <div className="product-short-description mb-4">
                <p>{product.description.substring(0, 150)}...</p>
              </div>

              <div className="product-stock mb-4">
                <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                  <i className={`bi ${product.stock > 0 ? "bi-check-circle-fill" : "bi-x-circle-fill"} me-2`}></i>
                  {product.stock > 0 ? `${product.stock} unidades disponibles` : "Agotado"}
                </span>
              </div>

              <div className="product-actions mb-4">
                <div className="quantity-selector d-flex align-items-center mb-3">
                  <span className="me-3">Cantidad:</span>
                  <div className="input-group" style={{ width: "130px" }}>
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      <i className="bi bi-dash"></i>
                    </Button>
                    <Form.Control
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(Number.parseInt(e.target.value) || 1)}
                      min="1"
                      max={product.stock}
                      className="text-center"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= product.stock}
                    >
                      <i className="bi bi-plus"></i>
                    </Button>
                  </div>
                </div>

                <div className="d-grid gap-2 d-md-flex">
                  <Button
                    variant="success"
                    size="lg"
                    className="flex-grow-1"
                    onClick={addToCart}
                    disabled={product.stock <= 0}
                  >
                    <i className="bi bi-cart-plus me-2"></i>
                    Añadir al Carrito
                  </Button>

                  <Button variant="outline-secondary" size="lg">
                    <i className="bi bi-heart"></i>
                  </Button>
                </div>
              </div>

              <div className="product-category mb-4">
                <span className="text-muted me-2">Categoría:</span>
                <Link to={`/catalogo?categoria=${product.category.toLowerCase()}`}>{product.category}</Link>
              </div>

              <div className="product-share">
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
        <div className="product-tabs mb-5">
          <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k)} className="mb-4">
            <Tab eventKey="descripcion" title="Descripción">
              <div className="tab-content-container">
                <h3 className="mb-4">Descripción del Producto</h3>
                <p>{product.description}</p>

                <h4 className="mt-4 mb-3">Características</h4>
                <ul className="features-list">
                  {product.features.map((feature, index) => (
                    <li key={index}>
                      <i className="bi bi-check-circle-fill me-2" style={{ color: "#7ab51d" }}></i>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </Tab>

            <Tab eventKey="especificaciones" title="Especificaciones">
              <div className="tab-content-container">
                <h3 className="mb-4">Especificaciones Técnicas</h3>
                <table className="table specifications-table">
                  <tbody>
                    {Object.entries(product.specifications).map(([key, value], index) => (
                      <tr key={index}>
                        <th>{key}</th>
                        <td>{value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Tab>

            <Tab eventKey="reviews" title={`Reseñas (${product.reviews.length})`}>
              <div className="tab-content-container" id="reviews">
                <h3 className="mb-4">Opiniones de Clientes</h3>

                <div className="reviews-summary mb-4">
                  <div className="d-flex align-items-center">
                    <div className="overall-rating me-4">
                      <span className="rating-value">{product.rating}</span>
                      <div className="stars">
                        {[...Array(5)].map((_, i) => (
                          <i
                            key={i}
                            className={`bi ${i < Math.floor(product.rating) ? "bi-star-fill" : i < product.rating ? "bi-star-half" : "bi-star"} text-warning`}
                          ></i>
                        ))}
                      </div>
                      <span className="total-reviews">{product.reviews.length} reseñas</span>
                    </div>

                    <div className="rating-bars flex-grow-1">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = product.reviews.filter((review) => Math.floor(review.rating) === stars).length
                        const percentage = (count / product.reviews.length) * 100

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
                  {product.reviews.map((review) => (
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
                    Tu dirección de correo no será publicada. Los campos obligatorios están marcados con *
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

                    <Row>
                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Nombre *</Form.Label>
                          <Form.Control type="text" />
                        </Form.Group>
                      </Col>

                      <Col md={6}>
                        <Form.Group className="mb-3">
                          <Form.Label>Correo electrónico *</Form.Label>
                          <Form.Control type="email" />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Button variant="success" type="submit">
                      Enviar Reseña
                    </Button>
                  </Form>
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>

        {/* Productos relacionados */}
        <div className="related-products">
          <h3 className="section-title mb-4">Productos Relacionados</h3>

          <Row className="g-4">
            {relatedProducts.map((relatedProduct) => (
              <Col md={4} key={relatedProduct.id}>
                <div className="related-product-card card h-100 border-0 shadow-sm">
                  <Link to={`/producto/${relatedProduct.id}`} className="text-decoration-none">
                    <div className="position-relative">
                      <img
                        src={relatedProduct.image || "/placeholder.svg"}
                        alt={relatedProduct.name}
                        className="card-img-top related-product-image"
                      />
                      {relatedProduct.discount > 0 && (
                        <Badge bg="success" className="position-absolute top-0 start-0 m-2">
                          -{relatedProduct.discount}%
                        </Badge>
                      )}
                    </div>

                    <div className="card-body">
                      <h5 className="card-title related-product-title">{relatedProduct.name}</h5>

                      <div className="d-flex justify-content-between align-items-center mt-2">
                        <div className="related-product-price">
                          {relatedProduct.discount > 0 ? (
                            <>
                              <span className="original-price">${relatedProduct.originalPrice.toLocaleString()}</span>
                              <span className="current-price">${relatedProduct.price.toLocaleString()}</span>
                            </>
                          ) : (
                            <span className="current-price">${relatedProduct.price.toLocaleString()}</span>
                          )}
                        </div>

                        <div className="related-product-rating">
                          <i className="bi bi-star-fill text-warning me-1"></i>
                          <span>{relatedProduct.rating}</span>
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

export default ProductoDetallePage

