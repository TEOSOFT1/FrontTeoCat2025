"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Save, ArrowLeft, X } from "lucide-react"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import BasicInfoSection from "../../../Components/AdminComponents/ProductosComponents/BasicInfoSection"
import CharacteristicsSection from "../../../Components/AdminComponents/ProductosComponents/CharacteristicsSection"
import SpecificationsSection from "../../../Components/AdminComponents/ProductosComponents/SpecificationsSection"
import ImagesSection from "../../../Components/AdminComponents/ProductosComponents/ImagesSection"
import PricingSection from "../../../Components/AdminComponents/ProductosComponents/PricingSection"
import AdditionalInfoSection from "../../../Components/AdminComponents/ProductosComponents/AdditionalInfoSection"
import { uploadImageToCloudinary } from "../../../Services/uploadImageToCloudinary" // Importamos la función

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
  const [imagenesLoading, setImagenesLoading] = useState([false, false, false, false]) // Estado para controlar la carga de cada imagen

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
        fotos: "https://example.com/uploads/producto_1.jpg|https://example.com/uploads/producto_2.jpg",
      }

      setFormData(productoEditando)

      // Simular carga de imágenes si el producto tiene fotos
      if (productoEditando.fotos) {
        const fotosArray = productoEditando.fotos.split("|")
        const newImagenesPreview = [...imagenesPreview]

        fotosArray.forEach((url, index) => {
          if (index < 4) {
            // Máximo 4 imágenes
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
  const handleImageUpload = async (e, index) => {
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
      const newImagenesLoading = [...imagenesLoading]

      // Actualizar la imagen y su vista previa local temporal
      newImagenes[index] = file
      newImagenesPreview[index] = URL.createObjectURL(file)

      // Indicar que esta imagen está cargando
      newImagenesLoading[index] = true
      setImagenesLoading(newImagenesLoading)

      // Actualizar los estados con la vista previa local
      setImagenes(newImagenes)
      setImagenesPreview(newImagenesPreview)

      try {
        // Subir la imagen a Cloudinary en la carpeta 'productos'
        const imageUrl = await uploadImageToCloudinary(file, "productos")

        if (imageUrl) {
          // Actualizar la vista previa con la URL de Cloudinary
          const updatedImagenesPreview = [...imagenesPreview]

          // Revocar la URL temporal para liberar memoria
          if (newImagenesPreview[index] && newImagenesPreview[index].startsWith("blob:")) {
            URL.revokeObjectURL(newImagenesPreview[index])
          }

          updatedImagenesPreview[index] = imageUrl
          setImagenesPreview(updatedImagenesPreview)

          // Actualizar el formData con las imágenes
          const updatedImagenes = [...imagenes]
          updatedImagenes[index] = imageUrl // Guardamos la URL en lugar del archivo

          setFormData({
            ...formData,
            imagenes: updatedImagenes,
          })
        } else {
          toast.error("Error al subir la imagen. Intente nuevamente.")
        }
      } catch (error) {
        console.error("Error al subir la imagen:", error)
        toast.error("Error al subir la imagen. Intente nuevamente.")
      } finally {
        // Indicar que esta imagen ya no está cargando
        const finalImagenesLoading = [...imagenesLoading]
        finalImagenesLoading[index] = false
        setImagenesLoading(finalImagenesLoading)
      }
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
    if (imagenesPreview[index] && imagenesPreview[index].startsWith("blob:")) {
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
  const handleAddCaracteristica = (caracteristica) => {
    if (caracteristica.trim() === "") {
      return
    }

    // Verificar si la característica ya existe
    if (formData.caracteristicas.includes(caracteristica.trim())) {
      toast.error("Esta característica ya ha sido agregada")
      return
    }

    // Agregar la nueva característica
    const updatedCaracteristicas = [...formData.caracteristicas, caracteristica.trim()]

    // Actualizar el formData
    setFormData({
      ...formData,
      caracteristicas: updatedCaracteristicas,
    })
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
  const handleAddEspecificacion = (especificacion) => {
    if (especificacion.nombre.trim() === "" || especificacion.valor.trim() === "") {
      return
    }

    // Verificar si ya existe una especificación con el mismo nombre
    const existeNombre = formData.especificaciones.some(
      (spec) => spec.nombre.toLowerCase() === especificacion.nombre.trim().toLowerCase(),
    )

    if (existeNombre) {
      toast.error("Ya existe una especificación con este nombre")
      return
    }

    // Agregar la nueva especificación
    const updatedEspecificaciones = [
      ...formData.especificaciones,
      {
        nombre: especificacion.nombre.trim(),
        valor: especificacion.valor.trim(),
      },
    ]

    // Actualizar el formData
    setFormData({
      ...formData,
      especificaciones: updatedEspecificaciones,
    })
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
    // Verificar si hay imágenes cargando
    if (imagenesLoading.some((loading) => loading)) {
      toast.warning("Espere a que se completen las cargas de imágenes")
      return
    }

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
        },
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

    // Filtrar las URLs de las imágenes (ahora son URLs de Cloudinary)
    const imageUrls = formData.imagenes.filter((img) => img !== null && typeof img === "string")

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
      },
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
            {/* Sección de información básica */}
            <BasicInfoSection
              formData={formData}
              formErrors={formErrors}
              categorias={categorias}
              handleInputChange={handleInputChange}
            />

            {/* Sección de características */}
            <CharacteristicsSection
              caracteristicas={formData.caracteristicas}
              onAddCaracteristica={handleAddCaracteristica}
              onRemoveCaracteristica={handleRemoveCaracteristica}
            />

            {/* Sección de especificaciones */}
            <SpecificationsSection
              especificaciones={formData.especificaciones}
              onAddEspecificacion={handleAddEspecificacion}
              onRemoveEspecificacion={handleRemoveEspecificacion}
            />

            <div className="row mb-3">
              {/* Sección de imágenes */}
              <div className="col-md-6">
                <ImagesSection
                  imagenes={imagenes}
                  imagenesPreview={imagenesPreview}
                  onImageUpload={handleImageUpload}
                  onRemoveImage={handleRemoveImage}
                />
                {/* Indicador de carga de imágenes */}
                {imagenesLoading.some((loading) => loading) && (
                  <div className="alert alert-info mt-2 py-2">
                    <small>Subiendo imágenes a Cloudinary...</small>
                  </div>
                )}
              </div>

              <div className="col-md-6">
                {/* Sección de precios y stock */}
                <PricingSection
                  formData={formData}
                  formErrors={formErrors}
                  precioConIva={precioConIva}
                  formatNumber={formatNumber}
                  handleInputChange={handleInputChange}
                />

                {/* Sección de información adicional */}
                <AdditionalInfoSection
                  formData={formData}
                  formErrors={formErrors}
                  handleInputChange={handleInputChange}
                  handleScanBarcode={handleScanBarcode}
                />
              </div>
            </div>

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2 mt-4">
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                <X size={18} className="me-1" />
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleSaveProduct}
                disabled={imagenesLoading.some((loading) => loading)}
              >
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

