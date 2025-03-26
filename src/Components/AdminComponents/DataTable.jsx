"use client"

import { useState, useEffect } from "react"
import { Search, Download, FileText, Plus } from "lucide-react"

const DataTable = ({
  columns,
  data,
  itemsPerPage = 10,
  addButtonLabel = "Agregar",
  showAddButton = true,
  showExportButton = true,
  onAdd,
  onExportExcel,
  onExportPdf,
  searchPlaceholder = "Buscar...",
  loading = false,
}) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [filteredData, setFilteredData] = useState(data)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setFilteredData(data)
  }, [data])

  // Búsqueda
  const handleSearch = (term) => {
    setSearchTerm(term)
    setCurrentPage(1)

    if (!term) {
      setFilteredData(data)
      return
    }

    const filtered = data.filter((item) => {
      return Object.values(item).join(" ").toLowerCase().includes(term.toLowerCase())
    })

    setFilteredData(filtered)
  }

  // Paginación
  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentData = filteredData.slice(startIndex, endIndex)

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  // Manejador para exportar a Excel (por defecto)
  const handleExportExcel = () => {
    if (onExportExcel) {
      onExportExcel()
    } else if (onExportPdf) {
      // Si no hay manejador específico para Excel pero sí para PDF, usamos ese
      onExportPdf()
    }
  }

  // Manejador para exportar a PDF
  const handleExportPdf = () => {
    if (onExportPdf) {
      onExportPdf()
    } else if (onExportExcel) {
      // Si no hay manejador específico para PDF pero sí para Excel, usamos ese
      onExportExcel()
    }
  }

  // Generar elementos de paginación
  const renderPaginationItems = () => {
    const items = []

    // Primera página
    if (currentPage > 2) {
      items.push(
        <li key="first" className={`page-item ${currentPage === 1 ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(1)}>
            1
          </button>
        </li>,
      )
    }

    // Ellipsis después de la primera página
    if (currentPage > 3) {
      items.push(
        <li key="ellipsis-start" className="page-item disabled">
          <span className="page-link">...</span>
        </li>,
      )
    }

    // Páginas alrededor de la página actual
    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      items.push(
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(i)}>
            {i}
          </button>
        </li>,
      )
    }

    // Ellipsis antes de la última página
    if (currentPage < totalPages - 2) {
      items.push(
        <li key="ellipsis-end" className="page-item disabled">
          <span className="page-link">...</span>
        </li>,
      )
    }

    // Última página (si hay más de una página y no es la actual)
    if (totalPages > 1 && currentPage < totalPages - 1) {
      items.push(
        <li key="last" className={`page-item ${currentPage === totalPages ? "active" : ""}`}>
          <button className="page-link" onClick={() => handlePageChange(totalPages)}>
            {totalPages}
          </button>
        </li>,
      )
    }

    return items
  }

  return (
    <div className="card data-table-card">
      <div className="card-body p-0">
        {/* Barra de herramientas integrada */}
        <div className="table-toolbar p-3 border-bottom">
          <div className="row align-items-center">
            <div className={`col-12 ${showAddButton || showExportButton ? "col-md-6" : ""} mb-2 mb-md-0`}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control search-input"
                  placeholder={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <span className="input-group-text search-icon">
                  <Search size={18} />
                </span>
              </div>
            </div>

            {(showAddButton || showExportButton) && (
              <div className="col-12 col-md-6">
                <div className="d-flex gap-2 justify-content-md-end">
                  {showAddButton && (
                    <button className="btn btn-primary d-flex align-items-center" onClick={onAdd}>
                      <Plus size={18} className="me-1" />
                      {addButtonLabel}
                    </button>
                  )}

                  {showExportButton && (
                    <div className="btn-group">
                      <button
                        className="btn btn-outline-success d-flex align-items-center"
                        onClick={handleExportExcel}
                        title="Exportar a Excel"
                      >
                        <Download size={18} className="me-1" />
                        <span className="d-none d-sm-inline">Excel</span>
                      </button>
                      <button
                        className="btn btn-outline-danger d-flex align-items-center"
                        onClick={handleExportPdf}
                        title="Exportar a PDF"
                      >
                        <FileText size={18} className="me-1" />
                        <span className="d-none d-sm-inline">PDF</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                {columns.map((column, index) => (
                  <th
                    key={index}
                    className={`${column.className || ""} ${column.field === "acciones" ? "text-center" : ""}`}
                  >
                    {column.header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2 mb-0">Cargando datos...</p>
                  </td>
                </tr>
              ) : currentData.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                    <p className="mb-0">No se encontraron registros</p>
                  </td>
                </tr>
              ) : (
                currentData.map((row, rowIndex) => (
                  <tr key={rowIndex}>
                    {columns.map((column, colIndex) => (
                      <td
                        key={colIndex}
                        className={`${column.className || ""} ${column.field === "acciones" ? "text-center" : ""}`}
                      >
                        {column.render ? column.render(row) : row[column.field]}
                      </td>
                    ))}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 0 && (
          <div className="pagination-wrapper p-3 border-top">
            <div className="d-flex justify-content-between align-items-center flex-wrap">
              <div className="pagination-info small text-muted">
                Mostrando {filteredData.length > 0 ? startIndex + 1 : 0} a {Math.min(endIndex, filteredData.length)} de{" "}
                {filteredData.length} registros
              </div>

              <nav aria-label="Navegación de páginas">
                <ul className="pagination pagination-sm mb-0">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                      aria-label="Anterior"
                    >
                      <span aria-hidden="true">&laquo;</span>
                    </button>
                  </li>

                  {renderPaginationItems()}

                  <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      aria-label="Siguiente"
                    >
                      <span aria-hidden="true">&raquo;</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default DataTable

