"use client"

import { Camera, X } from "lucide-react"

/**
 * Componente para la sección de imágenes del producto
 */
const ImagesSection = ({ imagenes, imagenesPreview, onImageUpload, onRemoveImage }) => {
  return (
    <div>
      <label className="form-label">Fotos del Producto (Máximo 4)</label>
      <div className="row g-2">
        {[0, 1, 2, 3].map((index) => (
          <div key={index} className="col-6">
            <div className="card h-100">
              <div className="card-body p-2 d-flex flex-column align-items-center justify-content-center">
                {imagenesPreview[index] ? (
                  <>
                    <div className="position-relative w-100">
                      <img
                        src={imagenesPreview[index] || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        className="img-fluid rounded mb-2"
                        style={{ maxHeight: "100px", objectFit: "contain" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger position-absolute top-0 end-0"
                        onClick={() => onRemoveImage(index)}
                      >
                        <X size={16} />
                      </button>
                    </div>
                    <small className="text-muted text-center">
                      {imagenes[index]?.name?.length > 15
                        ? imagenes[index]?.name?.substring(0, 15) + "..."
                        : imagenes[index]?.name}
                    </small>
                  </>
                ) : (
                  <>
                    <label
                      htmlFor={`imagen-${index}`}
                      className="btn btn-outline-secondary mb-1"
                      style={{ cursor: "pointer" }}
                    >
                      <Camera size={18} />
                    </label>
                    <small className="text-muted">Imagen {index + 1}</small>
                    <input
                      type="file"
                      className="d-none"
                      id={`imagen-${index}`}
                      onChange={(e) => onImageUpload(e, index)}
                      accept="image/*"
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <small className="form-text text-muted">Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen.</small>
    </div>
  )
}

export default ImagesSection

