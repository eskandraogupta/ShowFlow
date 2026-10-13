# Showflow Backend

Spring Boot REST API for the Showflow event catalog and checkout preview. H2 stores events, reservations, and reserved seats in a local file database at `backend/data/venuevista`. The 13 sample events are inserted the first time the database starts. The data persists across application restarts.

## Requirements

- Java 21
- Maven 3.9+

## Run

```bash
mvn spring-boot:run
```

The service listens on `http://localhost:8080`. Set `FRONTEND_URL` if the frontend origin differs from `http://localhost:3000`. The database location and credentials can be overridden with `DATABASE_URL`, `DATABASE_USERNAME`, and `DATABASE_PASSWORD`.

## API

- `GET /api/health` — service status and timestamp.
- `GET /api/events` — event catalog. Optional filters: `city`, `category`, and `q` (searches title, subtitle, and venue).
- `GET /api/events/{id}` — one event, or `404` when it does not exist.
- `POST /api/bookings` — reserve seats and calculate the total. Responds with `201 Created`; duplicate seats for the same event and showtime respond with `409 Conflict`.
- `GET /api/bookings` — list all bookings, newest first.
- `GET /api/bookings/{id}` — retrieve a reservation.
- `PATCH /api/bookings/{id}/cancel` — mark a reservation cancelled and release its seats. The booking remains in the list for history.

Booking request example:

```json
{
  "eventId": "summer-beats",
  "seatCodes": ["A03", "A04"],
  "showtime": "6:30 PM",
  "fullName": "Asha Rao",
  "email": "asha@example.com",
  "phone": "+91 98765 43210",
  "paymentMethod": "UPI"
}
```

`paymentMethod` accepts `UPI`, `CARD`, or `NETBANKING`. The response contains a generated booking ID, server-calculated ticket and fee amounts, and status `RESERVED`. The selected payment method is recorded, but no payment gateway is connected and no card or UPI credentials are stored. A database unique constraint prevents reserving the same seat for the same event and showtime twice.

## Test

```bash
mvn test
```
