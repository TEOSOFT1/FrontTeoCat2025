"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { Save, AlertTriangle } from "lucide-react"
import "../../Styles/AdminStyles/TiposServicios.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de tipos de servicios
 * Permite crear, ver, editar, activar/desactivar y eliminar tipos de servicios
 */
const TiposServicios = () => {
  // Estado para los tipos de servicios
  const [tiposServicios, setTiposServicios] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Tipo de Servicio")
  const [currentTipoServicio, setCurrentTipoServicio] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [tipoServicioToDelete, setTipoServicioToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener tipos de servicios
   */
  useEffect(() => {
    // Aquí se implementarán las llamadas a la API para obtener tipos de servicios
    setTiposServicios([])
  }, [])

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombre", header: "Nombre" },
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
   * Manejador para ver detalles de un tipo de servicio
   * @param {Object} tipoServicio - Objeto de tipo de servicio a visualizar
   */
  const handleView = (tipoServicio) => {
    setCurrentTipoServicio(tipoServicio)
    setModalTitle("Ver Detalles del Tipo de Servicio")

    // Cargar datos del tipo de servicio en el formulario
    setFormData({
      nombre: tipoServicio.nombre,
      descripcion: tipoServicio.descripcion,
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar un tipo de servicio
   * @param {Object} tipoServicio - Objeto de tipo de servicio a editar
   */
  const handleEdit = (tipoServicio) => {
    setCurrentTipoServicio(tipoServicio)
    setModalTitle("Editar Tipo de Servicio")

    // Cargar datos del tipo de servicio en el formulario
    setFormData({
      nombre: tipoServicio.nombre,
      descripcion: tipoServicio.descripcion,
    })

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de un tipo de servicio (Activo/Inactivo)
   * @param {Object} tipoServicio - Objeto de tipo de servicio a cambiar estado
   */
  const handleToggleStatus = (tipoServicio) => {
    // Cambiar el estado del tipo de servicio
    const updatedTiposServicios = tiposServicios.map((t) => {
      if (t.id === tipoServicio.id) {
        return {
          ...t,
          estado: t.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return t
    })

    setTiposServicios(updatedTiposServicios)

    // Añadir notificación
    const newStatus = tipoServicio.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El tipo de servicio "{tipoServicio.nombre}" ahora está {newStatus}.
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
   * Manejador para iniciar el proceso de eliminación de un tipo de servicio
   * @param {Object} tipoServicio - Objeto de tipo de servicio a eliminar
   */
  const handleDelete = (tipoServicio) => {
    setTipoServicioToDelete(tipoServicio)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación de un tipo de servicio
   */
  const confirmDelete = () => {
    if (tipoServicioToDelete) {
      const updatedTiposServicios = tiposServicios.filter((t) => t.id !== tipoServicioToDelete.id)
      setTiposServicios(updatedTiposServicios)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Tipo de servicio eliminado</strong>
          <p>El tipo de servicio "{tipoServicioToDelete.nombre}" ha sido eliminado correctamente.</p>
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
    setTipoServicioToDelete(null)
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setTipoServicioToDelete(null)
  }

  /**
   * Manejador para abrir el modal de agregar tipo de servicio
   */
  const handleAddTipoServicio = () => {
    setCurrentTipoServicio(null)
    setModalTitle("Agregar Tipo de Servicio")

    // Resetear el formulario
    setFormData({
      nombre: "",
      descripcion: "",
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
   * Manejador para guardar el tipo de servicio (crear nuevo o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveTipoServicio = () => {
    // Validaciones básicas
    if (!formData.nombre.trim()) {
      // Notificación de error
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, ingrese un nombre para el tipo de servicio.</p>
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

    if (currentTipoServicio) {
      // Actualizar tipo de servicio existente
      const updatedTiposServicios = tiposServicios.map((t) => {
        if (t.id === currentTipoServicio.id) {
          return {
            ...t,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
          }
        }
        return t
      })

      setTiposServicios(updatedTiposServicios)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Tipo de servicio actualizado</strong>
          <p>El tipo de servicio "{formData.nombre}" ha sido actualizado correctamente.</p>
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
      // Crear nuevo tipo de servicio
      const newTipoServicio = {
        id: Date.now(), // ID temporal, en una implementación real vendría del backend
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        estado: "Activo",
      }

      setTiposServicios([...tiposServicios, newTipoServicio])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Tipo de servicio creado</strong>
          <p>El tipo de servicio "{formData.nombre}" ha sido creado correctamente.</p>
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
    const modalElement = document.getElementById("tipoServicioModal")

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
    <div className="tipos-servicios-container">
      <h2 className="mb-4">Gestión de Tipos de Servicios</h2>

      <DataTable
        columns={columns}
        data={tiposServicios}
        onAdd={handleAddTipoServicio}
        addButtonLabel="Agregar Tipo de Servicio"
        searchPlaceholder="Buscar tipos de servicios..."
      />

      {/* Modal para Agregar/Editar/Ver Tipo de Servicio */}
      <div
        className="modal fade"
        id="tipoServicioModal"
        tabIndex="-1"
        aria-labelledby="tipoServicioModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="tipoServicioModalLabel">
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
              <form className="tipo-servicio-form">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre del Tipo de Servicio <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={modalTitle === "Ver Detalles del Tipo de Servicio"}
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
                    disabled={modalTitle === "Ver Detalles del Tipo de Servicio"}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cancelar
              </button>

              {modalTitle !== "Ver Detalles del Tipo de Servicio" && (
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleSaveTipoServicio}
                >
                  <Save size={18} className="me-1" />
                  Guardar Tipo de Servicio
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
                <p className="mb-0">¿Está seguro de eliminar el tipo de servicio "{tipoServicioToDelete?.nombre}"?</p>
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

export default TiposServicios

