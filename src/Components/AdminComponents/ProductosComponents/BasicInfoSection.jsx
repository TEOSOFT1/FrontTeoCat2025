"use client"

/**
 * Componente para la sección de información básica del producto
 */
const BasicInfoSection = ({ formData, formErrors, categorias, handleInputChange }) => {
  return (
    <div>
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label">
            Nombre del Producto <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className={`form-control ${formErrors.nombre ? "is-invalid" : ""}`}
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            maxLength={100}
            required
          />
          {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
          <small className="form-text text-muted">Máximo 100 caracteres.</small>
        </div>
        <div className="col-md-6">
          <label htmlFor="categoria" className="form-label">
            Categoría <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${formErrors.categoria ? "is-invalid" : ""}`}
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.nombre}>
                {categoria.nombre}
              </option>
            ))}
          </select>
          {formErrors.categoria && <div className="invalid-feedback">{formErrors.categoria}</div>}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción
        </label>
        <textarea
          className={`form-control ${formErrors.descripcion ? "is-invalid" : ""}`}
          id="descripcion"
          name="descripcion"
          rows="3"
          value={formData.descripcion}
          onChange={handleInputChange}
          maxLength={500}
        ></textarea>
        {formErrors.descripcion && <div className="invalid-feedback">{formErrors.descripcion}</div>}
        <small className="form-text text-muted">Máximo 500 caracteres.</small>
      </div>
    </div>
  )
}

export default BasicInfoSection

