import { BaseDeDatosSingleton } from "../models/BaseDeDatosSingleton";
import { Reserva } from "../models/Reserva";
import crypto from "crypto";
import { servicioListaEspera } from "./ServicioListaEspera";

export class ServicioReservas {
  private db = BaseDeDatosSingleton.obtenerInstancia();

  static readonly MINUTOS_POR_TURNO = 90;
  static readonly PRECIO_FIJO = 5000; // no sé cuánto estará asi que tiré un numero cualquiera
  static readonly HORAS_LIMITE_CANCELACION = 12;

  private sumarMinutos(fecha: Date, minutos: number) {
    return new Date(fecha.getTime() + minutos * 60 * 1000);
  }

  private seSolapa(aInicio: Date, aFin: Date, bInicio: Date, bFin: Date) {
    return aInicio < bFin && bInicio < aFin;
  }

  listar() {
    return this.db.reservas
      .slice()
      .sort((a, b) => a.inicio.getTime() - b.inicio.getTime());
  }

  crear(params: { idCancha: string; idUsuario: string; inicioISO: string; pagado?: boolean }) {
    const { idCancha, idUsuario, inicioISO, pagado = true } = params;

    const cancha = this.db.canchas.find(c => c.id === idCancha && c.activa);
    if (!cancha) throw new Error("Cancha inexistente o inactiva.");

    const inicio = new Date(inicioISO);
    if (isNaN(inicio.getTime())) throw new Error("Fecha/hora inválida (usar ISO).");

    const fin = this.sumarMinutos(inicio, ServicioReservas.MINUTOS_POR_TURNO);

    // evitar doble reserva en la misma cancha y horario
    const conflicto = this.db.reservas.some(
      r => r.idCancha === idCancha && this.seSolapa(inicio, fin, r.inicio, r.fin)
    );
    if (conflicto) throw new Error("La cancha ya tiene un turno en ese horario.");

    const reserva: Reserva = {
      id: crypto.randomUUID(),
      idCancha,
      idUsuario,
      inicio,
      fin,
      precio: ServicioReservas.PRECIO_FIJO,
      pagado,
      creadaEn: new Date()
    };

    this.db.reservas.push(reserva);
    return reserva;
  }

  cancelar(idReserva: string) {
    const indice = this.db.reservas.findIndex(r => r.id === idReserva);
    if (indice === -1) throw new Error("Reserva no encontrada.");

    const reserva = this.db.reservas[indice];
    this.db.reservas.splice(indice, 1);

    const horasRestantes = (reserva.inicio.getTime() - Date.now()) / (1000 * 60 * 60);
    const reembolsable = horasRestantes >= ServicioReservas.HORAS_LIMITE_CANCELACION;

    const clave = servicioListaEspera.crearClave(reserva.idCancha, reserva.inicio.toISOString());
    servicioListaEspera.notificar(
      clave,
      `¡Se liberó la cancha ${reserva.idCancha} a las ${reserva.inicio.toISOString()}!`
    );

    return { reembolsable, precio: reserva.precio };
    // acá iría la lógica de reembolso
  }
}

export const servicioReservas = new ServicioReservas();
