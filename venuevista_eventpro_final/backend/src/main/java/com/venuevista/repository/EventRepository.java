package com.venuevista.repository;

import com.venuevista.model.EventEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EventRepository extends JpaRepository<EventEntity, String> {
  List<EventEntity> findAllByOrderByPositionAsc();
}
