import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import MisReservas from "../pages/MisReservas";
import { getReservas, cancelarReserva } from "../api/reservas";
import toast from "react-hot-toast";
import dayjs from "../lib/dayjs";
import { describe, it, vi, beforeEach, expect } from "vitest";

// Mocks de API
vi.mock("../api/reservas", () => ({
  getReservas: vi.fn(),
  cancelarReserva: vi.fn(),
}));

// Mock de react-hot-toast
vi.mock("react-hot-toast", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    toast: {
      success: vi.fn(),
      error: vi.fn(),
    },
    default: {
      success: vi.fn(),
      error: vi.fn(),
    },
  };
});

const mockGetReservas = getReservas as unknown as ReturnType<typeof vi.fn>;
const mockCancelarReserva = cancelarReserva as unknown as ReturnType<typeof vi.fn>;
const mockToastSuccess = toast.success as unknown as ReturnType<typeof vi.fn>;
const mockToastError = toast.error as unknown as ReturnType<typeof vi.fn>;

describe("MisReservas page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("muestra mensaje si no hay reservas", async () => {
    mockGetReservas.mockResolvedValue([]);
    render(<MisReservas />);
    await waitFor(() => {
      expect(screen.getByText(/Aún no tenés reservas/i)).toBeInTheDocument();
    });
  });

  it("muestra reservas correctamente", async () => {
    const reserva = {
      id: "1",
      idUsuario: "usuario-demo",
      inicio: dayjs().add(2, "day").toISOString(),
      fin: dayjs().add(2, "day").add(1, "hour").toISOString(),
      cancha: "Cancha 1",
    };
    mockGetReservas.mockResolvedValue([reserva]);
    render(<MisReservas />);
    const tarjeta = await screen.findByText(/Cancha/i);
    expect(tarjeta).toBeInTheDocument();
    expect(screen.getByText(/Cancelar Turno/i)).toBeInTheDocument();
  });

  it("cancela reserva correctamente y recarga la lista", async () => {
    const reserva = {
      id: "1",
      idUsuario: "usuario-demo",
      inicio: dayjs().add(2, "day").toISOString(),
      fin: dayjs().add(2, "day").add(1, "hour").toISOString(),
      cancha: "Cancha 1",
    };
    mockGetReservas.mockResolvedValue([reserva]);
    mockCancelarReserva.mockResolvedValue({});
    vi.spyOn(window, "confirm").mockReturnValue(true);

    render(<MisReservas />);
    const btnCancelar = await screen.findByRole("button", { name: /Cancelar Turno/i });
    fireEvent.click(btnCancelar);

    await waitFor(() => {
      expect(mockCancelarReserva).toHaveBeenCalledWith(reserva.id);
      expect(mockToastSuccess).toHaveBeenCalled();
      expect(mockGetReservas).toHaveBeenCalledTimes(2);
    });
  });

  it("no cancela si quedan menos de 12 horas", async () => {
    const reserva = {
      id: "1",
      idUsuario: "usuario-demo",
      inicio: dayjs().add(10, "hour").toISOString(),
      fin: dayjs().add(11, "hour").toISOString(),
      cancha: "Cancha 1",
    };
    mockGetReservas.mockResolvedValue([reserva]);
    render(<MisReservas />);

    const btnNoCancelable = await screen.findByRole("button", { name: /No cancelable/i });
    fireEvent.click(btnNoCancelable);

    expect(mockCancelarReserva).not.toHaveBeenCalled();
    expect(mockToastError).toBeTruthy();
  });

  it("muestra error si falla la API", async () => {
    mockGetReservas.mockRejectedValue(new Error("API fallida"));
    render(<MisReservas />);
    await waitFor(() => {
      expect(screen.getByText(/API fallida/i)).toBeInTheDocument();
    });
  });
});