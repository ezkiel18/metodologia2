import { Router } from "express";
import { controladorListaEspera } from "../controllers/listaEspera.controlador";

const router = Router();

router.post("/suscribir", (req, res) => controladorListaEspera.suscribir(req, res));

export default router;
