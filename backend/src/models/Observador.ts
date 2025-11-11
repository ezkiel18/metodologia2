export interface Observador {
  actualizar(mensaje: string): void;
}

export interface Sujeto {
  suscribir(clave: string, observador: Observador): void;
  desuscribir(clave: string, observador: Observador): void;
  notificar(clave: string, mensaje: string): void;
}
