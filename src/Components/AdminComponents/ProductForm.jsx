"use client"

import { useState, useEffect } from "react"
import { Save, Camera, Calendar, X, Link } from "lucide-react"

/**
 * Componente de formulario para productos
 * Maneja la entrada de datos para crear o editar productos
 */
const ProductForm = ({ formData, setFormData, modalTitle, handleSaveProduct, handleCloseModal, categorias = [] }) => {
  // Estado para mostrar el cálculo del IVA
  const [precioConIva, setPrecioConIva] = useState({
    valorIva: 0,
    precioFinal: 0,
  })

  /**
   * Efecto para calcular el precio con IVA cuando cambia el precio o el IVA
   */
  useEffect(() => {
    if (formData.precio && formData.iva !== "NA") {
      const precio = Number.parseFloat(formData.precio) || 0
      const iva = Number.parseFloat(formData.iva) || 0
      const valorIva = precio * (iva / 100)
      const precioFinal = precio + valorIva

      setPrecioConIva({
        valorIva: valorIva,
        precioFinal: precioFinal,
      })
    } else {
      setPrecioConIva({
        valorIva: 0,
        precioFinal: Number.parseFloat(formData.precio) || 0,
      })
    }
  }, [formData.precio, formData.iva])

  /**
   * Manejador para cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
        // Si se marca "No vence", limpiar la fecha de vencimiento
        ...(name === "noVence" && checked ? { fechaVencimiento: "" } : {}),
      })
    } else {
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  /**
   * Manejador para eliminar la foto
   */
  const handleRemovePhoto = () => {
    setFormData({
      ...formData,
      fotoUrl: "",
      fotoPreview: null,
    })
  }

  /**
   * Función para simular el escaneo de un código de barras
   */
  const handleScanBarcode = () => {
    // Generar un código de barras aleatorio de 13 dígitos (formato EAN-13)
    const randomBarcode = Math.floor(Math.random() * 9000000000000) + 1000000000000

    setFormData({
      ...formData,
      codigoBarras: randomBarcode.toString(),
    })
  }

  /**
   * Función para formatear números con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toLocaleString("es-CO")
  }

  return (
    <form className="product-form">
      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="nombre" className="form-label">
            Nombre del Producto <span className="text-danger">*</span>
          </label>
          <input
            type="text"
            className="form-control"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            disabled={modalTitle === "Ver Detalles del Producto"}
            required
          />
        </div>
        <div className="col-md-6">
          <label htmlFor="categoria" className="form-label">
            Categoría <span className="text-danger">*</span>
          </label>
          <select
            className="form-select"
            id="categoria"
            name="categoria"
            value={formData.categoria}
            onChange={handleInputChange}
            disabled={modalTitle === "Ver Detalles del Producto"}
            required
          >
            <option value="">Seleccione una categoría</option>
            {categorias.map((categoria) => (
              <option key={categoria.id} value={categoria.nombre}>
                {categoria.nombre}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mb-3">
        <label htmlFor="descripcion" className="form-label">
          Descripción
        </label>
        <textarea
          className="form-control"
          id="descripcion"
          name="descripcion"
          rows="3"
          value={formData.descripcion}
          onChange={handleInputChange}
          disabled={modalTitle === "Ver Detalles del Producto"}
        ></textarea>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label htmlFor="fotoUrl" className="form-label">
            Foto del Producto (URL)
          </label>
          <div className="input-group">
            <span className="input-group-text">
              <Link size={18} />
            </span>
            <input
              type="text"
              className="form-control"
              id="fotoUrl"
              name="fotoUrl"
              placeholder="https://ejemplo.com/imagen.jpg"
              value={formData.fotoUrl || ""}
              onChange={handleInputChange}
              disabled={modalTitle === "Ver Detalles del Producto"}
            />
            {formData.fotoUrl && (
              <button
                type="button"
                className="btn btn-outline-danger"
                onClick={handleRemovePhoto}
                disabled={modalTitle === "Ver Detalles del Producto"}
              >
                <X size={18} />
              </button>
            )}
          </div>

          {formData.fotoPreview && (
            <div className="mt-2 product-image-preview">
              <img
                src={formData.fotoPreview || "/placeholder.svg"}
                alt="Vista previa"
                className="img-thumbnail"
                style={{ maxHeight: "150px" }}
              />
            </div>
          )}
        </div>
        <div className="col-md-6">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="stock" className="form-label">
                Stock <span className="text-danger">*</span>
              </label>
              <input
                type="number"
                className="form-control"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                disabled={modalTitle === "Ver Detalles del Producto"}
                min="0"
                required
              />
            </div>
            <div className="col-md-6">
              <label htmlFor="iva" className="form-label">
                IVA (%)
              </label>
              <select
                className="form-select"
                id="iva"
                name="iva"
                value={formData.iva}
                onChange={handleInputChange}
                disabled={modalTitle === "Ver Detalles del Producto"}
              >
                <option value="NA">No aplica</option>
                <option value="0">0%</option>
                <option value="5">5%</option>
                <option value="19">19%</option>
              </select>
            </div>
          </div>
          <div className="mt-3">
            <label htmlFor="precio" className="form-label">
              Precio <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <span className="input-group-text">$</span>
              <input
                type="number"
                className="form-control"
                id="precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                disabled={modalTitle === "Ver Detalles del Producto"}
                min="0"
                required
              />
            </div>
            {formData.precio && (
              <div className="mt-2 small">
                {formData.iva !== "NA" ? (
                  <>
                    <div className="d-flex justify-content-between">
                      <span>Valor sin IVA:</span>
                      <span className="text-muted">${formatNumber(Number.parseFloat(formData.precio) || 0)}</span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span>IVA ({formData.iva}%):</span>
                      <span className="text-muted">${formatNumber(precioConIva.valorIva)}</span>
                    </div>
                    <div className="d-flex justify-content-between fw-bold">
                      <span>Precio final:</span>
                      <span className="text-primary">${formatNumber(precioConIva.precioFinal)}</span>
                    </div>
                  </>
                ) : (
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Precio final:</span>
                    <span className="text-primary">${formatNumber(Number.parseFloat(formData.precio) || 0)}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-md-6">
          <label className="form-label">Identificación del Producto</label>
          <div className="row g-2">
            <div className="col-md-6">
              <label htmlFor="codigoBarras" className="form-label small">
                Código de Barras
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  id="codigoBarras"
                  name="codigoBarras"
                  value={formData.codigoBarras}
                  onChange={handleInputChange}
                  disabled={modalTitle === "Ver Detalles del Producto"}
                  placeholder="Código de barras"
                />
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={handleScanBarcode}
                  disabled={modalTitle === "Ver Detalles del Producto"}
                >
                  <Camera size={18} />
                </button>
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="referencia" className="form-label small">
                Referencia
              </label>
              <input
                type="text"
                className="form-control"
                id="referencia"
                name="referencia"
                value={formData.referencia || ""}
                onChange={handleInputChange}
                disabled={modalTitle === "Ver Detalles del Producto"}
                placeholder="Referencia interna"
              />
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="d-flex align-items-center mb-2">
            <label htmlFor="fechaVencimiento" className="form-label mb-0 me-3">
              Fecha de Vencimiento
            </label>
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                id="noVence"
                name="noVence"
                checked={formData.noVence}
                onChange={handleInputChange}
                disabled={modalTitle === "Ver Detalles del Producto"}
              />
              <label className="form-check-label" htmlFor="noVence">
                No vence
              </label>
            </div>
          </div>
          <div className="input-group">
            <span className="input-group-text">
              <Calendar size={18} />
            </span>
            <input
              type="date"
              className="form-control"
              id="fechaVencimiento"
              name="fechaVencimiento"
              value={formData.fechaVencimiento}
              onChange={handleInputChange}
              disabled={modalTitle === "Ver Detalles del Producto" || formData.noVence}
            />
          </div>
        </div>
      </div>

      <div className="modal-footer px-0 pb-0">
        <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
          Cancelar
        </button>

        {modalTitle !== "Ver Detalles del Producto" && (
          <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveProduct}>
            <Save size={18} className="me-1" />
            Guardar Producto
          </button>
        )}
      </div>
    </form>
  )
}

export default ProductForm

