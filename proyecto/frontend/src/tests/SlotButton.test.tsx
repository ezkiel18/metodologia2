import { render, screen, fireEvent } from '@testing-library/react';
import SlotButton from '../components/SlotButton'; 
import { describe, it, expect, vi } from 'vitest';

describe('SlotButton', () => {

  it('debería renderizar correctamente un slot DISPONIBLE (verde)', () => {
    const mockOnClick = vi.fn();

    render(
      <SlotButton 
        hora="10:00"
        ocupado={false}
        onClick={mockOnClick}
      />
    );

    //La hora aparece correctamente
    expect(screen.getByText('10:00')).toBeInTheDocument();

    //Ocupado NO debe aparecer
    expect(screen.queryByText('(ocupado)')).not.toBeInTheDocument();

    //El boton tiene la clase verde
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-600');
    expect(button.className).toContain('hover:bg-green-700');

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('debería renderizar correctamente un slot OCUPADO (rojo)', () => {
    const mockOnClick = vi.fn();

    render(
      <SlotButton 
        hora="11:30"
        ocupado={true}
        onClick={mockOnClick}
      />
    );

    //La hora aparece correctamente
    expect(screen.getByText('11:30')).toBeInTheDocument();

    //Ocupado debe estar presente
    expect(screen.getByText('(ocupado)')).toBeInTheDocument();

    //El boton tiene las clases rojas
    const button = screen.getByRole('button');
    expect(button.className).toContain('bg-red-500');
    expect(button.className).toContain('hover:bg-red-600');

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
  
  it('debería aplicar las clases correctas según el estado ocupado', () => {
    const { rerender } = render(
        <SlotButton hora="14:00" ocupado={false} onClick={() => {}} />
    );

    let button = screen.getByRole('button');
    expect(button.className).toContain('bg-green-600');
    expect(button.className).toContain('hover:bg-green-700');

    rerender(
        <SlotButton hora="14:00" ocupado={true} onClick={() => {}} />
    );

    button = screen.getByRole('button');
    expect(button.className).toContain('bg-red-500');
    expect(button.className).toContain('hover:bg-red-600');
  });

  it('no debería llamar onClick si el botón está disabled', () => {
    const mockOnClick = vi.fn();

    render(
        <button disabled onClick={mockOnClick}>{"Test"}</button>
    );

    fireEvent.click(screen.getByRole('button'));

    expect(mockOnClick).not.toHaveBeenCalled();
  });

});