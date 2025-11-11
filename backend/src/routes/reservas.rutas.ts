import { Router } from "express";
import { controladorReservas } from "../controllers/reservas.controlador";

const router = Router();

router.get("/", (req, res) => controladorReservas.listar(req, res));
router.post("/", (req, res) => controladorReservas.crear(req, res));
router.delete("/:id", (req, res) => controladorReservas.cancelar(req, res));

export default router;
