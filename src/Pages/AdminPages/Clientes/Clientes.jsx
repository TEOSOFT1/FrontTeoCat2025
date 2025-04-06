"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import "../../../Styles/AdminStyles/Clientes.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import ClienteForm from "../../../Components/AdminComponents/ClientesComponents/ClienteForm"
import DeleteConfirmModal from "../../../Components/AdminComponents/ClientesComponents/DeleteConfirmModal"

/**
 * Componente para la gestión de clientes
 * Permite visualizar, crear, editar y cambiar el estado de clientes en el sistema
 */
const Clientes = () => {
  // Estado para los clientes
  const [clientes, setClientes] = useState([])

  // Estado para las mascotas
  const [mascotas, setMascotas] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Cliente")
  const [currentCliente, setCurrentCliente] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    documento: "",
    correo: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
    mascotas: [],
  })

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    documento: "",
    correo: "",
    nombre: "",
    apellido: "",
    direccion: "",
    telefono: "",
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [clienteToDelete, setClienteToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener clientes
   */
  useEffect(() => {
    // Aquí se implementará la carga de datos desde la API
  }, [])

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombreCompleto", header: "Nombre" },
    { field: "correo", header: "Correo" },
    { field: "documento", header: "Documento" },
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
          actions={["view", "edit", "toggleStatus", row.tieneVentas ? null : "delete"]}
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
   * Manejador para ver detalles de un cliente
   * @param {Object} cliente - Objeto de cliente a visualizar
   */
  const handleView = (cliente) => {
    setCurrentCliente(cliente)
    setModalTitle("Ver Detalles del Cliente")

    // Cargar datos del cliente en el formulario
    setFormData({
      documento: cliente.documento,
      correo: cliente.correo,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      mascotas: cliente.mascotas,
    })

    // Resetear errores
    setFormErrors({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar un cliente
   * @param {Object} cliente - Objeto de cliente a editar
   */
  const handleEdit = (cliente) => {
    setCurrentCliente(cliente)
    setModalTitle("Editar Cliente")

    // Cargar datos del cliente en el formulario
    setFormData({
      documento: cliente.documento,
      correo: cliente.correo,
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
      mascotas: cliente.mascotas,
    })

    // Resetear errores
    setFormErrors({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
    })

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de un cliente (Activo/Inactivo)
   * @param {Object} cliente - Objeto de cliente a cambiar estado
   */
  const handleToggleStatus = (cliente) => {
    // Cambiar el estado del cliente
    const updatedClientes = clientes.map((c) => {
      if (c.id === cliente.id) {
        return {
          ...c,
          estado: c.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return c
    })

    setClientes(updatedClientes)

    // Añadir notificación
    const newStatus = cliente.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El cliente "{cliente.nombreCompleto}" ahora está {newStatus}.
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
   * Manejador para iniciar el proceso de eliminación de un cliente
   * @param {Object} cliente - Objeto de cliente a eliminar
   */
  const handleDelete = (cliente) => {
    // Verificar si el cliente tiene ventas asociadas
    if (cliente.tieneVentas) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>No se puede eliminar el cliente porque tiene ventas asociadas.</p>
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

    setClienteToDelete(cliente)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación de un cliente
   */
  const confirmDelete = () => {
    if (clienteToDelete) {
      const updatedClientes = clientes.filter((c) => c.id !== clienteToDelete.id)
      setClientes(updatedClientes)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Cliente eliminado</strong>
          <p>El cliente "{clienteToDelete.nombreCompleto}" ha sido eliminado correctamente.</p>
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
    setClienteToDelete(null)
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setClienteToDelete(null)
  }

  /**
   * Manejador para abrir el modal de agregar cliente
   */
  const handleAddCliente = () => {
    setCurrentCliente(null)
    setModalTitle("Agregar Cliente")

    // Resetear el formulario
    setFormData({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
      mascotas: [],
    })

    // Resetear errores
    setFormErrors({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
    })

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

    // Limpiar el error específico cuando el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  /**
   * Manejador para seleccionar mascotas en el select
   * @param {Array} selectedOptions - Opciones seleccionadas del select
   */
  const handleSelectMascotas = (selectedOptions) => {
    setFormData({
      ...formData,
      mascotas: selectedOptions ? selectedOptions.map((option) => option.value) : [],
    })
  }

  /**
   * Validar el formulario completo
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    let isValid = true
    const errors = {
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
    }

    // Validar documento (requerido y formato)
    if (!formData.documento.trim()) {
      errors.documento = "El documento es obligatorio"
      isValid = false
    } else if (!/^\d{7,12}$/.test(formData.documento)) {
      errors.documento = "El documento debe tener entre 7 y 12 dígitos"
      isValid = false
    } else {
      // Verificar si el documento ya existe (excepto para el cliente actual en edición)
      const documentoExiste = clientes.some(
        (c) => c.documento === formData.documento && (!currentCliente || c.id !== currentCliente.id),
      )
      if (documentoExiste) {
        errors.documento = "Este documento ya está registrado"
        isValid = false
      }
    }

    // Validar correo (requerido y formato)
    if (!formData.correo.trim()) {
      errors.correo = "El correo es obligatorio"
      isValid = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.correo)) {
        errors.correo = "Formato de correo inválido"
        isValid = false
      } else {
        // Verificar si el correo ya existe (excepto para el cliente actual en edición)
        const correoExiste = clientes.some(
          (c) => c.correo === formData.correo && (!currentCliente || c.id !== currentCliente.id),
        )
        if (correoExiste) {
          errors.correo = "Este correo ya está registrado"
          isValid = false
        }
      }
    }

    // Validar nombre (requerido)
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
      isValid = false
    } else if (formData.nombre.trim().length > 50) {
      errors.nombre = "El nombre no puede exceder los 50 caracteres"
      isValid = false
    }

    // Validar apellido (requerido)
    if (!formData.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio"
      isValid = false
    } else if (formData.apellido.trim().length > 50) {
      errors.apellido = "El apellido no puede exceder los 50 caracteres"
      isValid = false
    }

    // Validar teléfono (requerido y formato)
    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio"
      isValid = false
    } else if (!/^\d{7,10}$/.test(formData.telefono)) {
      errors.telefono = "El teléfono debe tener entre 7 y 10 dígitos"
      isValid = false
    }

    // Validar dirección (requerida)
    if (!formData.direccion.trim()) {
      errors.direccion = "La dirección es obligatoria"
      isValid = false
    } else if (formData.direccion.trim().length > 100) {
      errors.direccion = "La dirección no puede exceder los 100 caracteres"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar el cliente (crear nuevo o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveCliente = () => {
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

    // Crear nombre completo
    const nombreCompleto = `${formData.nombre} ${formData.apellido}`

    if (currentCliente) {
      // Actualizar cliente existente
      const updatedClientes = clientes.map((c) => {
        if (c.id === currentCliente.id) {
          return {
            ...c,
            nombre: formData.nombre,
            apellido: formData.apellido,
            nombreCompleto: nombreCompleto,
            correo: formData.correo,
            documento: formData.documento,
            direccion: formData.direccion,
            telefono: formData.telefono,
            mascotas: formData.mascotas,
          }
        }
        return c
      })

      setClientes(updatedClientes)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Cliente actualizado</strong>
          <p>El cliente "{nombreCompleto}" ha sido actualizado correctamente.</p>
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
      // Crear nuevo cliente
      const newCliente = {
        id: Date.now(), // ID temporal, en una implementación real vendría del backend
        nombre: formData.nombre,
        apellido: formData.apellido,
        nombreCompleto: nombreCompleto,
        correo: formData.correo,
        documento: formData.documento,
        direccion: formData.direccion,
        telefono: formData.telefono,
        mascotas: formData.mascotas,
        estado: "Activo",
        tieneVentas: false, // Un cliente nuevo no tiene ventas
      }

      setClientes([...clientes, newCliente])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Cliente creado</strong>
          <p>El cliente "{nombreCompleto}" ha sido creado correctamente.</p>
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

  // Opciones para el select de mascotas
  const mascotasOptions = mascotas.map((mascota) => ({
    value: mascota,
    label: mascota.nombre,
  }))

  /**
   * Efecto para inicializar el modal de Bootstrap
   */
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("clienteModal")

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
      // Asegurarse de que se elimine cualquier backdrop residual al desmontar
      const backdrop = document.querySelector(".modal-backdrop")
      if (backdrop) {
        backdrop.remove()
      }
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
    }
  }, [showModal])

  return (
    <div className="clientes-container">
      <h2 className="mb-4">Gestión de Clientes</h2>

      <DataTable
        columns={columns}
        data={clientes}
        onAdd={handleAddCliente}
        addButtonLabel="Agregar Cliente"
        searchPlaceholder="Buscar clientes..."
      />

      {/* Modal para Agregar/Editar/Ver Cliente */}
      <ClienteForm
        showModal={showModal}
        modalTitle={modalTitle}
        formData={formData}
        formErrors={formErrors}
        mascotasOptions={mascotasOptions}
        handleInputChange={handleInputChange}
        handleSelectMascotas={handleSelectMascotas}
        handleSaveCliente={handleSaveCliente}
        handleCloseModal={handleCloseModal}
      />

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        cliente={clienteToDelete}
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

export default Clientes

