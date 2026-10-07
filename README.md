# Sistema de Gestión para Farmacia

Trabajo práctico - Programación III

Sistema web integral para la administración de farmacias que permite gestionar medicamentos, categorías y empleados.

---

## 🛠 Tecnologías Utilizadas

- **Backend:** NestJS, TypeORM, class-validator
- **Base de Datos:** MySQL 8.0 en contenedor Docker
- **Frontend:** ReactJS (Vite), React Router, Axios, Lucide React
- **Contenedores:** Docker Compose
- **Control de Versiones:** Git y GitHub

---

## 📋 Requisitos Previos

- [Node.js](https://nodejs.org/) (v18 o superior)
- [Yarn](https://yarnpkg.com/)
- [Docker Desktop](https://www.docker.com/)

---

## 🚀 Instrucciones de Ejecución

### 1. Clonar el repositorio

```bash
git clone https://github.com/LautaroVidelaa/GestorFarmacia.git
cd farmacia
```

### 2. Base de Datos (Docker)

Iniciar el contenedor de MySQL:

```bash
docker compose up -d
```

> La base de datos queda accesible localmente en el puerto `3307`.

### 3. Backend (NestJS)

Configurar y levantar la API REST:

```bash
cd backend
copy example.env .env (windows)
cp example.env .env (linux/mac)
yarn install
yarn start:dev
```

> El backend quedará corriendo en `http://localhost:3000/api`.

### 4. Frontend (ReactJS)

En otra terminal, configurar y levantar la aplicación web:

```bash
cd frontend
copy example.env .env (windows)
cp example.env .env (linux/mac)
yarn install
yarn dev
```

> Abrir en el navegador: `http://localhost:5173`.

---

## 📖 Documentación de Endpoints (API REST)

Prefijo global: `/api`

### 🏷 Categorías (`/api/categories`)

| Método    | Endpoint            | Descripción                  | Body Requerido                                        |
| :--------- | :------------------ | :---------------------------- | :---------------------------------------------------- |
| `GET`    | `/categories`     | Listar todas las categorías  | -                                                     |
| `GET`    | `/categories/:id` | Obtener una categoría por ID | -                                                     |
| `POST`   | `/categories`     | Crear una categoría          | `{ "nombre": "string", "descripcion": "string" }`   |
| `PATCH`  | `/categories/:id` | Actualizar una categoría     | `{ "nombre"?: "string", "descripcion"?: "string" }` |
| `DELETE` | `/categories/:id` | Eliminar una categoría       | -                                                     |

### 💊 Medicamentos (`/api/medicines`)

| Método    | Endpoint           | Descripción                  | Body Requerido                                                                                                                                              |
| :--------- | :----------------- | :---------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/medicines`     | Listar todos los medicamentos | -                                                                                                                                                           |
| `GET`    | `/medicines/:id` | Obtener un medicamento por ID | -                                                                                                                                                           |
| `POST`   | `/medicines`     | Crear un medicamento          | `{ "nombre": "string", "descripcion": "string", "precio": 0.0, "stock": 0, "laboratorio": "string", "fechaVencimiento": "YYYY-MM-DD", "categoriaId": 1 }` |
| `PATCH`  | `/medicines/:id` | Actualizar un medicamento     | Campos opcionales del DTO de creación                                                                                                                      |
| `DELETE` | `/medicines/:id` | Eliminar un medicamento       | -                                                                                                                                                           |

### 👥 Empleados (`/api/employees`)

| Método    | Endpoint           | Descripción               | Body Requerido                                                                                                                                              |
| :--------- | :----------------- | :------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/employees`     | Listar todos los empleados | -                                                                                                                                                           |
| `GET`    | `/employees/:id` | Obtener un empleado por ID | -                                                                                                                                                           |
| `POST`   | `/employees`     | Crear un empleado          | `{ "nombre": "string", "apellido": "string", "dni": "string", "email": "string", "telefono": "string", "cargo": "string", "fechaIngreso": "YYYY-MM-DD" }` |
| `PATCH`  | `/employees/:id` | Actualizar un empleado     | Campos opcionales del DTO de creación                                                                                                                      |
| `DELETE` | `/employees/:id` | Eliminar un empleado       | -                                                                                                                                                           |

---

## ✨ Funcionalidades Adicionales Implementadas

- Alertas de **stock crítico** en el Dashboard (productos con 5 unidades o menos).
- Notificaciones de **medicamentos próximos a vencer** (dentro de los 30 días).
- Validación de datos automática con DTOs y `ValidationPipe`.
- Configuración mediante variables de entorno `.env`.