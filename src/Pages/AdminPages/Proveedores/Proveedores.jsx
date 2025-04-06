"use client"

import { useState, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import "../../../Styles/AdminStyles/Proveedores.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import ProveedorForm from "../../../Components/AdminComponents/ProveedoresComponents/ProveedorForm"
import DeleteConfirmModal from "../../../Components/AdminComponents/ProveedoresComponents/DeleteConfirmModal"

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

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
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

    // Limpiar errores
    setFormErrors({
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

    // Limpiar errores
    setFormErrors({
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
    // Verificar si el proveedor tiene productos asociados
    // En una implementación real, esto se verificaría con una llamada a la API
    const tieneProductosAsociados = false // Simulación

    if (tieneProductosAsociados) {
      toast.error(
        <div>
          <strong>No se puede eliminar</strong>
          <p>Este proveedor tiene productos asociados. Desactívelo en lugar de eliminarlo.</p>
        </div>,
        {
          position: "top-right",
          autoClose: 4000,
        },
      )
      return
    }

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

    // Limpiar errores
    setFormErrors({
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

    // Limpiar el error específico cuando el usuario comienza a escribir
    setFormErrors({
      ...formErrors,
      [name]: "",
    })
  }

  /**
   * Función para validar el formulario
   * @returns {boolean} - True si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    let isValid = true
    const errors = {
      documento: "",
      correo: "",
      representante: "",
      contacto: "",
      telefono: "",
      direccion: "",
    }

    // Validar representante (requerido)
    if (!formData.representante.trim()) {
      errors.representante = "El nombre del representante es obligatorio"
      isValid = false
    } else if (formData.representante.trim().length > 100) {
      errors.representante = "El nombre no puede exceder los 100 caracteres"
      isValid = false
    }

    // Validar contacto (requerido)
    if (!formData.contacto.trim()) {
      errors.contacto = "La persona de contacto es obligatoria"
      isValid = false
    } else if (formData.contacto.trim().length > 100) {
      errors.contacto = "El nombre no puede exceder los 100 caracteres"
      isValid = false
    }

    // Validar documento (requerido y formato)
    if (!formData.documento.trim()) {
      errors.documento = "El documento es obligatorio"
      isValid = false
    } else {
      // Validar formato de documento (NIT/RUT)
      const documentoRegex = /^[0-9]{6,12}(-[0-9kK])?$/
      if (!documentoRegex.test(formData.documento.trim())) {
        errors.documento = "El documento debe tener un formato válido (ej: 900123456-7)"
        isValid = false
      } else {
        // Verificar si el documento ya existe (excepto para el proveedor actual en edición)
        const documentoExiste = proveedores.some(
          (p) =>
            p.documento.toLowerCase() === formData.documento.trim().toLowerCase() &&
            (!currentProveedor || p.id !== currentProveedor.id),
        )

        if (documentoExiste) {
          errors.documento = "Ya existe un proveedor con este documento"
          isValid = false
        }
      }
    }

    // Validar teléfono (requerido y formato)
    if (!formData.telefono.trim()) {
      errors.telefono = "El teléfono es obligatorio"
      isValid = false
    } else {
      // Validar formato de teléfono (7-10 dígitos)
      const telefonoRegex = /^[0-9]{7,10}$/
      if (!telefonoRegex.test(formData.telefono.replace(/\s+/g, ""))) {
        errors.telefono = "El teléfono debe tener entre 7 y 10 dígitos"
        isValid = false
      }
    }

    // Validar correo (opcional pero con formato)
    if (formData.correo.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.correo.trim())) {
        errors.correo = "El correo electrónico no tiene un formato válido"
        isValid = false
      }
    }

    // Validar dirección (opcional pero con longitud máxima)
    if (formData.direccion.trim() && formData.direccion.trim().length > 200) {
      errors.direccion = "La dirección no puede exceder los 200 caracteres"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar el proveedor
   */
  const handleSaveProveedor = () => {
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

      // Hacer scroll al primer error
      const firstErrorField = Object.keys(formErrors).find((key) => formErrors[key])
      if (firstErrorField) {
        const element = document.getElementById(firstErrorField)
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" })
          element.focus()
        }
      }

      return
    }

    if (currentProveedor) {
      // Actualizar proveedor existente
      const updatedProveedores = proveedores.map((p) => {
        if (p.id === currentProveedor.id) {
          return {
            ...p,
            representante: formData.representante.trim(),
            contacto: formData.contacto.trim(),
            correo: formData.correo.trim(),
            documento: formData.documento.trim(),
            direccion: formData.direccion.trim(),
            telefono: formData.telefono.trim(),
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
        representante: formData.representante.trim(),
        contacto: formData.contacto.trim(),
        correo: formData.correo.trim(),
        documento: formData.documento.trim(),
        direccion: formData.direccion.trim(),
        telefono: formData.telefono.trim(),
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
      <ProveedorForm
        showModal={showModal}
        modalTitle={modalTitle}
        formData={formData}
        formErrors={formErrors}
        onInputChange={handleInputChange}
        onSave={handleSaveProveedor}
        onClose={handleCloseModal}
      />

      {/* Modal de confirmación para eliminar */}
      <DeleteConfirmModal
        show={showDeleteConfirm}
        proveedor={proveedorToDelete}
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

export default Proveedores

