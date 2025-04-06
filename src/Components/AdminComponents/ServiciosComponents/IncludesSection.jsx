"use client"

import { Plus, Trash2 } from "lucide-react"

/**
 * Componente para la sección de "Que Incluye" del servicio
 */
const IncludesSection = ({ queIncluye, nuevoQueIncluye, setNuevoQueIncluye, onAddQueIncluye, onRemoveQueIncluye }) => {
  const handleAdd = () => {
    if (nuevoQueIncluye.nombre.trim() && nuevoQueIncluye.valor.trim()) {
      onAddQueIncluye(nuevoQueIncluye)
      setNuevoQueIncluye({ nombre: "", valor: "" })
    }
  }

  return (
    <div className="mb-4">
      <label className="form-label">Que Incluye</label>
      <div className="row g-2 mb-2">
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Nombre (ej: Sesión)"
            value={nuevoQueIncluye.nombre}
            onChange={(e) => setNuevoQueIncluye({ ...nuevoQueIncluye, nombre: e.target.value })}
            maxLength={50}
          />
        </div>
        <div className="col-md-5">
          <input
            type="text"
            className="form-control"
            placeholder="Valor (ej: 60 minutos)"
            value={nuevoQueIncluye.valor}
            onChange={(e) => setNuevoQueIncluye({ ...nuevoQueIncluye, valor: e.target.value })}
            maxLength={100}
          />
        </div>
        <div className="col-md-2">
          <button
            type="button"
            className="btn btn-outline-primary w-100"
            onClick={handleAdd}
            disabled={nuevoQueIncluye.nombre.trim() === "" || nuevoQueIncluye.valor.trim() === ""}
          >
            <Plus size={18} />
          </button>
        </div>
      </div>
      <small className="form-text text-muted">Máximo 50 caracteres para el nombre y 100 para el valor.</small>

      {queIncluye && queIncluye.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-sm table-bordered">
            <thead className="table-light">
              <tr>
                <th>Elemento</th>
                <th>Detalle</th>
                <th style={{ width: "50px" }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {queIncluye.map((item, index) => (
                <tr key={index}>
                  <td>{item.nombre}</td>
                  <td>{item.valor}</td>
                  <td className="text-center">
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onRemoveQueIncluye(index)}
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
        <p className="text-muted small">No hay elementos agregados</p>
      )}
    </div>
  )
}

export default IncludesSection

