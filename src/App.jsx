"use client"

import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import AppRoutes from "./Routes/AppRoutes"
import ClienteRoutes from "./Routes/ClienteRoutes"
import { useEffect } from "react"

// Importar estilos
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap-icons/font/bootstrap-icons.css"
import "react-toastify/dist/ReactToastify.css"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/navigation"
import "swiper/css/effect-fade"
import "./Styles/main.scss"
import "./App.css"

function App() {
  useEffect(() => {
    // Importar los scripts de Bootstrap para componentes interactivos
    import("bootstrap/dist/js/bootstrap.bundle.min.js")
  }, [])

  // Determinar qué rutas mostrar basado en la URL
  const isAdminRoute = window.location.pathname.includes("/admin")

  return (
    <BrowserRouter>
      {isAdminRoute ? <AppRoutes /> : <ClienteRoutes />}
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  )
}

export default App

