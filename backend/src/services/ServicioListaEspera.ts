import { Observador, Sujeto } from "../models/Observador";
import { ServicioNotificaciones } from "./ServicioNotificaciones";

class ObservadorEmail implements Observador {
  constructor(private email: string, private notificador: ServicioNotificaciones) {}
  actualizar(mensaje: string): void {
    this.notificador.notificar(this.email, mensaje);
  }
}

export class ServicioListaEspera implements Sujeto {
  // clave = `${idCancha}|${inicioISO}`
  private mapa: Map<string, Set<Observador>> = new Map();
  private notificador = new ServicioNotificaciones();

  crearClave(idCancha: string, inicioISO: string) {
    return `${idCancha}|${inicioISO}`;
  }

  suscribir(clave: string, observador: Observador): void {
    if (!this.mapa.has(clave)) this.mapa.set(clave, new Set());
    this.mapa.get(clave)!.add(observador);
  }

  desuscribir(clave: string, observador: Observador): void {
    this.mapa.get(clave)?.delete(observador);
  }

  notificar(clave: string, mensaje: string): void {
    const observadores = this.mapa.get(clave);
    if (!observadores) return;
    observadores.forEach(o => o.actualizar(mensaje));
    // después de notificar, liberamos la lista de ese horario
    this.mapa.delete(clave);
  }

  crearObservadorEmail(email: string) {
    return new ObservadorEmail(email, this.notificador);
  }
}

export const servicioListaEspera = new ServicioListaEspera();
