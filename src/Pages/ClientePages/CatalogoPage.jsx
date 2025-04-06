"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { Container, Row, Col, Form, Button, InputGroup, Card, Pagination } from "react-bootstrap"
import ProductCard from "../../Components/ClienteComponents/CatalogoComponents/ProductCard"
import "../../Pages/ClientePages/CatalogoPage.scss"

const CatalogoPage = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaParam = searchParams.get("categoria")

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  // Paginación
  const [currentPage, setCurrentPage] = useState(1)
  const [productsPerPage] = useState(6)
  const [totalPages, setTotalPages] = useState(1)
  const [paginatedProducts, setPaginatedProducts] = useState([])

  // Filtros
  const [selectedCategory, setSelectedCategory] = useState(categoriaParam || "todos")
  const [priceRange, setPriceRange] = useState([0, 200000])
  const [sortBy, setSortBy] = useState("featured")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRating, setSelectedRating] = useState(0)

  useEffect(() => {
    // Simulación de carga de datos desde API
    // En producción, aquí harías fetch a tu API

    const mockProducts = [
      {
        id: 1,
        name: "Alimento Premium para Perros",
        category: "Alimentos",
        price: 75000,
        rating: 4.8,
        stock: 15,
        image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?q=80&w=500",
      },
      {
        id: 2,
        name: "Juguete Interactivo para Gatos",
        category: "Juguetes",
        price: 35000,
        rating: 4.5,
        stock: 20,
        image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=500",
      },
      {
        id: 3,
        name: "Cama Ortopédica para Mascotas",
        category: "Accesorios",
        price: 120000,
        rating: 4.9,
        stock: 8,
        image: "https://images.unsplash.com/photo-1567612529009-afe25813a308?q=80&w=500",
      },
      {
        id: 4,
        name: "Collar Ajustable con GPS",
        category: "Accesorios",
        price: 89000,
        rating: 4.7,
        stock: 12,
        image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?q=80&w=500",
      },
      {
        id: 5,
        name: "Alimento Húmedo para Gatos",
        category: "Alimentos",
        price: 45000,
        rating: 4.6,
        stock: 25,
        image: "https://images.unsplash.com/photo-1600357077527-930ccbaf7773?q=80&w=500",
      },
      {
        id: 6,
        name: "Pelota de Juguete Resistente",
        category: "Juguetes",
        price: 25000,
        rating: 4.3,
        stock: 30,
        image: "https://images.unsplash.com/photo-1546491764-67a5b8d5b3ae?q=80&w=500",
      },
      {
        id: 7,
        name: "Transportadora para Mascotas",
        category: "Accesorios",
        price: 150000,
        rating: 4.8,
        stock: 5,
        image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?q=80&w=500",
      },
      {
        id: 8,
        name: "Snacks Naturales para Perros",
        category: "Alimentos",
        price: 30000,
        rating: 4.5,
        stock: 40,
        image: "https://images.unsplash.com/photo-1623387641168-d9803ddd3f35?q=80&w=500",
      },
      {
        id: 9,
        name: "Rascador para Gatos",
        category: "Accesorios",
        price: 85000,
        rating: 4.7,
        stock: 10,
        image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?q=80&w=500",
      },
      {
        id: 10,
        name: "Champú Hipoalergénico",
        category: "Higiene",
        price: 28000,
        rating: 4.4,
        stock: 22,
        image: "https://images.unsplash.com/photo-1584305574647-0cc949a2bb9f?q=80&w=500",
      },
      {
        id: 11,
        name: "Correa Retráctil",
        category: "Accesorios",
        price: 45000,
        rating: 4.2,
        stock: 15,
        image: "https://images.unsplash.com/photo-1567612529009-afe25813a308?q=80&w=500",
      },
      {
        id: 12,
        name: "Comedero Automático",
        category: "Accesorios",
        price: 120000,
        rating: 4.6,
        stock: 8,
        image: "https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?q=80&w=500",
      },
    ]

    // Extraer categorías únicas
    const uniqueCategories = [...new Set(mockProducts.map((product) => product.category))]

    setProducts(mockProducts)
    setFilteredProducts(mockProducts)
    setCategories(uniqueCategories)
    setLoading(false)

    // Si hay un parámetro de categoría en la URL, aplicar ese filtro
    if (categoriaParam) {
      const normalizedParam = categoriaParam.toLowerCase()
      const matchingCategory = uniqueCategories.find((cat) => cat.toLowerCase() === normalizedParam)

      if (matchingCategory) {
        setSelectedCategory(matchingCategory)
        setFilteredProducts(mockProducts.filter((product) => product.category.toLowerCase() === normalizedParam))
      }
    }
  }, [categoriaParam])

  // Aplicar filtros cuando cambien
  useEffect(() => {
    let result = [...products]

    // Filtrar por categoría
    if (selectedCategory !== "todos") {
      result = result.filter((product) => product.category === selectedCategory)
    }

    // Filtrar por rango de precio
    result = result.filter((product) => product.price >= priceRange[0] && product.price <= priceRange[1])

    // Filtrar por término de búsqueda
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (product) => product.name.toLowerCase().includes(term) || product.category.toLowerCase().includes(term),
      )
    }

    // Filtrar por valoración
    if (selectedRating > 0) {
      result = result.filter((product) => product.rating >= selectedRating)
    }

    // Aplicar ordenamiento
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.price - a.price)
    } else if (sortBy === "rating") {
      result.sort((a, b) => b.rating - a.rating)
    }

    setFilteredProducts(result)
    setCurrentPage(1) // Resetear a la primera página cuando cambian los filtros
  }, [selectedCategory, priceRange, sortBy, searchTerm, selectedRating, products])

  // Calcular productos paginados
  useEffect(() => {
    const indexOfLastProduct = currentPage * productsPerPage
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

    setPaginatedProducts(currentProducts)
    setTotalPages(Math.ceil(filteredProducts.length / productsPerPage))
  }, [filteredProducts, currentPage, productsPerPage])

  const handlePriceChange = (e) => {
    setPriceRange([0, Number.parseInt(e.target.value)])
  }

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)

    // Actualizar URL con el parámetro de categoría
    if (category !== "todos") {
      setSearchParams({ categoria: category.toLowerCase() })
    } else {
      setSearchParams({})
    }
  }

  const handleSortChange = (e) => {
    setSortBy(e.target.value)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    // El término de búsqueda ya se actualiza con el onChange del input
  }

  const handleSearchInputChange = (e) => {
    setSearchTerm(e.target.value)
  }

  const handleRatingChange = (rating) => {
    setSelectedRating(rating === selectedRating ? 0 : rating)
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
    // Scroll to top
    window.scrollTo(0, 0)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const clearFilters = () => {
    setSelectedCategory("todos")
    setPriceRange([0, 200000])
    setSortBy("featured")
    setSearchTerm("")
    setSelectedRating(0)
    setSearchParams({})
  }

  if (loading) {
    return (
      <div className="catalogo-page loading-container">
        <Container className="py-5 mt-5 text-center">
          <div className="spinner-border" role="status" style={{ color: "#7ab51d" }}>
            <span className="visually-hidden">Cargando...</span>
          </div>
          <p className="mt-3">Cargando productos...</p>
        </Container>
      </div>
    )
  }

  // Generar elementos de paginación
  const paginationItems = []
  for (let number = 1; number <= totalPages; number++) {
    paginationItems.push(
      <Pagination.Item key={number} active={number === currentPage} onClick={() => handlePageChange(number)}>
        {number}
      </Pagination.Item>,
    )
  }

  return (
    <div className="catalogo-page">
      <Container className="py-5 mt-5">
        <div className="catalog-header mb-4">
          <h1 className="page-title">Catálogo de Productos</h1>
          <p className="text-muted">Encuentra todo lo que tu mascota necesita</p>
        </div>

        {/* Barra de búsqueda */}
        <div className="search-container mb-4 mx-auto" style={{ maxWidth: "600px" }}>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <Form.Control
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchInputChange}
                className="search-input"
              />
              <Button variant="success" type="submit" className="search-button">
                <i className="bi bi-search"></i>
              </Button>
            </InputGroup>
          </Form>
        </div>

        {/* Botón para mostrar/ocultar filtros en móvil */}
        <div className="d-lg-none mb-4">
          <Button
            variant="outline-secondary"
            onClick={toggleFilters}
            className="w-100 d-flex justify-content-between align-items-center"
          >
            <span>Filtros y Ordenamiento</span>
            <i className={`bi bi-chevron-${showFilters ? "up" : "down"}`}></i>
          </Button>
        </div>

        <Row>
          {/* Filtros (columna izquierda) */}
          <Col lg={3} className={`mb-4 filters-column ${showFilters ? "show" : ""}`}>
            <div className="filters-container sticky-top" style={{ top: "90px" }}>
              <Card className="filters-card border-0 shadow-sm">
                <Card.Header className="bg-white border-0">
                  <div className="d-flex justify-content-between align-items-center">
                    <h5 className="filters-title mb-0">Filtros</h5>
                    <Button variant="link" className="p-0 text-decoration-none" onClick={clearFilters}>
                      Limpiar
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {/* Filtro por categoría */}
                  <div className="mb-4">
                    <h6 className="filter-subtitle mb-3">Categorías</h6>
                    <div className="category-filters">
                      <div
                        className={`category-filter-item ${selectedCategory === "todos" ? "active" : ""}`}
                        onClick={() => handleCategoryChange("todos")}
                      >
                        Todos los productos
                      </div>
                      {categories.map((category, index) => (
                        <div
                          key={index}
                          className={`category-filter-item ${selectedCategory === category ? "active" : ""}`}
                          onClick={() => handleCategoryChange(category)}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Filtro por precio */}
                  <div className="mb-4">
                    <h6 className="filter-subtitle mb-3">Precio</h6>
                    <div className="price-range-container">
                      <div className="d-flex justify-content-between mb-2">
                        <span>$0</span>
                        <span>${priceRange[1].toLocaleString()}</span>
                      </div>
                      <Form.Range
                        min="0"
                        max="200000"
                        step="10000"
                        value={priceRange[1]}
                        onChange={handlePriceChange}
                        className="price-range"
                      />
                    </div>
                  </div>

                  {/* Filtro por valoración */}
                  <div className="mb-4">
                    <h6 className="filter-subtitle mb-3">Valoración</h6>
                    <div className="rating-filters">
                      {[4, 3, 2, 1].map((rating) => (
                        <div
                          key={rating}
                          className={`rating-filter-item ${selectedRating === rating ? "active" : ""}`}
                          onClick={() => handleRatingChange(rating)}
                        >
                          {Array(5)
                            .fill(0)
                            .map((_, i) => (
                              <i
                                key={i}
                                className={`bi ${i < rating ? "bi-star-fill" : "bi-star"} ${i < rating ? "text-warning" : ""}`}
                              ></i>
                            ))}
                          {rating === 4 && <span className="ms-2">y más</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ordenar por */}
                  <div>
                    <h6 className="filter-subtitle mb-3">Ordenar por</h6>
                    <Form.Select value={sortBy} onChange={handleSortChange} className="sort-select">
                      <option value="featured">Destacados</option>
                      <option value="price-asc">Precio: Menor a Mayor</option>
                      <option value="price-desc">Precio: Mayor a Menor</option>
                      <option value="rating">Mejor Valorados</option>
                    </Form.Select>
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Productos (columna derecha) */}
          <Col lg={9}>
            {filteredProducts.length === 0 ? (
              <div className="no-results-container">
                <div className="alert alert-info">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  No se encontraron productos que coincidan con los filtros seleccionados.
                </div>
                <Button variant="success" onClick={clearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <>
                <div className="d-flex justify-content-between align-items-center mb-4 results-header">
                  <p className="mb-0 results-count">{filteredProducts.length} productos encontrados</p>
                  <div className="d-none d-md-block">
                    <Form.Select value={sortBy} onChange={handleSortChange} className="sort-select-inline">
                      <option value="featured">Destacados</option>
                      <option value="price-asc">Precio: Menor a Mayor</option>
                      <option value="price-desc">Precio: Mayor a Menor</option>
                      <option value="rating">Mejor Valorados</option>
                    </Form.Select>
                  </div>
                </div>

                <div className="products-grid-container">
                  <Row className="g-4">
                    {paginatedProducts.map((product) => (
                      <Col md={6} lg={4} key={product.id}>
                        <ProductCard product={product} />
                      </Col>
                    ))}
                  </Row>
                </div>

                {/* Paginación */}
                {totalPages > 1 && (
                  <div className="pagination-container mt-5 d-flex justify-content-center">
                    <Pagination>
                      <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                      {paginationItems}
                      <Pagination.Next
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      />
                    </Pagination>
                  </div>
                )}
              </>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  )
}

export default CatalogoPage

