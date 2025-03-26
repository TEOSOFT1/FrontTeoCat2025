"use client"

import { useState } from "react"
import "../../Styles/AdminStyles/Dashboard.css"

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2022")
  const [selectedMonth, setSelectedMonth] = useState("Todos los meses")
  
  // Datos de ventas mensuales
  const salesData = {
    "2022": {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      values: [120000, 150000, 180000, 200000, 220000, 240000, 260000, 280000, 300000, 320000, 360000, 380000]
    },
    "2023": {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      values: [140000, 170000, 200000, 220000, 240000, 260000, 280000, 300000, 320000, 340000, 380000, 400000]
    },
    "2024": {
      labels: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      values: [160000, 190000, 220000, 240000, 260000, 280000, 300000, 320000, 340000, 360000, 400000, 420000]
    }
  }

  // Datos para los gráficos de productos
  const topProducts = [
    { name: 'Comida Premium para Perros', percentage: 40.5, color: '#6f42c1' },
    { name: 'Juguete Interactivo para Gatos', percentage: 32.4, color: '#20c997' },
    { name: 'Cama Ortopédica para Perros', percentage: 27.1, color: '#fd7e14' }
  ]

  const leastSoldProducts = [
    { name: 'Collar GPS para Gatos', percentage: 55.5, color: '#6f42c1' },
    { name: 'Cepillo Eléctrico para Perros', percentage: 33.3, color: '#20c997' },
    { name: 'Fuente de Agua para Mascotas', percentage: 11.2, color: '#fd7e14' }
  ]

  // Obtener datos según selección
  const getCurrentData = () => {
    if (selectedMonth === "Todos los meses") {
      return {
        labels: salesData[selectedYear].labels,
        values: salesData[selectedYear].values
      }
    } else {
      const monthIndex = salesData[selectedYear].labels.indexOf(selectedMonth)
      return {
        labels: [selectedMonth],
        values: [salesData[selectedYear].values[monthIndex]]
      }
    }
  }

  const currentData = getCurrentData()

  return (
    <div className="dashboard-container">
      {/* Título y Filtros */}
      <div className="header-row">
        <h5 className="mb-0">Ventas por Año/Mes</h5>
        <div className="filters">
          <div className="filter-item">
            <span className="filter-label">Año:</span>
            <select 
              className="form-select form-select-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="2022">2022</option>
              <option value="2023">2023</option>
              <option value="2024">2024</option>
            </select>
          </div>
          <div className="filter-item">
            <span className="filter-label">Mes:</span>
            <select 
              className="form-select form-select-sm"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            >
              <option value="Todos los meses">Todos los meses</option>
              {salesData[selectedYear].labels.map((month, index) => (
                <option key={index} value={month}>{month}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Título del gráfico */}
      <h6 className="chart-title">Ventas Anuales {selectedYear}</h6>

      {/* Contenedor principal */}
      <div className="main-container">
        {/* Gráfico de Barras */}
        <div className="chart-container">
          {/* Eje Y */}
          <div className="y-axis">
            <div>$400k</div>
            <div>$300k</div>
            <div>$200k</div>
            <div>$100k</div>
            <div>$0k</div>
          </div>
          
          {/* Barras */}
          <div className="bars-container">
            {currentData.labels.map((month, index) => (
              <div key={index} className="bar-column">
                <div className="bar-wrapper">
                  <div 
                    className="bar inverted"
                    style={{ 
                      height: `${(currentData.values[index] / 420000) * 100}%`,
                    }}
                  >
                    <span className="bar-value">${(currentData.values[index]/1000).toFixed(0)}k</span>
                  </div>
                </div>
                <span className="bar-label">{month.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráficos Circulares */}
        <div className="pie-charts">
          {/* Top 3 Productos Más Vendidos */}
          <div className="pie-chart-wrapper">
            <h6 className="pie-title">Top 3 Productos Más Vendidos</h6>
            <div className="pie-content">
              <div className="pie">
                <svg width="90" height="90" viewBox="0 0 100 100">
                  <circle r="25" cx="50" cy="50" fill="transparent" 
                    stroke={topProducts[0].color} 
                    strokeWidth="50" 
                    strokeDasharray={`${topProducts[0].percentage} ${100 - topProducts[0].percentage}`}
                    transform="rotate(-90) translate(-100, 0)"
                  />
                  <circle r="25" cx="50" cy="50" fill="transparent" 
                    stroke={topProducts[1].color} 
                    strokeWidth="50" 
                    strokeDasharray={`${topProducts[1].percentage} ${100 - topProducts[1].percentage}`}
                    strokeDashoffset={`${-topProducts[0].percentage}`}
                    transform="rotate(-90) translate(-100, 0)"
                  />
                  <circle r="25" cx="50" cy="50" fill="transparent" 
                    stroke={topProducts[2].color} 
                    strokeWidth="50" 
                    strokeDasharray={`${topProducts[2].percentage} ${100 - topProducts[2].percentage}`}
                    strokeDashoffset={`${-(topProducts[0].percentage + topProducts[1].percentage)}`}
                    transform="rotate(-90) translate(-100, 0)"
                  />
                  <circle r="15" cx="50" cy="50" fill="white" />
                </svg>
              </div>
              <div className="pie-legend">
                {topProducts.map((product, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: product.color }}></span>
                    <span className="legend-text">{product.name.split(' ')[0]}</span>
                    <span className="legend-value">{product.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top 3 Productos Menos Vendidos */}
          <div className="pie-chart-wrapper">
            <h6 className="pie-title">Top 3 Productos Menos Vendidos</h6>
            <div className="pie-content">
              <div className="pie">
                <svg width="90" height="90" viewBox="0 0 100 100">
                  <circle r="25" cx="50" cy="50" fill="transparent" 
                    stroke={leastSoldProducts[0].color} 
                    strokeWidth="50" 
                    strokeDasharray={`${leastSoldProducts[0].percentage} ${100 - leastSoldProducts[0].percentage}`}
                    transform="rotate(-90) translate(-100, 0)"
                  />
                  <circle r="25" cx="50" cy="50" fill="transparent" 
                    stroke={leastSoldProducts[1].color} 
                    strokeWidth="50" 
                    strokeDasharray={`${leastSoldProducts[1].percentage} ${100 - leastSoldProducts[1].percentage}`}
                    strokeDashoffset={`${-leastSoldProducts[0].percentage}`}
                    transform="rotate(-90) translate(-100, 0)"
                  />
                  <circle r="25" cx="50" cy="50" fill="transparent" 
                    stroke={leastSoldProducts[2].color} 
                    strokeWidth="50" 
                    strokeDasharray={`${leastSoldProducts[2].percentage} ${100 - leastSoldProducts[2].percentage}`}
                    strokeDashoffset={`${-(leastSoldProducts[0].percentage + leastSoldProducts[1].percentage)}`}
                    transform="rotate(-90) translate(-100, 0)"
                  />
                  <circle r="15" cx="50" cy="50" fill="white" />
                </svg>
              </div>
              <div className="pie-legend">
                {leastSoldProducts.map((product, index) => (
                  <div key={index} className="legend-item">
                    <span className="legend-color" style={{ backgroundColor: product.color }}></span>
                    <span className="legend-text">{product.name.split(' ')[0]}</span>
                    <span className="legend-value">{product.percentage}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard