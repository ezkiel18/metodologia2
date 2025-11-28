# Backend – Sistema de Reservas de Pádel

El módulo **backend** implementa la API REST utilizando **Node.js + Express + TypeScript**.  
Gestiona reservas, cancelaciones, lista de espera y las reglas de negocio del sistema.

---

# Tecnologías utilizadas

- **Node.js**
- **Express**
- **TypeScript**
- **uuid**
- **ts-node-dev**
- **Patrón Singleton**
- **Patrón Observer**

---

# Estructura del Proyecto

```
backend/
 ├── src/
 │   ├── controllers/     → controladores REST
 │   ├── routes/          → rutas de Express
 │   ├── services/        → lógica de negocio (Singleton + Observer)
 │   ├── models/          → interfaces TS
 │   ├── app.ts           → configuración general
 │   └── server.ts        → arranque de la API
 ├── tests/               → pruebas unitarias
 ├── package.json
 └── tsconfig.json
```

---

#  Patrones de Diseño

###  Singleton
Servicios como `ServicioReservas` mantienen un estado único que simula una base de datos centralizada.

###  Observer
Se usa en la **lista de espera**:  
cuando se cancela una reserva, se notifica automáticamente a todos los usuarios suscriptos a ese horario → comportamiento real de un sistema de turnos.

---

#  Endpoints Principales

###  Reservas
```
GET    /api/reservas
POST   /api/reservas
DELETE /api/reservas/:id
```

### 📌 Lista de Espera
```
POST /api/lista-espera/suscribir
```

### 📌 Salud del sistema
```
GET /salud
```

---

#  Reglas de Negocio Implementadas

- Turnos de **90 minutos**
- No se permiten solapamientos
- Cancelación permitida
- Lista de espera por horario y cancha
- Notificación automática (Observer)
- Todas las canchas tienen el mismo precio

---

#  Instalación y Ejecución

```bash
cd backend
npm install
npm run dev
```

Servidor disponible en:

```
http://localhost:3000/
```

---

#  Ejecutar tests

```bash
npm run test
```

---