"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { Save, AlertTriangle } from "lucide-react"
import "../../Styles/AdminStyles/Roles.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de roles y permisos
 * Permite crear, ver, editar, activar/desactivar y eliminar roles
 * Incluye una matriz de permisos para diferentes módulos del sistema
 */
const Roles = () => {
  // Estado para los roles
  const [roles, setRoles] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Rol")
  const [currentRole, setCurrentRole] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    nombre: "",
    permisos: {
      configuracion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      usuarios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      acceso: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      producto: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      proveedor: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      compras: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      clientes: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      citas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      servicios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      ventas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      devolucion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
    },
  })

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [roleToDelete, setRoleToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombre", header: "Nombre del Rol" },
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
   * Manejador para ver detalles de un rol
   */
  const handleView = (role) => {
    setCurrentRole(role)
    setModalTitle("Ver Detalles del Rol")

    // Cargar datos del rol en el formulario
    setFormData({
      nombre: role.nombre,
      permisos: role.permisos || {
        configuracion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        usuarios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        acceso: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        producto: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        proveedor: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        compras: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        clientes: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        citas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        servicios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        ventas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        devolucion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      },
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar un rol
   */
  const handleEdit = (role) => {
    setCurrentRole(role)
    setModalTitle("Editar Rol")

    // Cargar datos del rol en el formulario
    setFormData({
      nombre: role.nombre,
      permisos: role.permisos || {
        configuracion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        usuarios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        acceso: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        producto: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        proveedor: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        compras: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        clientes: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        citas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        servicios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        ventas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        devolucion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      },
    })

    setShowModal(true)
  }

  /**
   * Manejador para iniciar el proceso de eliminación
   */
  const handleDelete = (role) => {
    setRoleToDelete(role)
    setShowDeleteConfirm(true)
  }

  /**
   * Función para confirmar la eliminación
   */
  const confirmDelete = () => {
    if (roleToDelete) {
      const updatedRoles = roles.filter((r) => r.id !== roleToDelete.id)
      setRoles(updatedRoles)

      // Añadir notificación
      if (toastIds.current.delete) {
        toast.dismiss(toastIds.current.delete)
      }

      toastIds.current.delete = toast.info(
        <div>
          <strong>Rol eliminado</strong>
          <p>El rol "{roleToDelete?.nombre}" ha sido eliminado correctamente.</p>
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
    setRoleToDelete(null)
  }

  /**
   * Función para cancelar el proceso de eliminación
   */
  const cancelDelete = () => {
    setShowDeleteConfirm(false)
    setRoleToDelete(null)
  }

  /**
   * Manejador para cambiar el estado de un rol
   */
  const handleToggleStatus = (role) => {
    // Cambiar el estado del rol
    const updatedRoles = roles.map((r) => {
      if (r.id === role.id) {
        return {
          ...r,
          estado: r.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return r
    })

    setRoles(updatedRoles)

    // Añadir notificación
    const newStatus = role.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El rol "{role.nombre}" ahora está {newStatus}.
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
   * Manejador para abrir el modal de agregar rol
   */
  const handleAddRole = () => {
    setCurrentRole(null)
    setModalTitle("Agregar Rol")

    // Resetear el formulario
    setFormData({
      nombre: "",
      permisos: {
        configuracion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        usuarios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        acceso: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        producto: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        proveedor: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        compras: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        clientes: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        citas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        servicios: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        ventas: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
        devolucion: { crear: false, modificar: false, cambiarEstado: false, visualizar: false, eliminar: false },
      },
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
   * Manejador para cambios en el input de nombre
   */
  const handleNameChange = (e) => {
    setFormData({
      ...formData,
      nombre: e.target.value,
    })
  }

  /**
   * Manejador para cambios en los checkboxes de permisos
   */
  const handlePermissionChange = (module, permission) => {
    setFormData({
      ...formData,
      permisos: {
        ...formData.permisos,
        [module]: {
          ...formData.permisos[module],
          [permission]: !formData.permisos[module][permission],
        },
      },
    })
  }

  /**
   * Manejador para guardar el rol
   */
  const handleSaveRole = () => {
    if (!formData.nombre.trim()) {
      // Notificación de error
      if (toastIds.current.error) {
        toast.dismiss(toastIds.current.error)
      }

      toastIds.current.error = toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, ingrese un nombre para el rol.</p>
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

    if (currentRole) {
      // Actualizar rol existente
      const updatedRoles = roles.map((r) => {
        if (r.id === currentRole.id) {
          return {
            ...r,
            nombre: formData.nombre,
            permisos: formData.permisos,
          }
        }
        return r
      })

      setRoles(updatedRoles)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Rol actualizado</strong>
          <p>El rol "{formData.nombre}" ha sido actualizado correctamente.</p>
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
      // Crear nuevo rol
      const newRole = {
        id: Date.now(),
        nombre: formData.nombre,
        permisos: formData.permisos,
        estado: "Activo",
      }

      setRoles([...roles, newRole])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Rol creado</strong>
          <p>El rol "{formData.nombre}" ha sido creado correctamente.</p>
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
    const modalElement = document.getElementById("roleModal")

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
    <div className="roles-container">
      <h2 className="mb-4">Gestión de Roles</h2>

      <DataTable
        columns={columns}
        data={roles}
        onAdd={handleAddRole}
        addButtonLabel="Agregar Rol"
        searchPlaceholder="Buscar roles..."
      />

      {/* Modal para Agregar/Editar/Ver Rol */}
      <div className="modal fade" id="roleModal" tabIndex="-1" aria-labelledby="roleModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="roleModalLabel">
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
              <form>
                <div className="mb-4">
                  <label htmlFor="roleName" className="form-label">
                    Nombre del Rol
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="roleName"
                    value={formData.nombre}
                    onChange={handleNameChange}
                    disabled={modalTitle === "Ver Detalles del Rol"}
                  />
                </div>

                <div className="table-responsive">
                  <table className="table table-bordered permissions-table">
                    <thead className="table-light">
                      <tr>
                        <th>Módulo</th>
                        <th>Crear</th>
                        <th>Modificar</th>
                        <th>Cambiar Estado</th>
                        <th>Visualizar</th>
                        <th>Eliminar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(formData.permisos).map(([module, permissions]) => {
                        // Convertir nombre del módulo para mostrar (primera letra mayúscula)
                        const displayName = module.charAt(0).toUpperCase() + module.slice(1)

                        return (
                          <tr key={module}>
                            <td>{displayName}</td>
                            {Object.entries(permissions).map(([permission, value]) => (
                              <td key={`${module}-${permission}`} className="text-center">
                                <div className="form-check d-flex justify-content-center">
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    checked={value}
                                    onChange={() => handlePermissionChange(module, permission)}
                                    disabled={modalTitle === "Ver Detalles del Rol"}
                                    id={`${module}-${permission}`}
                                  />
                                </div>
                              </td>
                            ))}
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cancelar
              </button>

              {modalTitle !== "Ver Detalles del Rol" && (
                <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveRole}>
                  <Save size={18} className="me-1" />
                  Guardar Rol
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
                <p className="mb-0">¿Está seguro de eliminar el rol "{roleToDelete?.nombre}"?</p>
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

export default Roles

