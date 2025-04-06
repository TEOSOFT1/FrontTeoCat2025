"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"

/**
 * Componente para la sección de características del producto
 */
const CharacteristicsSection = ({ caracteristicas, onAddCaracteristica, onRemoveCaracteristica }) => {
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState("")

  const handleAdd = () => {
    if (nuevaCaracteristica.trim()) {
      onAddCaracteristica(nuevaCaracteristica)
      setNuevaCaracteristica("")
    }
  }

  return (
    <div className="mb-3">
      <label className="form-label">Características</label>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Añadir característica (ej: Resistente al agua)"
          value={nuevaCaracteristica}
          onChange={(e) => setNuevaCaracteristica(e.target.value)}
          maxLength={100}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleAdd}
          disabled={nuevaCaracteristica.trim() === ""}
        >
          <Plus size={18} />
        </button>
      </div>
      <small className="form-text text-muted">Máximo 100 caracteres por característica.</small>

      {caracteristicas && caracteristicas.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-3 g-2 mt-2">
          {caracteristicas.map((caracteristica, index) => (
            <div key={index} className="col">
              <div className="d-flex align-items-center border rounded p-2">
                <span className="me-auto text-truncate">{caracteristica}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => onRemoveCaracteristica(index)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted small">No hay características agregadas</p>
      )}
    </div>
  )
}

export default CharacteristicsSection

