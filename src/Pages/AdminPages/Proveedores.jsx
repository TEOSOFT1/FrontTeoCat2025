"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { Save, AlertTriangle } from "lucide-react"
import "../../Styles/AdminStyles/Proveedores.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de proveedores
 * Permite crear, ver, editar, activar/desactivar y eliminar proveedores
 */
const Proveedores = () => {
  // Estado para los proveedores
  const [proveedores, setProveedores] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Proveedor")
  const [currentProveedor, setCurrentProveedor] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    documento: "",
    correo: "",
    representante: "",
    contacto: "",
    telefono: "",
    direccion: "",
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [proveedorToDelete, setProveedorToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Definición de columnas para la tabla
  const columns = [
    { field: "representante", header: "Representante" },
    { field: "contacto", header: "Persona de Contacto" },
    { field: "documento", header: "Documento" },
    { field: "telefono", header: "Teléfono" },
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
        />
      ),
    },
  ]

  /**
   * Manejador para ver detalles de un proveedor
   */
  const handleView = (proveedor) => {
    setCurrentProveedor(proveedor)
    setModalTitle("Ver Detalles del Proveedor")

    // Cargar datos del proveedor en el formulario
    setFormData({
      documento: proveedor.documento,
      correo: proveedor.correo,
      representante: proveedor.representante,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar un proveedor
   */
  const handleEdit = (proveedor) => {
    setCurrentProveedor(proveedor)
    setModalTitle("Editar Proveedor")

    // Cargar datos del proveedor en el formulario
    setFormData({
      documento: proveedor.documento,
      correo: proveedor.correo,
      representante: proveedor.representante,
      contacto: proveedor.contacto,
      telefono: proveedor.telefono,
      direccion: proveedor.direccion,
    })

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de un proveedor
   */
  const handleToggleStatus = (proveedor) => {
    // Cambiar el estado del proveedor
    const updatedProveedores = proveedores.map((p) => {
      if (p.id === proveedor.id) {
        return {
          ...p,
          estado: p.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return p
    })

    setProveedores(updatedProveedores)

    // Añadir notificación
    const newStatus = proveedor.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El proveedor "{proveedor.representante}" ahora está {newStatus}.
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
   * Manejador para iniciar el proceso de eliminación
   */
  const handleDelete = (proveedor) => {
    setProveedorToDelete(proveedor)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación
   */
  const confirmDelete = () => {
    if (proveedorToDelete) {
      const updatedProveedores = proveedores.filter((p) => p.id !== proveedorToDelete.id)
      setProveedores(updatedProveedores)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Proveedor eliminado</strong>
          <p>El proveedor "{proveedorToDelete.representante}" ha sido eliminado correctamente.</p>
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
    setProveedorToDelete(null)
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setProveedorToDelete(null)
  }

  /**
   * Manejador para abrir el modal de agregar proveedor
   */
  const handleAddProveedor = () => {
    setCurrentProveedor(null)
    setModalTitle("Agregar Proveedor")

    // Resetear el formulario
    setFormData({
      documento: "",
      correo: "",
      representante: "",
      contacto: "",
      telefono: "",
      direccion: "",
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
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  /**
   * Manejador para guardar el proveedor
   */
  const handleSaveProveedor = () => {
    // Validaciones básicas
    if (
      !formData.representante.trim() ||
      !formData.contacto.trim() ||
      !formData.documento.trim() ||
      !formData.telefono.trim()
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

    // Validar formato de correo
    if (formData.correo) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.correo)) {
        if (toastIds.current.error) {
          toast.dismiss(toastIds.current.error)
        }

        toastIds.current.error = toast.error(
          <div>
            <strong>Error</strong>
            <p>Por favor, ingrese un correo electrónico válido.</p>
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
    }

    if (currentProveedor) {
      // Actualizar proveedor existente
      const updatedProveedores = proveedores.map((p) => {
        if (p.id === currentProveedor.id) {
          return {
            ...p,
            representante: formData.representante,
            contacto: formData.contacto,
            correo: formData.correo,
            documento: formData.documento,
            direccion: formData.direccion,
            telefono: formData.telefono,
          }
        }
        return p
      })

      setProveedores(updatedProveedores)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Proveedor actualizado</strong>
          <p>El proveedor "{formData.representante}" ha sido actualizado correctamente.</p>
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
      // Crear nuevo proveedor
      const newProveedor = {
        id: Date.now(),
        representante: formData.representante,
        contacto: formData.contacto,
        correo: formData.correo,
        documento: formData.documento,
        direccion: formData.direccion,
        telefono: formData.telefono,
        estado: "Activo",
      }

      setProveedores([...proveedores, newProveedor])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Proveedor creado</strong>
          <p>El proveedor "{formData.representante}" ha sido creado correctamente.</p>
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
    const modalElement = document.getElementById("proveedorModal")

    if (showModal) {
      import("bootstrap").then((bootstrap) => {
        modalInstance = new bootstrap.Modal(modalElement)
        modalInstance.show()
      })
    } else {
      if (modalElement && modalElement.classList.contains("show")) {
        import("bootstrap").then((bootstrap) => {
          modalInstance = bootstrap.Modal.getInstance(modalElement)
          if (modalInstance) {
            modalInstance.hide()
          }
        })
      }
    }

    const handleHidden = () => {
      setShowModal(false)
    }

    modalElement?.addEventListener("hidden.bs.modal", handleHidden)

    return () => {
      modalElement?.removeEventListener("hidden.bs.modal", handleHidden)
    }
  }, [showModal])

  return (
    <div className="proveedores-container">
      <h2 className="mb-4">Gestión de Proveedores</h2>

      <DataTable
        columns={columns}
        data={proveedores}
        onAdd={handleAddProveedor}
        addButtonLabel="Agregar Proveedor"
        searchPlaceholder="Buscar proveedores..."
      />

      {/* Modal para Agregar/Editar/Ver Proveedor */}
      <div
        className="modal fade"
        id="proveedorModal"
        tabIndex="-1"
        aria-labelledby="proveedorModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="proveedorModalLabel">
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
              <form className="proveedor-form">
                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="documento" className="form-label">
                      Documento <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="documento"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Proveedor"}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="correo" className="form-label">
                      Correo Electrónico
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Proveedor"}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="representante" className="form-label">
                      Nombre (Representante) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="representante"
                      name="representante"
                      value={formData.representante}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Proveedor"}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="contacto" className="form-label">
                      Persona de Contacto <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contacto"
                      name="contacto"
                      value={formData.contacto}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Proveedor"}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Proveedor"}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="direccion" className="form-label">
                      Dirección
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Proveedor"}
                    />
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cancelar
              </button>

              {modalTitle !== "Ver Detalles del Proveedor" && (
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleSaveProveedor}
                >
                  <Save size={18} className="me-1" />
                  Guardar Proveedor
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
                <p className="mb-0">¿Está seguro de eliminar el proveedor "{proveedorToDelete?.representante}"?</p>
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

export default Proveedores

