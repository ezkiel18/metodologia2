import { useEffect, useState } from "react";
import { getReservas, crearReserva } from "../api/reservas";
import { suscribirListaEspera } from "../api/listaEspera";
import { buildSlots } from "../utils/time";
import dayjs from "../lib/dayjs";
import CanchaSelector from "../components/CanchaSelector";
import toast from "react-hot-toast";
import SlotButton from "../components/SlotButton";

const USUARIO_ID = "usuario-demo";

export default function Home() {
  const [fecha, setFecha] = useState(dayjs().format("YYYY-MM-DD"));
  const hoy = dayjs().format("YYYY-MM-DD");
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
  return reservas.some(
    (r) =>
      r.idCancha === canchaId &&    //filtra por cancha
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
      toast.success("Reserva creada correctamente");
    } catch (err: any) {
      toast.error(err.message ?? "Error al crear la reserva");
    }
  }

  async function handleEsperar(slot: string) {
    try {
      await suscribirListaEspera({
        idCancha: canchaId,
        idUsuario: USUARIO_ID,
        inicio: slot,
      });
      toast.success("Te suscribiste a la lista de espera para ese horario");
    } catch (err: any) {
      toast.error(err.message ?? "Error al suscribirte a la lista de espera");
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Sistema de reservas de pádel</h1>

      <div className="flex gap-4 items-center mt-3">
        <label className="flex items-center gap-2">
          Fecha:
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            min={hoy} 
            className="border p-1"
          />
        </label>

        <CanchaSelector value={canchaId} onChange={setCanchaId} />
      </div>

      {err && <p className="text-red-600 mt-3">Error: {err}</p>}
      {loading && <p className="mt-3">Cargando disponibilidad…</p>}

      {!loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {slots.map((s) => {
            const ocupado = estaOcupado(s);
            const hora = dayjs(s).format("HH:mm");

            const esHoy = fecha === hoy;
            const esPasado = esHoy && dayjs(s).isBefore(dayjs(), "minute");

            const deshabilitado = ocupado || esPasado;

            return (
              <SlotButton
                key={s}
                hora={hora}
                ocupado={deshabilitado}
                onClick={() => {
                  if (deshabilitado) return;
                  return ocupado ? handleEsperar(s) : handleReservar(s);
                }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}