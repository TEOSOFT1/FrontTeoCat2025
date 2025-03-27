"use client"

import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { Container, Row, Col, Form, Button, Card, Nav, Alert, Badge, Modal } from "react-bootstrap"
import { toast } from "react-toastify"
import "./PerfilPage.scss"

const PerfilPage = () => {
  const [searchParams] = useSearchParams()
  const tabParam = searchParams.get("tab")

  // Estado para la información del usuario
  const [user, setUser] = useState({
    id: 1,
    documento: "12345678",
    nombre: "Juan",
    apellido: "Pérez",
    correo: "juan.perez@example.com",
    telefono: "(604) 123-4567",
    direccion: "Calle 123 #45-67, Medellín",
    profileImage: "https://randomuser.me/api/portraits/men/32.jpg",
  })

  // Estado para las mascotas del usuario
  const [pets, setPets] = useState([
    {
      id: 1,
      nombre: "Max",
      especie: "Perro",
      raza: "Labrador",
      edad: 3,
      fechaNacimiento: "2021-03-15",
      image: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300",
    },
    {
      id: 2,
      nombre: "Luna",
      especie: "Gato",
      raza: "Siamés",
      edad: 2,
      fechaNacimiento: "2022-05-20",
      image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300",
    },
  ])

  // Estado para los pedidos del usuario
  const [orders, setOrders] = useState([
    {
      id: "ORD-2023-001",
      date: "2023-12-15",
      total: 125000,
      status: "Entregado",
      items: [
        { name: "Alimento Premium para Perros", quantity: 1, price: 75000 },
        { name: "Juguete Interactivo para Gatos", quantity: 1, price: 35000 },
        { name: "Snacks Naturales para Perros", quantity: 1, price: 15000 },
      ],
    },
    {
      id: "ORD-2023-002",
      date: "2024-01-20",
      total: 89000,
      status: "En proceso",
      items: [{ name: "Collar Ajustable con GPS", quantity: 1, price: 89000 }],
    },
  ])

  // Estado para las citas del usuario
  const [appointments, setAppointments] = useState([
    {
      id: "APT-2023-001",
      service: "Peluquería Canina",
      pet: "Max",
      date: "2023-12-10",
      time: "10:00 AM",
      status: "Completada",
    },
    {
      id: "APT-2024-001",
      service: "Baño y Spa",
      pet: "Max",
      date: "2024-02-05",
      time: "11:30 AM",
      status: "Programada",
    },
  ])

  // Estado para la pestaña activa
  const [activeTab, setActiveTab] = useState("profile")

  // Estado para el modo de edición
  const [isEditing, setIsEditing] = useState(false)

  // Estado para el formulario de edición
  const [formData, setFormData] = useState({ ...user })

  // Estado para el formulario de cambio de contraseña
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  // Estado para mostrar/ocultar contraseñas
  const [showPasswords, setShowPasswords] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  })

  // Estado para el modal de nueva mascota
  const [showPetModal, setShowPetModal] = useState(false)

  // Estado para el formulario de nueva mascota
  const [newPetForm, setNewPetForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    fechaNacimiento: "",
  })

  // Estado para el modal de editar mascota
  const [showEditPetModal, setShowEditPetModal] = useState(false)

  // Estado para la mascota que se está editando
  const [editingPet, setEditingPet] = useState(null)

  // Establecer la pestaña activa basada en el parámetro de URL
  useEffect(() => {
    if (tabParam) {
      setActiveTab(tabParam)
    }
  }, [tabParam])

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Manejar cambios en el formulario de contraseña
  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordForm({
      ...passwordForm,
      [name]: value,
    })
  }

  // Manejar cambios en el formulario de nueva mascota
  const handleNewPetChange = (e) => {
    const { name, value } = e.target
    setNewPetForm({
      ...newPetForm,
      [name]: value,
    })
  }

  // Manejar cambios en el formulario de editar mascota
  const handleEditPetChange = (e) => {
    const { name, value } = e.target
    setEditingPet({
      ...editingPet,
      [name]: value,
    })
  }

  // Guardar cambios del perfil
  const handleSaveProfile = (e) => {
    e.preventDefault()
    setUser(formData)
    setIsEditing(false)
    toast.success("Perfil actualizado correctamente")
  }

  // Cambiar contraseña
  const handleChangePassword = (e) => {
    e.preventDefault()

    // Validar que las contraseñas coincidan
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    // Validar que la contraseña tenga al menos 8 caracteres
    if (passwordForm.newPassword.length < 8) {
      toast.error("La contraseña debe tener al menos 8 caracteres")
      return
    }

    // Aquí iría la lógica para cambiar la contraseña en la API

    // Resetear el formulario
    setPasswordForm({
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    })

    toast.success("Contraseña actualizada correctamente")
  }

  // Agregar nueva mascota
  const handleAddPet = (e) => {
    e.preventDefault()

    // Validar formulario
    if (
      !newPetForm.nombre ||
      !newPetForm.especie ||
      !newPetForm.raza ||
      !newPetForm.edad ||
      !newPetForm.fechaNacimiento
    ) {
      toast.error("Por favor completa todos los campos")
      return
    }

    // Crear nueva mascota
    const newPet = {
      id: pets.length + 1,
      ...newPetForm,
      image:
        newPetForm.especie === "Perro"
          ? "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=300"
          : "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=300",
    }

    // Agregar a la lista de mascotas
    setPets([...pets, newPet])

    // Cerrar modal y resetear formulario
    setShowPetModal(false)
    setNewPetForm({
      nombre: "",
      especie: "",
      raza: "",
      edad: "",
      fechaNacimiento: "",
    })

    toast.success("Mascota agregada correctamente")
  }

  // Abrir modal para editar mascota
  const handleEditPetClick = (pet) => {
    setEditingPet({ ...pet })
    setShowEditPetModal(true)
  }

  // Guardar cambios de mascota
  const handleSavePet = (e) => {
    e.preventDefault()

    // Validar formulario
    if (
      !editingPet.nombre ||
      !editingPet.especie ||
      !editingPet.raza ||
      !editingPet.edad ||
      !editingPet.fechaNacimiento
    ) {
      toast.error("Por favor completa todos los campos")
      return
    }

    // Actualizar mascota en la lista
    const updatedPets = pets.map((pet) => (pet.id === editingPet.id ? editingPet : pet))

    setPets(updatedPets)

    // Cerrar modal
    setShowEditPetModal(false)
    setEditingPet(null)

    toast.success("Mascota actualizada correctamente")
  }

  // Eliminar mascota
  const handleDeletePet = (petId) => {
    // Confirmar eliminación
    if (window.confirm("¿Estás seguro de que deseas eliminar esta mascota?")) {
      const updatedPets = pets.filter((pet) => pet.id !== petId)
      setPets(updatedPets)
      toast.success("Mascota eliminada correctamente")
    }
  }

  // Alternar visibilidad de contraseña
  const togglePasswordVisibility = (field) => {
    setShowPasswords({
      ...showPasswords,
      [field]: !showPasswords[field],
    })
  }

  return (
    <div className="perfil-page">
      <Container className="py-5 mt-5">
        <Row>
          {/* Sidebar de navegación */}
          <Col lg={3} className="mb-4">
            <Card className="profile-sidebar border-0 shadow-sm">
              <Card.Body className="p-0">
                <div className="profile-header text-center p-4">
                  <div className="profile-image-container mb-3">
                    <img src={user.profileImage || "/placeholder.svg"} alt={user.nombre} className="profile-image" />
                    <div className="profile-image-overlay">
                      <i className="bi bi-camera"></i>
                    </div>
                  </div>
                  <h4 className="profile-name">
                    {user.nombre} {user.apellido}
                  </h4>
                  <p className="profile-email mb-0">{user.correo}</p>
                </div>

                <Nav className="profile-nav flex-column">
                  <Nav.Link
                    as="button"
                    className={activeTab === "profile" ? "active" : ""}
                    onClick={() => setActiveTab("profile")}
                  >
                    <i className="bi bi-person nav-icon"></i>
                    Mi Perfil
                  </Nav.Link>
                  <Nav.Link
                    as="button"
                    className={activeTab === "pets" ? "active" : ""}
                    onClick={() => setActiveTab("pets")}
                  >
                    <i className="bi bi-heart nav-icon"></i>
                    Mis Mascotas
                  </Nav.Link>
                  <Nav.Link
                    as="button"
                    className={activeTab === "orders" ? "active" : ""}
                    onClick={() => setActiveTab("orders")}
                  >
                    <i className="bi bi-box-seam nav-icon"></i>
                    Mis Pedidos
                  </Nav.Link>
                  <Nav.Link
                    as="button"
                    className={activeTab === "appointments" ? "active" : ""}
                    onClick={() => setActiveTab("appointments")}
                  >
                    <i className="bi bi-calendar-check nav-icon"></i>
                    Mis Citas
                  </Nav.Link>
                  <Nav.Link
                    as="button"
                    className={activeTab === "password" ? "active" : ""}
                    onClick={() => setActiveTab("password")}
                  >
                    <i className="bi bi-shield-lock nav-icon"></i>
                    Cambiar Contraseña
                  </Nav.Link>
                  <Nav.Link
                    as={Link}
                    to="/login"
                    className="text-danger"
                    onClick={() => localStorage.removeItem("token")}
                  >
                    <i className="bi bi-box-arrow-right nav-icon"></i>
                    Cerrar Sesión
                  </Nav.Link>
                </Nav>
              </Card.Body>
            </Card>
          </Col>

          {/* Contenido principal */}
          <Col lg={9}>
            {/* Mi Perfil */}
            {activeTab === "profile" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="profile-card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Información Personal</h4>
                    <Button
                      variant={isEditing ? "outline-secondary" : "success"}
                      size="sm"
                      onClick={() => {
                        if (isEditing) {
                          setFormData({ ...user })
                        }
                        setIsEditing(!isEditing)
                      }}
                    >
                      {isEditing ? (
                        <>
                          <i className="bi bi-x-circle me-1"></i> Cancelar
                        </>
                      ) : (
                        <>
                          <i className="bi bi-pencil me-1"></i> Editar
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {isEditing ? (
                    <Form onSubmit={handleSaveProfile}>
                      <Row className="mb-3">
                        <Col md={6} className="mb-3 mb-md-0">
                          <Form.Group controlId="documento">
                            <Form.Label>Documento</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-card-text"></i>
                              </span>
                              <Form.Control
                                type="text"
                                name="documento"
                                value={formData.documento}
                                disabled
                                className="bg-light"
                              />
                            </div>
                            <Form.Text className="text-muted">El documento no se puede modificar</Form.Text>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="correo">
                            <Form.Label>Correo Electrónico</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-envelope"></i>
                              </span>
                              <Form.Control
                                type="email"
                                name="correo"
                                value={formData.correo}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={6} className="mb-3 mb-md-0">
                          <Form.Group controlId="nombre">
                            <Form.Label>Nombre</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-person"></i>
                              </span>
                              <Form.Control
                                type="text"
                                name="nombre"
                                value={formData.nombre}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="apellido">
                            <Form.Label>Apellido</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-person"></i>
                              </span>
                              <Form.Control
                                type="text"
                                name="apellido"
                                value={formData.apellido}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Row className="mb-3">
                        <Col md={6} className="mb-3 mb-md-0">
                          <Form.Group controlId="direccion">
                            <Form.Label>Dirección</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-geo-alt"></i>
                              </span>
                              <Form.Control
                                type="text"
                                name="direccion"
                                value={formData.direccion}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group controlId="telefono">
                            <Form.Label>Teléfono</Form.Label>
                            <div className="input-group">
                              <span className="input-group-text">
                                <i className="bi bi-telephone"></i>
                              </span>
                              <Form.Control
                                type="tel"
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleInputChange}
                                required
                              />
                            </div>
                          </Form.Group>
                        </Col>
                      </Row>

                      <div className="text-end">
                        <Button type="submit" variant="success">
                          <i className="bi bi-save me-1"></i> Guardar Cambios
                        </Button>
                      </div>
                    </Form>
                  ) : (
                    <div className="profile-info">
                      <Row className="mb-4">
                        <Col md={6} className="mb-3 mb-md-0">
                          <div className="info-group">
                            <h6 className="info-label">Documento</h6>
                            <p className="info-value">{user.documento}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-group">
                            <h6 className="info-label">Correo Electrónico</h6>
                            <p className="info-value">{user.correo}</p>
                          </div>
                        </Col>
                      </Row>

                      <Row className="mb-4">
                        <Col md={6} className="mb-3 mb-md-0">
                          <div className="info-group">
                            <h6 className="info-label">Nombre</h6>
                            <p className="info-value">{user.nombre}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-group">
                            <h6 className="info-label">Apellido</h6>
                            <p className="info-value">{user.apellido}</p>
                          </div>
                        </Col>
                      </Row>

                      <Row>
                        <Col md={6} className="mb-3 mb-md-0">
                          <div className="info-group">
                            <h6 className="info-label">Dirección</h6>
                            <p className="info-value">{user.direccion}</p>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="info-group">
                            <h6 className="info-label">Teléfono</h6>
                            <p className="info-value">{user.telefono}</p>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Mis Mascotas */}
            {activeTab === "pets" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="profile-card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Mis Mascotas</h4>
                    <Button variant="success" size="sm" onClick={() => setShowPetModal(true)}>
                      <i className="bi bi-plus-circle me-1"></i> Añadir Mascota
                    </Button>
                  </div>
                </Card.Header>
                <Card.Body>
                  {pets.length === 0 ? (
                    <Alert variant="info">
                      <div className="text-center py-4">
                        <i className="bi bi-emoji-smile fs-1 mb-3"></i>
                        <h5>No tienes mascotas registradas</h5>
                        <p className="mb-3">
                          Registra a tus compañeros peludos para gestionar mejor sus citas y servicios.
                        </p>
                        <Button variant="success" onClick={() => setShowPetModal(true)}>
                          <i className="bi bi-plus-circle me-1"></i> Añadir Mascota
                        </Button>
                      </div>
                    </Alert>
                  ) : (
                    <Row className="g-4">
                      {pets.map((pet) => (
                        <Col md={6} key={pet.id}>
                          <Card className="pet-card h-100">
                            <Row className="g-0">
                              <Col xs={4}>
                                <div className="pet-image-container">
                                  <img src={pet.image || "/placeholder.svg"} alt={pet.nombre} className="pet-image" />
                                </div>
                              </Col>
                              <Col xs={8}>
                                <Card.Body>
                                  <div className="d-flex justify-content-between align-items-start">
                                    <Card.Title className="pet-name">{pet.nombre}</Card.Title>
                                    <Badge bg={pet.especie === "Perro" ? "success" : "info"} className="pet-badge">
                                      {pet.especie}
                                    </Badge>
                                  </div>
                                  <Card.Text as="div" className="pet-details">
                                    <p className="mb-1">
                                      <strong>Raza:</strong> {pet.raza}
                                    </p>
                                    <p className="mb-1">
                                      <strong>Edad:</strong> {pet.edad} años
                                    </p>
                                    <p className="mb-3">
                                      <strong>Nacimiento:</strong> {new Date(pet.fechaNacimiento).toLocaleDateString()}
                                    </p>
                                    <div className="pet-actions">
                                      <Button
                                        variant="outline-primary"
                                        size="sm"
                                        className="me-2"
                                        onClick={() => handleEditPetClick(pet)}
                                      >
                                        <i className="bi bi-pencil"></i>
                                      </Button>
                                      <Button
                                        variant="outline-danger"
                                        size="sm"
                                        onClick={() => handleDeletePet(pet.id)}
                                      >
                                        <i className="bi bi-trash"></i>
                                      </Button>
                                    </div>
                                  </Card.Text>
                                </Card.Body>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Mis Pedidos */}
            {activeTab === "orders" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="profile-card-header">
                  <h4 className="mb-0">Mis Pedidos</h4>
                </Card.Header>
                <Card.Body>
                  {orders.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-box-seam fs-1 mb-3" style={{ color: "#7ab51d" }}></i>
                      <h5>No tienes pedidos aún</h5>
                      <p className="mb-4">¡Explora nuestro catálogo y realiza tu primer pedido!</p>
                      <Link to="/catalogo" className="btn btn-success">
                        Ir al Catálogo
                      </Link>
                    </div>
                  ) : (
                    <div className="accordion" id="accordionOrders">
                      {orders.map((order, index) => (
                        <div className="accordion-item order-item" key={order.id}>
                          <h2 className="accordion-header">
                            <button
                              className="accordion-button collapsed"
                              type="button"
                              data-bs-toggle="collapse"
                              data-bs-target={`#collapse${index}`}
                            >
                              <div className="d-flex justify-content-between align-items-center w-100 me-3">
                                <span className="order-id">
                                  <strong>Pedido:</strong> {order.id}
                                </span>
                                <span className="order-date d-none d-md-block">
                                  <strong>Fecha:</strong> {order.date}
                                </span>
                                <span className="order-total d-none d-md-block">
                                  <strong>Total:</strong> ${order.total.toLocaleString()}
                                </span>
                                <span>
                                  <Badge
                                    bg={order.status === "Entregado" ? "success" : "warning"}
                                    text={order.status === "Entregado" ? "white" : "dark"}
                                    className="order-status"
                                  >
                                    {order.status}
                                  </Badge>
                                </span>
                              </div>
                            </button>
                          </h2>
                          <div
                            id={`collapse${index}`}
                            className="accordion-collapse collapse"
                            data-bs-parent="#accordionOrders"
                          >
                            <div className="accordion-body">
                              <div className="table-responsive">
                                <table className="table order-items-table">
                                  <thead>
                                    <tr>
                                      <th>Producto</th>
                                      <th>Cantidad</th>
                                      <th>Precio</th>
                                      <th>Subtotal</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {order.items.map((item, itemIndex) => (
                                      <tr key={itemIndex}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${item.price.toLocaleString()}</td>
                                        <td>${(item.price * item.quantity).toLocaleString()}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                  <tfoot>
                                    <tr>
                                      <td colSpan="3" className="text-end fw-bold">
                                        Total:
                                      </td>
                                      <td className="fw-bold">${order.total.toLocaleString()}</td>
                                    </tr>
                                  </tfoot>
                                </table>
                              </div>

                              <div className="d-flex justify-content-end mt-3">
                                <Button variant="brown" size="sm" className="me-2">
                                  <i className="bi bi-file-earmark-text me-1"></i> Ver Factura
                                </Button>
                                {order.status !== "Entregado" && (
                                  <Button variant="outline-danger" size="sm">
                                    <i className="bi bi-x-circle me-1"></i> Cancelar Pedido
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Mis Citas */}
            {activeTab === "appointments" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="profile-card-header">
                  <div className="d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Mis Citas</h4>
                    <Link to="/agendar-cita" className="btn btn-success btn-sm">
                      <i className="bi bi-plus-circle me-1"></i> Agendar Cita
                    </Link>
                  </div>
                </Card.Header>
                <Card.Body>
                  {appointments.length === 0 ? (
                    <div className="text-center py-4">
                      <i className="bi bi-calendar-x fs-1 mb-3" style={{ color: "#7ab51d" }}></i>
                      <h5>No tienes citas programadas</h5>
                      <p className="mb-4">¡Agenda una cita para alguno de nuestros servicios!</p>
                      <Link to="/servicios" className="btn btn-success">
                        Ver Servicios
                      </Link>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table appointments-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Servicio</th>
                            <th>Mascota</th>
                            <th>Fecha</th>
                            <th>Hora</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appointment) => (
                            <tr key={appointment.id} className="appointment-row">
                              <td>{appointment.id}</td>
                              <td>{appointment.service}</td>
                              <td>{appointment.pet}</td>
                              <td>{appointment.date}</td>
                              <td>{appointment.time}</td>
                              <td>
                                <Badge
                                  bg={appointment.status === "Completada" ? "success" : "primary"}
                                  className="appointment-status"
                                >
                                  {appointment.status}
                                </Badge>
                              </td>
                              <td>
                                {appointment.status !== "Completada" && (
                                  <Button variant="outline-danger" size="sm">
                                    <i className="bi bi-x-circle"></i>
                                  </Button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </Card.Body>
              </Card>
            )}

            {/* Cambiar Contraseña */}
            {activeTab === "password" && (
              <Card className="border-0 shadow-sm">
                <Card.Header className="profile-card-header">
                  <h4 className="mb-0">Cambiar Contraseña</h4>
                </Card.Header>
                <Card.Body>
                  <Form onSubmit={handleChangePassword}>
                    <Form.Group className="mb-3" controlId="oldPassword">
                      <Form.Label>Contraseña Antigua</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-shield-lock"></i>
                        </span>
                        <Form.Control
                          type={showPasswords.oldPassword ? "text" : "password"}
                          name="oldPassword"
                          value={passwordForm.oldPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("oldPassword")}>
                          <i className={`bi ${showPasswords.oldPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </Button>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="newPassword">
                      <Form.Label>Nueva Contraseña</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-shield-lock"></i>
                        </span>
                        <Form.Control
                          type={showPasswords.newPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordForm.newPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("newPassword")}>
                          <i className={`bi ${showPasswords.newPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </Button>
                      </div>
                      <Form.Text className="text-muted">La contraseña debe tener al menos 8 caracteres</Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="confirmPassword">
                      <Form.Label>Repetir Contraseña</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-shield-lock"></i>
                        </span>
                        <Form.Control
                          type={showPasswords.confirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordForm.confirmPassword}
                          onChange={handlePasswordChange}
                          required
                        />
                        <Button variant="outline-secondary" onClick={() => togglePasswordVisibility("confirmPassword")}>
                          <i className={`bi ${showPasswords.confirmPassword ? "bi-eye-slash" : "bi-eye"}`}></i>
                        </Button>
                      </div>
                    </Form.Group>

                    <div className="d-grid">
                      <Button type="submit" variant="success">
                        Actualizar Contraseña
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            )}
          </Col>
        </Row>
      </Container>

      {/* Modal para agregar mascota */}
      <Modal show={showPetModal} onHide={() => setShowPetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Agregar Nueva Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPet}>
            <Form.Group className="mb-3" controlId="petNombre">
              <Form.Label>Nombre de la mascota *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nombre"
                name="nombre"
                value={newPetForm.nombre}
                onChange={handleNewPetChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petEspecie">
              <Form.Label>Especie *</Form.Label>
              <Form.Select name="especie" value={newPetForm.especie} onChange={handleNewPetChange} required>
                <option value="">Seleccionar...</option>
                <option value="Perro">Perro</option>
                <option value="Gato">Gato</option>
                <option value="Ave">Ave</option>
                <option value="Otro">Otro</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="petRaza">
              <Form.Label>Raza *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Raza"
                name="raza"
                value={newPetForm.raza}
                onChange={handleNewPetChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petEdad">
              <Form.Label>Edad (años) *</Form.Label>
              <Form.Control
                type="number"
                placeholder="Edad"
                name="edad"
                value={newPetForm.edad}
                onChange={handleNewPetChange}
                min="0"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="petFechaNacimiento">
              <Form.Label>Fecha de nacimiento *</Form.Label>
              <Form.Control
                type="date"
                name="fechaNacimiento"
                value={newPetForm.fechaNacimiento}
                onChange={handleNewPetChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowPetModal(false)}>
                Cancelar
              </Button>
              <Button variant="success" type="submit">
                Guardar
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Modal para editar mascota */}
      <Modal show={showEditPetModal} onHide={() => setShowEditPetModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Editar Mascota</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingPet && (
            <Form onSubmit={handleSavePet}>
              <Form.Group className="mb-3" controlId="editPetNombre">
                <Form.Label>Nombre de la mascota *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nombre"
                  name="nombre"
                  value={editingPet.nombre}
                  onChange={handleEditPetChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetEspecie">
                <Form.Label>Especie *</Form.Label>
                <Form.Select name="especie" value={editingPet.especie} onChange={handleEditPetChange} required>
                  <option value="">Seleccionar...</option>
                  <option value="Perro">Perro</option>
                  <option value="Gato">Gato</option>
                  <option value="Ave">Ave</option>
                  <option value="Otro">Otro</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetRaza">
                <Form.Label>Raza *</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Raza"
                  name="raza"
                  value={editingPet.raza}
                  onChange={handleEditPetChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetEdad">
                <Form.Label>Edad (años) *</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="Edad"
                  name="edad"
                  value={editingPet.edad}
                  onChange={handleEditPetChange}
                  min="0"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="editPetFechaNacimiento">
                <Form.Label>Fecha de nacimiento *</Form.Label>
                <Form.Control
                  type="date"
                  name="fechaNacimiento"
                  value={editingPet.fechaNacimiento}
                  onChange={handleEditPetChange}
                  required
                />
              </Form.Group>

              <div className="d-flex justify-content-end">
                <Button variant="secondary" className="me-2" onClick={() => setShowEditPetModal(false)}>
                  Cancelar
                </Button>
                <Button variant="success" type="submit">
                  Guardar Cambios
                </Button>
              </div>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default PerfilPage

