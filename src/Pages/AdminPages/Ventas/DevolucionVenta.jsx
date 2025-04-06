"use client"

import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Check } from "lucide-react"
import "../../../Styles/AdminStyles/DevolucionVenta.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import VentaInfoSection from "../../../Components/AdminComponents/VentasComponents/VentaInfoSection"
import ProductoDevolucionForm from "../../../Components/AdminComponents/VentasComponents/ProductoDevolucionForm"
import DevolucionesTable from "../../../Components/AdminComponents/VentasComponents/DevolucionesTable"
import ResumenDevolucion from "../../../Components/AdminComponents/VentasComponents/ResumenDevolucion"

/**
 * Componente para gestionar la devolución de productos de una venta
 */
const DevolucionVenta = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const ventaId = queryParams.get("id")

  // Estado para la venta seleccionada
  const [venta, setVenta] = useState(null)

  // Estado para los motivos de devolución
  const [motivos, setMotivos] = useState([
    { id: 1, nombre: "Producto defectuoso" },
    { id: 2, nombre: "Producto incorrecto" },
    { id: 3, nombre: "Cambio de opinión" },
    { id: 4, nombre: "Otro" },
  ])

  // Estado para los estados de devolución
  const [estados, setEstados] = useState([
    { id: 1, nombre: "Pendiente" },
    { id: 2, nombre: "Aprobada" },
    { id: 3, nombre: "Rechazada" },
  ])

  // Estado para las devoluciones
  const [devoluciones, setDevoluciones] = useState([])

  // Estado para la devolución actual
  const [devolucionActual, setDevolucionActual] = useState({
    producto: null,
    cantidad: 1,
    motivo: null,
    estado: null,
  })

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    producto: "",
    cantidad: "",
    motivo: "",
    estado: "",
  })

  // Función para formatear números con separadores de miles
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Cargar datos de la venta
  useEffect(() => {
    // Simulamos la carga de datos de la venta desde una API
    const ventas = [
      {
        id: 1,
        codigoFactura: "VENT-2023-001",
        cliente: {
          id: 1,
          nombre: "Juan Pérez",
          documento: "1098765432",
        },
        fechaVenta: "2023-08-15",
        subtotal: 2500000,
        totalIVA: 475000,
        total: 2975000,
        estado: "Completada",
        productos: [
          {
            id: 1,
            codigoBarras: "7891234567890",
            nombre: "Smartphone XYZ",
            cantidad: 2,
            precioUnitario: 1200000,
            iva: 19,
            subtotal: 2400000,
            totalConIVA: 2856000,
          },
          {
            id: 3,
            codigoBarras: "7891234567892",
            nombre: "Leche Deslactosada 1L",
            cantidad: 20,
            precioUnitario: 5000,
            iva: 5,
            subtotal: 100000,
            totalConIVA: 105000,
          },
        ],
      },
      {
        id: 2,
        codigoFactura: "VENT-2023-002",
        cliente: {
          id: 2,
          nombre: "María Rodríguez",
          documento: "1087654321",
        },
        fechaVenta: "2023-08-20",
        subtotal: 1800000,
        totalIVA: 342000,
        total: 2142000,
        estado: "Completada",
        productos: [
          {
            id: 2,
            codigoBarras: "7891234567891",
            nombre: "Camiseta Deportiva",
            cantidad: 40,
            precioUnitario: 45000,
            iva: 19,
            subtotal: 1800000,
            totalConIVA: 2142000,
          },
        ],
      },
    ]

    if (ventaId) {
      const ventaEncontrada = ventas.find((v) => v.id === Number.parseInt(ventaId))
      if (ventaEncontrada) {
        setVenta(ventaEncontrada)
      } else {
        // Si no se encuentra la venta, redirigir a la lista de ventas
        toast.error(
          <div>
            <strong>Error</strong>
            <p>No se encontró la venta solicitada.</p>
          </div>,
          {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            onClose: () => navigate("/ventas/ventas"),
          },
        )
      }
    } else {
      // Si no hay ID de venta, redirigir a la lista de ventas
      navigate("/ventas/ventas")
    }
  }, [ventaId, navigate])

  // Manejador para cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setDevolucionActual({
      ...devolucionActual,
      [name]: value,
    })

    // Limpiar el error específico cuando el usuario comienza a escribir
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  // Manejador para seleccionar un producto
  const handleSelectProducto = (selectedOption) => {
    setDevolucionActual({
      ...devolucionActual,
      producto: selectedOption ? selectedOption.value : null,
      cantidad: 1, // Resetear cantidad al cambiar de producto
    })

    // Limpiar el error específico
    if (formErrors.producto) {
      setFormErrors({
        ...formErrors,
        producto: "",
      })
    }
  }

  // Manejador para seleccionar un motivo
  const handleSelectMotivo = (selectedOption) => {
    setDevolucionActual({
      ...devolucionActual,
      motivo: selectedOption ? selectedOption.value : null,
    })

    // Limpiar el error específico
    if (formErrors.motivo) {
      setFormErrors({
        ...formErrors,
        motivo: "",
      })
    }
  }

  // Manejador para seleccionar un estado
  const handleSelectEstado = (selectedOption) => {
    setDevolucionActual({
      ...devolucionActual,
      estado: selectedOption ? selectedOption.value : null,
    })

    // Limpiar el error específico
    if (formErrors.estado) {
      setFormErrors({
        ...formErrors,
        estado: "",
      })
    }
  }

  // Manejador para incrementar la cantidad
  const handleIncrementarCantidad = () => {
    if (devolucionActual.producto && devolucionActual.cantidad < devolucionActual.producto.cantidad) {
      setDevolucionActual({
        ...devolucionActual,
        cantidad: devolucionActual.cantidad + 1,
      })
    }
  }

  // Manejador para decrementar la cantidad
  const handleDecrementarCantidad = () => {
    if (devolucionActual.cantidad > 1) {
      setDevolucionActual({
        ...devolucionActual,
        cantidad: devolucionActual.cantidad - 1,
      })
    }
  }

  // Validar el formulario de devolución
  const validateDevolucionForm = () => {
    let isValid = true
    const errors = {
      producto: "",
      cantidad: "",
      motivo: "",
      estado: "",
    }

    // Validar producto
    if (!devolucionActual.producto) {
      errors.producto = "Por favor, seleccione un producto"
      isValid = false
    }

    // Validar cantidad
    if (!devolucionActual.cantidad || devolucionActual.cantidad <= 0) {
      errors.cantidad = "Por favor, ingrese una cantidad válida"
      isValid = false
    } else if (devolucionActual.producto && devolucionActual.cantidad > devolucionActual.producto.cantidad) {
      errors.cantidad = "La cantidad a devolver no puede ser mayor que la cantidad comprada"
      isValid = false
    }

    // Validar motivo
    if (!devolucionActual.motivo) {
      errors.motivo = "Por favor, seleccione un motivo de devolución"
      isValid = false
    }

    // Validar estado
    if (!devolucionActual.estado) {
      errors.estado = "Por favor, seleccione un estado para la devolución"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  // Manejador para agregar una devolución
  const handleAgregarDevolucion = () => {
    // Validar el formulario
    if (!validateDevolucionForm()) {
      // Mostrar notificación de error general
      toast.error(
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

    const { producto, cantidad, motivo, estado } = devolucionActual

    // Verificar si el producto ya está en la lista de devoluciones
    const productoExistente = devoluciones.findIndex((d) => d.producto.id === producto.id)

    if (productoExistente !== -1) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Este producto ya está en la lista de devoluciones.</p>
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

    // Calcular subtotal
    const subtotal = cantidad * producto.precioUnitario

    // Agregar devolución
    const nuevaDevolucion = {
      id: Date.now(), // ID temporal
      producto: producto,
      cantidad: Number.parseInt(cantidad),
      motivo: motivo,
      estado: estado,
      subtotal: subtotal,
    }

    setDevoluciones([...devoluciones, nuevaDevolucion])

    // Resetear formulario
    setDevolucionActual({
      producto: null,
      cantidad: 1,
      motivo: null,
      estado: null,
    })

    // Notificación de éxito
    toast.success(
      <div>
        <strong>Devolución agregada</strong>
        <p>El producto ha sido agregado a la lista de devoluciones.</p>
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

  // Manejador para eliminar una devolución
  const handleEliminarDevolucion = (id) => {
    setDevoluciones(devoluciones.filter((d) => d.id !== id))

    // Notificación
    toast.info(
      <div>
        <strong>Devolución eliminada</strong>
        <p>La devolución ha sido eliminada de la lista.</p>
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

  // Manejador para confirmar la devolución
  const handleConfirmarDevolucion = () => {
    if (devoluciones.length === 0) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>No hay productos para devolver.</p>
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

    // Aquí normalmente enviaríamos los datos al servidor
    // Por ahora, solo mostraremos una notificación y redirigiremos

    toast.success(
      <div>
        <strong>Devolución registrada</strong>
        <p>La devolución ha sido registrada correctamente.</p>
      </div>,
      {
        icon: "✅",
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        onClose: () => {
          // Redirigir a la lista de ventas después de que se cierre la notificación
          navigate("/ventas/ventas")
        },
      },
    )
  }

  // Manejador para cancelar y volver a la lista de ventas
  const handleCancel = () => {
    navigate("/ventas/ventas")
  }

  // Calcular monto total de devolución
  const calcularMontoTotalDevolucion = () => {
    return devoluciones.reduce((total, devolucion) => total + devolucion.subtotal, 0)
  }

  // Opciones para el select de productos
  const productosOptions = venta
    ? venta.productos.map((producto) => ({
        value: producto,
        label: `${producto.nombre} - ${producto.codigoBarras} - Cantidad: ${producto.cantidad}`,
      }))
    : []

  // Opciones para el select de motivos
  const motivosOptions = motivos.map((motivo) => ({
    value: motivo,
    label: motivo.nombre,
  }))

  // Opciones para el select de estados
  const estadosOptions = estados.map((estado) => ({
    value: estado,
    label: estado.nombre,
  }))

  if (!venta) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "50vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="devolucion-venta-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Devolución de Venta</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Ventas
        </button>
      </div>

      {/* Sección de información de la venta */}
      <VentaInfoSection venta={venta} formatNumber={formatNumber} />

      {/* Formulario para agregar productos a devolver */}
      <ProductoDevolucionForm
        devolucionActual={devolucionActual}
        formErrors={formErrors}
        productosOptions={productosOptions}
        motivosOptions={motivosOptions}
        estadosOptions={estadosOptions}
        handleSelectProducto={handleSelectProducto}
        handleInputChange={handleInputChange}
        handleIncrementarCantidad={handleIncrementarCantidad}
        handleDecrementarCantidad={handleDecrementarCantidad}
        handleSelectMotivo={handleSelectMotivo}
        handleSelectEstado={handleSelectEstado}
        handleAgregarDevolucion={handleAgregarDevolucion}
      />

      {/* Tabla de devoluciones */}
      <DevolucionesTable
        devoluciones={devoluciones}
        formatNumber={formatNumber}
        handleEliminarDevolucion={handleEliminarDevolucion}
      />

      {/* Resumen de la devolución */}
      <ResumenDevolucion montoTotal={calcularMontoTotalDevolucion()} formatNumber={formatNumber} />

      <div className="d-flex justify-content-end mt-4">
        <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
          Cerrar
        </button>
        <button
          type="button"
          className="btn btn-success d-flex align-items-center"
          onClick={handleConfirmarDevolucion}
          disabled={devoluciones.length === 0}
        >
          <Check size={18} className="me-1" />
          Confirmar Devolución
        </button>
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

export default DevolucionVenta

