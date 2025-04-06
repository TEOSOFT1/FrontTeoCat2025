"use client"

import { Eye, CheckCircle } from "lucide-react"

/**
 * Componente para mostrar una tarjeta de notificación de producto
 */
const NotificationCard = ({ notificacion, onChangeStatus }) => {
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

  return (
    <div
      className={`product-card ${getPrioridadClass(notificacion.prioridad)} ${notificacion.estado === "pendiente" ? "notificacion-no-leida" : ""}`}
    >
      <div className="product-status-badges">
        {notificacion.tipo === "stock" ? (
          <span className="badge bg-primary">Stock Bajo</span>
        ) : (
          <span className="badge bg-warning text-dark">Vencimiento</span>
        )}

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

      <div className="product-image-container">
        <img
          src={notificacion.producto.imagen || "/placeholder.svg"}
          alt={notificacion.producto.nombre}
          className="product-image"
        />
      </div>

      <div className="product-info">
        <h5 className="product-name">{notificacion.producto.nombre}</h5>

        {notificacion.tipo === "stock" && (
          <div className="stock-indicator">
            <div className="stock-text">
              Stock: {notificacion.producto.stock} / {notificacion.producto.stockMinimo}
            </div>
            <div className="progress">
              <div
                className={`progress-bar ${notificacion.producto.stock === 0 ? "bg-danger" : "bg-warning"}`}
                role="progressbar"
                style={{
                  width: `${Math.min((notificacion.producto.stock / notificacion.producto.stockMinimo) * 100, 100)}%`,
                }}
                aria-valuenow={notificacion.producto.stock}
                aria-valuemin="0"
                aria-valuemax={notificacion.producto.stockMinimo}
              ></div>
            </div>
          </div>
        )}

        {notificacion.tipo === "vencimiento" && (
          <div className="vencimiento-indicator">
            <div className="vencimiento-text">
              Vence: {notificacion.producto.fechaVencimiento.toLocaleDateString("es-ES")}
            </div>
            <div className="vencimiento-days">
              {new Date() > notificacion.producto.fechaVencimiento ? (
                <span className="text-danger">Vencido</span>
              ) : (
                <span>
                  Quedan {Math.ceil((notificacion.producto.fechaVencimiento - new Date()) / (1000 * 60 * 60 * 24))} días
                </span>
              )}
            </div>
          </div>
        )}

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

export default NotificationCard

