"use client"

import { useState } from "react"
import { Plus, Trash2 } from "lucide-react"

/**
 * Componente para la sección de especificaciones técnicas del producto
 */
const SpecificationsSection = ({ especificaciones, onAddEspecificacion, onRemoveEspecificacion }) => {
  const [nuevaEspecificacion, setNuevaEspecificacion] = useState({
    nombre: "",
    valor: "",
  })

  const handleAdd = () => {
    if (nuevaEspecificacion.nombre.trim() && nuevaEspecificacion.valor.trim()) {
      onAddEspecificacion(nuevaEspecificacion)
      setNuevaEspecificacion({ nombre: "", valor: "" })
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label">Especificaciones Técnicas</label>
      <div className="row g-2 mb-2">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre (ej: Material)"
            value={nuevaEspecificacion.nombre}
            onChange={(e) => setNuevaEspecificacion({ ...nuevaEspecificacion, nombre: e.target.value })}
            maxLength={50}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Valor (ej: Aluminio)"
            value={nuevaEspecificacion.valor}
            onChange={(e) => setNuevaEspecificacion({ ...nuevaEspecificacion, valor: e.target.value })}
            maxLength={100}
          />
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-primary w-100"
            onClick={handleAdd}
            disabled={nuevaEspecificacion.nombre.trim() === "" || nuevaEspecificacion.valor.trim() === ""}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
      <small className="form-text text-muted">Máximo 50 caracteres para el nombre y 100 para el valor.</small>

      {especificaciones && especificaciones.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Especificación</th>
                <th>Valor</th>
                <th style={{ width: "50px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {especificaciones.map((especificacion, index) => (
                <tr key={index}>
                  <td>{especificacion.nombre}</td>
                  <td>{especificacion.valor}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRemoveEspecificacion(index)}
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-muted small">No hay especificaciones agregadas</p>
      )}
    </div>
  )
}

export default SpecificationsSection

