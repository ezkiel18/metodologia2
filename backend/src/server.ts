import app from "./app";

const PUERTO = process.env.PORT || 3000;
app.listen(PUERTO, () => {
  console.log(`API de Padel corriendo en http://localhost:${PUERTO}`);
});