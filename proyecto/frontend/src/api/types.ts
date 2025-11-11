export interface Cancha {
  id: string;
  nombre: string;
  activa: boolean;
}

export interface Reserva {
  id: string;
  idCancha: string;
  idUsuario: string;
  inicio: string;
  fin: string;
  precio: number;
  pagado: boolean;
  creadaEn: string;
}

export interface Usuario {
  id: string;
  nombre: string;
  email: string;
}