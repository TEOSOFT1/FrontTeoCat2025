"use client"

import { Star, ExternalLink, Eye, CheckCircle } from "lucide-react"

/**
 * Componente para mostrar una fila de notificación de reseña (vista de lista)
 */
const ReviewNotificationRow = ({ notificacion, onChangeStatus }) => {
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
   * Función para renderizar estrellas según la calificación
   * @param {number} rating - Calificación (1-5)
   * @returns {JSX.Element} Estrellas renderizadas
   */
  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} size={14} className={i <= rating ? "text-warning fill-warning" : "text-muted"} />)
    }
    return <div className="d-flex">{stars}</div>
  }

  return (
    <div
      className={`product-row ${getPrioridadClass(notificacion.prioridad)} ${notificacion.estado === "pendiente" ? "notificacion-no-leida" : ""}`}
    >
      <div className="product-row-image">
        <img
          src={notificacion.producto.imagen || "/placeholder.svg"}
          alt={notificacion.producto.nombre}
          className="product-image-small"
        />
      </div>

      <div className="product-row-info">
        <h5 className="product-row-name">{notificacion.producto.nombre}</h5>
        <div className="d-flex align-items-center mb-1">
          {renderStars(notificacion.calificacion)}
          <span className="badge bg-warning text-dark ms-2">{notificacion.calificacion}/5</span>
        </div>
        <p className="product-row-message">"{notificacion.comentario}"</p>
        <div className="product-row-details">
          <small className="text-muted">Por: {notificacion.cliente}</small>
        </div>
      </div>

      <div className="product-row-meta">
        <div className="product-row-date">{formatDate(notificacion.fechaCreacion)}</div>
        <div className="product-row-badges">
          <span className="badge bg-info">Reseña</span>
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
        <a
          href={notificacion.producto.url}
          className="btn btn-outline-primary btn-sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} className="me-1" />
          Ver
        </a>

        {notificacion.estado === "pendiente" && (
          <button
            className="btn btn-outline-warning btn-sm ms-1"
            onClick={() => onChangeStatus(notificacion.id, "vista")}
          >
            <Eye size={14} className="me-1" />
            Vista
          </button>
        )}

        {(notificacion.estado === "pendiente" || notificacion.estado === "vista") && (
          <button
            className="btn btn-outline-success btn-sm ms-1"
            onClick={() => onChangeStatus(notificacion.id, "resuelta")}
          >
            <CheckCircle size={14} className="me-1" />
            Resuelta
          </button>
        )}
      </div>
    </div>
  )
}

export default ReviewNotificationRow

