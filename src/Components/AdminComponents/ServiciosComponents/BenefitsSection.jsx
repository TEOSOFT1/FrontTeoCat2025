"use client"

import { Plus, X } from "lucide-react"

/**
 * Componente para la sección de beneficios del servicio
 */
const BenefitsSection = ({ beneficios, nuevoBeneficio, setNuevoBeneficio, onAddBeneficio, onRemoveBeneficio }) => {
  const handleAdd = () => {
    if (nuevoBeneficio.trim()) {
      onAddBeneficio(nuevoBeneficio)
      setNuevoBeneficio("")
    }
  }

  return (
    <div className="mb-4">
      <label className="form-label">Beneficios</label>
      <div className="input-group mb-2">
        <input
          type="text"
          className="form-control"
          placeholder="Añadir beneficio (ej: Mejora la salud capilar)"
          value={nuevoBeneficio}
          onChange={(e) => setNuevoBeneficio(e.target.value)}
          maxLength={100}
        />
        <button
          type="button"
          className="btn btn-outline-primary"
          onClick={handleAdd}
          disabled={nuevoBeneficio.trim() === ""}
        >
          <Plus size={18} />
        </button>
      </div>
      <small className="form-text text-muted">Máximo 100 caracteres por beneficio.</small>

      {beneficios && beneficios.length > 0 ? (
        <div className="row row-cols-1 row-cols-md-3 g-2 mt-2">
          {beneficios.map((beneficio, index) => (
            <div key={index} className="col">
              <div className="d-flex align-items-center border rounded p-2">
                <span className="me-auto text-truncate">{beneficio}</span>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-danger ms-2"
                  onClick={() => onRemoveBeneficio(index)}
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted small">No hay beneficios agregados</p>
      )}
    </div>
  )
}

export default BenefitsSection

