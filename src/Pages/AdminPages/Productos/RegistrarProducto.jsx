"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Save, ArrowLeft, X, Camera, Calendar, Plus, Trash2 } from 'lucide-react'
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para registrar un nuevo producto o editar uno existente
 * Versión de página completa del formulario de productos con validaciones
 */
const RegistrarProducto = () => {
  // Obtener parámetros de la URL para edición
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const productId = params.get("id")
  const isEditing = !!productId

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    imagenes: [null, null, null, null],
    stock: "0",
    precio: "0",
    iva: "19",
    codigoBarras: "",
    referencia: "",
    fechaVencimiento: "",
    noVence: false,
    caracteristicas: [],
    especificaciones: [],
  })

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    nombre: "",
    descripcion: "",
    categoria: "",
    stock: "",
    precio: "",
    codigoBarras: "",
    referencia: "",
    fechaVencimiento: "",
  })

  // Estado para mostrar el cálculo del IVA
  const [precioConIva, setPrecioConIva] = useState({
    valorIva: 0,
    precioFinal: 0,
  })

  // Estado para manejar las imágenes
  const [imagenes, setImagenes] = useState([null, null, null, null])
  const [imagenesPreview, setImagenesPreview] = useState([null, null, null, null])

  // Estados para características y especificaciones
  const [nuevaCaracteristica, setNuevaCaracteristica] = useState("")
  const [nuevaEspecificacion, setNuevaEspecificacion] = useState({
    nombre: "",
    valor: "",
  })

  // Estado para las categorías (simulado)
  const [categorias, setCategorias] = useState([
    { id: 1, nombre: "Alimentos" },
    { id: 2, nombre: "Accesorios" },
    { id: 3, nombre: "Medicamentos" },
    { id: 4, nombre: "Juguetes" },
    { id: 5, nombre: "Higiene" },
  ])

  // Estado para productos existentes (para validación de duplicados)
  const [productosExistentes, setProductosExistentes] = useState([])

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Hook para navegación
  const navigate = useNavigate()

  /**
   * Efecto para cargar datos del producto si estamos en modo edición
   */
  useEffect(() => {
    if (isEditing) {
      // Aquí se implementaría la carga de datos del producto desde la API
      // Por ahora, simulamos con datos de ejemplo
      const productoEditando = {
        id: Number.parseInt(productId),
        nombre: "Producto de ejemplo",
        descripcion: "Descripción del producto de ejemplo",
        categoria: "Alimentos",
        imagenes: [null, null, null, null],
        stock: "10",
        precio: "25000",
        iva: "19",
        codigoBarras: "7501234567890",
        referencia: "REF-001",
        fechaVencimiento: "2025-12-31",
        noVence: false,
        caracteristicas: ["Característica 1", "Característica 2"],
        especificaciones: [
          { nombre: "Peso", valor: "500g" },
          { nombre: "Color", valor: "Azul" },
        ],
        fotos: "https://example.com/uploads/producto_1.jpg|https://example.com/uploads/producto_2.jpg"
      }

      setFormData(productoEditando)

      // Simular carga de imágenes si el producto tiene fotos
      if (productoEditando.fotos) {
        const fotosArray = productoEditando.fotos.split("|")
        const newImagenesPreview = [...imagenesPreview]
        
        fotosArray.forEach((url, index) => {
          if (index < 4) { // Máximo 4 imágenes
            newImagenesPreview[index] = url
          }
        })
        
        setImagenesPreview(newImagenesPreview)
      }
    }

    // Cargar productos existentes para validación
    // En un caso real, esto vendría de la API
    setProductosExistentes([
      { id: 1, nombre: "Producto existente 1", codigoBarras: "1234567890123" },
      { id: 2, nombre: "Producto existente 2", codigoBarras: "2345678901234" },
    ])
  }, [isEditing, productId])

  /**
   * Efecto para inicializar características y especificaciones si no existen
   */
  useEffect(() => {
    if (!formData.caracteristicas) {
      setFormData({
        ...formData,
        caracteristicas: [],
      })
    }

    if (!formData.especificaciones) {
      setFormData({
        ...formData,
        especificaciones: [],
      })
    }
  }, [])

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
    const { name, value, type, checked, files } = e.target

    if (type === "checkbox") {
      setFormData({
        ...formData,
        [name]: checked,
        // Si se marca "No vence", limpiar la fecha de vencimiento
        ...(name === "noVence" && checked ? { fechaVencimiento: "" } : {}),
      })
    } else if (type === "file") {
      // Si es un input de tipo file, guardar el archivo
      if (files && files[0]) {
        setFormData({
          ...formData,
          [name]: files[0],
        })
      }
    } else {
      // Para otros tipos de input, guardar el valor
      setFormData({
        ...formData,
        [name]: value,
      })
    }

    // Limpiar el error específico cuando el usuario comienza a escribir
    setFormErrors({
      ...formErrors,
      [name]: "",
    })
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

      // Actualizar el formData con las imágenes
      setFormData({
        ...formData,
        imagenes: newImagenes,
      })
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
    if (imagenesPreview[index] && imagenesPreview[index].startsWith('blob:')) {
      URL.revokeObjectURL(imagenesPreview[index])
    }
    newImagenesPreview[index] = null

    // Actualizar los estados
    setImagenes(newImagenes)
    setImagenesPreview(newImagenesPreview)

    // Actualizar el formData
    setFormData({
      ...formData,
      imagenes: newImagenes,
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

    // Limpiar el error si existía
    setFormErrors({
      ...formErrors,
      codigoBarras: "",
    })
  }

  /**
   * Función para formatear números con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toLocaleString("es-CO")
  }

  /**
   * Manejador para agregar una nueva característica
   */
  const handleAddCaracteristica = () => {
    if (nuevaCaracteristica.trim() === "") {
      return
    }

    // Verificar si la característica ya existe
    if (formData.caracteristicas.includes(nuevaCaracteristica.trim())) {
      toast.error("Esta característica ya ha sido agregada")
      return
    }

    // Agregar la nueva característica
    const updatedCaracteristicas = [...formData.caracteristicas, nuevaCaracteristica.trim()]

    // Actualizar el formData
    setFormData({
      ...formData,
      caracteristicas: updatedCaracteristicas,
    })

    // Limpiar el campo
    setNuevaCaracteristica("")
  }

  /**
   * Manejador para eliminar una característica
   * @param {Number} index - Índice de la característica a eliminar
   */
  const handleRemoveCaracteristica = (index) => {
    const updatedCaracteristicas = [...formData.caracteristicas]
    updatedCaracteristicas.splice(index, 1)

    setFormData({
      ...formData,
      caracteristicas: updatedCaracteristicas,
    })
  }

  /**
   * Manejador para agregar una nueva especificación
   */
  const handleAddEspecificacion = () => {
    if (nuevaEspecificacion.nombre.trim() === "" || nuevaEspecificacion.valor.trim() === "") {
      return
    }

    // Verificar si ya existe una especificación con el mismo nombre
    const existeNombre = formData.especificaciones.some(
      (spec) => spec.nombre.toLowerCase() === nuevaEspecificacion.nombre.trim().toLowerCase(),
    )

    if (existeNombre) {
      toast.error("Ya existe una especificación con este nombre")
      return
    }

    // Agregar la nueva especificación
    const updatedEspecificaciones = [
      ...formData.especificaciones,
      {
        nombre: nuevaEspecificacion.nombre.trim(),
        valor: nuevaEspecificacion.valor.trim(),
      },
    ]

    // Actualizar el formData
    setFormData({
      ...formData,
      especificaciones: updatedEspecificaciones,
    })

    // Limpiar los campos
    setNuevaEspecificacion({ nombre: "", valor: "" })
  }

  /**
   * Manejador para eliminar una especificación
   * @param {Number} index - Índice de la especificación a eliminar
   */
  const handleRemoveEspecificacion = (index) => {
    const updatedEspecificaciones = [...formData.especificaciones]
    updatedEspecificaciones.splice(index, 1)

    setFormData({
      ...formData,
      especificaciones: updatedEspecificaciones,
    })
  }

  /**
   * Validar el formulario completo
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    let isValid = true
    const errors = {
      nombre: "",
      descripcion: "",
      categoria: "",
      stock: "",
      precio: "",
      codigoBarras: "",
      referencia: "",
      fechaVencimiento: "",
    }

    // Validar nombre (requerido y único)
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del producto es obligatorio"
      isValid = false
    } else if (formData.nombre.trim().length > 100) {
      errors.nombre = "El nombre no puede exceder los 100 caracteres"
      isValid = false
    } else {
      // Verificar si el nombre ya existe (excepto para el producto actual en edición)
      const nombreExiste = productosExistentes.some(
        (prod) =>
          prod.nombre.toLowerCase() === formData.nombre.trim().toLowerCase() &&
          (!isEditing || prod.id !== Number.parseInt(productId)),
      )
      if (nombreExiste) {
        errors.nombre = "Ya existe un producto con este nombre"
        isValid = false
      }
    }

    // Validar descripción (opcional pero con longitud máxima)
    if (formData.descripcion && formData.descripcion.length > 500) {
      errors.descripcion = "La descripción no puede exceder los 500 caracteres"
      isValid = false
    }

    // Validar categoría (requerida)
    if (!formData.categoria) {
      errors.categoria = "Debe seleccionar una categoría"
      isValid = false
    }

    // Validar stock (requerido y numérico)
    if (formData.stock === "") {
      errors.stock = "El stock es obligatorio"
      isValid = false
    } else {
      const stockNum = Number(formData.stock)
      if (isNaN(stockNum) || stockNum < 0) {
        errors.stock = "El stock debe ser un número positivo"
        isValid = false
      } else if (!Number.isInteger(stockNum)) {
        errors.stock = "El stock debe ser un número entero"
        isValid = false
      } else if (stockNum > 9999) {
        errors.stock = "El stock no puede ser mayor a 9999"
        isValid = false
      }
    }

    // Validar precio (requerido y numérico)
    if (formData.precio === "") {
      errors.precio = "El precio es obligatorio"
      isValid = false
    } else {
      const precioNum = Number(formData.precio)
      if (isNaN(precioNum) || precioNum <= 0) {
        errors.precio = "El precio debe ser un número positivo"
        isValid = false
      } else if (precioNum > 999999999) {
        errors.precio = "El precio no puede ser mayor a 999,999,999"
        isValid = false
      }
    }

    // Validar código de barras (opcional pero con formato)
    if (formData.codigoBarras) {
      if (!/^\d{8,14}$/.test(formData.codigoBarras)) {
        errors.codigoBarras = "El código de barras debe tener entre 8 y 14 dígitos"
        isValid = false
      } else {
        // Verificar si el código de barras ya existe (excepto para el producto actual en edición)
        const codigoExiste = productosExistentes.some(
          (prod) =>
            prod.codigoBarras === formData.codigoBarras && (!isEditing || prod.id !== Number.parseInt(productId)),
        )
        if (codigoExiste) {
          errors.codigoBarras = "Ya existe un producto con este código de barras"
          isValid = false
        }
      }
    }

    // Validar referencia (opcional pero con longitud máxima)
    if (formData.referencia && formData.referencia.length > 50) {
      errors.referencia = "La referencia no puede exceder los 50 caracteres"
      isValid = false
    }

    // Validar fecha de vencimiento si el producto vence
    if (!formData.noVence && !formData.fechaVencimiento) {
      errors.fechaVencimiento = "Debe ingresar una fecha de vencimiento o marcar 'No vence'"
      isValid = false
    } else if (!formData.noVence) {
      // Verificar que la fecha de vencimiento sea futura
      const fechaVencimiento = new Date(formData.fechaVencimiento)
      const hoy = new Date()
      hoy.setHours(0, 0, 0, 0) // Resetear la hora para comparar solo fechas

      if (fechaVencimiento < hoy) {
        errors.fechaVencimiento = "La fecha de vencimiento debe ser futura"
        isValid = false
      }
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar el producto
   */
  const handleSaveProduct = () => {
    // Validar el formulario
    if (!validateForm()) {
      // Mostrar notificación de error general
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, corrija los errores en el formulario.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      )

      // Hacer scroll al primer error
      const firstErrorField = Object.keys(formErrors).find((key) => formErrors[key])
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          element.focus()
        }
      }

      return
    }

    // Procesar las imágenes
    // En un caso real, aquí se subirían las imágenes al servidor y se obtendrían las URLs
    
    // Simulamos las URLs de las imágenes (en producción, estas vendrían después de subir las imágenes)
    const imageUrls = imagenes
      .map((img, index) => {
        if (img) {
          // En un caso real, aquí iría la URL devuelta por el servidor
          return `https://example.com/uploads/producto_${Date.now()}_${index}.jpg`
        }
        return null
      })
      .filter((url) => url !== null)

    // Concatenar las URLs con un delimitador para guardarlas en un solo campo
    const fotosString = imageUrls.join("|")

    // Preparar los datos para enviar a la base de datos
    const productoData = {
      Nombre: formData.nombre,
      Descripcion: formData.descripcion,
      Categoria: formData.categoria,
      Fotos: fotosString, // URLs de imágenes separadas por |
      Stock: Number.parseInt(formData.stock),
      Precio: Number.parseFloat(formData.precio),
      IVA: formData.iva === "NA" ? null : Number.parseFloat(formData.iva),
      CodigoBarras: formData.codigoBarras,
      Referencia: formData.referencia,
      FechaVencimiento: formData.noVence ? null : formData.fechaVencimiento,
      Caracteristicas: formData.caracteristicas.join(", "), // Convertir array a string separado por comas
      Especificaciones: formData.especificaciones.map((item) => `${item.nombre}: ${item.valor}`).join(", "), // Convertir a string
    }

    console.log("Datos a enviar:", productoData)

    // Aquí iría la lógica para guardar el producto en la base de datos
    // Por ahora, solo mostramos una notificación de éxito

    const mensaje = isEditing ? "actualizado" : "guardado"

    toast.success(
      <div>
        <strong>Producto {mensaje}</strong>
        <p>
          El producto "{formData.nombre}" ha sido {mensaje} correctamente.
        </p>
      </div>,
      {
        icon: "✅",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      }
    )

    // Esperar a que se muestre la notificación y luego redirigir
    setTimeout(() => {
      navigate("/inventario/productos")
    }, 2000)
  }

  /**
   * Manejador para cancelar y volver a la lista de productos
   */
  const handleCancel = () => {
    navigate("/inventario/productos")
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

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? "Editar Producto" : "Registrar Nuevo Producto"}</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Productos
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form className="product-form">
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

            {/* Sección de Características */}
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
                  onClick={handleAddCaracteristica}
                  disabled={nuevaCaracteristica.trim() === ""}
                >
                  <Plus size={18} />
                </button>
              </div>
              <small className="form-text text-muted">Máximo 100 caracteres por característica.</small>

              {formData.caracteristicas && formData.caracteristicas.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-2 mt-2">
                  {formData.caracteristicas.map((caracteristica, index) => (
                    <div key={index} className="col">
                      <div className="d-flex align-items-center border rounded p-2">
                        <span className="me-auto text-truncate">{caracteristica}</span>
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger ms-2"
                          onClick={() => handleRemoveCaracteristica(index)}
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

            {/* Sección de Especificaciones */}
            <div className="mb-3">
              <label className="form-label">Especificaciones Técnicas</label>
              <div className="row g-2 mb-2">
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nombre (ej: Material)"
                    value={nuevaEspecificacion.nombre}
                    onChange={(e) => setNuevaEspecificacion({ ...nuevaEspecificacion, nombre: e.target.value })}
                    maxLength={50}
                  />
                </div>
                <div className="col-md-5">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Valor (ej: Aluminio)"
                    value={nuevaEspecificacion.valor}
                    onChange={(e) => setNuevaEspecificacion({ ...nuevaEspecificacion, valor: e.target.value })}
                    maxLength={100}
                  />
                </div>
                <div className="col-md-2">
                  <button
                    type="button"
                    className="btn btn-outline-primary w-100"
                    onClick={handleAddEspecificacion}
                    disabled={nuevaEspecificacion.nombre.trim() === "" || nuevaEspecificacion.valor.trim() === ""}
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
              <small className="form-text text-muted">Máximo 50 caracteres para el nombre y 100 para el valor.</small>

              {formData.especificaciones && formData.especificaciones.length > 0 ? (
                <div className="table-responsive">
                  <table className="table table-sm table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Especificación</th>
                        <th>Valor</th>
                        <th style={{ width: "50px" }}>Acción</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.especificaciones.map((especificacion, index) => (
                        <tr key={index}>
                          <td>{especificacion.nombre}</td>
                          <td>{especificacion.valor}</td>
                          <td className="text-center">
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleRemoveEspecificacion(index)}
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
                <p className="text-muted small">No hay especificaciones agregadas</p>
              )}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
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
                <small className="form-text text-muted">
                  Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB por imagen.
                </small>
              </div>

              <div className="col-md-6">
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
                      <select
                        className="form-select"
                        id="iva"
                        name="iva"
                        value={formData.iva}
                        onChange={handleInputChange}
                      >
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
                        {formErrors.fechaVencimiento && (
                          <div className="invalid-feedback">{formErrors.fechaVencimiento}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                <X size={18} className="me-1" />
                Cancelar
              </button>
              <button type="button" className="btn btn-primary" onClick={handleSaveProduct}>
                <Save size={18} className="me-1" />
                {isEditing ? "Actualizar Producto" : "Guardar Producto"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Contenedor para las notificaciones */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  )
}

export default RegistrarProducto