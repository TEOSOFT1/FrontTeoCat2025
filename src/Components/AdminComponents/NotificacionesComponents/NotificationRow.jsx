"use client"

import { Eye, CheckCircle } from "lucide-react"

/**
 * Componente para mostrar una fila de notificación de producto (vista de lista)
 */
const NotificationRow = ({ notificacion, onChangeStatus }) => {
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
        <p className="product-row-message">{notificacion.mensaje}</p>
        <div className="product-row-details">
          {notificacion.tipo === "stock" && (
            <div className="stock-row-indicator">
              <span>
                Stock: {notificacion.producto.stock} / {notificacion.producto.stockMinimo}
              </span>
              <div className="progress" style={{ width: "100px" }}>
                <div
                  className={`progress-bar ${notificacion.producto.stock === 0 ? "bg-danger" : "bg-warning"}`}
                  role="progressbar"
                  style={{
                    width: `${Math.min((notificacion.producto.stock / notificacion.producto.stockMinimo) * 100, 100)}%`,
                  }}
                ></div>
              </div>
            </div>
          )}

          {notificacion.tipo === "vencimiento" && (
            <div className="vencimiento-row-indicator">
              <span>Vence: {notificacion.producto.fechaVencimiento.toLocaleDateString("es-ES")}</span>
              {new Date() > notificacion.producto.fechaVencimiento ? (
                <span className="text-danger ms-2">Vencido</span>
              ) : (
                <span className="ms-2">
                  Quedan {Math.ceil((notificacion.producto.fechaVencimiento - new Date()) / (1000 * 60 * 60 * 24))} días
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="product-row-meta">
        <div className="product-row-date">{formatDate(notificacion.fechaCreacion)}</div>
        <div className="product-row-badges">
          {notificacion.tipo === "stock" ? (
            <span className="badge bg-primary">Stock Bajo</span>
          ) : (
            <span className="badge bg-warning text-dark">Vencimiento</span>
          )}

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

export default NotificationRow

