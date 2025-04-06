"use client"

import { useState, useEffect, useRef } from "react"
import DataTable from "../../../Components/AdminComponents/DataTable"
import TableActions from "../../../Components/AdminComponents/TableActions"
import "../../../Styles/AdminStyles/Usuarios.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import UserForm from "../../../Components/AdminComponents/UsuariosComponents/UserForm"
import StatusConfirmModal from "../../../Components/AdminComponents/UsuariosComponents/StatusConfirmModal"

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
        (user) => user.documento === formData.documento && (!currentUser || user.id !== currentUser.id),
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
          (user) => user.correo === formData.correo && (!currentUser || user.id !== currentUser.id),
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
      <UserForm
        showModal={showModal}
        modalTitle={modalTitle}
        formData={formData}
        formErrors={formErrors}
        roles={roles}
        currentUser={currentUser}
        onInputChange={handleInputChange}
        onSave={handleSaveUser}
        onClose={handleCloseModal}
      />

      {/* Modal de confirmación para cambio de estado */}
      <StatusConfirmModal
        show={showStatusConfirm}
        user={userToToggle}
        onConfirm={handleToggleStatus}
        onCancel={handleCancelToggleStatus}
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

export default Usuarios

