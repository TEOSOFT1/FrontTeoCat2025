"use client"

/**
 * Componente para la sección de información básica del servicio
 */
const BasicInfoSection = ({ formData, formErrors, tiposServicio, handleInputChange }) => {
  return (
    <div className="mb-4">
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="idTipoServicio" className="form-label">
            Tipo de Servicio <span className="text-danger">*</span>
          </label>
          <select
            className={`form-select ${formErrors.idTipoServicio ? "is-invalid" : ""}`}
            id="idTipoServicio"
            name="idTipoServicio"
            value={formData.idTipoServicio}
            onChange={handleInputChange}
            required
          >
            <option value="">Seleccione un tipo de servicio</option>
            {tiposServicio.map((tipo) => (
              <option key={tipo.id} value={tipo.id}>
                {tipo.nombre}
              </option>
            ))}
          </select>
          {formErrors.idTipoServicio && <div className="invalid-feedback">{formErrors.idTipoServicio}</div>}
        </div>
        <div className="col-md-6">
          <label htmlFor="duracion" className="form-label">
            Duración (minutos) <span className="text-danger">*</span>
          </label>
          <input
            type="number"
            className={`form-control ${formErrors.duracion ? "is-invalid" : ""}`}
            id="duracion"
            name="duracion"
            value={formData.duracion}
            onChange={handleInputChange}
            min="1"
            required
            placeholder="Ej: 30"
          />
          {formErrors.duracion && <div className="invalid-feedback">{formErrors.duracion}</div>}
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="nombre" className="form-label">
          Nombre del Servicio <span className="text-danger">*</span>
        </label>
        <input
          type="text"
          className={`form-control ${formErrors.nombre ? "is-invalid" : ""}`}
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleInputChange}
          required
          placeholder="Ingrese el nombre del servicio"
        />
        {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción
        </label>
        <textarea
          className="form-control bg-light"
          id="descripcion"
          name="descripcion"
          rows="3"
          value={formData.descripcion}
          onChange={handleInputChange}
          readOnly
          placeholder="La descripción se completará automáticamente según el tipo de servicio seleccionado"
        ></textarea>
        <small className="text-muted">
          La descripción se completa automáticamente según el tipo de servicio seleccionado.
        </small>
      </div>
    </div>
  )
}

export default BasicInfoSection

