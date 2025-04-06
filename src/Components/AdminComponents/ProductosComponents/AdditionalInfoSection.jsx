"use client"

import { Camera, Calendar } from "lucide-react"

/**
 * Componente para la sección de información adicional del producto
 */
const AdditionalInfoSection = ({ formData, formErrors, handleInputChange, handleScanBarcode }) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="codigoBarras" className="form-label">
            Código de Barras
          </label>
          <div className="input-group">
            <input
              type="text"
              className={`form-control ${formErrors.codigoBarras ? "is-invalid" : ""}`}
              id="codigoBarras"
              name="codigoBarras"
              value={formData.codigoBarras}
              onChange={handleInputChange}
              maxLength={14}
            />
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleScanBarcode}
              title="Escanear código de barras"
            >
              <Camera size={18} />
            </button>
            {formErrors.codigoBarras && <div className="invalid-feedback">{formErrors.codigoBarras}</div>}
          </div>
          <small className="form-text text-muted">Entre 8 y 14 dígitos numéricos.</small>
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="referencia" className="form-label">
            Referencia
          </label>
          <input
            type="text"
            className={`form-control ${formErrors.referencia ? "is-invalid" : ""}`}
            id="referencia"
            name="referencia"
            value={formData.referencia}
            onChange={handleInputChange}
            maxLength={50}
          />
          {formErrors.referencia && <div className="invalid-feedback">{formErrors.referencia}</div>}
          <small className="form-text text-muted">Código o referencia interna del producto.</small>
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label d-block">Fecha de Vencimiento</label>
        <div className="row g-2 align-items-center">
          <div className="col-auto">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="noVence"
                name="noVence"
                checked={formData.noVence}
                onChange={handleInputChange}
              />
              <label className="form-check-label" htmlFor="noVence">
                No vence
              </label>
            </div>
          </div>
          <div className="col">
            <div className="input-group">
              <span className="input-group-text">
                <Calendar size={18} />
              </span>
              <input
                type="date"
                className={`form-control ${formErrors.fechaVencimiento ? "is-invalid" : ""}`}
                id="fechaVencimiento"
                name="fechaVencimiento"
                value={formData.fechaVencimiento}
                onChange={handleInputChange}
                disabled={formData.noVence}
                min={new Date().toISOString().split("T")[0]}
              />
              {formErrors.fechaVencimiento && <div className="invalid-feedback">{formErrors.fechaVencimiento}</div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdditionalInfoSection

