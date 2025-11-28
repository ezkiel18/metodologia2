import { expect, describe, it } from 'vitest';
import { buildSlots } from '../utils/time';

describe('buildSlots - Dia Completo', () => {
  it('debería generar exactamente 10 turnos de 90 minutos para un día completo (08:00 a 23:00 Local)', () => {
    const fecha = '2025-11-24'; 
    
    //08:00 a 23:00 local, 90 min
    const slots = buildSlots(fecha);

    expect(slots).toHaveLength(10); 

    //Al generarse los horarios se hace en forma UTC 8:00 AM Local = 11 AM UTC
    expect(slots).toContain('2025-11-24T11:00:00.000Z'); // 08:00 AM Local
    expect(slots).toContain('2025-11-24T12:30:00.000Z'); // 09:30 AM Local
    expect(slots).toContain('2025-11-24T14:00:00.000Z'); // 11:00 AM Local
    expect(slots).toContain('2025-11-24T15:30:00.000Z'); // 12:30 PM Local
    expect(slots).toContain('2025-11-24T17:00:00.000Z'); // 14:00 PM Local
    expect(slots).toContain('2025-11-24T18:30:00.000Z'); // 15:30 PM Local
    expect(slots).toContain('2025-11-24T20:00:00.000Z'); // 17:00 PM Local
    expect(slots).toContain('2025-11-24T21:30:00.000Z'); // 18:30 PM Local
    expect(slots).toContain('2025-11-24T23:00:00.000Z'); // 20:00 PM Local
    expect(slots).toContain('2025-11-25T00:30:00.000Z'); // 21:30 PM Local
  });
});