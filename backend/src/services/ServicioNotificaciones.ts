export class ServicioNotificaciones {
  // En producción: email/SMS/push. Acá, consola para visualizar.
  notificar(email: string, mensaje: string) {
    console.log(`[NOTIFICACIÓN → ${email}] ${mensaje}`);
  }
}