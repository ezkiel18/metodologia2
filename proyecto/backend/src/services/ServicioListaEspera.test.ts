import { ServicioListaEspera } from './ServicioListaEspera';
import { ServicioNotificaciones } from './ServicioNotificaciones';
import { Observador } from '../models/Observador';

jest.mock('./ServicioNotificaciones');

const MockedNotificador = ServicioNotificaciones as jest.MockedClass<typeof ServicioNotificaciones>;

let servicioListaEspera: ServicioListaEspera;

let mockMetodoNotificar: jest.Mock;

beforeEach(() => {
  jest.clearAllMocks();

  mockMetodoNotificar = jest.fn();
  MockedNotificador.prototype.notificar = mockMetodoNotificar;

  servicioListaEspera = new ServicioListaEspera();
});

describe('ServicioListaEspera', () => {

  const claveTest = 'cancha-1|2025-01-01T18:00:00Z';

  it('deberia suscribir un observador generico y notificarlo', () => {
    // creamos un observador "falso" que podemos espiar
    const observadorMock: Observador = {
      actualizar: jest.fn()
    };

    servicioListaEspera.suscribir(claveTest, observadorMock);
    servicioListaEspera.notificar(claveTest, 'Mensaje de prueba');
      
    expect(observadorMock.actualizar).toHaveBeenCalledTimes(1);
    expect(observadorMock.actualizar).toHaveBeenCalledWith('Mensaje de prueba');
  });

  it('deberia crear un observador de Email y notificarlo', () => {
    const email = 'test@usuario.com';
    const mensaje = '¡Tu turno está disponible!';

    const observadorEmail = servicioListaEspera.crearObservadorEmail(email);
    servicioListaEspera.suscribir(claveTest, observadorEmail);
    servicioListaEspera.notificar(claveTest, mensaje);

    expect(mockMetodoNotificar).toHaveBeenCalledTimes(1);
    expect(mockMetodoNotificar).toHaveBeenCalledWith(email, mensaje);
  });

  it('deberia notificar a multiples observadores suscritos a la misma clave', () => {
    const observador1 = servicioListaEspera.crearObservadorEmail('test1@usuario.com');
    const observador2 = servicioListaEspera.crearObservadorEmail('test2@usuario.com');

    servicioListaEspera.suscribir(claveTest, observador1);
    servicioListaEspera.suscribir(claveTest, observador2);

    servicioListaEspera.notificar(claveTest, 'Mensaje para ambos');

    expect(mockMetodoNotificar).toHaveBeenCalledTimes(2);
    expect(mockMetodoNotificar).toHaveBeenCalledWith('test1@usuario.com', 'Mensaje para ambos');
    expect(mockMetodoNotificar).toHaveBeenCalledWith('test2@usuario.com', 'Mensaje para ambos');
  });

  it('no deberia notificar a observadores de otras claves', () => {
    const otraClave = 'cancha-2|2025-01-01T18:00:00Z';
    
    const observador1 = servicioListaEspera.crearObservadorEmail('test1@usuario.com');
    const observador2 = servicioListaEspera.crearObservadorEmail('test2@usuario.com');

    servicioListaEspera.suscribir(claveTest, observador1);
    servicioListaEspera.suscribir(otraClave, observador2);

    servicioListaEspera.notificar(claveTest, 'Mensaje solo para clave 1');

    expect(mockMetodoNotificar).toHaveBeenCalledTimes(1);
    expect(mockMetodoNotificar).toHaveBeenCalledWith('test1@usuario.com', 'Mensaje solo para clave 1');
    expect(mockMetodoNotificar).not.toHaveBeenCalledWith('test2@usuario.com', expect.any(String));
  });

  it('deberia eliminar la lista de observadores despues de notificar', () => {
    const observador = servicioListaEspera.crearObservadorEmail('test@usuario.com');
    servicioListaEspera.suscribir(claveTest, observador);

    servicioListaEspera.notificar(claveTest, 'Primera notificación');
    
    expect(mockMetodoNotificar).toHaveBeenCalledTimes(1);

    servicioListaEspera.notificar(claveTest, 'Segunda notificación');

    expect(mockMetodoNotificar).toHaveBeenCalledTimes(1);
  });

});