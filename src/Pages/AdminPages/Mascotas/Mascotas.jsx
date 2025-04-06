"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import "../../../Styles/AdminStyles/Mascotas.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import MascotaForm from "../../../Components/AdminComponents/MascotasComponents/MascotaForm"
import DeleteConfirmModal from "../../../Components/AdminComponents/MascotasComponents/DeleteConfirmModal"
import { uploadImageToCloudinary } from "../../../Services/uploadImageToCloudinary" // Importamos la función

/**
 * Componente para la gestión de mascotas
 * Permite visualizar, crear, editar, activar/desactivar y eliminar mascotas
 */
const Mascotas = () => {
  // Estado para las mascotas
  const [mascotas, setMascotas] = useState([])

  // Estado para los clientes
  const [clientes, setClientes] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Mascota")
  const [currentMascota, setCurrentMascota] = useState(null)

  // Estado para la foto
  const [fotoMascota, setFotoMascota] = useState(null)
  const [fotoPreview, setFotoPreview] = useState(null)
  const [isImageLoading, setIsImageLoading] = useState(false) // Estado para controlar la carga de la imagen

  // Estado para el formulario
  const [formData, setFormData] = useState({
    cliente: null,
    nombre: "",
    especie: "",
    raza: "",
    tamaño: "",
    fechaNacimiento: "",
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [mascotaToDelete, setMascotaToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener mascotas y clientes
   */
  useEffect(() => {
    // Aquí se implementará la carga de datos desde la API
  }, [])

  /**
   * Función para formatear fechas
   * @param {string} dateString - Fecha en formato ISO
   * @returns {string} Fecha formateada en formato local
   */
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("es-ES", options)
  }

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombre", header: "Nombre de la Mascota" },
    { field: "raza", header: "Raza" },
    {
      field: "fechaNacimiento",
      header: "Fecha de Nacimiento",
      render: (row) => formatDate(row.fechaNacimiento),
    },
    {
      field: "estado",
      header: "Estado",
      render: (row) => (
        <span className={`badge ${row.estado === "Activo" ? "bg-success" : "bg-danger"}`}>{row.estado}</span>
      ),
    },
    {
      field: "acciones",
      header: "Acciones",
      render: (row) => (
        <TableActions
          actions={["view", "edit", "toggleStatus", "delete"]}
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          customLabels={{
            toggleStatus: row.estado === "Activo" ? "Desactivar" : "Activar",
          }}
        />
      ),
    },
  ]

  /**
   * Manejador para ver detalles de una mascota
   * @param {Object} mascota - Objeto de mascota a visualizar
   */
  const handleView = (mascota) => {
    setCurrentMascota(mascota)
    setModalTitle("Ver Detalles de la Mascota")

    // Cargar datos de la mascota en el formulario
    setFormData({
      cliente: mascota.cliente,
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      tamaño: mascota.tamaño,
      fechaNacimiento: mascota.fechaNacimiento,
    })

    // Cargar foto si existe
    if (mascota.foto) {
      setFotoPreview(mascota.foto)
    } else {
      setFotoPreview(null)
    }

    setShowModal(true)
  }

  /**
   * Manejador para editar una mascota
   * @param {Object} mascota - Objeto de mascota a editar
   */
  const handleEdit = (mascota) => {
    setCurrentMascota(mascota)
    setModalTitle("Editar Mascota")

    // Cargar datos de la mascota en el formulario
    setFormData({
      cliente: mascota.cliente,
      nombre: mascota.nombre,
      especie: mascota.especie,
      raza: mascota.raza,
      tamaño: mascota.tamaño,
      fechaNacimiento: mascota.fechaNacimiento,
    })

    // Cargar foto si existe
    if (mascota.foto) {
      setFotoPreview(mascota.foto)
    } else {
      setFotoPreview(null)
    }

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de una mascota (Activo/Inactivo)
   * @param {Object} mascota - Objeto de mascota a cambiar estado
   */
  const handleToggleStatus = (mascota) => {
    // Cambiar el estado de la mascota
    const updatedMascotas = mascotas.map((m) => {
      if (m.id === mascota.id) {
        return {
          ...m,
          estado: m.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return m
    })

    setMascotas(updatedMascotas)

    // Añadir notificación
    const newStatus = mascota.estado === "Activo" ? "inactiva" : "activa"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          La mascota "{mascota.nombre}" ahora está {newStatus}.
        </p>
      </div>,
      {
        icon: "🔄",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    )
  }

  /**
   * Manejador para iniciar el proceso de eliminación de una mascota
   * @param {Object} mascota - Objeto de mascota a eliminar
   */
  const handleDelete = (mascota) => {
    setMascotaToDelete(mascota)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación de una mascota
   */
  const confirmDelete = () => {
    if (mascotaToDelete) {
      const updatedMascotas = mascotas.filter((m) => m.id !== mascotaToDelete.id)
      setMascotas(updatedMascotas)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Mascota eliminada</strong>
          <p>La mascota "{mascotaToDelete.nombre}" ha sido eliminada correctamente.</p>
        </div>,
        {
          icon: "🗑️",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    }
    setShowDeleteConfirm(false)
    setMascotaToDelete(null)
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setMascotaToDelete(null)
  }

  /**
   * Manejador para abrir el modal de agregar mascota
   */
  const handleAddMascota = () => {
    setCurrentMascota(null)
    setModalTitle("Agregar Mascota")

    // Resetear el formulario
    setFormData({
      cliente: null,
      nombre: "",
      especie: "",
      raza: "",
      tamaño: "",
      fechaNacimiento: "",
    })

    // Resetear la foto
    setFotoMascota(null)
    setFotoPreview(null)

    setShowModal(true)
  }

  /**
   * Manejador para cerrar el modal
   */
  const handleCloseModal = () => {
    setShowModal(false)
  }

  /**
   * Manejador para cambios en los inputs del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  /**
   * Manejador para seleccionar un cliente en el select
   * @param {Object} selectedOption - Opción seleccionada del select
   */
  const handleSelectCliente = (selectedOption) => {
    setFormData({
      ...formData,
      cliente: selectedOption ? selectedOption.value : null,
    })
  }

  /**
   * Manejador para cambios en el input de foto
   * @param {Event} e - Evento del input
   */
  const handleFotoChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

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

    // Guardar el archivo para referencia
    setFotoMascota(file)

    // Crear URL para previsualización temporal
    const localPreview = URL.createObjectURL(file)
    setFotoPreview(localPreview)

    // Indicar que la imagen está cargando
    setIsImageLoading(true)

    try {
      // Subir la imagen a Cloudinary en la carpeta 'mascotas'
      const imageUrl = await uploadImageToCloudinary(file, "mascotas")

      if (imageUrl) {
        // Revocar la URL temporal para liberar memoria
        URL.revokeObjectURL(localPreview)

        // Actualizar la vista previa con la URL de Cloudinary
        setFotoPreview(imageUrl)

        // Ya no necesitamos guardar el archivo, solo la URL
        setFotoMascota(null)
      } else {
        toast.error("Error al subir la imagen. Intente nuevamente.")
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error)
      toast.error("Error al subir la imagen. Intente nuevamente.")
    } finally {
      // Indicar que la imagen ya no está cargando
      setIsImageLoading(false)
    }
  }

  /**
   * Manejador para guardar la mascota (crear nueva o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveMascota = () => {
    // Verificar si hay una imagen cargando
    if (isImageLoading) {
      toast.warning("Espere a que se complete la carga de la imagen")
      return
    }

    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.especie || !formData.fechaNacimiento) {
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

    if (currentMascota) {
      // Actualizar mascota existente
      const updatedMascotas = mascotas.map((m) => {
        if (m.id === currentMascota.id) {
          return {
            ...m,
            cliente: formData.cliente,
            nombre: formData.nombre,
            especie: formData.especie,
            raza: formData.raza,
            tamaño: formData.tamaño,
            fechaNacimiento: formData.fechaNacimiento,
            foto: fotoPreview || m.foto, // Mantener la foto existente si no se cambió
          }
        }
        return m
      })

      setMascotas(updatedMascotas)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Mascota actualizada</strong>
          <p>La mascota "{formData.nombre}" ha sido actualizada correctamente.</p>
        </div>,
        {
          icon: "✏️",
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        },
      )
    } else {
      // Crear nueva mascota
      const newMascota = {
        id: Date.now(), // ID temporal, en una implementación real vendría del backend
        cliente: formData.cliente,
        nombre: formData.nombre,
        especie: formData.especie,
        raza: formData.raza,
        tamaño: formData.tamaño,
        fechaNacimiento: formData.fechaNacimiento,
        estado: "Activo",
        foto: fotoPreview, // Guardar la URL de la foto (ahora es la URL de Cloudinary)
      }

      setMascotas([...mascotas, newMascota])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Mascota creada</strong>
          <p>La mascota "{formData.nombre}" ha sido creada correctamente.</p>
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
    }

    // Cerrar el modal
    setShowModal(false)
  }

  // Opciones para el select de clientes
  const clientesOptions = clientes.map((cliente) => ({
    value: cliente,
    label: `${cliente.nombreCompleto} - ${cliente.documento}`,
  }))

  // Opciones para el select de especies
  const especiesOptions = [
    { value: "Canino", label: "Canino" },
    { value: "Felino", label: "Felino" },
  ]

  // Opciones para el select de tamaños
  const tamañosOptions = [
    { value: "Pequeño", label: "Pequeño" },
    { value: "Grande", label: "Grande" },
  ]

  /**
   * Efecto para inicializar el modal de Bootstrap
   */
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("mascotaModal")

    if (showModal) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
    } else {
      // Si showModal es false y el modal está abierto, cerrarlo programáticamente
      if (modalElement && modalElement.classList.contains("show")) {
        import("bootstrap").then((bootstrap) => {
          modalInstance = bootstrap.Modal.getInstance(modalElement)
          if (modalInstance) {
            modalInstance.hide()
          }
        })
      }
    }

    // Evento para cuando el modal se cierra con el botón X o haciendo clic fuera
    const handleHidden = () => {
      setShowModal(false)
    }

    modalElement?.addEventListener("hidden.bs.modal", handleHidden)

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden)
      // No llamar a dispose() aquí, solo ocultar si es necesario
    }
  }, [showModal])

  return (
    <div className="mascotas-container">
      <h2 className="mb-4">Gestión de Mascotas</h2>

      <DataTable
        columns={columns}
        data={mascotas}
        onAdd={handleAddMascota}
        addButtonLabel="Agregar Mascota"
        searchPlaceholder="Buscar mascotas..."
      />

      {/* Modal para Agregar/Editar/Ver Mascota */}
      <MascotaForm
        showModal={showModal}
        modalTitle={modalTitle}
        formData={formData}
        fotoPreview={fotoPreview}
        especiesOptions={especiesOptions}
        tamañosOptions={tamañosOptions}
        clientesOptions={clientesOptions}
        onInputChange={handleInputChange}
        onSelectCliente={handleSelectCliente}
        onFotoChange={handleFotoChange}
        onSave={handleSaveMascota}
        onClose={handleCloseModal}
        disableSave={isImageLoading} // Pasar el estado de carga al formulario
      />

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        mascota={mascotaToDelete}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />

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

export default Mascotas

