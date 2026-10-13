package com.venuevista.dto;

import java.time.Instant;
import java.util.List;

public record BookingResponse(
    String bookingId,
    String eventId,
    String eventTitle,
    List<String> seatCodes,
    String showtime,
    String fullName,
    String email,
    int subtotal,
    int facilityFee,
    int serviceFee,
    int taxes,
    int total,
    String status,
    Instant createdAt) {
}
