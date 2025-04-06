"use client"

import { useState } from "react"
import { FileText, CheckCircle, XCircle, Eye, Calendar, DollarSign, User } from "lucide-react"

/**
 * Componente para mostrar una tarjeta de comprobante de pago
 */
const PaymentReceiptCard = ({ notificacion, onChangeStatus }) => {
  const [showRejectForm, setShowRejectForm] = useState(false)
  const [rejectReason, setRejectReason] = useState("")

  /**
   * Función para formatear fechas
   * @param {Date} date - Fecha a formatear
   * @returns {string} Fecha formateada
   */
  const formatDate = (date) => {
    return (
      date.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "short",
      }) +
      " " +
      date.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })
    )
  }

  /**
   * Función para formatear números con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toLocaleString("es-CO")
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
   * Función para obtener el color del estado
   * @param {string} estado - Estado del comprobante
   * @returns {string} Clase CSS para el color
   */
  const getEstadoClass = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-warning text-dark"
      case "aprobado":
        return "bg-success"
      case "rechazado":
        return "bg-danger"
      default:
        return "bg-secondary"
    }
  }

  /**
   * Función para obtener el emoji del estado
   * @param {string} estado - Estado del comprobante
   * @returns {string} Emoji correspondiente
   */
  const getEstadoEmoji = (estado) => {
    switch (estado) {
      case "pendiente":
        return "🟠"
      case "aprobado":
        return "✅"
      case "rechazado":
        return "❌"
      default:
        return "⚪"
    }
  }

  /**
   * Manejador para aprobar el comprobante
   */
  const handleApprove = () => {
    onChangeStatus(notificacion.id, "aprobado")
  }

  /**
   * Manejador para mostrar el formulario de rechazo
   */
  const handleShowRejectForm = () => {
    setShowRejectForm(true)
  }

  /**
   * Manejador para cancelar el rechazo
   */
  const handleCancelReject = () => {
    setShowRejectForm(false)
    setRejectReason("")
  }

  /**
   * Manejador para confirmar el rechazo
   */
  const handleConfirmReject = () => {
    if (rejectReason.trim() === "") {
      alert("Por favor, ingrese un motivo para el rechazo")
      return
    }
    onChangeStatus(notificacion.id, "rechazado", rejectReason)
    setShowRejectForm(false)
    setRejectReason("")
  }

  return (
    <div
      className={`product-card payment-receipt-card ${getPrioridadClass(notificacion.prioridad)} ${notificacion.estado === "pendiente" ? "notificacion-no-leida" : ""}`}
    >
      <div className="product-status-badges">
        <span className="badge bg-primary">Comprobante</span>
        <span className={`badge estado-badge ${getEstadoClass(notificacion.estado)}`}>
          {getEstadoEmoji(notificacion.estado)}{" "}
          {notificacion.estado.charAt(0).toUpperCase() + notificacion.estado.slice(1)}
        </span>
      </div>

      <div className="receipt-header">
        <div className="receipt-number">
          <span className="receipt-label">Pedido</span>
          <span className="receipt-value">#{notificacion.numeroPedido}</span>
        </div>
        <div className="receipt-date">
          <Calendar size={14} className="me-1" />
          <span>{formatDate(notificacion.fechaVenta)}</span>
        </div>
      </div>

      <div className="receipt-thumbnail">
        <div className="receipt-thumbnail-overlay">
          <Eye size={24} />
          <span>Ver comprobante</span>
        </div>
        {notificacion.comprobante.tipo === "pdf" ? (
          <div className="pdf-thumbnail">
            <FileText size={48} className="pdf-icon" />
            <span className="pdf-text">PDF</span>
          </div>
        ) : (
          <img
            src={notificacion.comprobante.url || "/placeholder.svg"}
            alt="Comprobante de pago"
            className="receipt-image"
          />
        )}
      </div>

      <div className="receipt-info">
        <div className="receipt-client">
          <User size={16} className="me-1" />
          <span>{notificacion.cliente}</span>
        </div>

        <div className="receipt-amount">
          <DollarSign size={16} className="me-1" />
          <span>${formatNumber(notificacion.monto)}</span>
        </div>

        {notificacion.notasAdicionales && (
          <div className="receipt-notes mt-2">
            <p className="receipt-notes-title">Notas:</p>
            <p className="receipt-notes-content">{notificacion.notasAdicionales}</p>
          </div>
        )}
      </div>

      <div className="product-actions">
        {notificacion.estado === "pendiente" && !showRejectForm && (
          <>
            <button className="btn btn-success btn-action" onClick={handleApprove}>
              <CheckCircle size={16} className="me-1" />
              Aprobar comprobante
            </button>
            <button className="btn btn-danger btn-action mt-2" onClick={handleShowRejectForm}>
              <XCircle size={16} className="me-1" />
              Rechazar comprobante
            </button>
          </>
        )}

        {showRejectForm && (
          <div className="reject-form">
            <div className="form-group mb-2">
              <label htmlFor="rejectReason" className="form-label">
                Motivo del rechazo:
              </label>
              <textarea
                id="rejectReason"
                className="form-control"
                rows="3"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Ingrese el motivo del rechazo..."
              ></textarea>
            </div>
            <div className="d-flex justify-content-between">
              <button className="btn btn-outline-secondary" onClick={handleCancelReject}>
                Cancelar
              </button>
              <button className="btn btn-danger" onClick={handleConfirmReject}>
                Confirmar rechazo
              </button>
            </div>
          </div>
        )}

        {notificacion.estado !== "pendiente" && (
          <a
            href={notificacion.comprobante.url}
            className="btn btn-outline-primary btn-action"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FileText size={16} className="me-1" />
            Ver comprobante completo
          </a>
        )}
      </div>
    </div>
  )
}

export default PaymentReceiptCard

