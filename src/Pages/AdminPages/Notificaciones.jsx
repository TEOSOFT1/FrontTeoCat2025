"use client"

import { useState, useEffect, useRef } from "react"
import { Bell, Package, Calendar, RefreshCw, Search } from "lucide-react"
import NotificationCard from "../../components/AdminComponents/NotificationCard"
import NotificationRow from "../../components/AdminComponents/NotificationRow"
import "../../Styles/AdminStyles/Notificaciones.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para la gestión de notificaciones
 * Muestra un catálogo visual de productos con alertas sobre stock bajo y fechas de vencimiento
 * Permite marcar notificaciones como vistas o resueltas
 */
const Notificaciones = () => {
  // Estados para las notificaciones
  const [notificaciones, setNotificaciones] = useState([])
  const [filteredNotificaciones, setFilteredNotificaciones] = useState([])

  // Estado para el filtro activo
  const [filtroActivo, setFiltroActivo] = useState("todas")

  // Estado para el tipo de notificación activo
  const [tipoActivo, setTipoActivo] = useState("todas")

  // Estado para la búsqueda
  const [searchTerm, setSearchTerm] = useState("")

  // Estado para la vista (grid o lista)
  const [viewMode, setViewMode] = useState("grid")

  // Referencias para las notificaciones toast
  const toastIds = useRef({})

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API para obtener notificaciones
   */
  useEffect(() => {
    // Aquí se implementará la carga de datos desde la API

    // Iniciar animación de fondo
    initParticlesBackground()
  }, [])

  /**
   * Función para inicializar el fondo animado con partículas
   */
  const initParticlesBackground = () => {
    // Esta función simula la inicialización de un fondo de partículas
    // En una implementación real, aquí se inicializaría una librería como particles.js
    console.log("Fondo de partículas inicializado")
  }

  /**
   * Efecto para aplicar filtros cuando cambian
   */
  useEffect(() => {
    let resultado = [...notificaciones]

    // Filtrar por estado
    if (filtroActivo !== "todas") {
      resultado = resultado.filter((notif) => notif.estado === filtroActivo)
    }

    // Filtrar por tipo
    if (tipoActivo !== "todas") {
      resultado = resultado.filter((notif) => notif.tipo === tipoActivo)
    }

    // Filtrar por término de búsqueda
    if (searchTerm.trim() !== "") {
      const term = searchTerm.toLowerCase()
      resultado = resultado.filter(
        (notif) => notif.producto.nombre.toLowerCase().includes(term) || notif.mensaje.toLowerCase().includes(term),
      )
    }

    setFilteredNotificaciones(resultado)
  }, [filtroActivo, tipoActivo, searchTerm, notificaciones])

  /**
   * Manejador para cambiar el estado de una notificación
   * @param {number} id - ID de la notificación
   * @param {string} nuevoEstado - Nuevo estado a aplicar
   */
  const cambiarEstadoNotificacion = (id, nuevoEstado) => {
    const updatedNotificaciones = notificaciones.map((notif) => {
      if (notif.id === id) {
        return { ...notif, estado: nuevoEstado }
      }
      return notif
    })

    setNotificaciones(updatedNotificaciones)

    // Mostrar notificación de éxito
    const notif = notificaciones.find((n) => n.id === id)

    if (toastIds.current[id]) {
      toast.dismiss(toastIds.current[id])
    }

    toastIds.current[id] = toast.success(
      <div>
        <strong>Estado actualizado</strong>
        <p>
          La notificación para "{notif.producto.nombre}" ha sido marcada como "{nuevoEstado}".
        </p>
      </div>,
      {
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
   * Manejador para cambiar el filtro activo
   * @param {string} filtro - Filtro a aplicar
   */
  const cambiarFiltro = (filtro) => {
    setFiltroActivo(filtro)
  }

  /**
   * Manejador para cambiar el tipo activo
   * @param {string} tipo - Tipo a filtrar
   */
  const cambiarTipo = (tipo) => {
    setTipoActivo(tipo)
  }

  /**
   * Función para obtener el conteo de notificaciones por estado
   * @param {string} estado - Estado a contar
   * @returns {number} Cantidad de notificaciones
   */
  const contarNotificaciones = (estado) => {
    if (estado === "todas") {
      return notificaciones.length
    }
    return notificaciones.filter((notif) => notif.estado === estado).length
  }

  /**
   * Función para obtener el conteo de notificaciones por tipo
   * @param {string} tipo - Tipo a contar
   * @returns {number} Cantidad de notificaciones
   */
  const contarTipoNotificaciones = (tipo) => {
    if (tipo === "todas") {
      return notificaciones.length
    }
    return notificaciones.filter((notif) => notif.tipo === tipo).length
  }

  /**
   * Función para refrescar las notificaciones
   * Simula una recarga de datos
   */
  const refrescarNotificaciones = () => {
    // Aquí se implementaría la recarga real de datos desde la API

    toast.info(
      <div>
        <strong>Actualizando</strong>
        <p>Buscando nuevas notificaciones...</p>
      </div>,
      {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      },
    )
  }

  /**
   * Función para cambiar el modo de visualización
   * @param {string} mode - Modo de visualización (grid o lista)
   */
  const changeViewMode = (mode) => {
    setViewMode(mode)
  }

  /**
   * Función para manejar cambios en el campo de búsqueda
   * @param {Event} e - Evento del input
   */
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
  }

  return (
    <div className="notificaciones-container">
      <div className="particles-bg"></div>

      <div className="content-wrapper">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="page-title">
            <Bell className="me-2" />
            Notificaciones
          </h2>
          <button className="btn btn-primary d-flex align-items-center refresh-btn" onClick={refrescarNotificaciones}>
            <RefreshCw size={18} className="me-1" />
            Actualizar
          </button>
        </div>

        {/* Reemplazar la sección de filtros con esta estructura mejorada */}
        <div className="filters-bar">
          {/* Barra de búsqueda primero */}
          <div className="filters-group search-group">
            <div className="input-group">
              <span className="input-group-text">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          </div>

          <div className="filters-container">
            {/* Filtros de estado */}
            <div className="filter-section">
              <div className="filters-group">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "todas" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("todas")}
                  >
                    Todas ({contarNotificaciones("todas")})
                  </button>
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "pendiente" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("pendiente")}
                  >
                    Pendientes ({contarNotificaciones("pendiente")})
                  </button>
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "vista" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("vista")}
                  >
                    Vistas ({contarNotificaciones("vista")})
                  </button>
                  <button
                    type="button"
                    className={`btn ${filtroActivo === "resuelta" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarFiltro("resuelta")}
                  >
                    Resueltas ({contarNotificaciones("resuelta")})
                  </button>
                </div>
              </div>
            </div>

            {/* Filtros de tipo */}
            <div className="filter-section">
              <div className="filters-group">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "todas" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("todas")}
                  >
                    Todas
                  </button>
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "stock" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("stock")}
                  >
                    <Package size={16} className="me-1" />
                    Stock
                  </button>
                  <button
                    type="button"
                    className={`btn ${tipoActivo === "vencimiento" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => cambiarTipo("vencimiento")}
                  >
                    <Calendar size={16} className="me-1" />
                    Vencimiento
                  </button>
                </div>
              </div>
            </div>

            {/* Selector de vista */}
            <div className="filter-section" style={{ flex: "0 0 auto", minWidth: "auto" }}>
              <div className="filters-group view-mode-group">
                <div className="btn-group" role="group">
                  <button
                    type="button"
                    className={`btn ${viewMode === "grid" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => changeViewMode("grid")}
                  >
                    <i className="bi bi-grid"></i>
                    Cuadrícula
                  </button>
                  <button
                    type="button"
                    className={`btn ${viewMode === "list" ? "btn-primary" : "btn-outline-primary"}`}
                    onClick={() => changeViewMode("list")}
                  >
                    <i className="bi bi-list"></i>
                    Lista
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {filteredNotificaciones.length > 0 ? (
          <div className={`products-container ${viewMode === "grid" ? "grid-view" : "list-view"}`}>
            {viewMode === "grid"
              ? filteredNotificaciones.map((notificacion) => (
                  <NotificationCard
                    key={notificacion.id}
                    notificacion={notificacion}
                    onChangeStatus={cambiarEstadoNotificacion}
                  />
                ))
              : filteredNotificaciones.map((notificacion) => (
                  <NotificationRow
                    key={notificacion.id}
                    notificacion={notificacion}
                    onChangeStatus={cambiarEstadoNotificacion}
                  />
                ))}
          </div>
        ) : (
          <div className="alert alert-info mt-4">
            <div className="d-flex align-items-center">
              <Bell size={24} className="me-3" />
              <div>
                <h5 className="mb-1">No hay notificaciones</h5>
                <p className="mb-0">No se encontraron notificaciones con los filtros seleccionados.</p>
              </div>
            </div>
          </div>
        )}
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

export default Notificaciones

