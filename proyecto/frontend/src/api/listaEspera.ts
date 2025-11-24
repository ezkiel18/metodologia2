import { api } from "./client";

export async function suscribirListaEspera(payload: {
  idCancha: string;
  inicio: string;
  idUsuario: string;
}) {
  const { data } = await api.post("/lista-espera/suscribir", payload);
  return data;
}