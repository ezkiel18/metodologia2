export interface Reserva {
  id: string;
  idCancha: string;
  idUsuario: string;
  inicio: Date;
  fin: Date;       // siempre inicio + 90'
  precio: number;  // precio fijo para todas las canchas
  pagado: boolean;
  creadaEn: Date;
}