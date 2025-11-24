import { useEffect, useState } from "react";
import dayjs from "../lib/dayjs";
import toast from "react-hot-toast";
import { getReservas, cancelarReserva } from "../api/reservas";
import type { Reserva } from "../api/types";
import ReservaCard from "../components/ReservaCard";

const USUARIO_ID = "usuario-demo";

export default function MisReservas() {
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  async function cargar() {
    setLoading(true);
    setErr(null);
    try {
      // Obtenemos todas las reservas del backend
      const data = await getReservas();
      
      // Filtramos localmente por usuario
      const misReservas = data
        .filter((r) => r.idUsuario === USUARIO_ID)
        .sort((a, b) => dayjs(a.inicio).isBefore(dayjs(b.inicio)) ? -1 : 1);
        
      setReservas(misReservas);
    } catch (e: any) {
      setErr(e.message || "Ocurrió un error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    cargar();
  }, []);

  async function onCancelar(r: Reserva) {
    // Validacion visual antes de llamar a la API
    const horas = dayjs(r.inicio).diff(dayjs(), "hour");
    if (horas < 12) {
      toast.error("No se puede cancelar con menos de 12 horas de anticipación.");
      return;
    }

    // Confirmacion nativa del navegador
    if (!window.confirm("¿Estás seguro de que quieres cancelar este turno?")) return;

    try {
      await cancelarReserva(r.id);
      toast.success("Reserva cancelada correctamente");
      await cargar(); // Recargamos la lista para sacar la tarjeta eliminada
    } catch (e: any) {
      toast.error(e.message ?? "Error al cancelar la reserva");
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        {}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8 pb-4 border-b border-gray-200">
        <h1 className="text-3xl font-bold text-gray-900">Mis Reservas</h1>
        <p className="text-gray-500 mt-1">
          Gestioná tus próximos partidos y revisá tu historial.
        </p>
      </header>

      {err && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded shadow-sm">
          <p className="text-red-700 font-medium">Error</p>
          <p className="text-red-600 text-sm">{err}</p>
        </div>
      )}

      {reservas.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
          <div className="text-4xl mb-3">🎾</div>
          <h3 className="text-lg font-medium text-gray-900">
            Aún no tenés reservas
          </h3>
          <p className="text-gray-500 mt-1 mb-6">
            ¡Reservá una cancha y empezá a jugar!
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-6 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm"
          >
            Ir a Reservar
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reservas.map((r) => (
            <ReservaCard 
              key={r.id} 
              reserva={r} 
              onCancelar={onCancelar} 
            />
          ))}
        </div>
      )}
    </div>
  );
}