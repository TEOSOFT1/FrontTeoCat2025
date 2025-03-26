"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { Save, AlertTriangle } from "lucide-react"
import "../../Styles/AdminStyles/Servicios.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de servicios
 * Permite crear, ver, editar, activar/desactivar y eliminar servicios
 */
const Servicios = () => {
  // Estado para los servicios
  const [servicios, setServicios] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Servicio")
  const [currentServicio, setCurrentServicio] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    duracion: "",
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [servicioToDelete, setServicioToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener servicios
   */
  useEffect(() => {
    // Aquí se implementará la carga de datos desde la API
  }, [])

  /**
   * Función para formatear números con separadores de miles
   * @param {number} number - Número a formatear
   * @returns {string} Número formateado con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  /**
   * Función para formatear duración en minutos a formato legible
   * @param {number} minutos - Duración en minutos
   * @returns {string} Duración formateada (ej: "1 h 30 min")
   */
  const formatDuracion = (minutos) => {
    if (minutos < 60) {
      return `${minutos} min`
    } else {
      const horas = Math.floor(minutos / 60)
      const min = minutos % 60
      return min > 0 ? `${horas} h ${min} min` : `${horas} h`
    }
  }

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombre", header: "Nombre del Servicio" },
    {
      field: "precio",
      header: "Precio",
      render: (row) => `$${formatNumber(row.precio)}`,
    },
    {
      field: "duracion",
      header: "Duración",
      render: (row) => formatDuracion(row.duracion),
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
   * Manejador para ver detalles de un servicio
   * @param {Object} servicio - Objeto de servicio a visualizar
   */
  const handleView = (servicio) => {
    setCurrentServicio(servicio)
    setModalTitle("Ver Detalles del Servicio")

    // Cargar datos del servicio en el formulario
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
      duracion: servicio.duracion.toString(),
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar un servicio
   * @param {Object} servicio - Objeto de servicio a editar
   */
  const handleEdit = (servicio) => {
    setCurrentServicio(servicio)
    setModalTitle("Editar Servicio")

    // Cargar datos del servicio en el formulario
    setFormData({
      nombre: servicio.nombre,
      descripcion: servicio.descripcion,
      precio: servicio.precio.toString(),
      duracion: servicio.duracion.toString(),
    })

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de un servicio (Activo/Inactivo)
   * @param {Object} servicio - Objeto de servicio a cambiar estado
   */
  const handleToggleStatus = (servicio) => {
    // Cambiar el estado del servicio
    const updatedServicios = servicios.map((s) => {
      if (s.id === servicio.id) {
        return {
          ...s,
          estado: s.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return s
    })

    setServicios(updatedServicios)

    // Añadir notificación
    const newStatus = servicio.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El servicio "{servicio.nombre}" ahora está {newStatus}.
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
   * Manejador para iniciar el proceso de eliminación de un servicio
   * @param {Object} servicio - Objeto de servicio a eliminar
   */
  const handleDelete = (servicio) => {
    setServicioToDelete(servicio)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación de un servicio
   */
  const confirmDelete = () => {
    if (servicioToDelete) {
      const updatedServicios = servicios.filter((s) => s.id !== servicioToDelete.id)
      setServicios(updatedServicios)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Servicio eliminado</strong>
          <p>El servicio "{servicioToDelete.nombre}" ha sido eliminado correctamente.</p>
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
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setServicioToDelete(null)
  }

  /**
   * Manejador para abrir el modal de agregar servicio
   */
  const handleAddServicio = () => {
    setCurrentServicio(null)
    setModalTitle("Agregar Servicio")

    // Resetear el formulario
    setFormData({
      nombre: "",
      descripcion: "",
      precio: "",
      duracion: "",
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
   * Manejador para guardar el servicio (crear nuevo o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveServicio = () => {
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.precio || !formData.duracion) {
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
    if (isNaN(Number(formData.precio)) || isNaN(Number(formData.duracion))) {
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

    // Validar que precio y duración sean mayores que cero
    if (Number(formData.precio) <= 0 || Number(formData.duracion) <= 0) {
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>El precio y la duración deben ser valores mayores que cero.</p>
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

    if (currentServicio) {
      // Actualizar servicio existente
      const updatedServicios = servicios.map((s) => {
        if (s.id === currentServicio.id) {
          return {
            ...s,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
            precio: Number(formData.precio),
            duracion: Number(formData.duracion),
          }
        }
        return s
      })

      setServicios(updatedServicios)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Servicio actualizado</strong>
          <p>El servicio "{formData.nombre}" ha sido actualizado correctamente.</p>
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
      // Crear nuevo servicio
      const newServicio = {
        id: Date.now(), // ID temporal, en una implementación real vendría del backend
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        precio: Number(formData.precio),
        duracion: Number(formData.duracion),
        estado: "Activo",
      }

      setServicios([...servicios, newServicio])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Servicio creado</strong>
          <p>El servicio "{formData.nombre}" ha sido creado correctamente.</p>
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

  /**
   * Efecto para inicializar el modal de Bootstrap
   */
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("servicioModal")

    if (showModal && modalElement) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
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
      if (modalInstance) {
        modalInstance.hide()
      }
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
    <div className="servicios-container">
      <h2 className="mb-4">Gestión de Servicios</h2>

      <DataTable
        columns={columns}
        data={servicios}
        onAdd={handleAddServicio}
        addButtonLabel="Agregar Servicio"
        searchPlaceholder="Buscar servicios..."
      />

      {/* Modal para Agregar/Editar/Ver Servicio */}
      <div
        className="modal fade"
        id="servicioModal"
        tabIndex="-1"
        aria-labelledby="servicioModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="servicioModalLabel">
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
              <form className="servicio-form">
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
                    disabled={modalTitle === "Ver Detalles del Servicio"}
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
                    disabled={modalTitle === "Ver Detalles del Servicio"}
                  ></textarea>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
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
                        disabled={modalTitle === "Ver Detalles del Servicio"}
                        min="0"
                        required
                      />
                    </div>
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
                      disabled={modalTitle === "Ver Detalles del Servicio"}
                      min="1"
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

              {modalTitle !== "Ver Detalles del Servicio" && (
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleSaveServicio}
                >
                  <Save size={18} className="me-1" />
                  Guardar Servicio
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
                <p className="mb-0">¿Está seguro de eliminar el servicio "{servicioToDelete?.nombre}"?</p>
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

export default Servicios

