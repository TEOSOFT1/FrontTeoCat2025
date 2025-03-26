"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Save, ArrowLeft, Trash2, Plus, FileText } from "lucide-react"
import Select from "react-select"
import "../../Styles/AdminStyles/RegistrarVenta.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

const RegistrarVenta = () => {
  const navigate = useNavigate()

  // Estado para los productos disponibles
  const [productos, setProductos] = useState([])

  // Estado para los clientes disponibles
  const [clientes, setClientes] = useState([])

  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigoFactura: "",
    cliente: null,
    fechaVenta: new Date().toISOString().split("T")[0],
    productosAgregados: [],
    productoSeleccionado: null,
    cantidad: 1,
  })

  // Referencias para las notificaciones
  const toastIds = useRef({})

  // Generar un código de factura único
  const generateInvoiceCode = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `VENT-${year}-${randomNum}`
  }

  // Inicializar el formulario
  useEffect(() => {
    setFormData({
      codigoFactura: generateInvoiceCode(),
      cliente: null,
      fechaVenta: new Date().toISOString().split("T")[0],
      productosAgregados: [],
      productoSeleccionado: null,
      cantidad: 1,
    })
  }, [])

  // Función para formatear números con separadores de miles
  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")
  }

  // Manejador para cambios en los inputs del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  // Manejador para seleccionar un producto
  const handleSelectProduct = (selectedOption) => {
    setFormData({
      ...formData,
      productoSeleccionado: selectedOption ? selectedOption.value : null,
    })
  }

  // Manejador para seleccionar un cliente
  const handleSelectCliente = (selectedOption) => {
    setFormData({
      ...formData,
      cliente: selectedOption ? selectedOption.value : null,
    })
  }

  // Manejador para agregar un producto a la lista
  const handleAddProduct = () => {
    const { productoSeleccionado, cantidad } = formData

    // Validaciones
    if (!productoSeleccionado) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, seleccione un producto.</p>
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

    if (!cantidad || cantidad <= 0) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, ingrese una cantidad válida.</p>
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

    // Verificar si el producto ya está en la lista
    const productoExistente = formData.productosAgregados.findIndex((p) => p.id === productoSeleccionado.id)

    const nuevosProductos = [...formData.productosAgregados]

    if (productoExistente !== -1) {
      // Actualizar cantidad si el producto ya existe
      nuevosProductos[productoExistente] = {
        ...nuevosProductos[productoExistente],
        cantidad: Number.parseInt(nuevosProductos[productoExistente].cantidad) + Number.parseInt(cantidad),
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

  // Manejador para eliminar un producto de la lista
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

  // Calcular totales
  const calcularTotales = () => {
    const productos = formData.productosAgregados

    const subtotal = productos.reduce((total, producto) => total + producto.subtotal, 0)
    const totalIVA = productos.reduce((total, producto) => {
      return total + producto.subtotal * (producto.iva / 100)
    }, 0)
    const total = subtotal + totalIVA

    return {
      subtotal,
      totalIVA,
      total,
    }
  }

  // Manejador para guardar la venta
  const handleSaveVenta = () => {
    // Validaciones básicas
    if (!formData.cliente) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, seleccione un cliente.</p>
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

    if (formData.productosAgregados.length === 0) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, agregue al menos un producto a la venta.</p>
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
    const { subtotal, totalIVA, total } = calcularTotales()

    // Preparar datos para guardar
    const ventaData = {
      codigoFactura: formData.codigoFactura,
      cliente: formData.cliente,
      fechaVenta: formData.fechaVenta,
      subtotal: subtotal,
      totalIVA: totalIVA,
      total: total,
      productos: [...formData.productosAgregados],
      estado: "Completada",
    }

    // Aquí normalmente enviaríamos los datos al servidor
    // Por ahora, solo mostraremos una notificación y redirigiremos

    toast.success(
      <div>
        <strong>Venta registrada</strong>
        <p>La venta con código "{formData.codigoFactura}" ha sido registrada correctamente.</p>
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

  // Definición de columnas para la tabla de productos agregados
  const productosAgregadosColumns = [
    { field: "codigoBarras", header: "Código de Barras" },
    { field: "nombre", header: "Nombre del Producto" },
    { field: "cantidad", header: "Cantidad" },
    {
      field: "precioUnitario",
      header: "Precio Unitario",
      render: (row) => `$${formatNumber(row.precioUnitario)}`,
    },
    {
      field: "iva",
      header: "IVA",
      render: (row) => `${row.iva}%`,
    },
    {
      field: "subtotal",
      header: "Subtotal",
      render: (row) => `$${formatNumber(row.subtotal)}`,
    },
    {
      field: "totalConIVA",
      header: "Total con IVA",
      render: (row) => `$${formatNumber(row.totalConIVA)}`,
    },
    {
      field: "acciones",
      header: "Acciones",
      render: (row, index) => (
        <button className="btn btn-sm btn-danger" onClick={() => handleRemoveProduct(index)}>
          <Trash2 size={16} />
        </button>
      ),
    },
  ]

  // Opciones para el select de productos
  const productosOptions = productos.map((producto) => ({
    value: producto,
    label: `${producto.nombre} - ${producto.codigoBarras} - $${formatNumber(producto.precioUnitario)}`,
  }))

  // Opciones para el select de clientes
  const clientesOptions = clientes.map((cliente) => ({
    value: cliente,
    label: `${cliente.nombre} - ${cliente.documento}`,
  }))

  // Estilos personalizados para react-select
  const customSelectStyles = {
    control: (provided, state) => ({
      ...provided,
      borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      boxShadow: state.isFocused ? "0 0 0 0.25rem rgba(13, 110, 253, 0.25)" : null,
      "&:hover": {
        borderColor: state.isFocused ? "#86b7fe" : "#ced4da",
      },
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? "#0d6efd" : state.isFocused ? "#f8f9fa" : null,
      color: state.isSelected ? "white" : "black",
    }),
  }

  return (
    <div className="registrar-venta-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Registrar Venta</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Ventas
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form className="venta-form">
            <div className="row mb-3">
              <div className="col-md-4">
                <label htmlFor="codigoFactura" className="form-label">
                  Código de Factura
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="codigoFactura"
                  name="codigoFactura"
                  value={formData.codigoFactura}
                  readOnly
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="cliente" className="form-label">
                  Cliente <span className="text-danger">*</span>
                </label>
                <Select
                  id="cliente"
                  name="cliente"
                  options={clientesOptions}
                  value={
                    formData.cliente ? clientesOptions.find((option) => option.value.id === formData.cliente.id) : null
                  }
                  onChange={handleSelectCliente}
                  placeholder="Seleccione un cliente..."
                  styles={customSelectStyles}
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "No se encontraron clientes"}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="fechaVenta" className="form-label">
                  Fecha de Venta <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaVenta"
                  name="fechaVenta"
                  value={formData.fechaVenta}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <hr className="my-4" />

            <h5 className="mb-3">Agregar Productos</h5>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="producto" className="form-label">
                  Producto
                </label>
                <Select
                  id="producto"
                  name="producto"
                  options={productosOptions}
                  value={
                    formData.productoSeleccionado
                      ? productosOptions.find((option) => option.value.id === formData.productoSeleccionado.id)
                      : null
                  }
                  onChange={handleSelectProduct}
                  placeholder="Seleccione un producto..."
                  styles={customSelectStyles}
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "No se encontraron productos"}
                />
              </div>
              <div className="col-md-2">
                <label htmlFor="cantidad" className="form-label">
                  Cantidad
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="cantidad"
                  name="cantidad"
                  value={formData.cantidad}
                  onChange={handleInputChange}
                  min="1"
                  disabled={!formData.productoSeleccionado}
                />
              </div>
              <div className="col-md-4 d-flex align-items-end">
                <button
                  type="button"
                  className="btn btn-success ms-auto"
                  onClick={handleAddProduct}
                  disabled={!formData.productoSeleccionado}
                >
                  <Plus size={18} className="me-1" />
                  Agregar
                </button>
              </div>
            </div>

            <div className="table-responsive mt-4">
              <table className="table table-striped table-bordered">
                <thead className="table-primary">
                  <tr>
                    {productosAgregadosColumns.map((column) => (
                      <th key={column.field}>{column.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {formData.productosAgregados.length > 0 ? (
                    formData.productosAgregados.map((producto, index) => (
                      <tr key={`${producto.id}-${index}`}>
                        {productosAgregadosColumns.map((column) => (
                          <td key={`${producto.id}-${column.field}`}>
                            {column.render ? column.render(producto, index) : producto[column.field]}
                          </td>
                        ))}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={productosAgregadosColumns.length} className="text-center py-3">
                        No hay productos agregados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="row mt-4">
              <div className="col-md-6">
                <div className="card">
                  <div className="card-header bg-light">
                    <h5 className="mb-0 d-flex align-items-center">
                      <FileText size={18} className="me-2" />
                      Resumen de la Venta
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Subtotal:</strong>
                      <span>${formatNumber(calcularTotales().subtotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Total IVA:</strong>
                      <span>${formatNumber(calcularTotales().totalIVA)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <span className="text-primary fw-bold">${formatNumber(calcularTotales().total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveVenta}>
                <Save size={18} className="me-1" />
                Registrar Venta
              </button>
            </div>
          </form>
        </div>
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

export default RegistrarVenta

