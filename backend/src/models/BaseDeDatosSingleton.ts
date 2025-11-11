import { Reserva } from "./Reserva";
import { Cancha } from "./Cancha";
import { Usuario } from "./Usuario";

export class BaseDeDatosSingleton {
  private static instancia: BaseDeDatosSingleton;

  public reservas: Reserva[] = [];
  public canchas: Cancha[] = [
    { id: "1", nombre: "Cancha 1", activa: true },
    { id: "2", nombre: "Cancha 2", activa: true }
  ];
  public usuarios: Usuario[] = [];

  private constructor() {}

  public static obtenerInstancia(): BaseDeDatosSingleton {
    if (!BaseDeDatosSingleton.instancia) {
      BaseDeDatosSingleton.instancia = new BaseDeDatosSingleton();
    }
    return BaseDeDatosSingleton.instancia;
  }
}
