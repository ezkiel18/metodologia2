import { useEffect, useState } from "react";
import dayjs from "../lib/dayjs";
import { getReservas, cancelarReserva } from "../api/reservas";
import type { Reserva } from "../api/types";

const USUARIO_ID = "usuario-demo"; // mismo que en Home

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function cargar() {
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      // Trae las del día; podés quitar el filtro si querés ver futuras
      const hoy = dayjs().format("YYYY-MM-DD");
      const data = await getReservas({ fecha: hoy });
      setReservas(data.filter(r => r.idUsuario === USUARIO_ID));
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { cargar(); }, []);

  async function onCancelar(r: Reserva) {
    setErr(null); setMsg(null);
    // Validación UI (el backend también valida)
    const horas = dayjs(r.inicio).diff(dayjs(), "hour");
    if (horas < 12) {
      setErr("No se puede cancelar con menos de 12 horas de anticipación.");
      return;
    }
    try {
      await cancelarReserva(r.id);
      setMsg("Reserva cancelada correctamente.");
      await cargar();
    } catch (e: any) {
      setErr(e.message);
    }
  }

  if (loading) return <p>Cargando…</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Mis reservas</h1>

      {err && <p className="text-red-600 mt-2">Error: {err}</p>}
      {msg && <p className="text-green-700 mt-2">{msg}</p>}

      {reservas.length === 0 ? (
        <p className="mt-4">No tenés reservas para hoy.</p>
      ) : (
        <ul className="mt-4 grid gap-3">
          {reservas.map(r => (
            <li key={r.id} className="border rounded p-3">
              <div><b>Cancha:</b> {r.idCancha}</div>
              <div><b>Inicio:</b> {dayjs(r.inicio).format("DD/MM HH:mm")}</div>
              <div><b>Fin:</b> {dayjs(r.fin).format("DD/MM HH:mm")}</div>
              <div><b>Precio:</b> ${r.precio}</div>
              <button
                onClick={() => onCancelar(r)}
                className="mt-2 px-3 py-1 rounded bg-gray-200 hover:bg-gray-300"
              >
                Cancelar
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}