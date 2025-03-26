"use client"

import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import PropTypes from "prop-types" // Para validar props (opcional)
import Sidebar from "../../Components/AdminComponents/Sidebar"
import UserProfile from "../../Components/AdminComponents/UserProfile"
import "../../Styles/AdminStyles/Layout.css"

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  // Cerrar sidebar en dispositivos móviles al cambiar de ruta
  useEffect(() => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false)
    }
  }, [location.pathname])

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Overlay para dispositivos móviles */}
      {sidebarOpen && <div className="sidebar-overlay" onClick={toggleSidebar} />}

      <div className={`main-content ${sidebarOpen ? "sidebar-open" : ""}`}>
        <header className="header">
          <div className="header-content">
            <button className="menu-toggle" onClick={toggleSidebar} aria-label="Abrir/Cerrar menú">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            </button>

            <div className="page-info">
              <p>Bienvenido al panel de administración</p>
            </div>

            <UserProfile />
          </div>
        </header>

        <main className="content">
          <Outlet />
        </main>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-text">
                Teo<span className="text-success">/Cat</span>
              </span>
              <p className="footer-tagline">Productos y servicios para mascotas</p>
            </div>
            <div className="footer-info">
              <p className="copyright">© {new Date().getFullYear()} Teo/Cat. Todos los derechos reservados.</p>
              <p className="location">Medellín, Colombia</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

// Validación de props (opcional)
Layout.propTypes = {
  // Agrega props si es necesario
}

export default Layout