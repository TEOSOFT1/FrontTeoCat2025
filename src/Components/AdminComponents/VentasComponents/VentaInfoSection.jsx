"use client"

/**
 * Componente para mostrar la información de la venta
 */
const VentaInfoSection = ({ venta, formatNumber }) => {
  return (
    <div className="card mb-4">
      <div className="card-body">
        <div className="row">
          <div className="col-md-3">
            <label className="form-label">Nombre del Cliente</label>
            <input type="text" className="form-control" value={venta.cliente.nombre} readOnly />
          </div>
          <div className="col-md-3">
            <label className="form-label">Fecha de Venta</label>
            <input type="date" className="form-control" value={venta.fechaVenta} readOnly />
          </div>
          <div className="col-md-3">
            <label className="form-label">Número de Factura</label>
            <input type="text" className="form-control" value={venta.codigoFactura} readOnly />
          </div>
          <div className="col-md-3">
            <label className="form-label">Total de la Venta</label>
            <input type="text" className="form-control" value={`$${formatNumber(venta.total)}`} readOnly />
          </div>
        </div>
      </div>
    </div>
  )
}

export default VentaInfoSection

