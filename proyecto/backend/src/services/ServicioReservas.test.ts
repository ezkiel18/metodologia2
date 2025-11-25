import { ServicioReservas } from './ServicioReservas';
import { BaseDeDatosSingleton } from '../models/BaseDeDatosSingleton';
import { servicioListaEspera } from './ServicioListaEspera';
import crypto from 'crypto';

jest.mock('../models/BaseDeDatosSingleton');
jest.mock('./ServicioListaEspera');

const MockedDB = BaseDeDatosSingleton as jest.Mocked<typeof BaseDeDatosSingleton>;
const mockedListaEspera = servicioListaEspera as jest.Mocked<typeof servicioListaEspera>;

(jest.spyOn(crypto, 'randomUUID') as jest.Mock).mockReturnValue('mocked-uuid-123');

let servicioDePrueba: ServicioReservas;

beforeEach(() => {
  jest.clearAllMocks();

  MockedDB.obtenerInstancia.mockReturnValue({
    reservas: [],
    canchas: [
      { id: '1', nombre: 'Cancha 1', activa: true },
      { id: '2', nombre: 'Cancha 2', activa: false },
    ],
    usuarios: [],
  } as any);

   mockedListaEspera.crearClave.mockImplementation(
    (idCancha, inicioISO) => `${idCancha}|${inicioISO}`
  );

  servicioDePrueba = new ServicioReservas();
});

describe('ServicioReservas', () => {

  it('debería crear una reserva exitosamente si la cancha está activa y libre', () => {
    const params = {
      idCancha: '1',
      idUsuario: 'user-123',
      inicioISO: '2025-12-01T18:00:00Z',
    };

    const reserva = servicioDePrueba.crear(params);

    expect(reserva.id).toBe('mocked-uuid-123');
    expect(reserva.idCancha).toBe('1');
    expect(reserva.precio).toBe(5000);
    
    expect(MockedDB.obtenerInstancia().reservas).toHaveLength(1);
    expect(MockedDB.obtenerInstancia().reservas[0].id).toBe('mocked-uuid-123');
  });

  it('debería lanzar un error si la cancha no existe', () => {
    const params = {
      idCancha: '99',
      idUsuario: 'user-123',
      inicioISO: '2025-12-01T18:00:00Z',
    };

    expect(() => servicioDePrueba.crear(params))
      .toThrow('Cancha inexistente o inactiva.');
  });

  it('debería lanzar un error si la cancha está inactiva', () => {
    const params = {
      idCancha: '2',
      idUsuario: 'user-123',
      inicioISO: '2025-12-01T18:00:00Z',
    };

    expect(() => servicioDePrueba.crear(params))
      .toThrow('Cancha inexistente o inactiva.');
  });
  
  it('debería lanzar un error si el horario se solapa con otra reserva', () => {
    MockedDB.obtenerInstancia().reservas.push({
      id: 'res-existente',
      idCancha: '1',
      idUsuario: 'user-abc',
      inicio: new Date('2025-12-01T18:00:00Z'),
      fin: new Date('2025-12-01T19:30:00Z'),
    } as any);

    const params = {
      idCancha: '1',
      idUsuario: 'user-123',
      inicioISO: '2025-12-01T18:30:00Z',
    };

    expect(() => servicioDePrueba.crear(params))
      .toThrow('La cancha ya tiene un turno en ese horario.');
  });

  it('debería notificar a la lista de espera al cancelar un turno', () => {
    const inicioDate = new Date('2025-12-25T18:00:00Z');
    MockedDB.obtenerInstancia().reservas.push({
      id: 'res-a-cancelar',
      idCancha: '1',
      idUsuario: 'user-123',
      inicio: inicioDate,
      creadaEn: new Date(),
    } as any);

    servicioDePrueba.cancelar('res-a-cancelar');

    expect(mockedListaEspera.notificar).toHaveBeenCalledTimes(1);
    
    expect(mockedListaEspera.notificar).toHaveBeenCalledWith(
      '1|2025-12-25T18:00:00.000Z',
      expect.stringContaining('¡Se liberó la cancha 1')
    );
  });
});