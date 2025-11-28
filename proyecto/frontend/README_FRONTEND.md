# Frontend – Sistema de Reservas de Pádel

El módulo **frontend** implementa la interfaz de usuario del Sistema de Reserva de Turnos para Canchas de Pádel.  
Está desarrollado con **React + Vite + TypeScript**, estilado con **Tailwind CSS**, y consume la API del backend mediante Axios.

---

# Tecnologías Principales

- **React** 
- **Vite** 
- **TypeScript**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Sonner** 
- **Dayjs**

---

# Estructura del Proyecto

```
frontend/
 ├── public/
 ├── src/
 │   ├── api/            → llamadas HTTP (axios)
 │   ├── components/     → botones, selectores, toasts, etc.
 │   ├── hooks/          → lógica reutilizable (useTitle)
 │   ├── pages/          → Home, MisReservas
 │   ├── utils/          → funciones auxiliares (buildSlots)
 │   ├── App.tsx         → router principal
 │   └── main.tsx        → punto de entrada
 ├── index.html
 ├── package.json
 └── tailwind.config.js
```

---

# Funcionalidades del Frontend

### Pantalla “Reservar”
- Selección de fecha (bloquea fechas pasadas)
- Selección de cancha
- Grilla dinámica de horarios
- Indicador visual de:
  - horario libre (verde)
  - ocupado (rojo)
  - pasado (gris/rojo)
- Reservar turno disponible
- Suscribirse a lista de espera
- Toasts de confirmación / error
- Polling automático cada 30s

---

### Pantalla “Mis reservas”
- Listado de reservas por usuario
- Cancelación respetando la regla de **12 horas**
- Notificaciones visuales
- UI limpia y responsiva

---

# Instalación y Ejecución

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará en:

```
http://localhost:5173/
```

---

# Configuración del Cliente HTTP

El frontend usa un cliente Axios con baseURL configurable:

```
VITE_API_URL=http://localhost:3000/api
```

En el archivo:  
`frontend/src/api/client.ts`

---

# Tests 

```bash
npm run test
```

---
