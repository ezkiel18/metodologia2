# Entrega – Metodología de Sistemas II

## Integrantes del grupo
- Ezequiel Barrionuevo
- Franco Muñoz Cartagena
- Alejo Petricio
- Parotta Luciano

---

# Tema elegido:
## Sistema de reserva de turnos para cancha de padel

- Las canchas tienen reservas de 1 hora y media (de las 18:00 hasta las 19:30)
- Una misma cancha no puede tener dos turnos en el mismo horario (cancha 1 no puede tener dos turnos a las 18:00)
- Todas las canchas tienen el mismo precio
- Las cancelaciones se deben hacer con minimo 12 horas de antelación, de lo contrario no se reembolsará el dinero.

# Patrones de diseño aplicados

### Singleton
Utilizado para simular una **única conexión a la base de datos** mediante instancias centralizadas en los servicios.  
Garantiza consistencia y un único punto de acceso al estado global de reservas.

### Observer
Aplicado en el módulo de lista de espera:  
- Cuando un usuario se suscribe a un horario ocupado, se registra como observador.  
- Si la reserva se libera, el sistema **notifica automáticamente** a quienes estaban esperando.  

Ejemplo: La cancha 1 ya está ocupada a las 16:00, un usuario X marca que le interesaria la cancha 1 a las 16:00, si el turno se llega a cancelar este usuario recibirá una notificación diciendo que está disponible.

Esta pagina es unicamente para un complejo de canchas de padel, todas las canchas tienen la misma calidad por lo que todas tienen el mismo precio, los partidos son de 90 minutos por lo que todos los turnos tienen esa duracion.

---

🚀 Guía de Instalación y Uso

🔧 Backend

Abrir una terminal y ubicarse en la carpeta backend/

Instalar dependencias:

    npm install

Para ejecutar los test:
    
    npm run test

Iniciar el servidor en modo desarrollo:

    npm run dev

🎨 Frontend

Abrir otra terminal y ubicarse en la carpeta frontend/

Instalar dependencias:

    npm install

Para ejecutar los test:
    
    npm run test


Ejecutar la aplicación en modo desarrollo:

    npm run dev

Al ejecutar Backend y Frontend se podra ver la pagina funcional en:

    http://localhost:5173/

---

# Arquitectura del Proyecto

```
/proyecto
 ├── backend     → Node + Express + TypeScript (API REST)
 └── frontend    → React + Vite + Tailwind (interfaz de usuario)
```

El frontend interactúa con el backend mediante los endpoints:

```
GET    /api/reservas
POST   /api/reservas
DELETE /api/reservas/:id
POST   /api/lista-espera/suscribir
```

---

# Tecnologías utilizadas

### **Frontend**
- React + Vite
- TypeScript
- Tailwind CSS
- Axios
- React Router
- Sistema de notificaciones (toasts)
- Sonner

### **Backend**
- Node.js
- Express
- TypeScript
- uuid
- Patrones: Singleton y Observer

---