"use client"

import { AlertTriangle } from "lucide-react"

/**
 * Modal de confirmación para eliminar cliente
 */
const DeleteConfirmModal = ({ show, cliente, onConfirm, onCancel }) => {
  if (!cliente) return null

  return (
    <>
      {show && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button type="button" className="btn-close btn-close-white" onClick={onCancel}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center">
                <AlertTriangle size={24} className="text-danger me-3" />
                <p className="mb-0">¿Está seguro de eliminar el cliente "{cliente?.nombreCompleto}"?</p>
              </div>
              <p className="mt-2 text-muted small">
                Esta acción no se puede deshacer. Si el cliente tiene historial, considere desactivarlo en lugar de
                eliminarlo.
              </p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default DeleteConfirmModal

