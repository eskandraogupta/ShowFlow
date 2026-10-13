package com.venuevista.service;

import com.venuevista.dto.EventResponse;
import com.venuevista.model.EventEntity;
import com.venuevista.repository.EventRepository;
import java.util.List;
import java.util.Locale;
import org.springframework.stereotype.Service;

@Service
public class EventService {
  private final EventRepository eventRepository;

  public EventService(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  public List<EventResponse> findAll(String city, String category, String query) {
    String normalizedQuery = query == null ? null : query.toLowerCase(Locale.ROOT);
    return eventRepository.findAllByOrderByPositionAsc().stream()
        .filter(event -> city == null || event.getCity().equalsIgnoreCase(city))
        .filter(event -> category == null || event.getCategory().equalsIgnoreCase(category))
        .filter(event -> normalizedQuery == null
            || (event.getTitle() + " " + event.getSubtitle() + " " + event.getVenue())
                .toLowerCase(Locale.ROOT).contains(normalizedQuery))
        .map(EventEntity::toResponse)
        .toList();
  }

  public EventResponse findById(String id) {
    return eventRepository.findById(id).map(EventEntity::toResponse).orElse(null);
  }

  public EventEntity findEntityById(String id) {
    return eventRepository.findById(id).orElse(null);
  }
}
