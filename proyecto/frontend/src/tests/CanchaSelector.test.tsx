import { render, screen, fireEvent } from '@testing-library/react';
import CanchaSelector from '../components/CanchaSelector';
import { describe, it, expect, vi } from 'vitest';

describe('CanchaSelector', () => {
  
  it('debería renderizar las opciones por defecto (Cancha 1 y Cancha 2) si no se pasan props', () => {
    const mockOnChange = vi.fn();

    render(
      <CanchaSelector
        value="1"
        onChange={mockOnChange}
      />
    );

    //Opciones por defecto
    expect(screen.getByRole('option', { name: 'Cancha 1' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cancha 2' })).toBeInTheDocument();

    //Valor inicial
    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement.value).toBe('1');
  });


  it('debería llamar a onChange cuando se selecciona la Cancha 2', () => {
    const mockOnChange = vi.fn();

    render(
      <CanchaSelector
        value="1"
        onChange={mockOnChange}
      />
    );

    const selectElement = screen.getByRole('combobox');

    //Usuario cambia la selección
    fireEvent.change(selectElement, { target: { value: '2' } });

    //onChange fue llamado
    expect(mockOnChange).toHaveBeenCalledTimes(1);

    //Con el valor correcto
    expect(mockOnChange).toHaveBeenCalledWith('2');
  });


  it('debería renderizar canchas personalizadas si se pasan por props', () => {
    const mockOnChange = vi.fn();
    const canchasCustom = [
      { id: 'a', nombre: 'Cancha A' },
      { id: 'b', nombre: 'Cancha B' },
    ];

    render(
      <CanchaSelector
        value="a"
        onChange={mockOnChange}
        canchas={canchasCustom}
      />
    );

    //Opciones personalizadas
    expect(screen.getByRole('option', { name: 'Cancha A' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Cancha B' })).toBeInTheDocument();

    //Valor seleccionado correcto
    expect(screen.getByRole('combobox')).toHaveValue('a');
  });


  it('debería actualizar el valor cuando cambia la prop "value" (componente controlado)', () => {
    const mockOnChange = vi.fn();

    const { rerender } = render(
      <CanchaSelector value="1" onChange={mockOnChange} />
    );

    const selectElement = screen.getByRole('combobox') as HTMLSelectElement;
    expect(selectElement.value).toBe('1');

    rerender(
      <CanchaSelector value="2" onChange={mockOnChange} />
    );

    expect(selectElement.value).toBe('2');
  });

});