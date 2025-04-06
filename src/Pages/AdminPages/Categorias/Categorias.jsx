"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import "../../../Styles/AdminStyles/Categorias.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import CategoryForm from "../../../Components/AdminComponents/CategoriasComponents/CategoryForm"
import DeleteConfirmModal from "../../../Components/AdminComponents/CategoriasComponents/DeleteConfirmModal"

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

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
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
      descripcion: categoria.descripcion || "",
    })

    // Resetear errores
    setFormErrors({
      nombre: "",
      descripcion: "",
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
      descripcion: categoria.descripcion || "",
    })

    // Resetear errores
    setFormErrors({
      nombre: "",
      descripcion: "",
    })

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de una categoría
   */
  const handleToggleStatus = (categoria) => {
    // Verificar si hay productos asociados a esta categoría antes de desactivarla
    if (categoria.estado === "Activo" && hasAssociatedProducts(categoria.id)) {
      // Mostrar notificación de error
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>No se puede desactivar la categoría "{categoria.nombre}" porque tiene productos asociados.</p>
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
   * Función para verificar si una categoría tiene productos asociados
   * En un caso real, esto sería una consulta a la base de datos
   */
  const hasAssociatedProducts = (categoriaId) => {
    // Simulación: Aquí se implementaría la lógica real para verificar
    // si hay productos asociados a esta categoría en la base de datos
    return false // Por ahora, siempre retorna false para permitir la desactivación
  }

  /**
   * Manejador para iniciar el proceso de eliminación
   */
  const handleDelete = (categoria) => {
    // Verificar si hay productos asociados a esta categoría
    if (hasAssociatedProducts(categoria.id)) {
      // Mostrar notificación de error
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>No se puede eliminar la categoría "{categoria.nombre}" porque tiene productos asociados.</p>
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

    // Resetear errores
    setFormErrors({
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

    // Limpiar el error específico cuando el usuario comienza a escribir
    setFormErrors({
      ...formErrors,
      [name]: "",
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
    }

    // Validar nombre (requerido y longitud)
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre de la categoría es obligatorio"
      isValid = false
    } else if (formData.nombre.trim().length > 50) {
      errors.nombre = "El nombre no puede exceder los 50 caracteres"
      isValid = false
    } else {
      // Verificar si el nombre ya existe (excepto para la categoría actual en edición)
      const nombreExiste = categorias.some(
        (cat) =>
          cat.nombre.toLowerCase() === formData.nombre.trim().toLowerCase() &&
          (!currentCategoria || cat.id !== currentCategoria.id),
      )
      if (nombreExiste) {
        errors.nombre = "Ya existe una categoría con este nombre"
        isValid = false
      }
    }

    // Validar descripción (opcional pero con longitud máxima)
    if (formData.descripcion && formData.descripcion.length > 255) {
      errors.descripcion = "La descripción no puede exceder los 255 caracteres"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar la categoría
   */
  const handleSaveCategoria = () => {
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

    if (currentCategoria) {
      // Actualizar categoría existente
      const updatedCategorias = categorias.map((c) => {
        if (c.id === currentCategoria.id) {
          return {
            ...c,
            nombre: formData.nombre.trim(),
            descripcion: formData.descripcion.trim(),
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
          <p>La categoría "{formData.nombre.trim()}" ha sido actualizada correctamente.</p>
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
        nombre: formData.nombre.trim(),
        descripcion: formData.descripcion.trim(),
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
          <p>La categoría "{formData.nombre.trim()}" ha sido creada correctamente.</p>
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
      <CategoryForm
        showModal={showModal}
        modalTitle={modalTitle}
        formData={formData}
        formErrors={formErrors}
        onInputChange={handleInputChange}
        onSave={handleSaveCategoria}
        onClose={handleCloseModal}
      />

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        categoria={categoriaToDelete}
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

export default CategoriasProducto

