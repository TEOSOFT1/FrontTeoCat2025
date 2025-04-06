"use client"

import { useState, useRef } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Save, ArrowLeft } from "lucide-react"
import "../../../Styles/AdminStyles/RegistrarCompra.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../../Styles/AdminStyles/ToastStyles.css"
import CompraForm from "../../../Components/AdminComponents/ComprasComponents/CompraForm"
import ProductosTable from "../../../Components/AdminComponents/ComprasComponents/ProductosTable"
import ResumenCompra from "../../../Components/AdminComponents/ComprasComponents/ResumenCompra"

/**
 * Componente para registrar compras de productos
 * Permite seleccionar proveedor, agregar productos y registrar la compra
 */
const RegistrarCompra = () => {
  const navigate = useNavigate()
  const location = useLocation()

  // Obtener el ID de la compra de los parámetros de la URL (para edición)
  const params = new URLSearchParams(location.search)
  const compraId = params.get("id")
  const isEditing = !!compraId

  // Estado para los productos disponibles
  const [productos, setProductos] = useState([])

  // Estado para los proveedores disponibles
  const [proveedores, setProveedores] = useState([])

  // Estado para indicar carga de datos
  const [isLoading, setIsLoading] = useState(false)

  // Estado para manejar errores
  const [error, setError] = useState(null)

  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigoFactura: generateInvoiceCode(),
    proveedor: null,
    fechaCompra: new Date().toISOString().split("T")[0],
    productosAgregados: [],
    productoSeleccionado: null,
    cantidad: 1,
  })

  // Estado para errores de validación
  const [formErrors, setFormErrors] = useState({
    proveedor: "",
    fechaCompra: "",
    productoSeleccionado: "",
    cantidad: "",
    productosAgregados: "",
  })

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Función para generar un código de factura único
   * @returns {string} Código de factura generado
   */
  function generateInvoiceCode() {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `COMP-${year}-${randomNum}`
  }

  /**
   * Función para formatear números con separadores de miles
   * @param {number} number - Número a formatear
   * @returns {string} Número formateado con separadores de miles
   */
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  /**
   * Manejador para cambios en los inputs del formulario
   * @param {Event} e - Evento del input
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Limpiar el error específico
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: "",
      })
    }
  }

  /**
   * Manejador para seleccionar un producto
   * @param {Object} selectedOption - Opción seleccionada del select
   */
  const handleSelectProduct = (selectedOption) => {
    setFormData({
      ...formData,
      productoSeleccionado: selectedOption ? selectedOption.value : null,
    })

    // Limpiar el error específico
    if (formErrors.productoSeleccionado) {
      setFormErrors({
        ...formErrors,
        productoSeleccionado: "",
      })
    }
  }

  /**
   * Manejador para seleccionar un proveedor
   * @param {Object} selectedOption - Opción seleccionada del select
   */
  const handleSelectProveedor = (selectedOption) => {
    setFormData({
      ...formData,
      proveedor: selectedOption ? selectedOption.value : null,
    })

    // Limpiar el error específico
    if (formErrors.proveedor) {
      setFormErrors({
        ...formErrors,
        proveedor: "",
      })
    }
  }

  /**
   * Validar el formulario de producto antes de agregarlo
   * @returns {boolean} True si el formulario es válido, false en caso contrario
   */
  const validateProductForm = () => {
    let isValid = true
    const errors = { ...formErrors }

    // Validar selección de producto
    if (!formData.productoSeleccionado) {
      errors.productoSeleccionado = "Por favor, seleccione un producto"
      isValid = false
    }

    // Validar cantidad
    if (!formData.cantidad || formData.cantidad <= 0) {
      errors.cantidad = "Por favor, ingrese una cantidad válida"
      isValid = false
    } else if (!Number.isInteger(Number(formData.cantidad))) {
      errors.cantidad = "La cantidad debe ser un número entero"
      isValid = false
    } else if (Number(formData.cantidad) > 1000) {
      errors.cantidad = "La cantidad no puede ser mayor a 1000 unidades"
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para agregar un producto a la lista
   * Valida los datos y agrega el producto a la lista de productos de la compra
   */
  const handleAddProduct = () => {
    // Validar el formulario
    if (!validateProductForm()) {
      return
    }

    const { productoSeleccionado, cantidad } = formData

    // Verificar si el producto ya está en la lista
    const productoExistente = formData.productosAgregados.findIndex((p) => p.id === productoSeleccionado.id)

    const nuevosProductos = [...formData.productosAgregados]

    if (productoExistente !== -1) {
      // Actualizar cantidad si el producto ya existe
      const nuevaCantidad = Number.parseInt(nuevosProductos[productoExistente].cantidad) + Number.parseInt(cantidad)

      // Validar que la cantidad total no exceda el límite
      if (nuevaCantidad > 1000) {
        toast.error(
          <div>
            <strong>Error</strong>
            <p>La cantidad total para este producto no puede exceder 1000 unidades.</p>
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

      nuevosProductos[productoExistente] = {
        ...nuevosProductos[productoExistente],
        cantidad: nuevaCantidad,
      }

      // Recalcular subtotal y total con IVA
      nuevosProductos[productoExistente].subtotal =
        nuevosProductos[productoExistente].cantidad * nuevosProductos[productoExistente].precioUnitario

      nuevosProductos[productoExistente].totalConIVA =
        nuevosProductos[productoExistente].subtotal * (1 + nuevosProductos[productoExistente].iva / 100)
    } else {
      // Agregar nuevo producto
      const subtotal = Number.parseInt(cantidad) * productoSeleccionado.precioUnitario
      const totalConIVA = subtotal * (1 + productoSeleccionado.iva / 100)

      nuevosProductos.push({
        id: productoSeleccionado.id,
        codigoBarras: productoSeleccionado.codigoBarras,
        nombre: productoSeleccionado.nombre,
        cantidad: Number.parseInt(cantidad),
        precioUnitario: productoSeleccionado.precioUnitario,
        iva: productoSeleccionado.iva,
        subtotal: subtotal,
        totalConIVA: totalConIVA,
      })
    }

    // Actualizar el estado
    setFormData({
      ...formData,
      productosAgregados: nuevosProductos,
      productoSeleccionado: null,
      cantidad: 1,
    })

    // Limpiar el error de productos agregados si existía
    if (formErrors.productosAgregados) {
      setFormErrors({
        ...formErrors,
        productosAgregados: "",
      })
    }

    // Notificación de éxito
    toast.success(
      <div>
        <strong>Producto agregado</strong>
        <p>El producto ha sido agregado a la lista.</p>
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
   * Manejador para eliminar un producto de la lista
   * @param {number} index - Índice del producto a eliminar
   */
  const handleRemoveProduct = (index) => {
    const nuevosProductos = [...formData.productosAgregados]
    nuevosProductos.splice(index, 1)

    setFormData({
      ...formData,
      productosAgregados: nuevosProductos,
    })

    // Notificación
    toast.info(
      <div>
        <strong>Producto eliminado</strong>
        <p>El producto ha sido eliminado de la lista.</p>
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
   * Función para calcular los totales de la compra
   * @returns {Object} Objeto con montoTotal, totalIVA y montoTotalConIVA
   */
  const calcularTotales = () => {
    const productos = formData.productosAgregados

    const montoTotal = productos.reduce((total, producto) => total + producto.subtotal, 0)
    const totalIVA = productos.reduce((total, producto) => {
      return total + producto.subtotal * (producto.iva / 100)
    }, 0)
    const montoTotalConIVA = montoTotal + totalIVA

    return {
      montoTotal,
      totalIVA,
      montoTotalConIVA,
    }
  }

  /**
   * Validar el formulario completo antes de guardar
   * @returns {boolean} True si el formulario es válido, false en caso contrario
   */
  const validateForm = () => {
    let isValid = true
    const errors = { ...formErrors }

    // Validar proveedor
    if (!formData.proveedor) {
      errors.proveedor = "Por favor, seleccione un proveedor"
      isValid = false
    }

    // Validar fecha de compra
    if (!formData.fechaCompra) {
      errors.fechaCompra = "Por favor, seleccione una fecha de compra"
      isValid = false
    } else {
      const fechaCompra = new Date(formData.fechaCompra)
      const hoy = new Date()
      hoy.setHours(23, 59, 59, 999) // Fin del día actual

      if (fechaCompra > hoy) {
        errors.fechaCompra = "La fecha de compra no puede ser futura"
        isValid = false
      }

      // Validar que la fecha no sea muy antigua (más de 1 año)
      const unAnioAtras = new Date()
      unAnioAtras.setFullYear(unAnioAtras.getFullYear() - 1)

      if (fechaCompra < unAnioAtras) {
        errors.fechaCompra = "La fecha de compra no puede ser mayor a un año"
        isValid = false
      }
    }

    // Validar que haya productos agregados
    if (formData.productosAgregados.length === 0) {
      errors.productosAgregados = "Por favor, agregue al menos un producto a la compra"
      isValid = false
    }

    // Validar monto total (para evitar errores de entrada)
    const { montoTotalConIVA } = calcularTotales()
    if (montoTotalConIVA > 100000000) {
      // 100 millones
      toast.error(
        <div>
          <strong>Error</strong>
          <p>El monto total de la compra es demasiado alto. Por favor, verifique las cantidades y precios.</p>
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
      isValid = false
    }

    setFormErrors(errors)
    return isValid
  }

  /**
   * Manejador para guardar la compra
   * Valida los datos y envía la información para registrar la compra
   */
  const handleSaveCompra = () => {
    // Validar el formulario
    if (!validateForm()) {
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

    // Calcular totales
    const { montoTotal, totalIVA, montoTotalConIVA } = calcularTotales()

    // Preparar datos para guardar
    const compraData = {
      id: isEditing ? Number(compraId) : Date.now(),
      codigoFactura: formData.codigoFactura,
      representante: formData.proveedor.representante,
      proveedor: formData.proveedor,
      fechaCompra: formData.fechaCompra,
      montoTotal: montoTotal,
      totalIVA: totalIVA,
      montoTotalConIVA: montoTotalConIVA,
      productos: [...formData.productosAgregados],
      estado: "Efectiva",
    }

    // Aquí se implementaría el envío de datos a la API
    try {
      // Simular envío de datos
      console.log("Datos de la compra a guardar:", compraData)

      // Mostrar notificación de éxito
      toast.success(
        <div>
          <strong>{isEditing ? "Compra actualizada" : "Compra registrada"}</strong>
          <p>
            La compra con código "{formData.codigoFactura}" ha sido {isEditing ? "actualizada" : "registrada"}{" "}
            correctamente.
          </p>
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
            // Redirigir a la lista de compras después de que se cierre la notificación
            navigate("/compras/compras")
          },
        },
      )
    } catch (error) {
      console.error("Error al guardar la compra:", error)
      toast.error(
        <div>
          <strong>Error</strong>
          <p>No se pudo {isEditing ? "actualizar" : "registrar"} la compra. Por favor, intente nuevamente.</p>
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
    }
  }

  /**
   * Manejador para cancelar y volver a la lista de compras
   */
  const handleCancel = () => {
    navigate("/compras/compras")
  }

  // Opciones para el select de productos
  const productosOptions = productos.map((producto) => ({
    value: producto,
    label: `${producto.nombre} - ${producto.codigoBarras} - $${formatNumber(producto.precioUnitario)}`,
  }))

  // Opciones para el select de proveedores
  const proveedoresOptions = proveedores.map((proveedor) => ({
    value: proveedor,
    label: `${proveedor.representante} - ${proveedor.documento}`,
  }))

  return (
    <div className="registrar-compra-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>{isEditing ? "Editar Compra" : "Registrar Compra"}</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Compras
        </button>
      </div>

      {error ? (
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Error</h4>
          <p>{error}</p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body">
            <form className="compra-form">
              {/* Sección de información básica de la compra */}
              <CompraForm
                formData={formData}
                formErrors={formErrors}
                proveedoresOptions={proveedoresOptions}
                productosOptions={productosOptions}
                handleInputChange={handleInputChange}
                handleSelectProveedor={handleSelectProveedor}
                handleSelectProduct={handleSelectProduct}
                handleAddProduct={handleAddProduct}
              />

              {/* Tabla de productos agregados */}
              <ProductosTable
                productosAgregados={formData.productosAgregados}
                formErrors={formErrors}
                formatNumber={formatNumber}
                handleRemoveProduct={handleRemoveProduct}
              />

              {/* Resumen de la compra */}
              <div className="row mt-4">
                <div className="col-md-6">
                  <ResumenCompra totales={calcularTotales()} formatNumber={formatNumber} />
                </div>
              </div>

              <div className="d-flex justify-content-end mt-4">
                <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveCompra}>
                  <Save size={18} className="me-1" />
                  {isEditing ? "Actualizar Compra" : "Registrar Compra"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default RegistrarCompra

