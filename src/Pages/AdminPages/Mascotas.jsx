"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { Save, AlertTriangle, PawPrint } from "lucide-react"
import Select from "react-select"
import "../../Styles/AdminStyles/Mascotas.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

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
    {
      field: "cliente.nombre",
      header: "Cliente",
      render: (row) => row.cliente?.nombre || "Sin cliente",
    },
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
   * Manejador para guardar la mascota (crear nueva o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveMascota = () => {
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.cliente || !formData.especie || !formData.fechaNacimiento) {
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
    { value: "Perro", label: "Perro" },
    { value: "Gato", label: "Gato" },
  ]

  // Opciones para el select de tamaños
  const tamañosOptions = [
    { value: "Pequeño", label: "Pequeño" },
    { value: "Grande", label: "Grande" },
  ]

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
      <div
        className="modal fade"
        id="mascotaModal"
        tabIndex="-1"
        aria-labelledby="mascotaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="mascotaModalLabel">
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
              <form className="mascota-form">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="cliente" className="form-label">
                      Cliente <span className="text-danger">*</span>
                    </label>
                    <Select
                      id="cliente"
                      name="cliente"
                      options={clientesOptions}
                      value={
                        formData.cliente
                          ? clientesOptions.find((option) => option.value.id === formData.cliente.id)
                          : null
                      }
                      onChange={handleSelectCliente}
                      placeholder="Seleccione un cliente..."
                      isDisabled={modalTitle === "Ver Detalles de la Mascota"}
                      styles={customSelectStyles}
                      isClearable
                      isSearchable
                      noOptionsMessage={() => "No se encontraron clientes"}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre de la Mascota <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <PawPrint size={18} />
                      </span>
                      <input
                        type="text"
                        className="form-control"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleInputChange}
                        disabled={modalTitle === "Ver Detalles de la Mascota"}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="especie" className="form-label">
                      Especie <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="especie"
                      name="especie"
                      value={formData.especie}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles de la Mascota"}
                      required
                    >
                      <option value="">Seleccione una especie</option>
                      {especiesOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="raza" className="form-label">
                      Raza
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="raza"
                      name="raza"
                      value={formData.raza}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles de la Mascota"}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="tamaño" className="form-label">
                      Tamaño
                    </label>
                    <select
                      className="form-select"
                      id="tamaño"
                      name="tamaño"
                      value={formData.tamaño}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles de la Mascota"}
                    >
                      <option value="">Seleccione un tamaño</option>
                      {tamañosOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="fechaNacimiento" className="form-label">
                      Fecha de Nacimiento <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="fechaNacimiento"
                      name="fechaNacimiento"
                      value={formData.fechaNacimiento}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles de la Mascota"}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cancelar
              </button>

              {modalTitle !== "Ver Detalles de la Mascota" && (
                <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveMascota}>
                  <Save size={18} className="me-1" />
                  Guardar Mascota
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
                <p className="mb-0">¿Está seguro de eliminar la mascota "{mascotaToDelete?.nombre}"?</p>
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

export default Mascotas

