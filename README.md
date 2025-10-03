Entrega Parcial – Metodología de Sistemas II

Integrantes del grupo
- Ezequiel Barrionuevo
- Franco Muñoz Cartagena
- Alejo Petricio
- Parotta Luciano

Tema elegido:
Sistema de reserva de turnos para cancha de padel

- Las canchas tienen reservas de 1 hora y media (de las 18:00 hasta las 19:30)
- Una misma cancha no puede tener dos turnos en el mismo horario (cancha 1 no puede tener dos turnos a las 18:00)
- Todas las canchas tienen el mismo precio
- Las cancelaciones se deben hacer con minimo 12 horas de antelación, de lo contrario no se reembolsará el dinero.

Patrones de diseño:

Singleton: Para garantizar una sola conexión compartida a la base de datos.

Observer: Para notificar a los usuarios cuando un turno de su interes este disponible

Ejemplo: La cancha 1 ya está ocupada a las 16:00, un usuario X marca que le interesaria la cancha 1 a las 16:00, si el turno se llega a cancelar este usuario recibirá una notificación diciendo que está disponible.
