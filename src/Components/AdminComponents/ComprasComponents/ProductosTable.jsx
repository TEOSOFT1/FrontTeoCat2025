"use client"

import { Trash2 } from "lucide-react"

/**
 * Componente para la tabla de productos agregados a la compra
 */
const ProductosTable = ({ productosAgregados, formErrors, formatNumber, handleRemoveProduct }) => {
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

  return (
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
          {productosAgregados.length > 0 ? (
            productosAgregados.map((producto, index) => (
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
  )
}

export default ProductosTable

