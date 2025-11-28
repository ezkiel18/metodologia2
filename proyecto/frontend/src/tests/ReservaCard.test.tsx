import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, afterAll } from "vitest";
import ReservaCard from "../components/ReservaCard";
import type { Reserva } from "../api/types";

// Mock de fecha fija para que dayjs siempre devuelva lo mismo
beforeAll(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2025-03-10T12:00:00"));
});

afterAll(() => {
  vi.useRealTimers();
});

describe("ReservaCard", () => {
  it("debería renderizar una reserva futura y permitir cancelación", () => {
    const mockOnCancelar = vi.fn();

    const reserva: Reserva = {
      id: "r1",
      idCancha: "1",
      idUsuario: "u1",
      inicio: "2025-03-15T18:00:00",
      fin: "2025-03-15T19:00:00",
      precio: 5000,
      pagado: true,
      creadaEn: "2025-03-01T10:00:00",
    };

    render(<ReservaCard reserva={reserva} onCancelar={mockOnCancelar} />);

    //Coincidimos solo con el día y "de March"
    expect(screen.getByText(/15 de/i)).toBeInTheDocument();

    //Horario visible
    expect(screen.getByText("18:00 - 19:00")).toBeInTheDocument();

    //Boton cancelable visible
    const btn = screen.getByRole("button", { name: /cancelar turno/i });
    expect(btn).toBeInTheDocument();
    expect(btn).not.toBeDisabled();

    //Click en cancelar
    fireEvent.click(btn);
    expect(mockOnCancelar).toHaveBeenCalledTimes(1);
    expect(mockOnCancelar).toHaveBeenCalledWith(reserva);
  });

  it("debería mostrar 'Finalizada' si la reserva ya pasó", () => {
    const mockOnCancelar = vi.fn();

    const reservaPasada: Reserva = {
      id: "r2",
      idCancha: "1",
      idUsuario: "u1",
      inicio: "2025-03-05T18:00:00",
      fin: "2025-03-05T19:00:00",
      precio: 5000,
      pagado: true,
      creadaEn: "2025-03-01T10:00:00",
    };

    render(<ReservaCard reserva={reservaPasada} onCancelar={mockOnCancelar} />);

    //Badge "Finalizada"
    expect(screen.getByText(/finalizada/i)).toBeInTheDocument();

    // Elboton no debe estar porque ya pasó
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("debería mostrar 'No cancelable' si faltan menos de 12 horas", () => {
    const mockOnCancelar = vi.fn();

    //Fecha del sistema: 10/03/2025 12:00
    //Inicio: 10/03/2025 20:00 → faltan 8 horas → no cancelable
    const reservaNoCancelable: Reserva = {
      id: "r3",
      idCancha: "1",
      idUsuario: "u1",
      inicio: "2025-03-10T20:00:00",
      fin: "2025-03-10T21:00:00",
      precio: 5000,
      pagado: true,
      creadaEn: "2025-03-01T10:00:00",
    };

    render(<ReservaCard reserva={reservaNoCancelable} onCancelar={mockOnCancelar} />);

    const btn = screen.getByRole("button", { name: /no cancelable/i });

    //Existe pero está deshabilitado
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();

    //No debe llamar al callback aunque se intente
    fireEvent.click(btn);
    expect(mockOnCancelar).not.toHaveBeenCalled();
  });
});