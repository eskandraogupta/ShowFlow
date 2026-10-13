package com.venuevista.service;

import com.venuevista.dto.BookingResponse;
import com.venuevista.dto.CreateBookingRequest;
import com.venuevista.model.BookingEntity;
import com.venuevista.model.EventEntity;
import com.venuevista.model.SeatReservationEntity;
import com.venuevista.repository.BookingRepository;
import com.venuevista.repository.SeatReservationRepository;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.UUID;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class BookingService {
  private final EventService eventService;
  private final BookingRepository bookingRepository;
  private final SeatReservationRepository seatReservationRepository;

  public BookingService(EventService eventService, BookingRepository bookingRepository,
      SeatReservationRepository seatReservationRepository) {
    this.eventService = eventService;
    this.bookingRepository = bookingRepository;
    this.seatReservationRepository = seatReservationRepository;
  }

  @Transactional
  public BookingResponse create(CreateBookingRequest request) {
    EventEntity event = eventService.findEntityById(request.eventId());
    if (event == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
    }
    if (request.seatCodes().stream().distinct().count() != request.seatCodes().size()) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Seat codes must be unique");
    }

    int subtotal = request.seatCodes().stream()
        .mapToInt(code -> seatPrice(event.getFromPrice(), code)).sum();
    int facilityFee = request.seatCodes().size() * 49;
    int serviceFee = 35;
    int taxes = (int) Math.round((facilityFee + serviceFee) * 0.18);
    int total = subtotal + facilityFee + serviceFee + taxes;
    String normalizedShowtime = request.showtime().trim().toUpperCase(Locale.ROOT);
    String bookingId = "VV-" + UUID.randomUUID().toString().replace("-", "")
        .substring(0, 8).toUpperCase(Locale.ROOT);
    BookingEntity booking = new BookingEntity(bookingId, event, normalizedShowtime,
        request.fullName().trim(), String.join(",", request.seatCodes()),
        request.email().trim(), request.phone().trim(),
        request.paymentMethod().name(), subtotal, facilityFee, serviceFee, taxes, total,
        "RESERVED", Instant.now());

    bookingRepository.save(booking);
    List<SeatReservationEntity> reservations = request.seatCodes().stream()
        .map(code -> new SeatReservationEntity(bookingId, event.getId(), normalizedShowtime, code))
        .toList();
    try {
      seatReservationRepository.saveAllAndFlush(reservations);
    } catch (DataIntegrityViolationException exception) {
      throw new ResponseStatusException(HttpStatus.CONFLICT,
          "One or more seats are no longer available", exception);
    }
    return booking.toResponse(request.seatCodes());
  }

  @Transactional(readOnly = true)
  public List<BookingResponse> findAll() {
    return bookingRepository.findAllByOrderByCreatedAtDesc().stream()
        .map(booking -> booking.toResponse(seatCodesFor(booking)))
        .toList();
  }

  @Transactional(readOnly = true)
  public BookingResponse findById(String id) {
    BookingEntity booking = bookingRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    return booking.toResponse(seatCodesFor(booking));
  }

  @Transactional
  public BookingResponse cancel(String id) {
    BookingEntity booking = bookingRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Booking not found"));
    List<String> seatCodes = seatCodesFor(booking);
    if (!"CANCELLED".equals(booking.getStatus())) {
      booking.setSeatCodes(seatCodes);
      booking.cancel();
      seatReservationRepository.deleteAllByBookingId(id);
    }
    return booking.toResponse(seatCodes);
  }

  private List<String> seatCodesFor(BookingEntity booking) {
    List<String> savedSeatCodes = booking.getSeatCodes();
    if (!savedSeatCodes.isEmpty()) return savedSeatCodes;
    return seatReservationRepository.findAllByBookingIdOrderByIdAsc(booking.getBookingId()).stream()
        .map(SeatReservationEntity::getSeatCode)
        .toList();
  }

  private static int seatPrice(int basePrice, String seatCode) {
    if (seatCode == null || !seatCode.matches("[A-H]\\d{2}")) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seat code: " + seatCode);
    }
    int seatNumber = Integer.parseInt(seatCode.substring(1));
    int rowCapacity = switch (seatCode.charAt(0)) {
      case 'A', 'B', 'C' -> 18;
      case 'D', 'E' -> 16;
      case 'F' -> 14;
      case 'G' -> 12;
      case 'H' -> 10;
      default -> 0;
    };
    if (seatNumber < 1 || seatNumber > rowCapacity) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seat code: " + seatCode);
    }
    return switch (seatCode.charAt(0)) {
      case 'A', 'B', 'C' -> basePrice;
      case 'D', 'E' -> basePrice * 2;
      case 'F' -> (int) Math.round(basePrice * 1.5);
      case 'G', 'H' -> basePrice * 3;
      default -> throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid seat code: " + seatCode);
    };
  }
}
