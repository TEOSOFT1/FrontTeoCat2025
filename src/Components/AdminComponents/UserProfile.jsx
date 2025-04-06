"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import { FiUser, FiLogOut, FiChevronDown, FiBell } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"
import "./UserProfile.scss"

const UserProfile = ({ userData = { name: "Tatiana Duque", email: "admin@teocat.com", role: "Administrador" } }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const backdropRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest(".user-profile")) {
        setIsOpen(false)
      }
    }

    // Close dropdown when navigating
    const handleRouteChange = () => {
      setIsOpen(false)
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("popstate", handleRouteChange)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("popstate", handleRouteChange)

      // Reset body styles if needed
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleLogout = () => {
    // Primero navegamos a la página principal
    navigate("/")

    // Luego, con un pequeño retraso, eliminamos las credenciales
    setTimeout(() => {
      // Eliminar token y rol del localStorage
      localStorage.removeItem("token")
      localStorage.removeItem("userRole")

      // Disparar evento personalizado para notificar a RolRoutes
      window.dispatchEvent(new Event("logout"))
    }, 100)
  }

  return (
    <div className="user-profile ms-auto">
      <div className="notification-bell">
        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
          <FiBell size={20} />
          <span className="notification-badge">3</span>
        </motion.div>
      </div>
      <div className="dropdown">
        <motion.button
          className="profile-button"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <div className="avatar">
            <FiUser size={20} />
          </div>
          <div className="user-info">
            <div className="user-name">{userData.name || "Usuario"}</div>
            <div className="user-role">{userData.role || "Invitado"}</div>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <FiChevronDown className="dropdown-icon" size={16} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="dropdown-backdrop"
                onClick={() => setIsOpen(false)}
                ref={backdropRef}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
              <motion.div
                className="dropdown-menu show"
                ref={dropdownRef}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
              >
                <div className="dropdown-header">
                  <div className="header-name">{userData.name || "Usuario"}</div>
                  <div className="header-email">{userData.email || "usuario@ejemplo.com"}</div>
                </div>
                <div className="dropdown-divider" />
                <div className="dropdown-content">
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <Link to="/perfil" className="dropdown-item" onClick={() => setIsOpen(false)}>
                      <FiUser className="item-icon" size={16} />
                      <span>Mi Perfil</span>
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <FiLogOut className="item-icon" size={16} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

export default UserProfile

