import { BrowserRouter } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import AppRoutes from "./Routes/AppRoutes"
import "bootstrap/dist/css/bootstrap.min.css"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  )
}

export default App

