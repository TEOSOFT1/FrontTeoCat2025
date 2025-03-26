"use client"

import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import PropTypes from "prop-types"
import { Home, Settings, Package, ShoppingCart, DollarSign, Scissors, PawPrint, ChevronRight } from "lucide-react"
import logo from "../../assets/Logo2.jpg"
import "../../Styles/AdminStyles/Sidebar.css"

const menuItems = [
  {
    title: "Dashboard",
    icon: Home,
    path: "/",
  },
  {
    title: "Configuración",
    icon: Settings,
    submenu: [
      { title: "Roles", path: "/configuracion/roles" },
      { title: "Usuarios", path: "/configuracion/usuarios" },
    ],
  },
  {
    title: "Stock",
    icon: Package,
    submenu: [
      { title: "Categorías", path: "/inventario/categorias" },
      { title: "Productos", path: "/inventario/productos" },
      { title: "Notificaciones", path: "/inventario/notificaciones" },
    ],
  },
  {
    title: "Compras",
    icon: ShoppingCart,
    submenu: [
      { title: "Proveedores", path: "/compras/proveedores" },
      { title: "Compras", path: "/compras/compras" },
      { title: "Registrar Compra", path: "/compras/registrar-compra" },
    ],
  },
  {
    title: "Ventas",
    icon: DollarSign,
    submenu: [
      { title: "Clientes", path: "/ventas/clientes" },
      { title: "Ventas", path: "/ventas/ventas" },
      { title: "Registrar Venta", path: "/ventas/registrar-venta" },
    ],
  },
  {
    title: "Servicios",
    icon: Scissors,
    submenu: [
      { title: "Tipos de Servicios", path: "/servicios/tipos-servicios" },
      { title: "Servicios", path: "/servicios/servicios" },
      { title: "Agendar Citas", path: "/servicios/AgendarCitas" },
    ],
  },
  {
    title: "Mascotas",
    icon: PawPrint,
    submenu: [
      { title: "Registrar Mascota", path: "/mascotas/lista" },
    ],
  },
]

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState(new Set())

  const toggleMenu = (title) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(title)) {
        newSet.delete(title)
      } else {
        newSet.add(title)
      }
      return newSet
    })
  }

  const isActive = (path) => location.pathname === path
  const isMenuActive = (submenu) => submenu?.some((item) => location.pathname === item.path)

  return (
    <>
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Sidebar Header con Logo */}
        <div className="sidebar-header">
          <Link to="/" className="logo">
            <img src={logo || "/placeholder.svg"} alt="Teo/Cat Logo" className="logo-img" />
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={`nav-item ${item.submenu && isMenuActive(item.submenu) ? "active-parent" : ""}`}
            >
              {item.submenu ? (
                <>
                  <button
                    className={`nav-link ${isMenuActive(item.submenu) ? "active" : ""}`}
                    onClick={() => toggleMenu(item.title)}
                    aria-expanded={openMenus.has(item.title)}
                  >
                    <item.icon className="nav-icon" />
                    <span className="nav-text">{item.title}</span>
                    <ChevronRight className={`nav-arrow ${openMenus.has(item.title) ? "rotate" : ""}`} />
                  </button>

                  <div className={`submenu ${openMenus.has(item.title) ? "open" : ""}`}>
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        to={subItem.path}
                        className={`submenu-link ${isActive(subItem.path) ? "active" : ""}`}
                      >
                        <span className="submenu-dot" />
                        <span className="submenu-text">{subItem.title}</span>
                      </Link>
                    ))}
                  </div>
                </>
              ) : (
                <Link to={item.path} className={`nav-link ${isActive(item.path) ? "active" : ""}`}>
                  <item.icon className="nav-icon" />
                  <span className="nav-text">{item.title}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>
      </aside>

      {/* Backdrop para móviles */}
      {isOpen && <div className="sidebar-backdrop" onClick={toggleSidebar} />}
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
}

export default Sidebar

