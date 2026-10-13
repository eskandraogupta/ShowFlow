# Showflow

Showflow is an event discovery, seating, and operations app with a React/Vite frontend and a standalone Spring Boot backend.

## Project layout

```text
venuevista_eventpro/
├── frontend/   React, TypeScript, Vite and Tailwind CSS
├── backend/    Java 21, Spring Boot REST API
└── README.md
```

VS Code workspace configuration (`.github/`, `.rocketride/`, and `.vscode/`) remains at the repository root.

## Run the frontend

Requirements: Node.js and npm.

From the repository root, install and start both the frontend and backend with:

```bash
npm install
npm run dev
```

The root `npm run dev` command starts the Spring Boot API and Vite together. It uses Maven when available and falls back to the existing packaged backend JAR. If neither Maven nor `backend/target/venuevista-backend-0.1.0-SNAPSHOT.jar` is available, build the backend with Maven first. To work inside the frontend directory, `npm run dev` also starts both services; use `npm run dev:server` there only when you are intentionally starting Vite without the API.

Vite serves the app at `http://localhost:3000` by default and automatically tries the next available port if 3000 is occupied. Sign in with the mobile preview flow using code `123456`; successful sign-in opens the seating workspace. The code is for local demonstration only; no SMS is sent. Frontend environment variables belong in `frontend/.env`; use `frontend/.env.example` as a template.

Other frontend checks:

```bash
npm run lint
npm run build
```

## Run the backend

Requirements: Java 21 or newer. Maven 3.9 or newer is required to build or run from source.

```bash
cd backend
mvn spring-boot:run
```

The API listens at `http://localhost:8080`. The initial endpoint is `GET /api/health`. Set `FRONTEND_URL` if the frontend origin differs from `http://localhost:3000`. H2 stores persistent event and reservation data in `backend/data/venuevista.mv.db`.

Run backend tests with:

```bash
mvn test
```

## Integration status

The frontend loads its event catalog from the backend and creates reservations through `/api/bookings`. In development, Vite proxies `/api` to `http://localhost:8080`; start both servers. Event and reservation data are persisted in the backend's local H2 database. No payment is processed.
