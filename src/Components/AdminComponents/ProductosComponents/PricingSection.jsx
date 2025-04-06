"use client"

/**
 * Componente para la sección de precios y stock del producto
 */
const PricingSection = ({ formData, formErrors, precioConIva, formatNumber, handleInputChange }) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="stock" className="form-label">
            Stock <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${formErrors.stock ? "is-invalid" : ""}`}
            id="stock"
            name="stock"
            value={formData.stock}
            onChange={handleInputChange}
            min="0"
            max="9999"
            required
          />
          {formErrors.stock && <div className="invalid-feedback">{formErrors.stock}</div>}
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="precio" className="form-label">
            Precio Base <span className="text-danger">*</span>
          </label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="number"
              className={`form-control ${formErrors.precio ? "is-invalid" : ""}`}
              id="precio"
              name="precio"
              value={formData.precio}
              onChange={handleInputChange}
              min="0"
              required
            />
            {formErrors.precio && <div className="invalid-feedback">{formErrors.precio}</div>}
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="iva" className="form-label">
            IVA
          </label>
          <div className="input-group">
            <select className="form-select" id="iva" name="iva" value={formData.iva} onChange={handleInputChange}>
              <option value="0">0%</option>
              <option value="5">5%</option>
              <option value="19">19%</option>
              <option value="NA">No Aplica</option>
            </select>
            <span className="input-group-text">%</span>
          </div>
        </div>
        <div className="col-md-6 mb-3">
          <label className="form-label">Precio Final</label>
          <div className="input-group">
            <span className="input-group-text">$</span>
            <input
              type="text"
              className="form-control bg-light"
              value={formatNumber(precioConIva.precioFinal)}
              readOnly
            />
          </div>
          <small className="form-text text-muted">IVA: ${formatNumber(precioConIva.valorIva)}</small>
        </div>
      </div>
    </div>
  )
}

export default PricingSection

