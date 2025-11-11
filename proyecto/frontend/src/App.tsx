import { BrowserRouter, Routes, Route, NavLink } from "react-router-dom";
import Home from "./pages/Home";
import MisReservas from "./pages/MisReservas";

export default function App() {
  return (
    <BrowserRouter>
      <nav style={{display:"flex",gap:12,padding:12,borderBottom:"1px solid #ddd"}}>
        <NavLink to="/" end style={({isActive})=>({fontWeight:isActive?"700":"500"})}>Reservar</NavLink>
        <NavLink to="/mis-reservas" style={({isActive})=>({fontWeight:isActive?"700":"500"})}>Mis reservas</NavLink>
      </nav>
      <div style={{maxWidth:920,margin:"0 auto",padding:16}}>
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/mis-reservas" element={<MisReservas/>} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}