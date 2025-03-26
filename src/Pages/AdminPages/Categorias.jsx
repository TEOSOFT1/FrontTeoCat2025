"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { Save, AlertTriangle } from "lucide-react"
import "../../Styles/AdminStyles/Categorias.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de categorías de productos
 * Permite crear, ver, editar, activar/desactivar y eliminar categorías
 */
const CategoriasProducto = () => {
  // Estado para las categorías
  const [categorias, setCategorias] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Categoría")
  const [currentCategoria, setCurrentCategoria] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [categoriaToDelete, setCategoriaToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

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
        />
      ),
    },
  ]

  /**
   * Manejador para ver detalles de una categoría
   */
  const handleView = (categoria) => {
    setCurrentCategoria(categoria)
    setModalTitle("Ver Detalles de la Categoría")

    // Cargar datos de la categoría en el formulario
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar una categoría
   */
  const handleEdit = (categoria) => {
    setCurrentCategoria(categoria)
    setModalTitle("Editar Categoría")

    // Cargar datos de la categoría en el formulario
    setFormData({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion,
    })

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de una categoría
   */
  const handleToggleStatus = (categoria) => {
    // Cambiar el estado de la categoría
    const updatedCategorias = categorias.map((c) => {
      if (c.id === categoria.id) {
        return {
          ...c,
          estado: c.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return c
    })

    setCategorias(updatedCategorias)

    // Añadir notificación
    const newStatus = categoria.estado === "Activo" ? "inactiva" : "activa"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          La categoría "{categoria.nombre}" ahora está {newStatus}.
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
  const handleDelete = (categoria) => {
    setCategoriaToDelete(categoria)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación
   */
  const confirmDelete = () => {
    if (categoriaToDelete) {
      const updatedCategorias = categorias.filter((c) => c.id !== categoriaToDelete.id)
      setCategorias(updatedCategorias)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Categoría eliminada</strong>
          <p>La categoría "{categoriaToDelete.nombre}" ha sido eliminada correctamente.</p>
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
    setCategoriaToDelete(null)
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setCategoriaToDelete(null)
  }

  /**
   * Manejador para abrir el modal de agregar categoría
   */
  const handleAddCategoria = () => {
    setCurrentCategoria(null)
    setModalTitle("Agregar Categoría")

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
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  /**
   * Manejador para guardar la categoría
   */
  const handleSaveCategoria = () => {
    // Validaciones básicas
    if (!formData.nombre.trim()) {
      // Notificación de error
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, ingrese un nombre para la categoría.</p>
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

    if (currentCategoria) {
      // Actualizar categoría existente
      const updatedCategorias = categorias.map((c) => {
        if (c.id === currentCategoria.id) {
          return {
            ...c,
            nombre: formData.nombre,
            descripcion: formData.descripcion,
          }
        }
        return c
      })

      setCategorias(updatedCategorias)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Categoría actualizada</strong>
          <p>La categoría "{formData.nombre}" ha sido actualizada correctamente.</p>
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
      // Crear nueva categoría
      const newCategoria = {
        id: Date.now(),
        nombre: formData.nombre,
        descripcion: formData.descripcion,
        estado: "Activo",
      }

      setCategorias([...categorias, newCategoria])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Categoría creada</strong>
          <p>La categoría "{formData.nombre}" ha sido creada correctamente.</p>
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
    handleCloseModal()
  }

  /**
   * Efecto para inicializar el modal de Bootstrap
   */
  useEffect(() => {
    let modalInstance = null
    const modalElement = document.getElementById("categoriaModal")

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
    <div className="categorias-container">
      <h2 className="mb-4">Gestión de Categorías de Producto</h2>

      <DataTable
        columns={columns}
        data={categorias}
        onAdd={handleAddCategoria}
        addButtonLabel="Agregar Categoría"
        searchPlaceholder="Buscar categorías..."
      />

      {/* Modal para Agregar/Editar/Ver Categoría */}
      <div
        className="modal fade"
        id="categoriaModal"
        tabIndex="-1"
        aria-labelledby="categoriaModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="categoriaModalLabel">
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
              <form className="categoria-form">
                <div className="mb-3">
                  <label htmlFor="nombre" className="form-label">
                    Nombre de la Categoría <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    disabled={modalTitle === "Ver Detalles de la Categoría"}
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
                    disabled={modalTitle === "Ver Detalles de la Categoría"}
                  ></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cancelar
              </button>

              {modalTitle !== "Ver Detalles de la Categoría" && (
                <button
                  type="button"
                  className="btn btn-primary d-flex align-items-center"
                  onClick={handleSaveCategoria}
                >
                  <Save size={18} className="me-1" />
                  Guardar Categoría
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
                <p className="mb-0">¿Está seguro de eliminar la categoría "{categoriaToDelete?.nombre}"?</p>
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

export default CategoriasProducto

