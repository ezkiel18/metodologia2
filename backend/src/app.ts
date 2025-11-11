import express from "express";
import cors from "cors";
import reservasRouter from "./routes/reservas.rutas";
import listaEsperaRouter from "./routes/listaEspera.rutas";

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/reservas", reservasRouter);
app.use("/api/lista-espera", listaEsperaRouter);

app.get("/salud", (_req, res) => res.json({ ok: true }));

export default app;