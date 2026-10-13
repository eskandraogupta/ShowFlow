package com.venuevista.repository;

import com.venuevista.model.SeatReservationEntity;
import java.util.Collection;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SeatReservationRepository extends JpaRepository<SeatReservationEntity, Long> {
  boolean existsByEventIdAndShowtimeIgnoreCaseAndSeatCodeIn(
      String eventId, String showtime, Collection<String> seatCodes);

  List<SeatReservationEntity> findAllByBookingIdOrderByIdAsc(String bookingId);

  void deleteAllByBookingId(String bookingId);
}
