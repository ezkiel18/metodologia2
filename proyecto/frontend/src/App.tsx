import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import MisReservas from "./pages/MisReservas";
import ToastProvider from "./components/ToastProvider";

export default function App() {
  return (
    <BrowserRouter>
      <ToastProvider />

      <div className="min-h-screen bg-slate-100 text-slate-800">

        {/* NAVBAR */}
        <header className="bg-white border-b shadow-sm">
          <nav className="max-w-5xl mx-auto flex items-center gap-6 px-6 py-4">
            <h1 className="text-xl font-semibold">Reservas Pádel</h1>

            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "font-bold text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`
              }
            >
              Reservar
            </NavLink>

            <NavLink
              to="/mis-reservas"
              className={({ isActive }) =>
                `text-sm ${
                  isActive
                    ? "font-bold text-blue-600"
                    : "text-slate-600 hover:text-blue-600"
                }`
              }
            >
              Mis reservas
            </NavLink>
          </nav>
        </header>

        {/* CONTENIDO PRINCIPAL */}
        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mis-reservas" element={<MisReservas />} />
          </Routes>
        </main>

      </div>
    </BrowserRouter>
  );
}