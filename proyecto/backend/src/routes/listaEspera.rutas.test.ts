import request from 'supertest';
import app from '../app';
import { servicioListaEspera } from '../services/ServicioListaEspera';

jest.mock('../services/ServicioListaEspera');

const mockedServicioListaEspera = servicioListaEspera as jest.Mocked<typeof servicioListaEspera>;

beforeEach(() => {
  jest.clearAllMocks();
});

describe('API de Lista de Espera', () => {

  const AÑO_FUTURO = new Date().getFullYear() + 1;
  const FECHA_INICIO_ISO = `${AÑO_FUTURO}-10-10T18:00:00.000Z`;

  it('POST /suscribir - deberia suscribir a un usuario y devolver 201', async () => {
    const body = {
      idCancha: '1',
      inicioISO: FECHA_INICIO_ISO,
      email: 'test@usuario.com',
    };

    const res = await request(app)
      .post('/api/lista-espera/suscribir')
      .send(body);

    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe(true);

    expect(mockedServicioListaEspera.crearClave).toHaveBeenCalledWith('1', FECHA_INICIO_ISO);
    expect(mockedServicioListaEspera.crearObservadorEmail).toHaveBeenCalledWith('test@usuario.com');
    expect(mockedServicioListaEspera.suscribir).toHaveBeenCalledTimes(1);
  });

  it('POST /suscribir - deberia devolver 400 si falta el email', async () => {
    const body = {
      idCancha: '1',
      inicioISO: FECHA_INICIO_ISO,
    };

    const res = await request(app)
      .post('/api/lista-espera/suscribir')
      .send(body);

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe('idCancha, inicioISO y email son requeridos.');

    expect(mockedServicioListaEspera.suscribir).not.toHaveBeenCalled();
    expect(mockedServicioListaEspera.crearObservadorEmail).not.toHaveBeenCalled();
  });

});