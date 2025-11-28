import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Home from "../pages/Home";
import * as reservasAPI from "../api/reservas";
import * as listaEsperaAPI from "../api/listaEspera";
import { vi, describe, it, beforeEach, expect } from "vitest";

vi.mock("../api/reservas");
vi.mock("../api/listaEspera");

describe("Home page", () => {
  const mockGetReservas = reservasAPI.getReservas as unknown as vi.Mock;
  const mockCrearReserva = reservasAPI.crearReserva as unknown as vi.Mock;
  const mockSuscribirLista = listaEsperaAPI.suscribirListaEspera as unknown as vi.Mock;

  beforeEach(() => {
    mockGetReservas.mockReset();
    mockCrearReserva.mockReset();
    mockSuscribirLista.mockReset();
  });

  it("debería mostrar loading y luego los slots generados", async () => {
    mockGetReservas.mockResolvedValue([]);
    render(<Home />);
    expect(screen.getByText(/Cargando disponibilidad/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getAllByRole("button").length).toBeGreaterThan(0);
    });
  });

  it("al cambiar cancha se llama getReservas nuevamente", async () => {
    mockGetReservas.mockResolvedValue([]);
    render(<Home />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });

    await waitFor(() => {
      expect(mockGetReservas).toHaveBeenCalled();
    });
  });

  it("al reservar un slot disponible se llama crearReserva y getReservas", async () => {
    mockGetReservas.mockResolvedValue([]);
    mockCrearReserva.mockResolvedValue({}); 

    render(<Home />);
    
    const btn = await screen.findAllByRole("button");
    fireEvent.click(btn[0]); //click en primer slot

    await waitFor(() => {
      expect(mockCrearReserva).toHaveBeenCalled();
      expect(mockGetReservas).toHaveBeenCalled();
    });
  });

  it("los slots pasados aparecen deshabilitados", async () => {
    mockGetReservas.mockResolvedValue([]);
    render(<Home />);

    const slots = await screen.findAllByRole("button");
    const hayPasado = slots.some((b) => b.hasAttribute("disabled"));
    expect(slots.length).toBeGreaterThan(0);
  });
});