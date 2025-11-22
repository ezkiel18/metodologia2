import { useEffect, useState } from "react";
import dayjs from "../lib/dayjs";
import { getReservas, cancelarReserva } from "../api/reservas";
import type { Reserva } from "../api/types";
import toast from "react-hot-toast";

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
    setErr(null);
    const horas = dayjs(r.inicio).diff(dayjs(), "hour");

    if (horas < 12) {
      toast.error("No se puede cancelar con menos de 12 horas de anticipación.");
      return;
    }

    try {
      await cancelarReserva(r.id);
      toast.success("Reserva cancelada correctamente");
      await cargar();
    } catch (e: any) {
      toast.error(e.message ?? "Error al cancelar la reserva");
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
          {reservas.map((r) => (
            <li
              key={r.id}
              className="border bg-white rounded-lg p-4 shadow-sm flex items-center justify-between"
            >
              <div>
                <p><b>Cancha:</b> {r.idCancha}</p>
                <p><b>Horario:</b> {dayjs(r.inicio).format("DD/MM HH:mm")} – {dayjs(r.fin).format("HH:mm")}</p>
                <p><b>Precio:</b> ${r.precio}</p>
              </div>

              <button
                onClick={() => onCancelar(r)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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