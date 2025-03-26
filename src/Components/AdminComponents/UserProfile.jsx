"use client"

import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { FiUser, FiLogOut, FiChevronDown } from "react-icons/fi"
import "../../Styles/AdminStyles/UserProfile.css"

const UserProfile = ({ userData = { name: "Tatiana Duque", email: "admin@teocat.com", role: "Administrador" } }) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const backdropRef = useRef(null)

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
    // Lógica para cerrar sesión
    localStorage.removeItem("token")
    window.location.href = "/login"
  }

  return (
    <div className="user-profile ms-auto">
      <div className="dropdown">
        <button
          className="btn btn-link text-decoration-none p-0 d-flex align-items-center"
          onClick={toggleDropdown}
          aria-expanded={isOpen}
        >
          <div className="avatar me-2">
            <FiUser size={20} />
          </div>
          <div className="user-info text-start">
            <div className="user-name fw-medium">{userData.name || "Usuario"}</div>
            <div className="user-role text-muted small">{userData.role || "Invitado"}</div>
          </div>
          <FiChevronDown className={`ms-2 transition ${isOpen ? "rotate-180" : ""}`} size={16} />
        </button>

        {isOpen && (
          <>
            <div className="dropdown-backdrop" onClick={() => setIsOpen(false)} ref={backdropRef} />
            <div className="dropdown-menu show position-absolute end-0 mt-2" ref={dropdownRef}>
              <div className="dropdown-header p-3">
                <div className="header-name fw-medium">{userData.name || "Usuario"}</div>
                <div className="header-email text-muted small">{userData.email || "usuario@ejemplo.com"}</div>
              </div>
              <div className="dropdown-divider my-0" />
              <div className="dropdown-content p-2">
                {/* Enlace a la vista de perfil */}
                <Link
                  to="/perfil"
                  className="dropdown-item d-flex align-items-center p-2 text-decoration-none"
                  onClick={() => setIsOpen(false)}
                >
                  <FiUser className="me-2" size={16} />
                  <span>Mi Perfil</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="dropdown-item d-flex align-items-center p-2 text-decoration-none text-danger"
                >
                  <FiLogOut className="me-2" size={16} />
                  <span>Cerrar Sesión</span>
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default UserProfile

