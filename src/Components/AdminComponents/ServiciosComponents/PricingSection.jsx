"use client"

/**
 * Componente para la sección de precios del servicio
 */
const PricingSection = ({ formData, formErrors, formatNumber, handleInputChange }) => {
  // Estilos para el slider de precio
  const sliderStyles = {
    container: {
      padding: "0.5rem 0",
    },
    rangeInput: {
      height: "1.5rem",
      padding: 0,
      backgroundColor: "transparent",
      width: "100%",
    },
    labels: {
      display: "flex",
      justifyContent: "space-between",
      marginTop: "0.25rem",
    },
  }

  return (
    <div className="row mb-4">
      <div className="col-md-6">
        <label htmlFor="precioPequeño" className="form-label">
          Precio Pequeño: ${formatNumber(Number.parseInt(formData.precioPequeño))}{" "}
          <span className="text-danger">*</span>
        </label>
        <div style={sliderStyles.container}>
          <input
            type="range"
            className={`form-range ${formErrors.precioPequeño ? "is-invalid" : ""}`}
            id="precioPequeño"
            name="precioPequeño"
            value={formData.precioPequeño}
            onChange={handleInputChange}
            min="40000"
            max="100000"
            step="1000"
            required
            style={sliderStyles.rangeInput}
          />
          <div style={sliderStyles.labels}>
            <small className="text-muted">$40.000</small>
            <small className="text-muted">$100.000</small>
          </div>
        </div>
        {formErrors.precioPequeño && <div className="invalid-feedback d-block">{formErrors.precioPequeño}</div>}
        <small className="text-muted">Precio para mascotas pequeñas (hasta 10kg)</small>
      </div>
      <div className="col-md-6">
        <label htmlFor="precioGrande" className="form-label">
          Precio Grande: ${formatNumber(Number.parseInt(formData.precioGrande))} <span className="text-danger">*</span>
        </label>
        <div style={sliderStyles.container}>
          <input
            type="range"
            className={`form-range ${formErrors.precioGrande ? "is-invalid" : ""}`}
            id="precioGrande"
            name="precioGrande"
            value={formData.precioGrande}
            onChange={handleInputChange}
            min="60000"
            max="120000"
            step="1000"
            required
            style={sliderStyles.rangeInput}
          />
          <div style={sliderStyles.labels}>
            <small className="text-muted">$60.000</small>
            <small className="text-muted">$120.000</small>
          </div>
        </div>
        {formErrors.precioGrande && <div className="invalid-feedback d-block">{formErrors.precioGrande}</div>}
        <small className="text-muted">Precio para mascotas grandes (más de 10kg)</small>
      </div>
    </div>
  )
}

export default PricingSection

