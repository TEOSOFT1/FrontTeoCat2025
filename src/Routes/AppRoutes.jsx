// Actualizar AppRoutes.jsx para incluir la ruta de TiposServicios
import { Routes, Route, Navigate } from "react-router-dom"
import Layout from "../Components/AdminComponents/Layout"
import Dashboard from "../Pages/AdminPages/Dashboard"
import UserProfile2 from "../Pages/AdminPages/UserProfile2"
import Roles from "../Pages/AdminPages/Roles"
import Usuarios from "../Pages/AdminPages/Usuarios"
import Categorias from "../Pages/AdminPages/Categorias"
import Productos from "../Pages/AdminPages/Productos"
import Notificaciones from "../Pages/AdminPages/Notificaciones"
import Proveedores from "../Pages/AdminPages/Proveedores"
import Compras from "../Pages/AdminPages/Compras"
import RegistrarCompra from "../Pages/AdminPages/RegistrarCompra"
import Clientes from "../Pages/AdminPages/Clientes"
import Ventas from "../Pages/AdminPages/Ventas"
import RegistrarVenta from "../Pages/AdminPages/RegistrarVenta"
import DevolucionVenta from "../Pages/AdminPages/DevolucionVenta"
import TiposServicios from "../Pages/AdminPages/TiposServicios" 
import Servicios from "../Pages/AdminPages/Servicios"
import AgendarCitas from "../Pages/AdminPages/AgendarCitas"
import NuevaCita from "../Pages/AdminPages/NuevaCita"
import Mascotas from "../Pages/AdminPages/Mascotas"
import AuthPage from "../Pages/AuthPage"
import RecoverPassword from "../Pages/RecoverPassword"
import NotFound from "../Pages/NotFound"

// Componente para rutas protegidas
const ProtectedRoute = ({ children }) => {
  // Aquí iría la lógica para verificar si el usuario está autenticado
  const isAuthenticated = localStorage.getItem("token") !== null

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return children
}

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas de autenticación */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />
      <Route path="/recover-password" element={<RecoverPassword />} />

      {/* Rutas protegidas dentro del Layout */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />

        {/* Ruta del perfil */}
        <Route path="perfil" element={<UserProfile2 />} />

        {/* Configuración */}
        <Route path="configuracion/roles" element={<Roles />} />
        <Route path="configuracion/usuarios" element={<Usuarios />} />

        {/* Inventario */}
        <Route path="inventario/categorias" element={<Categorias />} />
        <Route path="inventario/productos" element={<Productos />} />
        <Route path="inventario/notificaciones" element={<Notificaciones />} />

        {/* Compras */}
        <Route path="compras/proveedores" element={<Proveedores />} />
        <Route path="compras/compras" element={<Compras />} />
        <Route path="compras/registrar-compra" element={<RegistrarCompra />} />

        {/* Ventas */}
        <Route path="ventas/clientes" element={<Clientes />} />
        <Route path="ventas/ventas" element={<Ventas />} />
        <Route path="ventas/registrar-venta" element={<RegistrarVenta />} />
        <Route path="ventas/devolucion" element={<DevolucionVenta />} />

        {/* Servicios */}
        <Route path="servicios/tipos-servicios" element={<TiposServicios />} />
        <Route path="servicios/servicios" element={<Servicios />} />
        <Route path="servicios/AgendarCitas" element={<AgendarCitas />} />
        <Route path="servicios/NuevaCita" element={<NuevaCita />} />

        {/* Mascotas */}
        <Route path="mascotas/lista" element={<Mascotas />} />
        {/* <Route path="mascotas/registrar" element={<RegistrarMascota />} /> */}
      </Route>

      {/* Ruta para páginas no encontradas */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes

