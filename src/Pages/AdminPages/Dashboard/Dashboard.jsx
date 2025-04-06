"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts"
import { Calendar, ChevronDown, TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import "../Dashboard/Dashboard.scss"

const Dashboard = () => {
  const [selectedYear, setSelectedYear] = useState("2022")
  const [selectedMonth, setSelectedMonth] = useState("Todos los meses")
  const [showYearDropdown, setShowYearDropdown] = useState(false)
  const [showMonthDropdown, setShowMonthDropdown] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Datos de ventas mensuales
  const salesData = {
    "2022": {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      values: [120000, 150000, 180000, 200000, 220000, 240000, 260000, 280000, 300000, 320000, 360000, 380000],
    },
    "2023": {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      values: [140000, 170000, 200000, 220000, 240000, 260000, 280000, 300000, 320000, 340000, 380000, 400000],
    },
    "2024": {
      labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
      values: [160000, 190000, 220000, 240000, 260000, 280000, 300000, 320000, 340000, 360000, 400000, 420000],
    },
  }

  // Datos para los gráficos de productos más vendidos (solo top 3)
  const topProducts = [
    { name: "Comida Premium para Perros", value: 40.5, icon: "🐕" },
    { name: "Juguete Interactivo para Gatos", value: 32.4, icon: "🐈" },
    { name: "Cama Ortopédica para Perros", value: 27.1, icon: "🐕" },
  ]

  // Datos para los gráficos de productos menos vendidos (solo top 3)
  const leastSoldProducts = [
    { name: "Collar GPS para Gatos", value: 5.5, icon: "🐈" },
    { name: "Cepillo Eléctrico para Perros", value: 4.3, icon: "🐕" },
    { name: "Fuente de Agua para Mascotas", value: 3.2, icon: "💧" },
  ]

  // Obtener datos según selección
  const getCurrentData = () => {
    if (selectedMonth === "Todos los meses") {
      return salesData[selectedYear].labels.map((month, index) => ({
        name: month,
        value: salesData[selectedYear].values[index],
        icon: index % 2 === 0 ? "🐕" : "🐈",
      }))
    } else {
      const monthIndex = salesData[selectedYear].labels.indexOf(selectedMonth)
      return [
        {
          name: selectedMonth,
          value: salesData[selectedYear].values[monthIndex],
          icon: monthIndex % 2 === 0 ? "🐕" : "🐈",
        },
      ]
    }
  }

  const currentData = getCurrentData()
  const isSingleMonth = currentData.length === 1

  // Cerrar dropdowns al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".year-selector") && !event.target.closest(".year-dropdown")) {
        setShowYearDropdown(false)
      }
      if (!event.target.closest(".month-selector") && !event.target.closest(".month-dropdown")) {
        setShowMonthDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Efecto para simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 300)

    return () => clearTimeout(timer)
  }, [])

  // Renderizado para los puntos de datos con iconos de mascotas
  const CustomizedDot = (props) => {
    const { cx, cy, payload } = props

    return (
      <g>
        <text x={cx} y={cy - 15} textAnchor="middle" fill="#333" fontSize="14px">
          {payload.icon}
        </text>
        <circle cx={cx} cy={cy} r={4} fill="#00BFFF" stroke="#fff" strokeWidth={2} />
      </g>
    )
  }

  const CustomizedDotTop = (props) => {
    const { cx, cy, payload } = props

    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#333" fontSize="12px">
          {payload.icon}
        </text>
        <circle cx={cx} cy={cy} r={3} fill="#FF00FF" stroke="#fff" strokeWidth={1} />
      </g>
    )
  }

  const CustomizedDotLeast = (props) => {
    const { cx, cy, payload } = props

    return (
      <g>
        <text x={cx} y={cy - 10} textAnchor="middle" fill="#333" fontSize="12px">
          {payload.icon}
        </text>
        <circle cx={cx} cy={cy} r={3} fill="#00FF00" stroke="#fff" strokeWidth={1} />
      </g>
    )
  }

  // Animaciones para los elementos - simplificadas
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 10, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 50,
        damping: 10,
      },
    },
  }

  // Renderizado personalizado para barras con iconos
  const CustomizedBar = (props) => {
    const { x, y, width, height, payload } = props

    return (
      <g>
        <rect x={x} y={y} width={width} height={height} fill="#00BFFF" rx={4} ry={4} />
        <text x={x + width + 10} y={y + height / 2 + 5} textAnchor="start" fill="#333" fontSize="14px">
          {payload.icon}
        </text>
      </g>
    )
  }

  return (
    <div className="dashboard">
      <div className="animated-background">
        <div className="light-beam light-beam-1"></div>
        <div className="light-beam light-beam-2"></div>
        <div className="light-beam light-beam-3"></div>
        <div className="floating-paws">
          <span className="paw paw-1">🐾</span>
          <span className="paw paw-2">🐾</span>
          <span className="paw paw-3">🐾</span>
          <span className="paw paw-4">🐾</span>
          <span className="paw paw-5">🐾</span>
        </div>
      </div>

      <motion.div
        className="dashboard-header"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <h1 className="pulse-animation">Dashboard</h1>
        <div className="date-display">
          <Calendar size={16} />
          <span>
            {new Date().toLocaleDateString("es-ES", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </span>
        </div>
      </motion.div>

      <motion.div
        className="filters-container"
        initial={{ opacity: 0, y: -5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="year-month-filters">
          <div className="filter">
            <div className="year-selector" onClick={() => setShowYearDropdown(!showYearDropdown)}>
              <span>{selectedYear}</span>
              <ChevronDown size={16} />
            </div>

            {showYearDropdown && (
              <motion.div
                className="year-dropdown"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                {Object.keys(salesData).map((year) => (
                  <div
                    key={year}
                    className={`dropdown-item ${year === selectedYear ? "active" : ""}`}
                    onClick={() => {
                      setSelectedYear(year)
                      setShowYearDropdown(false)
                    }}
                  >
                    {year}
                  </div>
                ))}
              </motion.div>
            )}
          </div>

          <div className="filter">
            <div className="month-selector" onClick={() => setShowMonthDropdown(!showMonthDropdown)}>
              <span>{selectedMonth}</span>
              <ChevronDown size={16} />
            </div>

            {showMonthDropdown && (
              <motion.div
                className="month-dropdown"
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  className={`dropdown-item ${selectedMonth === "Todos los meses" ? "active" : ""}`}
                  onClick={() => {
                    setSelectedMonth("Todos los meses")
                    setShowMonthDropdown(false)
                  }}
                >
                  Todos los meses
                </div>
                {salesData[selectedYear].labels.map((month, index) => (
                  <div
                    key={index}
                    className={`dropdown-item ${month === selectedMonth ? "active" : ""}`}
                    onClick={() => {
                      setSelectedMonth(month)
                      setShowMonthDropdown(false)
                    }}
                  >
                    {month}
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>

      <motion.div
        className="charts-layout"
        variants={containerVariants}
        initial="hidden"
        animate={isLoaded ? "visible" : "hidden"}
      >
        {/* Gráfico de Ventas (Principal) */}
        <motion.div className="chart-container main-chart" variants={itemVariants}>
          <div className="chart-header">
            <div className="chart-title">
              <div className="title-with-icon">
                <div className="icon-container">
                  <DollarSign className="chart-icon" />
                  <span className="icon-badge">🐾</span>
                </div>
                <h2>Ventas de Productos para Mascotas</h2>
              </div>
              <p className="chart-subtitle">
                {`Ventas ${selectedYear}${selectedMonth !== "Todos los meses" ? ` - ${selectedMonth}` : ""}`}
              </p>
            </div>
            <div className="chart-value">
              <span className="value">{currentData.reduce((sum, item) => sum + item.value, 0).toLocaleString()}</span>
              <span className="label">Total</span>
            </div>
          </div>

          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              {isSingleMonth ? (
                // Gráfico de barras para un solo mes
                <BarChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]}
                    labelStyle={{ color: "#333", fontWeight: "bold" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Bar dataKey="value" fill="#00BFFF" shape={<CustomizedBar />} className="bar-animation" />
                </BarChart>
              ) : (
                // Gráfico de líneas para múltiples meses
                <LineChart data={currentData} margin={{ top: 20, right: 30, left: 20, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#6b7280" }} />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    tickFormatter={(value) => `$${value / 1000}k`}
                  />
                  <Tooltip
                    formatter={(value) => [`$${value.toLocaleString()}`, "Ventas"]}
                    labelStyle={{ color: "#333", fontWeight: "bold" }}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#00BFFF"
                    strokeWidth={3}
                    dot={<CustomizedDot />}
                    activeDot={{ r: 6, strokeWidth: 0, fill: "#00BFFF" }}
                    isAnimationActive={false}
                    className="line-animation"
                  />
                </LineChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="secondary-charts">
          {/* Gráfico de Productos Más Vendidos */}
          <motion.div className="chart-container top-products-chart" variants={itemVariants}>
            <div className="chart-header">
              <div className="chart-title">
                <div className="title-with-icon">
                  <div className="icon-container">
                    <TrendingUp className="chart-icon" />
                    <span className="icon-badge">🐕</span>
                  </div>
                  <h2>Top 3 Productos Más Vendidos</h2>
                </div>
                <p className="chart-subtitle">Top productos para mascotas</p>
              </div>
            </div>

            <div className="chart-content">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={topProducts} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    domain={[0, "dataMax + 10"]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    width={150}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Porcentaje"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#FF00FF"
                    strokeWidth={2}
                    dot={<CustomizedDotTop />}
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#FF00FF" }}
                    isAnimationActive={false}
                    layout="vertical"
                    className="line-animation-pink"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Gráfico de Productos Menos Vendidos */}
          <motion.div className="chart-container least-products-chart" variants={itemVariants}>
            <div className="chart-header">
              <div className="chart-title">
                <div className="title-with-icon">
                  <div className="icon-container">
                    <TrendingDown className="chart-icon" />
                    <span className="icon-badge">🐈</span>
                  </div>
                  <h2>Top 3 Productos Menos Vendidos</h2>
                </div>
                <p className="chart-subtitle">Productos con menor demanda</p>
              </div>
            </div>

            <div className="chart-content">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart
                  data={leastSoldProducts}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(0,0,0,0.05)" />
                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    domain={[0, "dataMax + 2"]}
                    tickFormatter={(value) => `${value}%`}
                  />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#6b7280" }}
                    width={150}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}%`, "Porcentaje"]}
                    contentStyle={{
                      backgroundColor: "rgba(255, 255, 255, 0.95)",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -5px rgba(0,0,0,0.1)",
                      border: "none",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#00FF00"
                    strokeWidth={2}
                    dot={<CustomizedDotLeast />}
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#00FF00" }}
                    isAnimationActive={false}
                    layout="vertical"
                    className="line-animation-green"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

export default Dashboard

