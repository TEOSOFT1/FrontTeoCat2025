"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import { Save, AlertTriangle } from "lucide-react"
import "../../../Styles/AdminStyles/Clientes.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import Select from "react-select"

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

  // Add a new state for validation errors
  const [errors, setErrors] = useState({
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

    // Clear the error for this field when user types
    if (errors[name]) {
      setErrors({
        ...errors,
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
   * Manejador para guardar el cliente (crear nuevo o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveCliente = () => {
    // Reset all errors
    const newErrors = {
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      direccion: "",
      telefono: "",
    }

    let isValid = true

    // Validate required fields
    if (!formData.documento.trim()) {
      newErrors.documento = "El documento es obligatorio"
      isValid = false
    }

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio"
      isValid = false
    }

    if (!formData.apellido.trim()) {
      newErrors.apellido = "El apellido es obligatorio"
      isValid = false
    }

    if (!formData.direccion.trim()) {
      newErrors.direccion = "La dirección es obligatoria"
      isValid = false
    }

    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio"
      isValid = false
    }

    // Validate email format if provided
    if (formData.correo.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.correo)) {
        newErrors.correo = "El formato del correo electrónico no es válido"
        isValid = false
      }
    } else {
      newErrors.correo = "El correo electrónico es obligatorio"
      isValid = false
    }

    // Check for duplicate documento (in a real app, this would be an API call)
    if (formData.documento.trim() && currentCliente?.documento !== formData.documento) {
      const documentoExists = clientes.some(
        (c) => c.documento === formData.documento && c.id !== (currentCliente?.id || 0),
      )

      if (documentoExists) {
        newErrors.documento = "Este documento ya está registrado"
        isValid = false
      }
    }

    // Check for duplicate email (in a real app, this would be an API call)
    if (formData.correo.trim() && currentCliente?.correo !== formData.correo) {
      const correoExists = clientes.some((c) => c.correo === formData.correo && c.id !== (currentCliente?.id || 0))

      if (correoExists) {
        newErrors.correo = "Este correo electrónico ya está registrado"
        isValid = false
      }
    }

    // Update errors state
    setErrors(newErrors)

    // If there are validation errors, show toast and return
    if (!isValid) {
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error de validación</strong>
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

  // Estilos personalizados para react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : null,
      "&:hover": {
        borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#0d6efd" : state.isFocused ? "#f8f9fa" : null,
      color: state.isSelected ? "white" : "black",
    }),
  }

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
      // Asegurarse de que se elimine cualquier backdrop residual
      const backdrop = document.querySelector(".modal-backdrop")
      if (backdrop) {
        backdrop.remove()
      }
      document.body.classList.remove("modal-open")
      document.body.style.overflow = ""
      document.body.style.paddingRight = ""
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
      <div
        className="modal fade"
        id="clienteModal"
        tabIndex="-1"
        aria-labelledby="clienteModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="clienteModalLabel">
                {modalTitle}
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="modal"
                aria-label="Close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <form className="cliente-form">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="documento" className="form-label">
                      Documento <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.documento ? "is-invalid" : ""}`}
                      id="documento"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Cliente"}
                      required
                    />
                    {errors.documento && <div className="invalid-feedback">{errors.documento}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="correo" className="form-label">
                      Correo Electrónico <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Cliente"}
                      required
                    />
                    {errors.correo && <div className="invalid-feedback">{errors.correo}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Cliente"}
                      required
                    />
                    {errors.nombre && <div className="invalid-feedback">{errors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="apellido" className="form-label">
                      Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.apellido ? "is-invalid" : ""}`}
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Cliente"}
                      required
                    />
                    {errors.apellido && <div className="invalid-feedback">{errors.apellido}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.telefono ? "is-invalid" : ""}`}
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Cliente"}
                      required
                    />
                    {errors.telefono && <div className="invalid-feedback">{errors.telefono}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="direccion" className="form-label">
                      Dirección <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.direccion ? "is-invalid" : ""}`}
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Cliente"}
                      required
                    />
                    {errors.direccion && <div className="invalid-feedback">{errors.direccion}</div>}
                  </div>
                </div>
                <div className="row mb-3">
                  <div className="col-12">
                    <label htmlFor="mascotas" className="form-label">
                      Mascotas
                    </label>
                    <Select
                      id="mascotas"
                      name="mascotas"
                      options={mascotasOptions}
                      value={
                        formData.mascotas
                          ? mascotasOptions.filter((option) =>
                              formData.mascotas.some((mascota) => mascota.id === option.value.id),
                            )
                          : []
                      }
                      onChange={handleSelectMascotas}
                      placeholder="Seleccione mascotas..."
                      isDisabled={modalTitle === "Ver Detalles del Cliente"}
                      styles={customSelectStyles}
                      isMulti
                      isClearable
                      isSearchable
                      noOptionsMessage={() => "No se encontraron mascotas"}
                    />
                    <small className="text-muted">Puede seleccionar múltiples mascotas para este cliente.</small>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cancelar
              </button>

              {modalTitle !== "Ver Detalles del Cliente" && (
                <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveCliente}>
                  <Save size={18} className="me-1" />
                  Guardar Cliente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showDeleteConfirm && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${showDeleteConfirm ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Confirmar eliminación</h5>
              <button type="button" className="btn-close btn-close-white" onClick={cancelDelete}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center">
                <AlertTriangle size={24} className="text-danger me-3" />
                <p className="mb-0">¿Está seguro de eliminar el cliente "{clienteToDelete?.nombreCompleto}"?</p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={cancelDelete}>
                Cancelar
              </button>
              <button type="button" className="btn btn-danger" onClick={confirmDelete}>
                Aceptar
              </button>
            </div>
          </div>
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

export default Clientes

