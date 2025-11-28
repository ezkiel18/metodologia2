import { api } from "./client";
import type { Reserva } from "./types";

export async function getReservas(params?: { fecha?: string; idCancha?: string }) {
  const { data } = await api.get("/reservas", { params });

  // Normaliza la respuesta:
  // * si ya es un array, lo devolvemos tal cual
  // * si viene como { reservas: [...] }, devolvemos ese array
  // * en cualquier otro caso, devolvemos []
  if (Array.isArray(data)) {
    return data as Reserva[];
  }

  if (data && Array.isArray((data as any).reservas)) {
    return (data as any).reservas as Reserva[];
  }

  return [] as Reserva[];
}

export async function crearReserva(payload: {
  idCancha: string;
  idUsuario: string;
  inicio: string; 
}) {
  const body = {
    idCancha: payload.idCancha,
    idUsuario: payload.idUsuario,
    inicioISO: payload.inicio, 
    pagado: false,             
  };

  const { data } = await api.post<Reserva>("/reservas", body);
  return data;
}

export async function cancelarReserva(id: string) {
  const { data } = await api.delete<{ ok: true }>(`/reservas/${id}`);
  return data;
}