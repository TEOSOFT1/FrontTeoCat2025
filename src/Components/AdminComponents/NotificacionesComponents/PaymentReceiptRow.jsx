"use client"

import { useState } from "react"
import { FileText, CheckCircle, XCircle, Eye, Calendar, DollarSign, User } from "lucide-react"

/**
 * Componente para mostrar una fila de comprobante de pago (vista de lista)
 */
const PaymentReceiptRow = ({ notificacion, onChangeStatus }) => {
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
      className={`product-row payment-receipt-row ${getPrioridadClass(notificacion.prioridad)} ${notificacion.estado === "pendiente" ? "notificacion-no-leida" : ""}`}
    >
      <div className="product-row-image">
        {notificacion.comprobante.tipo === "pdf" ? (
          <div className="pdf-thumbnail-small">
            <FileText size={32} className="pdf-icon" />
            <span className="pdf-text-small">PDF</span>
          </div>
        ) : (
          <img
            src={notificacion.comprobante.url || "/placeholder.svg"}
            alt="Comprobante de pago"
            className="product-image-small"
          />
        )}
      </div>

      <div className="product-row-info">
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="product-row-name">Pedido #{notificacion.numeroPedido}</h5>
          <span className={`badge ${getEstadoClass(notificacion.estado)}`}>
            {getEstadoEmoji(notificacion.estado)}{" "}
            {notificacion.estado.charAt(0).toUpperCase() + notificacion.estado.slice(1)}
          </span>
        </div>

        <div className="receipt-row-details">
          <div className="receipt-row-client">
            <User size={14} className="me-1" />
            <span>{notificacion.cliente}</span>
          </div>

          <div className="receipt-row-amount">
            <DollarSign size={14} className="me-1" />
            <span>${formatNumber(notificacion.monto)}</span>
          </div>

          <div className="receipt-row-date">
            <Calendar size={14} className="me-1" />
            <span>{formatDate(notificacion.fechaVenta)}</span>
          </div>
        </div>

        {notificacion.notasAdicionales && (
          <div className="receipt-row-notes mt-1">
            <small className="text-muted">{notificacion.notasAdicionales}</small>
          </div>
        )}
      </div>

      <div className="product-row-actions">
        {notificacion.estado === "pendiente" && !showRejectForm && (
          <>
            <button className="btn btn-success btn-sm" onClick={handleApprove}>
              <CheckCircle size={14} className="me-1" />
              Aprobar
            </button>
            <button className="btn btn-danger btn-sm ms-1" onClick={handleShowRejectForm}>
              <XCircle size={14} className="me-1" />
              Rechazar
            </button>
          </>
        )}

        {showRejectForm && (
          <div className="reject-form-row">
            <div className="form-group mb-2">
              <textarea
                className="form-control form-control-sm"
                rows="2"
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo del rechazo..."
              ></textarea>
            </div>
            <div className="d-flex justify-content-end">
              <button className="btn btn-outline-secondary btn-sm" onClick={handleCancelReject}>
                Cancelar
              </button>
              <button className="btn btn-danger btn-sm ms-1" onClick={handleConfirmReject}>
                Confirmar
              </button>
            </div>
          </div>
        )}

        {notificacion.estado !== "pendiente" && !showRejectForm && (
          <a
            href={notificacion.comprobante.url}
            className="btn btn-outline-primary btn-sm"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Eye size={14} className="me-1" />
            Ver
          </a>
        )}
      </div>
    </div>
  )
}

export default PaymentReceiptRow

