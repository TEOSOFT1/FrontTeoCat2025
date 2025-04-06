"use client"

import { useState, useRef } from "react"
import { FiUser, FiSave, FiX } from "react-icons/fi"
import ProfileImageSection from "../../../Components/AdminComponents/PerfilDeUsuarioComponents/ProfileImageSection"
import PersonalInfoSection from "../../../Components/AdminComponents/PerfilDeUsuarioComponents/PersonalInfoSection"
import PasswordSection from "../../../Components/AdminComponents/PerfilDeUsuarioComponents/PasswordSection"

/**
 * Componente principal de perfil de usuario
 * Permite visualizar y editar la información del perfil
 */
const UserProfile = () => {
  const fileInputRef = useRef(null)

  // Estado inicial del usuario
  const [userData, setUserData] = useState({
    nombre: "Tatiana",
    apellido: "Duque",
    telefono: "3001234567",
    direccion: "Calle 123 #45-67, Medellín",
    documento: "1098765432",
    passwordOld: "",
    passwordNew: "",
    passwordConfirm: "",
    profileImage: "/placeholder.svg?height=200&width=200", // Imagen por defecto
  })

  // Estado para controlar qué campos están en modo edición
  const [editMode, setEditMode] = useState({
    nombre: false,
    apellido: false,
    telefono: false,
    direccion: false,
    password: false,
    profileImage: false,
  })

  // Estado para mensajes de validación
  const [validation, setValidation] = useState({
    passwordOld: "",
    passwordNew: "",
    passwordConfirm: "",
  })

  /**
   * Maneja cambios en los inputs
   * @param {Event} e - Evento del input
   */
  const handleChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Validación de contraseñas
    if (name === "passwordNew" || name === "passwordConfirm") {
      validatePasswords(name, value)
    }
  }

  /**
   * Validación de contraseñas
   * @param {string} field - Campo a validar
   * @param {string} value - Valor del campo
   */
  const validatePasswords = (field, value) => {
    const newValidation = { ...validation }

    if (field === "passwordNew") {
      if (value.length > 0 && value.length < 6) {
        newValidation.passwordNew = "La contraseña debe tener al menos 6 caracteres"
      } else {
        newValidation.passwordNew = ""
      }

      if (userData.passwordConfirm && value !== userData.passwordConfirm) {
        newValidation.passwordConfirm = "Las contraseñas no coinciden"
      } else if (userData.passwordConfirm) {
        newValidation.passwordConfirm = ""
      }
    }

    if (field === "passwordConfirm") {
      if (value !== userData.passwordNew) {
        newValidation.passwordConfirm = "Las contraseñas no coinciden"
      } else {
        newValidation.passwordConfirm = ""
      }
    }

    setValidation(newValidation)
  }

  /**
   * Activa el modo edición para un campo específico
   * @param {string} field - Campo a editar
   */
  const toggleEditMode = (field) => {
    setEditMode((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))

    // Si estamos cancelando la edición de contraseña, limpiamos los campos
    if (field === "password" && editMode.password) {
      setUserData((prev) => ({
        ...prev,
        passwordOld: "",
        passwordNew: "",
        passwordConfirm: "",
      }))
      setValidation({
        passwordOld: "",
        passwordNew: "",
        passwordConfirm: "",
      })
    }
  }

  /**
   * Maneja la selección de imagen de perfil
   */
  const handleImageClick = () => {
    if (editMode.profileImage) {
      fileInputRef.current.click()
    }
  }

  /**
   * Maneja el cambio de imagen de perfil
   * @param {Event} e - Evento del input file
   */
  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // En una implementación real, aquí subirías la imagen a un servidor
      // Por ahora, solo creamos una URL temporal
      const imageUrl = URL.createObjectURL(file)
      setUserData((prev) => ({
        ...prev,
        profileImage: imageUrl,
      }))
    }
  }

  /**
   * Guarda los cambios del perfil
   * @param {Event} e - Evento del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    // Aquí iría la lógica para enviar los datos al servidor
    console.log("Datos actualizados:", userData)

    // Desactivamos todos los modos de edición
    setEditMode({
      nombre: false,
      apellido: false,
      telefono: false,
      direccion: false,
      password: false,
      profileImage: false,
    })

    // Limpiamos los campos de contraseña
    setUserData((prev) => ({
      ...prev,
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: "",
    }))

    // Mostraríamos un mensaje de éxito (usando react-toastify en una implementación real)
    alert("Perfil actualizado correctamente")
  }

  /**
   * Cancela todos los cambios
   */
  const handleCancel = () => {
    // Recargar los datos originales (en una implementación real se obtendrían del servidor)
    setUserData({
      nombre: "Tatiana",
      apellido: "Duque",
      telefono: "3001234567",
      direccion: "Calle 123 #45-67, Medellín",
      documento: "1098765432",
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: "",
      profileImage: "/placeholder.svg?height=200&width=200",
    })

    // Desactivamos todos los modos de edición
    setEditMode({
      nombre: false,
      apellido: false,
      telefono: false,
      direccion: false,
      password: false,
      profileImage: false,
    })

    setValidation({
      passwordOld: "",
      passwordNew: "",
      passwordConfirm: "",
    })
  }

  return (
    <div className="profile-container">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-0 py-3">
          <h4 className="card-title mb-0">
            <FiUser className="me-2" />
            Mi Perfil
          </h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-4">
              {/* Sección de imagen de perfil */}
              <ProfileImageSection
                userData={userData}
                editMode={editMode}
                fileInputRef={fileInputRef}
                handleImageClick={handleImageClick}
                handleImageChange={handleImageChange}
                toggleEditMode={toggleEditMode}
              />

              {/* Sección de información personal */}
              <PersonalInfoSection
                userData={userData}
                editMode={editMode}
                handleChange={handleChange}
                toggleEditMode={toggleEditMode}
              />
            </div>

            {/* Sección de Contraseña */}
            <PasswordSection
              userData={userData}
              editMode={editMode}
              validation={validation}
              handleChange={handleChange}
              toggleEditMode={toggleEditMode}
            />

            {/* Botones de acción */}
            <div className="d-flex justify-content-end gap-2">
              <button type="button" className="btn btn-outline-secondary" onClick={handleCancel}>
                <FiX className="me-1" /> Cancelar
              </button>
              <button type="submit" className="btn btn-primary">
                <FiSave className="me-1" /> Actualizar Perfil
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default UserProfile

