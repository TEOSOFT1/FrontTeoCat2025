"use client"

import { useState, useEffect } from "react"
import { Container, Row, Col, Form, Button, Card, ListGroup, Collapse } from "react-bootstrap"
import { Calendar } from "react-calendar"
import { toast } from "react-toastify"
import { useSearchParams } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import "react-calendar/dist/Calendar.css"
import "../../Pages/ClientePages/agendar-cita-page.scss"
import ServiceCard from "../../components/ClienteComponents/AgendarCitasComponents/service-card"
import PetCard from "../../components/ClienteComponents/AgendarCitasComponents/pet-card"
import TimeSlots from "../../components/ClienteComponents/AgendarCitasComponents/time-slots"
import AppointmentSummary from "../../components/ClienteComponents/AgendarCitasComponents/appointment-summary"

const AgendarCitaPage = () => {
  const [searchParams] = useSearchParams()
  const servicioParam = searchParams.get("servicio")

  // Estado para la fecha seleccionada
  const [selectedDate, setSelectedDate] = useState(new Date())

  // Estado para el horario seleccionado
  const [selectedTime, setSelectedTime] = useState("")

  // Estado para los servicios disponibles
  const [availableServices, setAvailableServices] = useState([])

  // Estado para los servicios seleccionados
  const [selectedServices, setSelectedServices] = useState([])

  // Estado para las mascotas del usuario
  const [userPets, setUserPets] = useState([])

  // Estado para la mascota seleccionada
  const [selectedPet, setSelectedPet] = useState("")

  // Estado para los horarios disponibles
  const [availableTimes, setAvailableTimes] = useState([])

  // Estado para el formulario de cliente
  const [clientForm, setClientForm] = useState({
    documento: "",
    correo: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  })

  // Estado para verificar si el cliente está registrado
  const [isRegistered, setIsRegistered] = useState(false)

  // Estado para controlar la visibilidad del formulario completo
  const [showFullForm, setShowFullForm] = useState(false)

  // Estado para el formulario de mascota
  const [petForm, setPetForm] = useState({
    nombre: "",
    especie: "",
    raza: "",
    edad: "",
    fechaNacimiento: "",
  })

  // Estado para mostrar el formulario de nueva mascota
  const [showNewPetForm, setShowNewPetForm] = useState(false)

  // Estado para el paso actual del formulario
  const [currentStep, setCurrentStep] = useState(1)

  // Estado para controlar errores de validación
  const [validationErrors, setValidationErrors] = useState({
    password: false,
    confirmPassword: false,
  })

  // Cargar servicios disponibles
  useEffect(() => {
    // Simulación de carga de datos desde API
    const mockServices = [
      {
        id: 1,
        name: "Peluquería Canina",
        description:
          "Corte y arreglo profesional para tu perro. Incluye corte de pelo, limpieza de oídos y corte de uñas.",
        price: 45000,
        duration: 60, // en minutos
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500",
      },
      {
        id: 2,
        name: "Baño y Spa",
        description:
          "Baño completo con productos premium, secado, cepillado y perfumado para dejar a tu mascota impecable.",
        price: 35000,
        duration: 45,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500",
      },
      {
        id: 3,
        name: "Paseo de Mascotas",
        description: "Paseos diarios con personal capacitado. Incluye recogida y entrega a domicilio.",
        price: 25000,
        duration: 30,
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=500",
      },
      {
        id: 4,
        name: "Adiestramiento Básico",
        description: "Enseñamos a tu mascota comandos básicos de obediencia y socialización con otras mascotas.",
        price: 60000,
        duration: 90,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=500",
      },
      {
        id: 5,
        name: "Consulta Veterinaria",
        description:
          "Revisión general de salud, vacunación y desparasitación con nuestros veterinarios especializados.",
        price: 50000,
        duration: 30,
        image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=500",
      },
    ]

    setAvailableServices(mockServices)

    // Si hay un servicio preseleccionado en la URL, agregarlo a los servicios seleccionados
    if (servicioParam) {
      const selectedServiceId = Number.parseInt(servicioParam)
      const serviceToAdd = mockServices.find((service) => service.id === selectedServiceId)

      if (serviceToAdd) {
        setSelectedServices([serviceToAdd])
        toast.info(`Servicio "${serviceToAdd.name}" preseleccionado`)
      }
    }
  }, [servicioParam])

  // Generar horarios disponibles cuando cambia la fecha
  useEffect(() => {
    // Simulación de horarios disponibles
    // En producción, esto vendría de una API basado en la fecha seleccionada

    // Verificar si es domingo (0 = domingo)
    if (selectedDate.getDay() === 0) {
      setAvailableTimes([])
      toast.warning("Los domingos no hay atención. Por favor selecciona otro día.")
      return
    }

    const times = []
    const startHour = 9 // 9 AM
    const endHour = 18 // 6 PM

    for (let hour = startHour; hour < endHour; hour++) {
      times.push(`${hour}:00`)
      times.push(`${hour}:30`)
    }

    setAvailableTimes(times)
    setSelectedTime("") // Resetear el horario seleccionado al cambiar de fecha
  }, [selectedDate])

  // Manejar cambio en el documento para buscar cliente
  const handleDocumentoChange = (e) => {
    const value = e.target.value
    setClientForm({
      ...clientForm,
      documento: value,
    })

    // Si el documento tiene al menos 8 caracteres, buscar cliente
    if (value.length >= 8) {
      checkClientExists(value)
    } else {
      // Resetear formulario si el documento es muy corto
      setIsRegistered(false)
      setUserPets([])
      setShowFullForm(false)
    }
  }

  // Simular verificación de cliente en la base de datos
  const checkClientExists = (documento) => {
    // Simulación de búsqueda en la base de datos
    // En producción, esto sería una llamada a la API

    // Documento de ejemplo para simular cliente existente
    if (documento === "12345678") {
      // Cliente encontrado
      setIsRegistered(true)
      setClientForm({
        documento: "12345678",
        correo: "cliente@ejemplo.com",
        nombre: "Juan",
        apellido: "Pérez",
        direccion: "Calle 123 #45-67, Medellín",
        telefono: "(604) 123-4567",
        password: "",
        confirmPassword: "",
      })

      // Cargar mascotas del cliente
      const mockPets = [
        {
          id: 1,
          nombre: "Max",
          especie: "Perro",
          raza: "Labrador",
          edad: 3,
          tamaño: "Grande",
          fechaNacimiento: "2021-03-15",
          imagen: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=500",
        },
        {
          id: 2,
          nombre: "Luna",
          especie: "Gato",
          raza: "Siamés",
          edad: 2,
          tamaño: "Pequeño",
          fechaNacimiento: "2022-05-20",
          imagen: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=500",
        },
      ]

      setUserPets(mockPets)
      toast.success("Cliente encontrado. Datos cargados automáticamente.")
      setShowFullForm(false)
    } else {
      // Cliente no encontrado
      setIsRegistered(false)
      setUserPets([])
      toast.info("Cliente no encontrado. Por favor complete el formulario para registrarse.")
      setShowFullForm(true)
    }
  }

  // Manejar cambios en el formulario de cliente
  const handleClientFormChange = (e) => {
    const { name, value } = e.target
    setClientForm({
      ...clientForm,
      [name]: value,
    })

    // Validar contraseñas
    if (name === "password" || name === "confirmPassword") {
      validatePasswords(name, value)
    }
  }

  // Validar contraseñas
  const validatePasswords = (field, value) => {
    if (field === "password") {
      const isValid = value.length >= 6
      setValidationErrors({
        ...validationErrors,
        password: !isValid,
        confirmPassword: clientForm.confirmPassword !== value && clientForm.confirmPassword !== "",
      })
    } else if (field === "confirmPassword") {
      setValidationErrors({
        ...validationErrors,
        confirmPassword: value !== clientForm.password,
      })
    }
  }

  // Manejar cambios en el formulario de mascota
  const handlePetFormChange = (e) => {
    const { name, value } = e.target
    setPetForm({
      ...petForm,
      [name]: value,
    })
  }

  // Agregar servicio a la lista de seleccionados
  const addService = (service) => {
    // Verificar si el servicio ya está seleccionado
    if (selectedServices.some((s) => s.id === service.id)) {
      toast.warning("Este servicio ya está seleccionado")
      return
    }

    setSelectedServices([...selectedServices, service])
  }

  // Eliminar servicio de la lista de seleccionados
  const removeService = (serviceId) => {
    setSelectedServices(selectedServices.filter((service) => service.id !== serviceId))
  }

  // Calcular el total de la cita
  const calculateTotal = () => {
    return selectedServices.reduce((total, service) => total + service.price, 0)
  }

  // Calcular la duración total de la cita
  const calculateDuration = () => {
    return selectedServices.reduce((total, service) => total + service.duration, 0)
  }

  // Formatear la duración en horas y minutos
  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60

    if (hours === 0) {
      return `${mins} minutos`
    } else if (mins === 0) {
      return `${hours} ${hours === 1 ? "hora" : "horas"}`
    } else {
      return `${hours} ${hours === 1 ? "hora" : "horas"} y ${mins} minutos`
    }
  }

  // Avanzar al siguiente paso
  const goToNextStep = () => {
    // Validar el paso actual antes de avanzar
    if (validateCurrentStep()) {
      setCurrentStep(currentStep + 1)
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  // Retroceder al paso anterior
  const goToPreviousStep = () => {
    setCurrentStep(currentStep - 1)
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  // Validar el paso actual
  const validateCurrentStep = () => {
    switch (currentStep) {
      case 1: // Fecha y hora
        if (!selectedDate) {
          toast.error("Por favor seleccione una fecha para la cita")
          return false
        }
        if (!selectedTime) {
          toast.error("Por favor seleccione un horario para la cita")
          return false
        }
        return true

      case 2: // Servicios
        if (selectedServices.length === 0) {
          toast.error("Por favor seleccione al menos un servicio")
          return false
        }
        return true

      case 3: // Información del cliente
        if (!clientForm.documento) {
          toast.error("Por favor ingrese su número de documento")
          return false
        }

        if (showFullForm) {
          if (
            !clientForm.correo ||
            !clientForm.nombre ||
            !clientForm.apellido ||
            !clientForm.direccion ||
            !clientForm.telefono ||
            !clientForm.password ||
            !clientForm.confirmPassword
          ) {
            toast.error("Por favor complete todos los campos del formulario de cliente")
            return false
          }

          if (validationErrors.password || validationErrors.confirmPassword) {
            toast.error("Por favor corrija los errores en las contraseñas")
            return false
          }
        }
        return true

      case 4: // Información de la mascota
        if (!selectedPet && !showNewPetForm) {
          toast.error("Por favor seleccione una mascota o registre una nueva")
          return false
        }

        if (showNewPetForm) {
          if (!petForm.nombre || !petForm.especie || !petForm.raza || !petForm.edad || !petForm.fechaNacimiento) {
            toast.error("Por favor complete todos los campos del formulario de mascota")
            return false
          }
        }
        return true

      default:
        return true
    }
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    // Validar que se hayan seleccionado todos los campos requeridos
    if (!validateCurrentStep()) {
      return
    }

    // Aquí iría la lógica para enviar los datos a la API
    // En este ejemplo, solo mostramos un mensaje de éxito

    toast.success("¡Cita agendada con éxito! Pronto recibirás un correo de confirmación.")

    // Resetear formulario
    setSelectedDate(new Date())
    setSelectedTime("")
    setSelectedServices([])
    setSelectedPet("")
    setShowNewPetForm(false)
    setCurrentStep(1)

    if (!isRegistered) {
      setClientForm({
        documento: "",
        correo: "",
        nombre: "",
        apellido: "",
        direccion: "",
        telefono: "",
        password: "",
        confirmPassword: "",
      })
      setShowFullForm(false)
    }

    setPetForm({
      nombre: "",
      especie: "",
      raza: "",
      edad: "",
      fechaNacimiento: "",
    })
  }

  // Función para deshabilitar fechas pasadas en el calendario
  const tileDisabled = ({ date, view }) => {
    if (view === "month") {
      // Deshabilitar fechas pasadas
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      // También deshabilitar domingos (0 = domingo, 6 = sábado)
      return date < today || date.getDay() === 0
    }
  }

  // Renderizar el paso actual
  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 step-header">
                <div className="step-number">1</div>
                <h4 className="mb-0">Selecciona Fecha y Hora</h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={7}>
                    <div className="calendar-container mb-4 mb-md-0">
                      <Calendar
                        onChange={setSelectedDate}
                        value={selectedDate}
                        tileDisabled={tileDisabled}
                        className="appointment-calendar"
                      />
                    </div>
                  </Col>
                  <Col md={5}>
                    <TimeSlots
                      availableTimes={availableTimes}
                      selectedTime={selectedTime}
                      setSelectedTime={setSelectedTime}
                    />

                    <div className="selected-datetime mt-4">
                      <h6>Fecha y Hora Seleccionada:</h6>
                      {selectedDate && (
                        <p className="mb-1">
                          <i className="bi bi-calendar-event me-2" style={{ color: "#7ab51d" }}></i>
                          {selectedDate.toLocaleDateString("es-ES", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </p>
                      )}
                      {selectedTime && (
                        <p className="mb-0">
                          <i className="bi bi-clock me-2" style={{ color: "#7ab51d" }}></i>
                          {selectedTime} hrs
                        </p>
                      )}
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Footer className="bg-white border-0 d-flex justify-content-end">
                <Button variant="success" onClick={goToNextStep} className="step-button">
                  Continuar <i className="bi bi-arrow-right ms-1"></i>
                </Button>
              </Card.Footer>
            </Card>
          </motion.div>
        )

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 step-header">
                <div className="step-number">2</div>
                <h4 className="mb-0">Selecciona los Servicios</h4>
              </Card.Header>
              <Card.Body>
                <Row className="g-4">
                  {availableServices.map((service) => (
                    <Col md={6} key={service.id}>
                      <ServiceCard
                        service={service}
                        addService={addService}
                        isSelected={selectedServices.some((s) => s.id === service.id)}
                      />
                    </Col>
                  ))}
                </Row>

                {selectedServices.length > 0 && (
                  <div className="selected-services-summary mt-4 p-3 border rounded">
                    <h5 className="mb-3">Servicios seleccionados:</h5>
                    <ListGroup variant="flush">
                      {selectedServices.map((service) => (
                        <ListGroup.Item
                          key={service.id}
                          className="d-flex justify-content-between align-items-center px-0 py-2 border-bottom"
                        >
                          <div>
                            <h6 className="mb-0">{service.name}</h6>
                            <small className="text-muted">{service.duration} min</small>
                          </div>
                          <div className="d-flex align-items-center">
                            <span className="me-3 fw-bold">${service.price.toLocaleString()}</span>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => removeService(service.id)}
                              className="btn-icon"
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                        </ListGroup.Item>
                      ))}
                      <ListGroup.Item className="d-flex justify-content-between align-items-center px-0 py-3 border-bottom">
                        <div>
                          <h6 className="mb-0">Total</h6>
                          <small className="text-muted">Duración: {formatDuration(calculateDuration())}</small>
                        </div>
                        <span className="fw-bold fs-5 text-success">${calculateTotal().toLocaleString()}</span>
                      </ListGroup.Item>
                    </ListGroup>
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-white border-0 d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={goToPreviousStep} className="step-button">
                  <i className="bi bi-arrow-left me-1"></i> Atrás
                </Button>
                <Button variant="success" onClick={goToNextStep} className="step-button">
                  Continuar <i className="bi bi-arrow-right ms-1"></i>
                </Button>
              </Card.Footer>
            </Card>
          </motion.div>
        )

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 step-header">
                <div className="step-number">3</div>
                <h4 className="mb-0">Información del Cliente</h4>
              </Card.Header>
              <Card.Body>
                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Group controlId="documento">
                      <Form.Label>Documento *</Form.Label>
                      <div className="input-group">
                        <span className="input-group-text">
                          <i className="bi bi-card-text"></i>
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Número de documento"
                          name="documento"
                          value={clientForm.documento}
                          onChange={handleDocumentoChange}
                          required
                        />
                      </div>
                      <Form.Text className="text-muted">
                        Si ya estás registrado, tus datos se cargarán automáticamente.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Collapse in={showFullForm}>
                  <div>
                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="correo">
                          <Form.Label>Correo *</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-envelope"></i>
                            </span>
                            <Form.Control
                              type="email"
                              placeholder="correo@ejemplo.com"
                              name="correo"
                              value={clientForm.correo}
                              onChange={handleClientFormChange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="telefono">
                          <Form.Label>Teléfono *</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-telephone"></i>
                            </span>
                            <Form.Control
                              type="tel"
                              placeholder="Teléfono"
                              name="telefono"
                              value={clientForm.telefono}
                              onChange={handleClientFormChange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="nombre">
                          <Form.Label>Nombre *</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-person"></i>
                            </span>
                            <Form.Control
                              type="text"
                              placeholder="Nombre"
                              name="nombre"
                              value={clientForm.nombre}
                              onChange={handleClientFormChange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="apellido">
                          <Form.Label>Apellido *</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-person"></i>
                            </span>
                            <Form.Control
                              type="text"
                              placeholder="Apellido"
                              name="apellido"
                              value={clientForm.apellido}
                              onChange={handleClientFormChange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Group controlId="direccion">
                          <Form.Label>Dirección *</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-geo-alt"></i>
                            </span>
                            <Form.Control
                              type="text"
                              placeholder="Dirección"
                              name="direccion"
                              value={clientForm.direccion}
                              onChange={handleClientFormChange}
                              required
                            />
                          </div>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="password">
                          <Form.Label>Contraseña *</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-lock"></i>
                            </span>
                            <Form.Control
                              type="password"
                              placeholder="Contraseña"
                              name="password"
                              value={clientForm.password}
                              onChange={handleClientFormChange}
                              isInvalid={validationErrors.password}
                              required
                            />
                          </div>
                          {validationErrors.password && (
                            <Form.Text className="text-danger">
                              La contraseña debe tener al menos 6 caracteres
                            </Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="confirmPassword">
                          <Form.Label>Confirmar Contraseña *</Form.Label>
                          <div className="input-group">
                            <span className="input-group-text">
                              <i className="bi bi-lock-fill"></i>
                            </span>
                            <Form.Control
                              type="password"
                              placeholder="Confirmar contraseña"
                              name="confirmPassword"
                              value={clientForm.confirmPassword}
                              onChange={handleClientFormChange}
                              isInvalid={validationErrors.confirmPassword}
                              required
                            />
                          </div>
                          {validationErrors.confirmPassword && (
                            <Form.Text className="text-danger">Las contraseñas no coinciden</Form.Text>
                          )}
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Collapse>

                {isRegistered && (
                  <div className="client-info-summary mt-3 p-3 border rounded bg-light">
                    <h6 className="mb-3">Información del cliente:</h6>
                    <Row>
                      <Col md={6}>
                        <p className="mb-1">
                          <strong>Nombre:</strong> {clientForm.nombre} {clientForm.apellido}
                        </p>
                        <p className="mb-1">
                          <strong>Documento:</strong> {clientForm.documento}
                        </p>
                        <p className="mb-1">
                          <strong>Correo:</strong> {clientForm.correo}
                        </p>
                      </Col>
                      <Col md={6}>
                        <p className="mb-1">
                          <strong>Teléfono:</strong> {clientForm.telefono}
                        </p>
                        <p className="mb-1">
                          <strong>Dirección:</strong> {clientForm.direccion}
                        </p>
                      </Col>
                    </Row>
                  </div>
                )}
              </Card.Body>
              <Card.Footer className="bg-white border-0 d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={goToPreviousStep} className="step-button">
                  <i className="bi bi-arrow-left me-1"></i> Atrás
                </Button>
                <Button variant="success" onClick={goToNextStep} className="step-button">
                  Continuar <i className="bi bi-arrow-right ms-1"></i>
                </Button>
              </Card.Footer>
            </Card>
          </motion.div>
        )

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="mb-4 border-0 shadow-sm">
              <Card.Header className="bg-white border-0 step-header">
                <div className="step-number">4</div>
                <h4 className="mb-0">Información de la Mascota</h4>
              </Card.Header>
              <Card.Body>
                {userPets.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Selecciona una mascota registrada:</h5>
                    <Row className="g-3">
                      {userPets.map((pet) => (
                        <Col md={6} key={pet.id}>
                          <PetCard
                            pet={pet}
                            isSelected={selectedPet === pet.id}
                            onClick={() => {
                              setSelectedPet(pet.id)
                              setShowNewPetForm(false)
                            }}
                          />
                        </Col>
                      ))}
                    </Row>

                    <div className="mt-3">
                      <Button
                        variant="link"
                        className="text-decoration-none p-0"
                        onClick={() => {
                          setShowNewPetForm(!showNewPetForm)
                          if (!showNewPetForm) setSelectedPet("")
                        }}
                      >
                        {showNewPetForm ? "Cancelar registro de nueva mascota" : "Registrar nueva mascota"}
                      </Button>
                    </div>
                  </div>
                )}

                <Collapse in={showNewPetForm || userPets.length === 0}>
                  <div>
                    {userPets.length > 0 && <h5 className="mb-3">Registrar nueva mascota:</h5>}

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="petNombre">
                          <Form.Label>Nombre de la mascota *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nombre"
                            name="nombre"
                            value={petForm.nombre}
                            onChange={handlePetFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="petEspecie">
                          <Form.Label>Especie *</Form.Label>
                          <Form.Select name="especie" value={petForm.especie} onChange={handlePetFormChange} required>
                            <option value="">Seleccionar...</option>
                            <option value="Perro">Perro</option>
                            <option value="Gato">Gato</option>
                            <option value="Ave">Ave</option>
                            <option value="Otro">Otro</option>
                          </Form.Select>
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="mb-3">
                      <Col md={6}>
                        <Form.Group controlId="petRaza">
                          <Form.Label>Raza *</Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Raza"
                            name="raza"
                            value={petForm.raza}
                            onChange={handlePetFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                      <Col md={6}>
                        <Form.Group controlId="petEdad">
                          <Form.Label>Edad (años) *</Form.Label>
                          <Form.Control
                            type="number"
                            placeholder="Edad"
                            name="edad"
                            value={petForm.edad}
                            onChange={handlePetFormChange}
                            min="0"
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <Form.Group controlId="petFechaNacimiento">
                          <Form.Label>Fecha de nacimiento *</Form.Label>
                          <Form.Control
                            type="date"
                            name="fechaNacimiento"
                            value={petForm.fechaNacimiento}
                            onChange={handlePetFormChange}
                            required
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                  </div>
                </Collapse>
              </Card.Body>
              <Card.Footer className="bg-white border-0 d-flex justify-content-between">
                <Button variant="outline-secondary" onClick={goToPreviousStep} className="step-button">
                  <i className="bi bi-arrow-left me-1"></i> Atrás
                </Button>
                <Button variant="success" type="submit" onClick={handleSubmit} className="step-button">
                  Confirmar Cita <i className="bi bi-check-circle ms-1"></i>
                </Button>
              </Card.Footer>
            </Card>
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <div className="agendar-cita-page">
      <Container className="py-5 mt-5">
        <div className="page-header mb-5">
          <h1 className="page-title">Agendar Cita</h1>
          <p className="text-muted">Programa una cita para los servicios que tu mascota necesita</p>

          <div className="steps-progress mt-4">
            <div className="steps-container">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={`step-item ${currentStep >= step ? "active" : ""} ${currentStep === step ? "current" : ""}`}
                >
                  <div className="step-circle">{step}</div>
                  <div className="step-label">
                    {step === 1 && "Fecha y Hora"}
                    {step === 2 && "Servicios"}
                    {step === 3 && "Cliente"}
                    {step === 4 && "Mascota"}
                  </div>
                </div>
              ))}
              <div className="steps-line"></div>
            </div>
          </div>
        </div>

        <Form onSubmit={handleSubmit}>
          <Row>
            {/* Columna izquierda: Pasos del formulario */}
            <Col lg={8}>
              <AnimatePresence mode="wait">{renderCurrentStep()}</AnimatePresence>
            </Col>

            {/* Columna derecha: Resumen de la cita */}
            <Col lg={4}>
              <AppointmentSummary
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                selectedServices={selectedServices}
                removeService={removeService}
                calculateTotal={calculateTotal}
                calculateDuration={calculateDuration}
                formatDuration={formatDuration}
                currentStep={currentStep}
              />
            </Col>
          </Row>
        </Form>
      </Container>
    </div>
  )
}

export default AgendarCitaPage

