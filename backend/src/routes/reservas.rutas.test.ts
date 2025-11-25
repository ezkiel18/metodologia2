import request from 'supertest';
import app from '../app'; 
import { servicioReservas } from '../services/ServicioReservas';

jest.mock('../services/ServicioReservas');

// Creamos un alias tipado para el servicio mockeado
const mockedServicioReservas = servicioReservas as jest.Mocked<typeof servicioReservas>;

// Preparamos una fecha futura para las pruebas
const AÑO_FUTURO = new Date().getFullYear() + 1;
const FECHA_INICIO_ISO = `${AÑO_FUTURO}-10-10T18:00:00.000Z`;
const mockReserva = {
  id: 'res-123',
  idCancha: '1',
  idUsuario: 'user-123',
  inicioISO: FECHA_INICIO_ISO,
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe('API de Reservas (/api/reservas)', () => {
  it('POST / - deberia crear una reserva y devolver 201 si el horario esta libre', async () => {
    mockedServicioReservas.crear.mockReturnValue(mockReserva as any);

    const body = {
      idCancha: '1',
      idUsuario: 'user-123',
      inicioISO: FECHA_INICIO_ISO,
    };

    const res = await request(app)
      .post('/api/reservas')
      .send(body);

    expect(mockedServicioReservas.crear).toHaveBeenCalledWith(body);
    expect(res.statusCode).toBe(201);
    expect(res.body.id).toBe('res-123');
  });

  it('POST / - deberia devolver 400 si el servicio lanza un error', async () => {
    const errorMsg = 'La cancha ya tiene un turno en ese horario.';
    mockedServicioReservas.crear.mockImplementation(() => {
      throw new Error(errorMsg);
    });

    const body = {
      idCancha: '1',
      idUsuario: 'user-123',
      inicioISO: FECHA_INICIO_ISO,
    };

    const res = await request(app)
      .post('/api/reservas')
      .send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe(errorMsg);
  });

    it('GET / - deberia devolver la lista de reservas', async () => {
    mockedServicioReservas.listar.mockReturnValue([mockReserva] as any);
    const res = await request(app).get('/api/reservas');

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].id).toBe('res-123');
  });

  it('DELETE /:id - deberia devolver 404 si la reserva no existe', async () => {
    const errorMsg = 'Reserva no encontrada.';
    mockedServicioReservas.cancelar.mockImplementation(() => {
      throw new Error(errorMsg);
    });

    const res = await request(app).delete('/api/reservas/id-que-no-existe');

    expect(res.statusCode).toBe(404);
    expect(res.body.error).toBe(errorMsg);
  });

  it('DELETE /:id - deberia cancelar una reserva y devolver 200', async () => {
    // "Programamos" el mock
    mockedServicioReservas.cancelar.mockReturnValue({
      reembolsable: true,
      precio: 5000,
    });

    const res = await request(app).delete('/api/reservas/res-123');

    expect(mockedServicioReservas.cancelar).toHaveBeenCalledWith('res-123');
    expect(res.statusCode).toBe(200);
    expect(res.body.reembolsable).toBe(true);
  });

});