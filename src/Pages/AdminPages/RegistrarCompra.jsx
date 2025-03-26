"use client"

import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Save, ArrowLeft, Trash2, Plus, FileText } from "lucide-react"
import Select from "react-select"
import "../../Styles/AdminStyles/RegistrarCompra.css"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import "../../Styles/AdminStyles/ToastStyles.css"

/**
 * Componente para registrar compras de productos
 * Permite seleccionar proveedor, agregar productos y registrar la compra
 */
const RegistrarCompra = () => {
  const navigate = useNavigate()

  // Estado para los productos disponibles
  const [productos, setProductos] = useState([])

  // Estado para los proveedores disponibles
  const [proveedores, setProveedores] = useState([])

  // Estado para el formulario
  const [formData, setFormData] = useState({
    codigoFactura: "",
    proveedor: null,
    fechaCompra: new Date().toISOString().split("T")[0],
    productosAgregados: [],
    productoSeleccionado: null,
    cantidad: 1,
  })

  // Referencias para las notificaciones
  const toastIds = useRef({})

  /**
   * Función para generar un código de factura único
   * @returns {string} Código de factura generado
   */
  const generateInvoiceCode = () => {
    const year = new Date().getFullYear()
    const randomNum = Math.floor(Math.random() * 1000)
      .toString()
      .padStart(3, "0")
    return `COMP-${year}-${randomNum}`
  }

  /**
   * Efecto para cargar datos iniciales
   * Aquí se implementarán las llamadas a la API con Axios
   */
  useEffect(() => {
    // Aquí se implementará la carga de datos desde la API
  }, [])

  /**
   * Efecto para inicializar el formulario
   * Genera un código de factura único y establece la fecha actual
   */
  useEffect(() => {
    setFormData({
      codigoFactura: generateInvoiceCode(),
      proveedor: null,
      fechaCompra: new Date().toISOString().split("T")[0],
      productosAgregados: [],
      productoSeleccionado: null,
      cantidad: 1,
    })
  }, [])

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
  }

  /**
   * Manejador para agregar un producto a la lista
   * Valida los datos y agrega el producto a la lista de productos de la compra
   */
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
   * Manejador para guardar la compra
   * Valida los datos y envía la información para registrar la compra
   */
  const handleSaveCompra = () => {
    // Validaciones básicas
    if (!formData.proveedor) {
      toast.error(
        <div>
          <strong>Error</strong>
          <p>Por favor, seleccione un proveedor.</p>
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
          <p>Por favor, agregue al menos un producto a la compra.</p>
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

    // Aquí se implementará el envío de datos a la API

    toast.success(
      <div>
        <strong>Compra registrada</strong>
        <p>La compra con código "{formData.codigoFactura}" ha sido registrada correctamente.</p>
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
  }

  /**
   * Manejador para cancelar y volver a la lista de compras
   */
  const handleCancel = () => {
    navigate("/compras/compras")
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

  // Opciones para el select de proveedores
  const proveedoresOptions = proveedores.map((proveedor) => ({
    value: proveedor,
    label: `${proveedor.representante} - ${proveedor.documento}`,
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
    <div className="registrar-compra-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Registrar Compra</h2>
        <button className="btn btn-outline-secondary d-flex align-items-center" onClick={handleCancel}>
          <ArrowLeft size={18} className="me-1" />
          Volver a Compras
        </button>
      </div>

      <div className="card">
        <div className="card-body">
          <form className="compra-form">
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
                <label htmlFor="proveedor" className="form-label">
                  Proveedor <span className="text-danger">*</span>
                </label>
                <Select
                  id="proveedor"
                  name="proveedor"
                  options={proveedoresOptions}
                  value={
                    formData.proveedor
                      ? proveedoresOptions.find((option) => option.value.id === formData.proveedor.id)
                      : null
                  }
                  onChange={handleSelectProveedor}
                  placeholder="Seleccione un proveedor..."
                  styles={customSelectStyles}
                  isClearable
                  isSearchable
                  noOptionsMessage={() => "No se encontraron proveedores"}
                />
              </div>
              <div className="col-md-4">
                <label htmlFor="fechaCompra" className="form-label">
                  Fecha de Compra <span className="text-danger">*</span>
                </label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaCompra"
                  name="fechaCompra"
                  value={formData.fechaCompra}
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
                      Resumen de la Compra
                    </h5>
                  </div>
                  <div className="card-body">
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Monto Total:</strong>
                      <span>${formatNumber(calcularTotales().montoTotal)}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-2">
                      <strong>Total IVA:</strong>
                      <span>${formatNumber(calcularTotales().totalIVA)}</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Monto Total con IVA:</strong>
                      <span className="text-primary fw-bold">${formatNumber(calcularTotales().montoTotalConIVA)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex justify-content-end mt-4">
              <button type="button" className="btn btn-secondary me-2" onClick={handleCancel}>
                Cancelar
              </button>
              <button type="button" className="btn btn-primary d-flex align-items-center" onClick={handleSaveCompra}>
                <Save size={18} className="me-1" />
                Registrar Compra
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

export default RegistrarCompra

