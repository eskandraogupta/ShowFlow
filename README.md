
# VenueVista EventPro 🎟️

A full-stack event discovery and reservation management platform designed to simplify event browsing, ticket booking, and venue operations through a modern, user-friendly interface.

## 📌 About the Project

**VenueVista EventPro** is a web application that combines a React-based frontend with a Spring Boot backend to provide event discovery and reservation functionality. Users can explore events and create bookings, while the application supports booking management and seating-related interfaces.

This project demonstrates full-stack web development, REST API integration, and database-backed reservation management.

## ✨ Features

- **Event Discovery:** Browse and explore available events.
- **User Interface:** Modern, responsive interface built with React and Tailwind CSS.
- **Booking Management:** Create and manage event reservations.
- **Seating Interface:** Dedicated seating and reservation views.
- **Dashboard:** Event and booking management views.
- **REST API Integration:** Frontend communicates with the backend through API endpoints.
- **Database Persistence:** Event and reservation data stored using an H2 database.
- **Health Check API:** Backend endpoint to verify API availability.

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Lucide React

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Maven
- H2 Database
- REST APIs

## 📂 Project Structure

```text
VenueVista-EventPro/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── data/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── main/
│   │   └── test/
│   └── pom.xml
├── scripts/
├── package.json
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Make sure you have installed:

- Node.js and npm
- Java Development Kit (JDK) 21
- Apache Maven 3.9 or newer
- Git

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
cd YOUR-REPOSITORY
```

Replace `YOUR-USERNAME` and `YOUR-REPOSITORY` with your GitHub username and repository name.

### 2. Install Dependencies

From the project root, run:

```bash
npm install
```

### 3. Start the Application

Run the following command from the project root:

```bash
npm run dev
```

This starts the frontend and backend development services together.

Open the frontend in your browser:

**http://localhost:3000**

The backend API runs at:

**http://localhost:8080**

### 4. Run the Backend Separately

If you want to start the backend independently, open a terminal and run:

```bash
cd backend
mvn spring-boot:run
```

### 5. Build and Check the Frontend

From the project root:

```bash
npm run build
npm run lint
```

### 6. Run Backend Tests

```bash
npm run backend:test
```

Alternatively, run the tests from the backend directory:

```bash
cd backend
mvn test
```

## 🔗 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/events` | Retrieve event catalog |
| POST | `/api/bookings` | Create a booking |

*Note: Confirm the exact event endpoint and request format in the backend controller before publishing the API documentation.*

## 🗄️ Database

The application uses an H2 database for storing event and reservation data.

- Database integration through Spring Boot and JPA.
- Event data can be initialized through a data seeder.
- Booking and reservation records are persisted by the backend.
- No payment is processed by the application.

## 🔐 Environment Configuration

Frontend environment variables belong in `frontend/.env`.

Use the provided `frontend/.env.example` as a starting point, where applicable.

**Security:** Never commit passwords, API keys, access tokens, or other secrets. Keep `.env` files out of Git and provide a sanitized `.env.example` instead.

## 🎯 Learning Outcomes

- Understanding full-stack application architecture.
- Building frontend interfaces with React and TypeScript.
- Developing REST APIs using Java and Spring Boot.
- Integrating frontend and backend services.
- Working with database persistence using Spring Data JPA and H2.
- Understanding event booking and reservation workflows.
- Using Git and GitHub for project version control.

## 🔮 Future Enhancements

- User authentication and role-based access control.
- Ticket payment gateway integration.
- Booking confirmation emails.
- Advanced event search and filtering.
- Improved seat selection and availability tracking.
- Deployment to a cloud hosting platform.

## 👨‍💻 Author

**Your Name**

Eskand Rao Gupta

---


