package com.venuevista.controller;

import com.venuevista.dto.EventResponse;
import com.venuevista.service.EventService;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/events")
public class EventController {
  private final EventService eventService;

  public EventController(EventService eventService) {
    this.eventService = eventService;
  }

  @GetMapping
  public List<EventResponse> findEvents(
      @RequestParam(required = false) String city,
      @RequestParam(required = false) String category,
      @RequestParam(required = false, name = "q") String query) {
    return eventService.findAll(city, category, query);
  }

  @GetMapping("/{id}")
  public EventResponse findEvent(@PathVariable String id) {
    EventResponse event = eventService.findById(id);
    if (event == null) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Event not found");
    }
    return event;
  }
}
