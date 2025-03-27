"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Button } from "react-bootstrap"
import ServiceCard from "../../Components/ClienteComponents/ServiceCard"
import "./ServiciosPage.scss"

const ServiciosPage = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    // Simulación de carga de datos desde API
    // En producción, aquí harías fetch a tu API

    const mockServices = [
      {
        id: 1,
        name: "Peluquería Canina",
        description:
          "Corte y arreglo profesional para tu perro. Incluye corte de pelo, limpieza de oídos y corte de uñas.",
        price: 45000,
        image: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=500",
      },
      {
        id: 2,
        name: "Baño y Spa",
        description:
          "Baño completo con productos premium, secado, cepillado y perfumado para dejar a tu mascota impecable.",
        price: 35000,
        image: "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?q=80&w=500",
      },
      {
        id: 3,
        name: "Paseo de Mascotas",
        description: "Paseos diarios con personal capacitado. Incluye recogida y entrega a domicilio.",
        price: 25000,
        image: "https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=500",
      },
      {
        id: 4,
        name: "Adiestramiento Básico",
        description: "Enseñamos a tu mascota comandos básicos de obediencia y socialización con otras mascotas.",
        price: 60000,
        image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=500",
      },
      {
        id: 5,
        name: "Guardería Canina",
        description: "Cuidamos de tu mascota mientras no estás. Incluye alimentación, paseos y juegos.",
        price: 40000,
        image: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?q=80&w=500",
      },
      {
        id: 6,
        name: "Consulta Veterinaria",
        description:
          "Revisión general de salud, vacunación y desparasitación con nuestros veterinarios especializados.",
        price: 50000,
        image: "https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?q=80&w=500",
      },
    ]

    setServices(mockServices)
    setLoading(false)
  }, [])

  const handleServiceClick = (serviceId) => {
    // Redirigir a la página de agendar cita con el ID del servicio como parámetro de consulta
    navigate(`/agendar-cita?servicio=${serviceId}`)
  }

  if (loading) {
    return (
      <div className="container py-5 mt-5 text-center">
        <div className="spinner-border" role="status" style={{ color: "#7ab51d" }}>
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3">Cargando servicios...</p>
      </div>
    )
  }

  return (
    <div className="servicios-page">
      <div className="container py-5 mt-5">
        {/* Banner de servicios */}
        <div className="position-relative mb-5 rounded overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?q=80&w=1920"
            alt="Servicios para mascotas"
            className="w-100"
            style={{ height: "300px", objectFit: "cover", filter: "brightness(0.7)" }}
          />
          <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
            <h1 className="display-4 fw-bold">Nuestros Servicios</h1>
            <p className="lead">Cuidamos de tu mascota con profesionalismo y cariño</p>
            <Button
              as={Link}
              to="/agendar-cita"
              className="mt-3 btn-lg"
              style={{ backgroundColor: "#7ab51d", color: "white" }}
            >
              <i className="bi bi-calendar-check me-2"></i>
              Agendar Cita
            </Button>
          </div>
        </div>

        {/* Descripción de servicios */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto text-center">
            <h2 style={{ color: "#5a3921" }}>Servicios Profesionales para tu Mascota</h2>
            <p className="lead">
              En Teo/Cat ofrecemos una amplia gama de servicios para el cuidado y bienestar de tu mascota. Nuestro
              equipo de profesionales está altamente capacitado para brindar la mejor atención.
            </p>
          </div>
        </div>

        {/* Listado de servicios */}
        <div className="row g-4 mb-5">
          {services.map((service) => (
            <div key={service.id} className="col-md-6 col-lg-4">
              <div onClick={() => handleServiceClick(service.id)} style={{ cursor: "pointer" }}>
                <ServiceCard service={service} />
              </div>
            </div>
          ))}
        </div>

        {/* Botón central para agendar cita */}
        <div className="text-center mb-5">
          <Button
            as={Link}
            to="/agendar-cita"
            className="btn-lg"
            style={{ backgroundColor: "#7ab51d", color: "white" }}
          >
            <i className="bi bi-calendar-check me-2"></i>
            Agendar una Cita Ahora
          </Button>
          <p className="mt-2 text-muted">Agenda fácilmente y elige el servicio que tu mascota necesita</p>
        </div>

        {/* Sección de información adicional */}
        <div className="row g-4 mb-5">
          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-calendar-check fs-1" style={{ color: "#7ab51d" }}></i>
                </div>
                <h4 style={{ color: "#5a3921" }}>Reserva Fácil</h4>
                <p>Agenda tu cita de forma rápida y sencilla a través de nuestra plataforma online o por teléfono.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-people fs-1" style={{ color: "#7ab51d" }}></i>
                </div>
                <h4 style={{ color: "#5a3921" }}>Personal Calificado</h4>
                <p>Nuestro equipo está formado por profesionales con amplia experiencia en el cuidado de mascotas.</p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body text-center">
                <div className="mb-3">
                  <i className="bi bi-shield-check fs-1" style={{ color: "#7ab51d" }}></i>
                </div>
                <h4 style={{ color: "#5a3921" }}>Garantía de Calidad</h4>
                <p>Todos nuestros servicios cuentan con garantía de satisfacción. Tu mascota merece lo mejor.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de preguntas frecuentes */}
        <div className="row mb-5">
          <div className="col-lg-8 mx-auto">
            <h3 className="text-center mb-4" style={{ color: "#5a3921" }}>
              Preguntas Frecuentes
            </h3>

            <div className="accordion" id="accordionFAQ">
              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    ¿Cómo puedo agendar una cita?
                  </button>
                </h2>
                <div id="collapseOne" className="accordion-collapse collapse show" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body">
                    Puedes agendar una cita a través de nuestra plataforma online, llamando a nuestro número de contacto
                    o visitando nuestra tienda. Te recomendamos agendar con al menos 24 horas de anticipación.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseTwo"
                    aria-expanded="false"
                    aria-controls="collapseTwo"
                  >
                    ¿Qué incluye el servicio de peluquería?
                  </button>
                </h2>
                <div id="collapseTwo" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body">
                    El servicio de peluquería incluye baño, secado, corte de pelo según la raza o preferencia, limpieza
                    de oídos, corte de uñas y perfumado. También ofrecemos servicios adicionales como tratamientos para
                    la piel.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseThree"
                    aria-expanded="false"
                    aria-controls="collapseThree"
                  >
                    ¿Cuánto tiempo dura el servicio de guardería?
                  </button>
                </h2>
                <div id="collapseThree" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body">
                    Nuestro servicio de guardería es por día (8 horas). También ofrecemos paquetes semanales y mensuales
                    con descuentos especiales. Durante su estancia, tu mascota recibirá alimentación, paseos y tiempo de
                    juego.
                  </div>
                </div>
              </div>

              <div className="accordion-item">
                <h2 className="accordion-header">
                  <button
                    className="accordion-button collapsed"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseFour"
                    aria-expanded="false"
                    aria-controls="collapseFour"
                  >
                    ¿Qué debo llevar para el servicio de baño?
                  </button>
                </h2>
                <div id="collapseFour" className="accordion-collapse collapse" data-bs-parent="#accordionFAQ">
                  <div className="accordion-body">
                    No necesitas traer nada especial. Nosotros proporcionamos todos los productos necesarios para el
                    baño. Sin embargo, si tu mascota requiere un champú especial por alguna condición de piel, puedes
                    traerlo.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de contacto */}
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h3 style={{ color: "#5a3921" }}>¿Tienes alguna pregunta?</h3>
            <p className="mb-4">Contáctanos para más información sobre nuestros servicios</p>
            <a
              href="tel:+576041234567"
              className="btn btn-lg me-2"
              style={{ backgroundColor: "#7ab51d", color: "white" }}
            >
              <i className="bi bi-telephone me-2"></i> Llamar
            </a>
            <a
              href="https://wa.me/576041234567"
              className="btn btn-lg"
              style={{ backgroundColor: "#5a3921", color: "white" }}
            >
              <i className="bi bi-whatsapp me-2"></i> WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServiciosPage

