"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Save, ArrowLeft, X, Camera, Plus, Trash2 } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para registrar un nuevo servicio
 * Versión de página completa del formulario de servicios
 */
const RegistrarServicio = () => {
  // Modificar el estado inicial del formulario para incluir los campos faltantes
  const [formData, setFormData] = useState({
    idTipoServicio: "",
    nombre: "",
    descripcion: "",
    precioPequeño: "40000",
    precioGrande: "60000",
    duracion: "0",
    beneficios: [],
    queIncluye: [],
  })

  // Estado para manejar las imágenes
  const [imagenes, setImagenes] = useState([null, null, null, null])
  const [imagenesPreview, setImagenesPreview] = useState([null, null, null, null])

  // Estados para beneficios y que incluye
  const [nuevoBeneficio, setNuevoBeneficio] = useState("")
  const [nuevoQueIncluye, setNuevoQueIncluye] = useState({
    nombre: "",
    valor: "",
  })

  // Estado para los tipos de servicio
  const [tiposServicio, setTiposServicio] = useState([
    {
      id: 1,
      nombre: "Corte de pelo",
      descripcion: "Servicio de corte de pelo para mascotas, incluye lavado y secado.",
    },
    { id: 2, nombre: "Baño completo", descripcion: "Baño completo con shampoo especial, secado y cepillado." },
    { id: 3, nombre: "Corte de uñas", descripcion: "Servicio de corte y limado de uñas para mascotas." },
    {
      id: 4,
      nombre: "Limpieza dental",
      descripcion: "Limpieza dental completa para mejorar la higiene bucal de tu mascota.",
    },
    { id: 5, nombre: "Desparasitación", descripcion: "Tratamiento para eliminar parásitos internos y externos." },
  ])

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Hook para navegación
  const navigate = useNavigate()

  /**
   * Efecto para inicializar beneficios y que incluye si no existen
   */
  useEffect(() => {
    if (!formData.beneficios) {
      setFormData({
        ...formData,
        beneficios: [],
      })
    }

    if (!formData.queIncluye) {
      setFormData({
        ...formData,
        queIncluye: [],
      })
    }

    // Aquí se implementaría la carga de tipos de servicio desde la API
    // Por ahora usamos datos de ejemplo
    // fetchTiposServicio()
  }, [])

  /**
   * Función para cargar tipos de servicio desde la API
   * Esta es una implementación simulada
   */
  const fetchTiposServicio = async () => {
    try {
      // Aquí iría la llamada a la API real
      // const response = await fetch('/api/tipos-servicio');
      // const data = await response.json();
      // setTiposServicio(data);
    } catch (error) {
      console.error("Error al cargar tipos de servicio:", error)
      toast.error("No se pudieron cargar los tipos de servicio")
    }
  }

  /**
   * Manejador para cambios en los inputs del formulario
   */
  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
      })
    } else if (type === "file") {
      // Si es un input de tipo file, guardar el archivo
      if (files && files[0]) {
        setFormData({
          ...formData,
          [name]: files[0],
        })
      }
    } else if (name === "idTipoServicio") {
      // Si cambia el tipo de servicio, actualizar también la descripción
      const servicioSeleccionado = tiposServicio.find((tipo) => tipo.id.toString() === value)

      if (servicioSeleccionado) {
        setFormData({
          ...formData,
          idTipoServicio: value,
          nombre: servicioSeleccionado.nombre, // Auto-completar el nombre con el del tipo
          descripcion: servicioSeleccionado.descripcion,
        })
      } else {
        setFormData({
          ...formData,
          idTipoServicio: value,
        })
      }
    } else {
      // Para otros tipos de input, guardar el valor
      setFormData({
        ...formData,
        [name]: value,
      })
    }
  }

  /**
   * Manejador para subir imágenes
   * @param {Event} e - Evento del input file
   * @param {Number} index - Índice de la imagen (0-3)
   */
  const handleImageUpload = (e, index) => {
    const file = e.target.files[0]
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith("image/")) {
        toast.error("Por favor, seleccione un archivo de imagen válido")
        return
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("La imagen es demasiado grande. El tamaño máximo es 5MB.")
        return
      }

      // Crear una copia de los arrays
      const newImagenes = [...imagenes]
      const newImagenesPreview = [...imagenesPreview]

      // Actualizar la imagen y su vista previa
      newImagenes[index] = file
      newImagenesPreview[index] = URL.createObjectURL(file)

      // Actualizar los estados
      setImagenes(newImagenes)
      setImagenesPreview(newImagenesPreview)
    }
  }

  /**
   * Manejador para eliminar una imagen
   * @param {Number} index - Índice de la imagen a eliminar (0-3)
   */
  const handleRemoveImage = (index) => {
    // Crear una copia de los arrays
    const newImagenes = [...imagenes]
    const newImagenesPreview = [...imagenesPreview]

    // Limpiar la imagen y su vista previa
    newImagenes[index] = null

    // Revocar la URL para liberar memoria
    if (imagenesPreview[index]) {
      URL.revokeObjectURL(imagenesPreview[index])
    }
    newImagenesPreview[index] = null

    // Actualizar los estados
    setImagenes(newImagenes)
    setImagenesPreview(newImagenesPreview)
  }

  /**
   * Función para formatear números con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toLocaleString("es-CO")
  }

  /**
   * Manejador para agregar un nuevo beneficio
   */
  const handleAddBeneficio = () => {
    if (nuevoBeneficio.trim() === "") {
      return
    }

    // Verificar si el beneficio ya existe
    if (formData.beneficios.includes(nuevoBeneficio.trim())) {
      toast.error("Este beneficio ya ha sido agregado")
      return
    }

    // Agregar el nuevo beneficio
    const updatedBeneficios = [...formData.beneficios, nuevoBeneficio.trim()]

    // Actualizar el formData
    setFormData({
      ...formData,
      beneficios: updatedBeneficios,
    })

    // Limpiar el campo
    setNuevoBeneficio("")
  }

  /**
   * Manejador para eliminar un beneficio
   * @param {Number} index - Índice del beneficio a eliminar
   */
  const handleRemoveBeneficio = (index) => {
    const updatedBeneficios = [...formData.beneficios]
    updatedBeneficios.splice(index, 1)

    setFormData({
      ...formData,
      beneficios: updatedBeneficios,
    })
  }

  /**
   * Manejador para agregar un nuevo elemento a "Que incluye"
   */
  const handleAddQueIncluye = () => {
    if (nuevoQueIncluye.nombre.trim() === "" || nuevoQueIncluye.valor.trim() === "") {
      return
    }

    // Verificar si ya existe un elemento con el mismo nombre
    const existeNombre = formData.queIncluye.some(
      (item) => item.nombre.toLowerCase() === nuevoQueIncluye.nombre.trim().toLowerCase(),
    )

    if (existeNombre) {
      toast.error("Ya existe un elemento con este nombre")
      return
    }

    // Agregar el nuevo elemento
    const updatedQueIncluye = [
      ...formData.queIncluye,
      {
        nombre: nuevoQueIncluye.nombre.trim(),
        valor: nuevoQueIncluye.valor.trim(),
      },
    ]

    // Actualizar el formData
    setFormData({
      ...formData,
      queIncluye: updatedQueIncluye,
    })

    // Limpiar los campos
    setNuevoQueIncluye({ nombre: "", valor: "" })
  }

  /**
   * Manejador para eliminar un elemento de "Que incluye"
   * @param {Number} index - Índice del elemento a eliminar
   */
  const handleRemoveQueIncluye = (index) => {
    const updatedQueIncluye = [...formData.queIncluye]
    updatedQueIncluye.splice(index, 1)

    setFormData({
      ...formData,
      queIncluye: updatedQueIncluye,
    })
  }

  // Modificar la función handleSaveServicio para formatear los datos correctamente
  const handleSaveServicio = () => {
    // Validaciones básicas
    if (
      !formData.idTipoServicio ||
      !formData.nombre ||
      !formData.precioPequeño ||
      !formData.precioGrande ||
      !formData.duracion
    ) {
      // Notificación de error
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, complete todos los campos obligatorios.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    // Validar que precio y duración sean números válidos
    if (
      isNaN(Number.parseFloat(formData.precioPequeño)) ||
      isNaN(Number.parseFloat(formData.precioGrande)) ||
      isNaN(Number.parseFloat(formData.duracion))
    ) {
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>El precio y la duración deben ser valores numéricos válidos.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    // Validar que al menos haya una imagen
    if (!imagenes.some((img) => img !== null)) {
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, suba al menos una imagen para el servicio.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
      return
    }

    // Preparar los datos para enviar a la base de datos
    // En un caso real, aquí se subirían las imágenes al servidor y se obtendrían las URLs

    // Simulamos las URLs de las imágenes (en producción, estas vendrían después de subir las imágenes)
    const imageUrls = imagenes
      .map((img, index) => {
        if (img) {
          // En un caso real, aquí iría la URL devuelta por el servidor
          return `https://example.com/uploads/servicio_${Date.now()}_${index}.jpg`
        }
        return null
      })
      .filter((url) => url !== null)

    // Concatenar las URLs con un delimitador para guardarlas en un solo campo
    const fotoString = imageUrls.join("|")

    const servicioData = {
      IdTipoServicio: Number.parseInt(formData.idTipoServicio),
      Nombre: formData.nombre,
      Foto: fotoString, // URLs de imágenes separadas por |
      Descripcion: formData.descripcion,
      Beneficios: formData.beneficios.join(", "), // Convertir array a string separado por comas
      Que_incluye: formData.queIncluye.map((item) => `${item.nombre}: ${item.valor}`).join(", "), // Convertir a string
      PrecioPequeño: Number.parseFloat(formData.precioPequeño),
      PrecioGrande: Number.parseFloat(formData.precioGrande),
      Duracion: Number.parseInt(formData.duracion),
      // Estado se asigna automáticamente en el backend
    }

    console.log("Datos a enviar:", servicioData)

    // Aquí iría la lógica para guardar el servicio en la base de datos
    // Por ahora, solo mostramos una notificación de éxito

    if (toastIds.current.success) {
      toast.dismiss(toastIds.current.success)
    }

    toastIds.current.success = toast.success(
      <div>
        <strong>Servicio guardado</strong>
        <p>El servicio "{formData.nombre}" ha sido guardado correctamente.</p>
      </div>,
      {
        icon: "✅",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    )

    // Esperar a que se muestre la notificación y luego redirigir
    setTimeout(() => {
      navigate("/servicios/servicios")
    }, 2000)
  }

  /**
   * Manejador para cancelar y volver a la lista de servicios
   */
  const handleCancel = () => {
    navigate("/servicios/servicios")
  }

  // Limpiar las URLs de vista previa al desmontar el componente
  useEffect(() => {
    return () => {
      imagenesPreview.forEach((preview) => {
        if (preview && typeof preview === "string" && preview.startsWith("blob:")) {
          URL.revokeObjectURL(preview)
        }
      })
    }
  }, [imagenesPreview])

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
    readonlyTextarea: {
      backgroundColor: "#f8f9fa",
      cursor: "default",
    },
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Registrar Nuevo Servicio</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Servicios
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form className="service-form">
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="idTipoServicio" className="form-label">
                  Tipo de Servicio <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
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
              </div>
              <div className="col-md-6">
                <label htmlFor="duracion" className="form-label">
                  Duración (minutos) <span className="text-danger">*</span>
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="duracion"
                  name="duracion"
                  value={formData.duracion}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
            </div>

            {/* Agregar un campo para el nombre del servicio */}
            <div className="mb-3">
              <label htmlFor="nombre" className="form-label">
                Nombre del Servicio <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
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
                style={sliderStyles.readonlyTextarea}
              ></textarea>
              <small className="text-muted">
                La descripción se completa automáticamente según el tipo de servicio seleccionado.
              </small>
            </div>

            {/* Sección de precios */}
            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="precioPequeño" className="form-label">
                  Precio Pequeño: ${formatNumber(Number.parseInt(formData.precioPequeño))}{" "}
                  <span className="text-danger">*</span>
                </label>
                <div style={sliderStyles.container}>
                  <input
                    type="range"
                    className="form-range"
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
              </div>
              <div className="col-md-6">
                <label htmlFor="precioGrande" className="form-label">
                  Precio Grande: ${formatNumber(Number.parseInt(formData.precioGrande))}{" "}
                  <span className="text-danger">*</span>
                </label>
                <div style={sliderStyles.container}>
                  <input
                    type="range"
                    className="form-range"
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
              </div>
            </div>

            {/* Sección de Beneficios (equivalente a Características) */}
            <div className="mb-3">
              <label className="form-label">Beneficios</label>
              <div className="input-group mb-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Añadir beneficio (ej: Mejora la salud capilar)"
                  value={nuevoBeneficio}
                  onChange={(e) => setNuevoBeneficio(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={handleAddBeneficio}
                  disabled={nuevoBeneficio.trim() === ""}
                >
                  <Plus size={18} />
                </button>
              </div>

              {formData.beneficios && formData.beneficios.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-2 mt-2">
                  {formData.beneficios.map((beneficio, index) => (
                    <div key={index} className="col">
                      <div className="d-flex align-items-center border rounded p-2">
                        <span className="me-auto text-truncate">{beneficio}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => handleRemoveBeneficio(index)}
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

            {/* Sección de Que Incluye (equivalente a Especificaciones Técnicas) */}
            <div className="mb-3">
              <label className="form-label">Que Incluye</label>
              <div className="row g-2 mb-2">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre (ej: Sesión)"
                    value={nuevoQueIncluye.nombre}
                    onChange={(e) => setNuevoQueIncluye({ ...nuevoQueIncluye, nombre: e.target.value })}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Valor (ej: 60 minutos)"
                    value={nuevoQueIncluye.valor}
                    onChange={(e) => setNuevoQueIncluye({ ...nuevoQueIncluye, valor: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={handleAddQueIncluye}
                    disabled={nuevoQueIncluye.nombre.trim() === "" || nuevoQueIncluye.valor.trim() === ""}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              {formData.queIncluye && formData.queIncluye.length > 0 ? (
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
                      {formData.queIncluye.map((item, index) => (
                        <tr key={index}>
                          <td>{item.nombre}</td>
                          <td>{item.valor}</td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveQueIncluye(index)}
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

            {/* Mantener la sección de múltiples imágenes */}
            <div className="mb-3">
              <label className="form-label">
                Fotos del Servicio (Máximo 4) <span className="text-danger">*</span>
              </label>
              <div className="row g-2">
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="col-md-3 col-6">
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
                                onClick={() => handleRemoveImage(index)}
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
                              onChange={(e) => handleImageUpload(e, index)}
                              accept="image/*"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <small className="text-muted d-block mt-1">
                Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen.
              </small>
              <small className="text-muted d-block">La primera imagen será la principal del servicio.</small>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveServicio}>
                <Save size={18} className="me-1" />
                Guardar Servicio
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        limit={3}
      />
    </div>
  )
}

export default RegistrarServicio

