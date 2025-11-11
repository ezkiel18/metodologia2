import { useEffect, useState } from "react";
import { getReservas, crearReserva } from "../api/reservas";
import { suscribirListaEspera } from "../api/listaEspera";
import { buildSlots } from "../utils/time";
import dayjs from "../lib/dayjs";
import CanchaSelector from "../components/CanchaSelector";

const USUARIO_ID = "usuario-demo";

export default function Home() {
  const [fecha, setFecha] = useState(dayjs().format("YYYY-MM-DD"));
  const [canchaId, setCanchaId] = useState("1");
  const [slots, setSlots] = useState<string[]>([]);
  const [reservas, setReservas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  // genera slots y trae reservas cuando cambia fecha/cancha
  useEffect(() => {
    setSlots(buildSlots(fecha));
    cargarReservas();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha, canchaId]);

  // polling cada 30s
  useEffect(() => {
    const id = setInterval(() => {
      cargarReservas(false);
    }, 30000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fecha, canchaId]);

  async function cargarReservas(showLoader = true) {
    if (showLoader) setLoading(true);
    setErr(null);
    try {
      const data = await getReservas({ fecha, idCancha: canchaId });
      setReservas(data);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      if (showLoader) setLoading(false);
    }
  }

  function estaOcupado(slot: string) {
    return reservas.some((r) =>
      dayjs(slot).isBetween(r.inicio, r.fin, "minute", "[)")
    );
  }

  async function handleReservar(slot: string) {
    try {
      await crearReserva({
        idCancha: canchaId,
        idUsuario: USUARIO_ID,
        inicio: slot,
      });
      await cargarReservas();
      alert("✅ Reserva creada");
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    }
  }

  async function handleEsperar(slot: string) {
    try {
      await suscribirListaEspera({
        idCancha: canchaId,
        idUsuario: USUARIO_ID,
        inicio: slot,
      });
      alert("🔔 Te suscribiste a la lista de espera");
    } catch (err: any) {
      alert(`❌ ${err.message}`);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Sistema de reservas de pádel</h1>

      <div className="flex gap-4 items-center mt-3">
        <label className="flex items-center gap-2">
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="border p-1"
          />
        </label>

        <CanchaSelector value={canchaId} onChange={setCanchaId} />
      </div>

      {err && <p className="text-red-600 mt-3">Error: {err}</p>}
      {loading && <p className="mt-3">Cargando disponibilidad…</p>}

      {!loading && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          {slots.map((s) => {
            const ocupado = estaOcupado(s);
            const hora = dayjs(s).format("HH:mm");
            return (
              <button
                key={s}
                disabled={false} // dejamos click activo; si está ocupado, suscribe a espera
                onClick={() => (ocupado ? handleEsperar(s) : handleReservar(s))}
                className={`p-3 rounded text-sm ${
                  ocupado
                    ? "bg-red-300 hover:bg-red-400"
                    : "bg-green-300 hover:bg-green-400"
                }`}
                title={ocupado ? "Ocupado — avisarme si se libera" : "Reservar"}
              >
                {hora} {ocupado ? "— ocupado" : ""}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}