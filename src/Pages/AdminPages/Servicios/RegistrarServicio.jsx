"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Save, ArrowLeft } from "lucide-react"
import "../../../Styles/AdminStyles/ToastStyles.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import BasicInfoSection from "../../../Components/AdminComponents/ServiciosComponents/BasicInfoSection"
import PricingSection from "../../../Components/AdminComponents/ServiciosComponents/PricingSection"
import BenefitsSection from "../../../Components/AdminComponents/ServiciosComponents/BenefitsSection"
import IncludesSection from "../../../Components/AdminComponents/ServiciosComponents/IncludesSection"
import ImagesSection from "../../../Components/AdminComponents/ServiciosComponents/ImagesSection"
import { uploadImageToCloudinary } from "../../../Services/uploadImageToCloudinary" // Importamos la función

/**
 * Componente para registrar un nuevo servicio
 * Versión de página completa del formulario de servicios
 */
const RegistrarServicio = () => {
  // Estado para el formulario
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
  const [imagenesLoading, setImagenesLoading] = useState([false, false, false, false]) // Estado para controlar la carga de cada imagen

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

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    idTipoServicio: "",
    nombre: "",
    duracion: "",
    precioPequeño: "",
    precioGrande: "",
    imagenes: "",
  })

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

    // Limpiar el error específico cuando el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
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

      // Limpiar el error de imágenes si existía
      if (formErrors.imagenes) {
        setFormErrors({
          ...formErrors,
          imagenes: "",
        })
      }

      try {
        // Subir la imagen a Cloudinary en la carpeta 'servicios'
        const imageUrl = await uploadImageToCloudinary(file, "servicios")

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

          setImagenes(updatedImagenes)
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
  const handleAddBeneficio = (beneficio) => {
    if (beneficio.trim() === "") {
      return
    }

    // Verificar si el beneficio ya existe
    if (formData.beneficios.includes(beneficio.trim())) {
      toast.error("Este beneficio ya ha sido agregado")
      return
    }

    // Agregar el nuevo beneficio
    const updatedBeneficios = [...formData.beneficios, beneficio.trim()]

    // Actualizar el formData
    setFormData({
      ...formData,
      beneficios: updatedBeneficios,
    })
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
  const handleAddQueIncluye = (item) => {
    if (item.nombre.trim() === "" || item.valor.trim() === "") {
      return
    }

    // Verificar si ya existe un elemento con el mismo nombre
    const existeNombre = formData.queIncluye.some(
      (existingItem) => existingItem.nombre.toLowerCase() === item.nombre.trim().toLowerCase(),
    )

    if (existeNombre) {
      toast.error("Ya existe un elemento con este nombre")
      return
    }

    // Agregar el nuevo elemento
    const updatedQueIncluye = [
      ...formData.queIncluye,
      {
        nombre: item.nombre.trim(),
        valor: item.valor.trim(),
      },
    ]

    // Actualizar el formData
    setFormData({
      ...formData,
      queIncluye: updatedQueIncluye,
    })
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

  /**
   * Validar el formulario completo
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    let isValid = true
    const errors = {
      idTipoServicio: "",
      nombre: "",
      duracion: "",
      precioPequeño: "",
      precioGrande: "",
      imagenes: "",
    }

    // Validar tipo de servicio
    if (!formData.idTipoServicio) {
      errors.idTipoServicio = "Por favor, seleccione un tipo de servicio"
      isValid = false
    }

    // Validar nombre
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre del servicio es obligatorio"
      isValid = false
    }

    // Validar duración
    if (!formData.duracion || formData.duracion === "0") {
      errors.duracion = "La duración debe ser mayor a 0 minutos"
      isValid = false
    } else if (isNaN(Number.parseInt(formData.duracion))) {
      errors.duracion = "La duración debe ser un número válido"
      isValid = false
    }

    // Validar precios
    if (!formData.precioPequeño || isNaN(Number.parseFloat(formData.precioPequeño))) {
      errors.precioPequeño = "El precio para mascotas pequeñas es obligatorio y debe ser un número válido"
      isValid = false
    }

    if (!formData.precioGrande || isNaN(Number.parseFloat(formData.precioGrande))) {
      errors.precioGrande = "El precio para mascotas grandes es obligatorio y debe ser un número válido"
      isValid = false
    }

    // Validar que al menos haya una imagen
    if (!imagenes.some((img) => img !== null)) {
      errors.imagenes = "Por favor, suba al menos una imagen para el servicio"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar el servicio
   * Valida los datos y envía la información
   */
  const handleSaveServicio = () => {
    // Verificar si hay imágenes cargando
    if (imagenesLoading.some((loading) => loading)) {
      toast.warning("Espere a que se completen las cargas de imágenes")
      return
    }

    // Validar el formulario
    if (!validateForm()) {
      // Mostrar notificación de error general
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
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
      return
    }

    // Filtrar las URLs de las imágenes (ahora son URLs de Cloudinary)
    const imageUrls = imagenes.filter((img) => img !== null && typeof img === "string")

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
            {/* Sección de información básica */}
            <BasicInfoSection
              formData={formData}
              formErrors={formErrors}
              tiposServicio={tiposServicio}
              handleInputChange={handleInputChange}
            />

            {/* Sección de precios */}
            <PricingSection
              formData={formData}
              formErrors={formErrors}
              formatNumber={formatNumber}
              handleInputChange={handleInputChange}
            />

            {/* Sección de beneficios */}
            <BenefitsSection
              beneficios={formData.beneficios}
              nuevoBeneficio={nuevoBeneficio}
              setNuevoBeneficio={setNuevoBeneficio}
              onAddBeneficio={handleAddBeneficio}
              onRemoveBeneficio={handleRemoveBeneficio}
            />

            {/* Sección de que incluye */}
            <IncludesSection
              queIncluye={formData.queIncluye}
              nuevoQueIncluye={nuevoQueIncluye}
              setNuevoQueIncluye={setNuevoQueIncluye}
              onAddQueIncluye={handleAddQueIncluye}
              onRemoveQueIncluye={handleRemoveQueIncluye}
            />

            {/* Sección de imágenes */}
            <ImagesSection
              imagenes={imagenes}
              imagenesPreview={imagenesPreview}
              formErrors={formErrors}
              onImageUpload={handleImageUpload}
              onRemoveImage={handleRemoveImage}
            />

            {/* Indicador de carga de imágenes */}
            {imagenesLoading.some((loading) => loading) && (
              <div className="alert alert-info mt-2 py-2">
                <small>Subiendo imágenes a Cloudinary...</small>
              </div>
            )}

            <div className="d-flex justify-content-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-primary d-flex align-items-center"
                onClick={handleSaveServicio}
                disabled={imagenesLoading.some((loading) => loading)}
              >
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

