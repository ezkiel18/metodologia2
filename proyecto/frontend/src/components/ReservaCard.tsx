import dayjs from "../lib/dayjs";
import type { Reserva } from "../api/types";

interface Props {
  reserva: Reserva;
  onCancelar: (reserva: Reserva) => void;
}

export default function ReservaCard({ reserva, onCancelar }: Props) {
  // Calculamos horas restantes para validar la regla de 12hs visualmente
  const horasRestantes = dayjs(reserva.inicio).diff(dayjs(), "hour");
  const esCancelable = horasRestantes >= 12;
  
  // Verificamos si el turno ya pasó para cambiar el estado
  const yaPaso = dayjs(reserva.fin).isBefore(dayjs());

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${yaPaso ? 'bg-gray-400' : 'bg-green-500'}`}></div>
          <span className="font-semibold text-gray-700">
            Cancha {reserva.idCancha}
          </span>
        </div>
        
        {yaPaso ? (
          <span className="text-xs font-medium px-2 py-1 bg-gray-200 text-gray-600 rounded-full">
            Finalizada
          </span>
        ) : (
          <span className="text-xs font-medium px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
            Pendiente
          </span>
        )}
      </div>
      <div className="p-4 flex-1">
        <div className="mb-4">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Fecha</p>
          <p className="text-lg font-bold text-gray-800 capitalize">
            {dayjs(reserva.inicio).format("dddd D [de] MMMM")}
          </p>
        </div>

        <div className="flex justify-between items-end border-t border-gray-50 pt-2">
          <div>
            <p className="text-xs text-gray-500">Horario</p>
            <p className="font-medium text-gray-700">
              {dayjs(reserva.inicio).format("HH:mm")} - {dayjs(reserva.fin).format("HH:mm")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Precio</p>
            <p className="font-medium text-gray-700">${reserva.precio}</p>
          </div>
        </div>
      </div>
      <div className="p-4 pt-0 mt-auto">
        {!yaPaso && (
          <button
            onClick={() => onCancelar(reserva)}
            disabled={!esCancelable}
            className={`w-full py-2 px-4 rounded-lg text-sm font-medium transition-colors border
              ${
                esCancelable
                  ? "bg-white border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                  : "bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed"
              }
            `}
            title={!esCancelable ? "No se puede cancelar con menos de 12hs de anticipación" : "Cancelar reserva"}
          >
            {esCancelable ? "Cancelar Turno" : "No cancelable"}
          </button>
        )}
      </div>
    </div>
  );
}