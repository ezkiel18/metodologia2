import { Request, Response } from "express";
import { servicioReservas } from "../services/ServicioReservas";

export class ControladorReservas {
  async listar(_req: Request, res: Response) {
    res.json(servicioReservas.listar());
  }

  async crear(req: Request, res: Response) {
    try {
      const { idCancha, idUsuario, inicioISO, pagado } = req.body;
      const creada = servicioReservas.crear({ idCancha, idUsuario, inicioISO, pagado });
      res.status(201).json(creada);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async cancelar(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const resultado = servicioReservas.cancelar(id);
      res.json(resultado);
    } catch (err: any) {
      res.status(404).json({ error: err.message });
    }
  }
}

export const controladorReservas = new ControladorReservas();