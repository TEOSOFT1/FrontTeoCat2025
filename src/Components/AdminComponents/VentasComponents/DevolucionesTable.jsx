"use client"

import { Trash2 } from "lucide-react"

/**
 * Componente para la tabla de devoluciones
 */
const DevolucionesTable = ({ devoluciones, formatNumber, handleEliminarDevolucion }) => {
  return (
    <div className="card mb-4">
      <div className="card-header bg-light">
        <h5 className="mb-0">Lista de Devoluciones</h5>
      </div>
      <div className="card-body">
        <div className="table-responsive">
          <table className="table table-striped table-bordered">
            <thead className="table-primary">
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Subtotal</th>
                <th>Motivo de Devolución</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {devoluciones.length > 0 ? (
                devoluciones.map((devolucion) => (
                  <tr key={devolucion.id}>
                    <td>{devolucion.producto.nombre}</td>
                    <td>{devolucion.cantidad}</td>
                    <td>${formatNumber(devolucion.subtotal)}</td>
                    <td>{devolucion.motivo.nombre}</td>
                    <td>{devolucion.estado.nombre}</td>
                    <td>
                      <button className="btn btn-sm btn-danger" onClick={() => handleEliminarDevolucion(devolucion.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-3">
                    No hay devoluciones agregadas
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DevolucionesTable

