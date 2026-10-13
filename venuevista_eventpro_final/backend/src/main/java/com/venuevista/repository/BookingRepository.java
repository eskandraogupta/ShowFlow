package com.venuevista.repository;

import com.venuevista.model.BookingEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BookingRepository extends JpaRepository<BookingEntity, String> {
  List<BookingEntity> findAllByOrderByCreatedAtDesc();
}
