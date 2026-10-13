package com.venuevista.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.List;

public record CreateBookingRequest(
    @NotBlank String eventId,
    @NotEmpty @Size(max = 10) List<@NotBlank String> seatCodes,
    @NotBlank String showtime,
    @NotBlank @Size(max = 120) String fullName,
    @NotBlank @Email @Size(max = 254) String email,
    @NotBlank @Size(max = 30) String phone,
    @NotNull PaymentMethod paymentMethod) {

  public enum PaymentMethod {
    UPI,
    CARD,
    NETBANKING
  }
}
