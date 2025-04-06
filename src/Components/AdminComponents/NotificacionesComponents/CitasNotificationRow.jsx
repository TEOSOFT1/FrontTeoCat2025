"use client"

import { Eye, CheckCircle, Calendar, User, PawPrint, Scissors } from "lucide-react"

/**
 * Componente para mostrar una fila de notificación de citas (vista de lista)
 */
const CitasNotificationRow = ({ notificacion, onChangeStatus }) => {
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
      className={`product-row ${getPrioridadClass(notificacion.prioridad)} ${notificacion.estado === "pendiente" ? "notificacion-no-leida" : ""}`}
    >
      <div className="product-row-info">
        <div className="d-flex align-items-center mb-2">
          <Calendar size={18} className="me-2 text-primary" />
          <h5 className="product-row-name mb-0">Cita: {formatCitaDate(notificacion.fechaCita)}</h5>
        </div>

        <div className="product-row-details">
          <div className="cita-row-client">
            <User size={14} className="me-1 text-secondary" />
            <span className="fw-medium me-1">Cliente:</span>
            {notificacion.cliente.nombre} ({notificacion.cliente.documento})
          </div>

          <div className="cita-row-mascotas">
            <PawPrint size={14} className="me-1 text-secondary" />
            <span className="fw-medium me-1">Mascotas:</span>
            {notificacion.mascotas.map((mascota, index) => (
              <span key={index}>
                {mascota.nombre}
                {index < notificacion.mascotas.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>

          <div className="cita-row-servicios">
            <Scissors size={14} className="me-1 text-secondary" />
            <span className="fw-medium me-1">Servicios:</span>
            {notificacion.servicios.map((servicio, index) => (
              <span key={index}>
                {servicio.nombre}
                {index < notificacion.servicios.length - 1 ? ", " : ""}
              </span>
            ))}
          </div>
        </div>

        <p className="product-row-message">{notificacion.mensaje}</p>
      </div>

      <div className="product-row-meta">
        <div className="product-row-date">{formatDate(notificacion.fechaCreacion)}</div>
        <div className="product-row-badges">
          <span className="badge bg-info">Cita</span>
          <span
            className={`badge ms-1 ${
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
      </div>

      <div className="product-row-actions">
        {notificacion.estado === "pendiente" && (
          <button
            className="btn btn-outline-warning btn-action"
            onClick={() => onChangeStatus(notificacion.id, "vista")}
          >
            <Eye size={16} className="me-1" />
            Vista
          </button>
        )}
        {(notificacion.estado === "pendiente" || notificacion.estado === "vista") && (
          <button
            className="btn btn-outline-success btn-action ms-2"
            onClick={() => onChangeStatus(notificacion.id, "resuelta")}
          >
            <CheckCircle size={16} className="me-1" />
            Resuelta
          </button>
        )}
      </div>
    </div>
  )
}

export default CitasNotificationRow

