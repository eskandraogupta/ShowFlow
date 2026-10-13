package com.venuevista.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;

@Entity
@Table(name = "seat_reservations", uniqueConstraints = @UniqueConstraint(
    name = "uk_reserved_event_showtime_seat",
    columnNames = {"event_id", "showtime", "seat_code"}))
public class SeatReservationEntity {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "booking_id", nullable = false, length = 20)
  private String bookingId;

  @Column(name = "event_id", nullable = false, length = 80)
  private String eventId;

  @Column(nullable = false, length = 40)
  private String showtime;

  @Column(name = "seat_code", nullable = false, length = 3)
  private String seatCode;

  protected SeatReservationEntity() {}

  public SeatReservationEntity(String bookingId, String eventId, String showtime, String seatCode) {
    this.bookingId = bookingId;
    this.eventId = eventId;
    this.showtime = showtime;
    this.seatCode = seatCode;
  }

  public String getSeatCode() { return seatCode; }
}
