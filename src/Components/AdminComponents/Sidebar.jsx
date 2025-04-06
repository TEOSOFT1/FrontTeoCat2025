"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import PropTypes from "prop-types"
import { Home, Settings, Package, ShoppingCart, DollarSign, Scissors, PawPrint, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import logo from "../../assets/Logo2.jpg"
import "./Sidebar.scss"

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
      { title: "Registrar Nuevo Producto", path: "/inventario/registrar-producto" },
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
      { title: "Registrar Nuevo Servicio", path: "/servicios/registrar-servicio" },
      { title: "Agendar Citas", path: "/servicios/AgendarCitas" },
    ],
  },
  {
    title: "Mascotas",
    icon: PawPrint,
    submenu: [{ title: "Registrar Mascota", path: "/mascotas/lista" }],
  },
]

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation()
  const [openMenus, setOpenMenus] = useState(new Set())
  const [logoHovered, setLogoHovered] = useState(false)

  // Check active routes on mount and set corresponding menus open
  useEffect(() => {
    const activeMenus = new Set()
    menuItems.forEach((item) => {
      if (item.submenu && item.submenu.some((subItem) => location.pathname === subItem.path)) {
        activeMenus.add(item.title)
      }
    })
    setOpenMenus(activeMenus)
  }, [location.pathname])

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
      <motion.aside
        className={`sidebar ${isOpen ? "open" : ""}`}
        animate={{
          width: isOpen ? "280px" : "0px",
          opacity: isOpen ? 1 : 0,
          x: isOpen ? 0 : -20,
        }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {/* Sidebar Header con Logo Mejorado */}
        <div className="sidebar-header">
          <Link
            to="/"
            className="logo"
            onMouseEnter={() => setLogoHovered(true)}
            onMouseLeave={() => setLogoHovered(false)}
          >
            <motion.div
              className="logo-container"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <motion.img
                src={logo || "/placeholder.svg"}
                alt="Teo/Cat Logo"
                className="logo-img"
                initial={{ scale: 0.9 }}
                animate={{
                  scale: logoHovered ? 1.05 : 1,
                  rotate: logoHovered ? 5 : 0,
                }}
                transition={{
                  duration: 0.4,
                  ease: "easeInOut",
                }}
                whileTap={{ scale: 0.95 }}
              />
              <motion.div
                className="logo-shine"
                initial={{ opacity: 0, x: -100 }}
                animate={{
                  opacity: logoHovered ? [0, 0.7, 0] : 0,
                  x: logoHovered ? [-100, 100, 300] : -100,
                }}
                transition={{
                  duration: 1.2,
                  ease: "easeInOut",
                  times: [0, 0.5, 1],
                  repeat: logoHovered ? Number.POSITIVE_INFINITY : 0,
                  repeatDelay: 2,
                }}
              />
            </motion.div>
          </Link>
        </div>

        {/* Sidebar Navigation */}
        <nav className="sidebar-nav">
          {menuItems.map((item, index) => (
            <motion.div
              key={index}
              className={`nav-item ${item.submenu && isMenuActive(item.submenu) ? "active-parent" : ""}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
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
                    <motion.div animate={{ rotate: openMenus.has(item.title) ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight className="nav-arrow" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {openMenus.has(item.title) && (
                      <motion.div
                        className="submenu open"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        {item.submenu.map((subItem, subIndex) => (
                          <motion.div
                            key={subIndex}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2, delay: subIndex * 0.05 }}
                          >
                            <Link
                              to={subItem.path}
                              className={`submenu-link ${isActive(subItem.path) ? "active" : ""}`}
                            >
                              <span className="submenu-dot" />
                              <span className="submenu-text">{subItem.title}</span>
                            </Link>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link to={item.path} className={`nav-link ${isActive(item.path) ? "active" : ""}`}>
                  <item.icon className="nav-icon" />
                  <span className="nav-text">{item.title}</span>
                </Link>
              )}
            </motion.div>
          ))}
        </nav>
      </motion.aside>

      {/* Backdrop para móviles */}
      {isOpen && (
        <motion.div
          className="sidebar-backdrop"
          onClick={toggleSidebar}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        />
      )}
    </>
  )
}

Sidebar.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggleSidebar: PropTypes.func.isRequired,
}

export default Sidebar

