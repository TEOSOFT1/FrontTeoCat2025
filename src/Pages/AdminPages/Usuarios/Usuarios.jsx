"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import { Save, Eye, EyeOff, AlertTriangle } from 'lucide-react'
import "../../../Styles/AdminStyles/Usuarios.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"

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

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    documento: "",
    correo: "",
    nombre: "",
    apellido: "",
    telefono: "",
    direccion: "",
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

  // Estado para el modal de confirmación de cambio de estado
  const [showStatusConfirm, setShowStatusConfirm] = useState(false)
  const [userToToggle, setUserToToggle] = useState(null)

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener usuarios y roles
   */
  useEffect(() => {
    // Aquí se implementará la carga de datos desde la API
    // Por ahora, usamos datos de ejemplo para roles
    setRoles([
      { id: 1, nombre: "Administrador" },
      { id: 2, nombre: "Vendedor" },
      { id: 3, nombre: "Inventario" },
    ])
  }, [])

  // Definición de columnas para la tabla
  const columns = [
    { field: "nombre", header: "Nombre" },
    { field: "correo", header: "Correo" },
    { field: "documento", header: "Documento" },
    {
      field: "rol",
      header: "Rol",
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
          actions={["view", "edit", "toggleStatus"]}
          row={row}
          onView={handleView}
          onEdit={handleEdit}
          onToggleStatus={handleConfirmToggleStatus}
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

    // Resetear errores
    setFormErrors({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      rol: "",
      contrasena: "",
      confirmarContrasena: "",
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

    // Resetear errores
    setFormErrors({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      rol: "",
      contrasena: "",
      confirmarContrasena: "",
    })

    setShowModal(true)
  }

  /**
   * Manejador para confirmar el cambio de estado de un usuario
   * @param {Object} user - Objeto de usuario a cambiar estado
   */
  const handleConfirmToggleStatus = (user) => {
    setUserToToggle(user)
    setShowStatusConfirm(true)
  }

  /**
   * Manejador para cambiar el estado de un usuario (Activo/Inactivo)
   */
  const handleToggleStatus = () => {
    if (!userToToggle) return

    // Cambiar el estado del usuario
    const updatedUsers = usuarios.map((u) => {
      if (u.id === userToToggle.id) {
        return {
          ...u,
          estado: u.estado === "Activo" ? "Inactivo" : "Activo",
        }
      }
      return u
    })

    setUsuarios(updatedUsers)

    // Añadir notificación
    const newStatus = userToToggle.estado === "Activo" ? "inactivo" : "activo"

    // Descartar notificación anterior si existe
    if (toastIds.current.status) {
      toast.dismiss(toastIds.current.status)
    }

    toastIds.current.status = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          El usuario "{userToToggle.nombre}" ahora está {newStatus}.
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

    // Cerrar el modal de confirmación
    setShowStatusConfirm(false)
    setUserToToggle(null)
  }

  /**
   * Manejador para cancelar el cambio de estado
   */
  const handleCancelToggleStatus = () => {
    setShowStatusConfirm(false)
    setUserToToggle(null)
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

    // Resetear errores
    setFormErrors({
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
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
    const { name, value, type, files } = e.target

    // Si es un input de tipo file, guardar el archivo
    if (type === "file") {
      if (files && files[0]) {
        setFormData({
          ...formData,
          [name]: files[0],
        })
      }
    } else {
      // Para otros tipos de input, guardar el valor
      setFormData({
        ...formData,
        [name]: value,
      })
    }

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
      documento: "",
      correo: "",
      nombre: "",
      apellido: "",
      telefono: "",
      direccion: "",
      rol: "",
      contrasena: "",
      confirmarContrasena: "",
    }

    // Validar documento (requerido y formato)
    if (!formData.documento.trim()) {
      errors.documento = "El documento es obligatorio"
      isValid = false
    } else if (!/^\d{7,12}$/.test(formData.documento)) {
      errors.documento = "El documento debe tener entre 7 y 12 dígitos"
      isValid = false
    } else {
      // Verificar si el documento ya existe (excepto para el usuario actual en edición)
      const documentoExiste = usuarios.some(
        (user) => user.documento === formData.documento && (!currentUser || user.id !== currentUser.id)
      )
      if (documentoExiste) {
        errors.documento = "Este documento ya está registrado"
        isValid = false
      }
    }

    // Validar correo (requerido y formato)
    if (!formData.correo.trim()) {
      errors.correo = "El correo es obligatorio"
      isValid = false
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(formData.correo)) {
        errors.correo = "Formato de correo inválido"
        isValid = false
      } else {
        // Verificar si el correo ya existe (excepto para el usuario actual en edición)
        const correoExiste = usuarios.some(
          (user) => user.correo === formData.correo && (!currentUser || user.id !== currentUser.id)
        )
        if (correoExiste) {
          errors.correo = "Este correo ya está registrado"
          isValid = false
        }
      }
    }

    // Validar nombre (requerido)
    if (!formData.nombre.trim()) {
      errors.nombre = "El nombre es obligatorio"
      isValid = false
    }

    // Validar apellido (requerido)
    if (!formData.apellido.trim()) {
      errors.apellido = "El apellido es obligatorio"
      isValid = false
    }

    // Validar teléfono (formato)
    if (formData.telefono.trim() && !/^\d{7,10}$/.test(formData.telefono)) {
      errors.telefono = "El teléfono debe tener entre 7 y 10 dígitos"
      isValid = false
    }

    // Validar dirección (requerido)
    if (!formData.direccion.trim()) {
      errors.direccion = "La dirección es obligatoria"
      isValid = false
    }

    // Validar rol (requerido)
    if (!formData.rol) {
      errors.rol = "Debe seleccionar un rol"
      isValid = false
    }

    // Validar contraseña (requerida para nuevos usuarios, opcional para edición)
    if (!currentUser) {
      // Nuevo usuario - contraseña requerida
      if (!formData.contrasena) {
        errors.contrasena = "La contraseña es obligatoria"
        isValid = false
      } else if (formData.contrasena.length < 6) {
        errors.contrasena = "La contraseña debe tener al menos 6 caracteres"
        isValid = false
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.contrasena)) {
        errors.contrasena =
          "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial"
        isValid = false
      }

      // Confirmar contraseña
      if (!formData.confirmarContrasena) {
        errors.confirmarContrasena = "Debe confirmar la contraseña"
        isValid = false
      } else if (formData.contrasena !== formData.confirmarContrasena) {
        errors.confirmarContrasena = "Las contraseñas no coinciden"
        isValid = false
      }
    } else if (formData.contrasena && formData.contrasena !== "********") {
      // Usuario existente - contraseña opcional pero debe cumplir requisitos si se proporciona
      if (formData.contrasena.length < 6) {
        errors.contrasena = "La contraseña debe tener al menos 6 caracteres"
        isValid = false
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/.test(formData.contrasena)) {
        errors.contrasena =
          "La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial"
        isValid = false
      }

      // Confirmar contraseña si se está cambiando
      if (!formData.confirmarContrasena) {
        errors.confirmarContrasena = "Debe confirmar la contraseña"
        isValid = false
      } else if (formData.contrasena !== formData.confirmarContrasena) {
        errors.confirmarContrasena = "Las contraseñas no coinciden"
        isValid = false
      }
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar el usuario (crear nuevo o actualizar existente)
   * Valida los datos y envía la información
   */
  const handleSaveUser = () => {
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

    // Crear nombre completo
    const nombreCompleto = `${formData.nombre} ${formData.apellido}`

    // Procesar la foto si es un archivo
    let fotoUrl = formData.foto
    if (formData.foto && typeof formData.foto === "object") {
      // En un caso real, aquí se subiría el archivo a un servidor o servicio de almacenamiento
      // y se obtendría la URL. Para este ejemplo, creamos una URL temporal
      fotoUrl = URL.createObjectURL(formData.foto)

      // Nota: En una implementación real, aquí se enviaría el archivo a un servidor
      // y se usaría la URL devuelta por el servidor
      console.log("Archivo a subir:", formData.foto.name)
    }

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
            foto: fotoUrl, // Usar la URL procesada
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
        foto: fotoUrl, // Usar la URL procesada
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
                      className={`form-control ${formErrors.documento ? "is-invalid" : ""}`}
                      id="documento"
                      name="documento"
                      value={formData.documento}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                    {formErrors.documento && <div className="invalid-feedback">{formErrors.documento}</div>}
                    <small className="form-text text-muted">Ingrese entre 7 y 12 dígitos sin puntos ni espacios.</small>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="correo" className="form-label">
                      Correo Electrónico <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${formErrors.correo ? "is-invalid" : ""}`}
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                    {formErrors.correo && <div className="invalid-feedback">{formErrors.correo}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="nombre" className="form-label">
                      Nombre <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.nombre ? "is-invalid" : ""}`}
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                    {formErrors.nombre && <div className="invalid-feedback">{formErrors.nombre}</div>}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="apellido" className="form-label">
                      Apellido <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.apellido ? "is-invalid" : ""}`}
                      id="apellido"
                      name="apellido"
                      value={formData.apellido}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                    {formErrors.apellido && <div className="invalid-feedback">{formErrors.apellido}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="telefono" className="form-label">
                      Teléfono <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${formErrors.telefono ? "is-invalid" : ""}`}
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                    {formErrors.telefono && <div className="invalid-feedback">{formErrors.telefono}</div>}
                    <small className="form-text text-muted">Ingrese entre 7 y 10 dígitos sin espacios.</small>
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="direccion" className="form-label">
                      Dirección <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${formErrors.direccion ? "is-invalid" : ""}`}
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      required
                    />
                    {formErrors.direccion && <div className="invalid-feedback">{formErrors.direccion}</div>}
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <label htmlFor="foto" className="form-label">
                      Foto
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="foto"
                      name="foto"
                      onChange={(e) => {
                        // Handle file upload
                        const file = e.target.files[0]
                        if (file) {
                          setFormData({
                            ...formData,
                            foto: file,
                          })
                        }
                      }}
                      disabled={modalTitle === "Ver Detalles del Usuario"}
                      accept="image/*"
                    />
                    {formData.foto && typeof formData.foto === "object" && (
                      <small className="form-text text-success">Archivo seleccionado: {formData.foto.name}</small>
                    )}
                    {formData.foto && typeof formData.foto === "string" && formData.foto.trim() !== "" && (
                      <div className="mt-2">
                        <img
                          src={formData.foto || "/placeholder.svg"}
                          alt="Vista previa"
                          style={{ maxWidth: "100%", maxHeight: "100px" }}
                          className="img-thumbnail"
                        />
                      </div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="rol" className="form-label">
                      Rol <span className="text-danger">*</span>
                    </label>
                    <select
                      className={`form-select ${formErrors.rol ? "is-invalid" : ""}`}
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
                    {formErrors.rol && <div className="invalid-feedback">{formErrors.rol}</div>}
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
                        className={`form-control ${formErrors.contrasena ? "is-invalid" : ""}`}
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
                    {formErrors.contrasena && <div className="invalid-feedback">{formErrors.contrasena}</div>}
                    {currentUser && modalTitle !== "Ver Detalles del Usuario" && (
                      <small className="form-text text-muted">
                        Dejar en blanco para mantener la contraseña actual.
                      </small>
                    )}
                    {!currentUser && (
                      <small className="form-text text-muted">
                        La contraseña debe tener al menos 6 caracteres, una mayúscula, una minúscula, un número y un carácter especial.
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
                        className={`form-control ${formErrors.confirmarContrasena ? "is-invalid" : ""}`}
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
                    {formErrors.confirmarContrasena && (
                      <div className="invalid-feedback">{formErrors.confirmarContrasena}</div>
                    )}
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

      {/* Modal de confirmación para cambio de estado */}
      {showStatusConfirm && <div className="modal-backdrop show"></div>}
      <div className={`modal fade ${showStatusConfirm ? "show d-block" : ""}`} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-warning text-white">
              <h5 className="modal-title">Confirmar cambio de estado</h5>
              <button type="button" className="btn-close btn-close-white" onClick={handleCancelToggleStatus}></button>
            </div>
            <div className="modal-body">
              <div className="d-flex align-items-center">
                <AlertTriangle size={24} className="text-warning me-3" />
                <p className="mb-0">
                  ¿Está seguro de {userToToggle?.estado === "Activo" ? "desactivar" : "activar"} al usuario "
                  {userToToggle?.nombre}"?
                </p>
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCancelToggleStatus}>
                Cancelar
              </button>
              <button
                type="button"
                className={`btn ${userToToggle?.estado === "Activo" ? "btn-danger" : "btn-success"}`}
                onClick={handleToggleStatus}
              >
                {userToToggle?.estado === "Activo" ? "Desactivar" : "Activar"}
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

export default Usuarios