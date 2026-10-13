package com.venuevista.model;

import com.venuevista.dto.BookingResponse;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.Arrays;
import java.util.List;

@Entity
@Table(name = "bookings")
public class BookingEntity {
  @Id
  @Column(length = 20, nullable = false)
  private String bookingId;

  @ManyToOne(optional = false)
  @JoinColumn(name = "event_id", nullable = false)
  private EventEntity event;

  @Column(nullable = false, length = 40)
  private String showtime;

  @Column(name = "seat_codes", length = 40)
  private String seatCodes;

  @Column(nullable = false, length = 120)
  private String fullName;

  @Column(nullable = false, length = 254)
  private String email;

  @Column(nullable = false, length = 30)
  private String phone;

  @Column(nullable = false, length = 20)
  private String paymentMethod;

  @Column(nullable = false)
  private int subtotal;

  @Column(nullable = false)
  private int facilityFee;

  @Column(nullable = false)
  private int serviceFee;

  @Column(nullable = false)
  private int taxes;

  @Column(nullable = false)
  private int total;

  @Column(nullable = false, length = 20)
  private String status;

  @Column(nullable = false)
  private Instant createdAt;

  protected BookingEntity() {}

  public BookingEntity(String bookingId, EventEntity event, String showtime, String fullName,
      String seatCodes, String email, String phone, String paymentMethod, int subtotal, int facilityFee,
      int serviceFee, int taxes, int total, String status, Instant createdAt) {
    this.bookingId = bookingId;
    this.event = event;
    this.showtime = showtime;
    this.seatCodes = seatCodes;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.paymentMethod = paymentMethod;
    this.subtotal = subtotal;
    this.facilityFee = facilityFee;
    this.serviceFee = serviceFee;
    this.taxes = taxes;
    this.total = total;
    this.status = status;
    this.createdAt = createdAt;
  }

  public String getBookingId() { return bookingId; }
  public EventEntity getEvent() { return event; }
  public String getShowtime() { return showtime; }
  public List<String> getSeatCodes() {
    return seatCodes == null || seatCodes.isBlank() ? List.of() : Arrays.asList(seatCodes.split(","));
  }
  public void setSeatCodes(List<String> seatCodes) { this.seatCodes = String.join(",", seatCodes); }
  public String getFullName() { return fullName; }
  public String getEmail() { return email; }
  public String getPhone() { return phone; }
  public String getPaymentMethod() { return paymentMethod; }
  public int getSubtotal() { return subtotal; }
  public int getFacilityFee() { return facilityFee; }
  public int getServiceFee() { return serviceFee; }
  public int getTaxes() { return taxes; }
  public int getTotal() { return total; }
  public String getStatus() { return status; }
  public void cancel() { this.status = "CANCELLED"; }
  public Instant getCreatedAt() { return createdAt; }

  public BookingResponse toResponse(List<String> seatCodes) {
    return new BookingResponse(bookingId, event.getId(), event.getTitle(), seatCodes, showtime, fullName, email,
        subtotal, facilityFee, serviceFee, taxes, total, status, createdAt);
  }
}
