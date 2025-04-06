"use client"

import { Eye, CheckCircle, Calendar, User, PawPrint, Scissors } from "lucide-react"

/**
 * Componente para mostrar una tarjeta de notificación de citas
 */
const CitasNotificationCard = ({ notificacion, onChangeStatus }) => {
  /**
   * Función para formatear fechas
   * @param {Date} date - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  const formatDate = (date) => {
    const now = new Date()
    const diff = now - date

    // Si es menos de 24 horas, mostrar "hace X horas/minutos"
    if (diff < 1000 * 60 * 60 * 24) {
      const hours = Math.floor(diff / (1000 * 60 * 60))
      if (hours > 0) {
        return `Hace ${hours} ${hours === 1 ? "hora" : "horas"}`
      }
      const minutes = Math.floor(diff / (1000 * 60))
      return `Hace ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`
    }

    // Si es menos de 7 días, mostrar "hace X días"
    if (diff < 1000 * 60 * 60 * 24 * 7) {
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      return `Hace ${days} ${days === 1 ? "día" : "días"}`
    }

    // Si es más de 7 días, mostrar la fecha completa
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  /**
   * Función para obtener la clase de prioridad
   * @param {string} prioridad - Nivel de prioridad
   * @returns {string} Clase CSS para el color
   */
  const getPrioridadClass = (prioridad) => {
    switch (prioridad) {
      case "baja":
        return "prioridad-baja"
      case "media":
        return "prioridad-media"
      case "alta":
        return "prioridad-alta"
      case "critica":
        return "prioridad-critica"
      default:
        return ""
    }
  }

  /**
   * Función para formatear la fecha de la cita
   * @param {Date} date - Fecha de la cita
   * @returns {string} Fecha formateada
   */
  const formatCitaDate = (date) => {
    return date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div
      className={`product-card ${getPrioridadClass(notificacion.prioridad)} ${notificacion.estado === "pendiente" ? "notificacion-no-leida" : ""}`}
    >
      <div className="product-status-badges">
        <span className="badge bg-info">Cita</span>
        <span
          className={`badge estado-badge ${
            notificacion.estado === "pendiente"
              ? "bg-danger"
              : notificacion.estado === "vista"
                ? "bg-warning"
                : "bg-success"
          }`}
        >
          {notificacion.estado.charAt(0).toUpperCase() + notificacion.estado.slice(1)}
        </span>
      </div>

      <div className="product-info">
        <div className="d-flex align-items-center mb-3">
          <Calendar size={20} className="me-2 text-primary" />
          <h5 className="product-name mb-0">Cita: {formatCitaDate(notificacion.fechaCita)}</h5>
        </div>

        <div className="cita-details mb-3">
          <div className="cita-client mb-2">
            <User size={16} className="me-2 text-secondary" />
            <span className="fw-medium">Cliente:</span> {notificacion.cliente.nombre} ({notificacion.cliente.documento})
          </div>

          <div className="cita-mascotas mb-2">
            <PawPrint size={16} className="me-2 text-secondary" />
            <span className="fw-medium">Mascotas:</span>
            <ul className="list-unstyled ms-4 mb-0">
              {notificacion.mascotas.map((mascota, index) => (
                <li key={index}>
                  {mascota.nombre} ({mascota.especie})
                </li>
              ))}
            </ul>
          </div>

          <div className="cita-servicios">
            <Scissors size={16} className="me-2 text-secondary" />
            <span className="fw-medium">Servicios:</span>
            <ul className="list-unstyled ms-4 mb-0">
              {notificacion.servicios.map((servicio, index) => (
                <li key={index}>{servicio.nombre}</li>
              ))}
            </ul>
          </div>
        </div>

        <p className="product-message">{notificacion.mensaje}</p>
        <div className="product-date">{formatDate(notificacion.fechaCreacion)}</div>
      </div>

      <div className="product-actions">
        {notificacion.estado === "pendiente" && (
          <button
            className="btn btn-outline-warning btn-action"
            onClick={() => onChangeStatus(notificacion.id, "vista")}
          >
            <Eye size={16} className="me-1" />
            Marcar como vista
          </button>
        )}
        {(notificacion.estado === "pendiente" || notificacion.estado === "vista") && (
          <button
            className="btn btn-outline-success btn-action"
            onClick={() => onChangeStatus(notificacion.id, "resuelta")}
          >
            <CheckCircle size={16} className="me-1" />
            Marcar como resuelta
          </button>
        )}
      </div>
    </div>
  )
}

export default CitasNotificationCard

