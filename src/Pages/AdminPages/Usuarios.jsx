"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../Components/AdminComponents/DataTable"
import TableActions from "../../Components/AdminComponents/TableActions"
import { Save, Eye, EyeOff } from "lucide-react"
import "../../Styles/AdminStyles/Usuarios.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de usuarios
 * Permite visualizar, crear, editar y cambiar el estado de usuarios en el sistema
 */
const Usuarios = () => {
  // Estado para los usuarios
  const [usuarios, setUsuarios] = useState([])

  // Estado para los roles disponibles
  const [roles, setRoles] = useState([])

  // Estado para el modal
  const [showModal, setShowModal] = useState(false)
  const [modalTitle, setModalTitle] = useState("Agregar Usuario")
  const [currentUser, setCurrentUser] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    documento: "",
    correo: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
    foto: "",
    rol: "",
    contrasena: "",
    confirmarContrasena: "",
  })

  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Estado para el modal de confirmación de eliminación
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [userToDelete, setUserToDelete] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener usuarios y roles
   */
  useEffect(() => {
    // Aquí se implementará la carga de datos desde la API
  }, [])

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombre", header: "Nombre" },
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
          actions={["view", "edit", "toggleStatus"]}
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleToggleStatus}
        />
      ),
    },
  ]

  /**
   * Manejador para ver detalles de un usuario
   * @param {Object} user - Objeto de usuario a visualizar
   */
  const handleView = (user) => {
    setCurrentUser(user)
    setModalTitle("Ver Detalles del Usuario")

    // Separar nombre y apellido (asumiendo que vienen juntos en el campo nombre)
    const nombreCompleto = user.nombre.split(" ")
    const nombre = nombreCompleto[0]
    const apellido = nombreCompleto.slice(1).join(" ")

    // Cargar datos del usuario en el formulario
    setFormData({
      documento: user.documento,
      correo: user.correo,
      nombre: nombre,
      apellido: apellido,
      telefono: user.telefono,
      direccion: user.direccion,
      foto: user.foto || "",
      rol: user.rol,
      contrasena: "********", // Placeholder para contraseña
      confirmarContrasena: "********", // Placeholder para confirmar contraseña
    })

    setShowModal(true)
  }

  /**
   * Manejador para editar un usuario
   * @param {Object} user - Objeto de usuario a editar
   */
  const handleEdit = (user) => {
    setCurrentUser(user)
    setModalTitle("Editar Usuario")

    // Separar nombre y apellido (asumiendo que vienen juntos en el campo nombre)
    const nombreCompleto = user.nombre.split(" ")
    const nombre = nombreCompleto[0]
    const apellido = nombreCompleto.slice(1).join(" ")

    // Cargar datos del usuario en el formulario
    setFormData({
      documento: user.documento,
      correo: user.correo,
      nombre: nombre,
      apellido: apellido,
      telefono: user.telefono,
      direccion: user.direccion,
      foto: user.foto || "",
      rol: user.rol,
      contrasena: "", // Vacío para edición
      confirmarContrasena: "", // Vacío para edición
    })

    setShowModal(true)
  }

  /**
   * Manejador para cambiar el estado de un usuario (Activo/Inactivo)
   * @param {Object} user - Objeto de usuario a cambiar estado
   */
  const handleToggleStatus = (user) => {
    // Cambiar el estado del usuario
    const updatedUsers = usuarios.map((u) => {
      if (u.id === user.id) {
        return {
          ...u,
          estado: u.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return u
    })

    setUsuarios(updatedUsers)

    // Añadir notificación
    const newStatus = user.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El usuario "{user.nombre}" ahora está {newStatus}.
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
   * Manejador para abrir el modal de agregar usuario
   */
  const handleAddUser = () => {
    setCurrentUser(null)
    setModalTitle("Agregar Usuario")

    // Resetear el formulario
    setFormData({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      foto: "",
      rol: "",
      contrasena: "",
      confirmarContrasena: "",
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
   * Manejador para guardar el usuario (crear nuevo o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveUser = () => {
    // Validaciones básicas
    if (!formData.nombre.trim() || !formData.apellido.trim() || !formData.correo.trim() || !formData.documento.trim()) {
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

    // Validar contraseñas si es un nuevo usuario o si se está cambiando la contraseña
    if (!currentUser || (formData.contrasena && formData.contrasena !== "********")) {
      if (formData.contrasena.length < 6) {
        if (toastIds.current.error) {
          toast.dismiss(toastIds.current.error)
        }

        toastIds.current.error = toast.error(
          <div>
            <strong>Error</strong>
            <p>La contraseña debe tener al menos 6 caracteres.</p>
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

      if (formData.contrasena !== formData.confirmarContrasena) {
        if (toastIds.current.error) {
          toast.dismiss(toastIds.current.error)
        }

        toastIds.current.error = toast.error(
          <div>
            <strong>Error</strong>
            <p>Las contraseñas no coinciden.</p>
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

    // Crear nombre completo
    const nombreCompleto = `${formData.nombre} ${formData.apellido}`

    if (currentUser) {
      // Actualizar usuario existente
      const updatedUsers = usuarios.map((u) => {
        if (u.id === currentUser.id) {
          return {
            ...u,
            nombre: nombreCompleto,
            correo: formData.correo,
            documento: formData.documento,
            telefono: formData.telefono,
            direccion: formData.direccion,
            foto: formData.foto,
            rol: formData.rol,
            // La contraseña se actualizaría en un caso real si no está vacía
          }
        }
        return u
      })

      setUsuarios(updatedUsers)

      // Notificación de éxito para edición
      if (toastIds.current.edit) {
        toast.dismiss(toastIds.current.edit)
      }

      toastIds.current.edit = toast.success(
        <div>
          <strong>Usuario actualizado</strong>
          <p>El usuario "{nombreCompleto}" ha sido actualizado correctamente.</p>
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
      // Crear nuevo usuario
      const newUser = {
        id: Date.now(), // ID temporal
        nombre: nombreCompleto,
        correo: formData.correo,
        documento: formData.documento,
        telefono: formData.telefono,
        direccion: formData.direccion,
        foto: formData.foto,
        rol: formData.rol,
        estado: "Activo",
        // La contraseña se guardaría encriptada en un caso real
      }

      setUsuarios([...usuarios, newUser])

      // Notificación de éxito para creación
      if (toastIds.current.create) {
        toast.dismiss(toastIds.current.create)
      }

      toastIds.current.create = toast.success(
        <div>
          <strong>Usuario creado</strong>
          <p>El usuario "{nombreCompleto}" ha sido creado correctamente.</p>
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
    const modalElement = document.getElementById("userModal")

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
    <div className="usuarios-container">
      <h2 className="mb-4">Gestión de Usuarios</h2>

      <DataTable
        columns={columns}
        data={usuarios}
        onAdd={handleAddUser}
        addButtonLabel="Agregar Usuario"
        searchPlaceholder="Buscar usuarios..."
      />

      {/* Modal para Agregar/Editar/Ver Usuario */}
      <div className="modal fade" id="userModal" tabIndex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header bg-primary text-white">
              <h5 className="modal-title" id="userModalLabel">
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
              <form className="user-form">
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
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="correo" className="form-label">
                      Correo Electrónico <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="apellido" className="form-label">
                      Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
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
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                    />
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="foto" className="form-label">
                      Foto (URL)
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="foto"
                      name="foto"
                      value={formData.foto}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="rol" className="form-label">
                      Rol <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      id="rol"
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    >
                      <option value="">Seleccione un rol</option>
                      {roles.map((rol) => (
                        <option key={rol.id} value={rol.nombre}>
                          {rol.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="contrasena" className="form-label">
                      Contraseña {!currentUser && <span className="text-danger">*</span>}
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword ? "text" : "password"}
                        className="form-control"
                        id="contrasena"
                        name="contrasena"
                        value={formData.contrasena}
                        onChange={handleInputChange}
                        disabled={modalTitle === "Ver Detalles del Usuario"}
                        required={!currentUser}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        disabled={modalTitle === "Ver Detalles del Usuario"}
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    {currentUser && modalTitle !== "Ver Detalles del Usuario" && (
                      <small className="form-text text-muted">
                        Dejar en blanco para mantener la contraseña actual.
                      </small>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="confirmarContrasena" className="form-label">
                      Confirmar Contraseña {!currentUser && <span className="text-danger">*</span>}
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        className="form-control"
                        id="confirmarContrasena"
                        name="confirmarContrasena"
                        value={formData.confirmarContrasena}
                        onChange={handleInputChange}
                        disabled={modalTitle === "Ver Detalles del Usuario"}
                        required={!currentUser}
                      />
                      <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={modalTitle === "Ver Detalles del Usuario"}
                      >
                        {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={handleCloseModal}>
                Cancelar
              </button>

              {modalTitle !== "Ver Detalles del Usuario" && (
                <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveUser}>
                  <Save size={18} className="me-1" />
                  Guardar Usuario
                </button>
              )}
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

export default Usuarios

