import { Request, Response } from "express";
import { servicioListaEspera } from "../services/ServicioListaEspera";

export class ControladorListaEspera {
  suscribir(req: Request, res: Response) {
    const { idCancha, inicioISO, email } = req.body;
    if (!idCancha || !inicioISO || !email) {
      return res.status(400).json({ error: "idCancha, inicioISO y email son requeridos." });
    }
    const clave = servicioListaEspera.crearClave(idCancha, inicioISO);
    const observador = servicioListaEspera.crearObservadorEmail(email);
    servicioListaEspera.suscribir(clave, observador);
    res.status(201).json({ ok: true, clave });
  }
}

export const controladorListaEspera = new ControladorListaEspera();
