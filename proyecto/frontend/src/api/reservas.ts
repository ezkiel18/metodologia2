import { api } from "./client";
import type { Reserva } from "./types";

export async function getReservas(params?: { fecha?: string; idCancha?: string }) {
  const { data } = await api.get<Reserva[]>("/reservas", { params });
  return data;
}

export async function crearReserva(payload: {
  idCancha: string;
  idUsuario: string;
  inicio: string;
}) {
  const { data } = await api.post<Reserva>("/reservas", payload);
  return data;
}

export async function cancelarReserva(id: string) {
  const { data } = await api.delete<{ ok: true }>(`/reservas/${id}`);
  return data;
}