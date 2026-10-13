package com.venuevista.config;

import com.venuevista.model.EventEntity;
import com.venuevista.repository.EventRepository;
import java.util.List;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class EventDataSeeder implements ApplicationRunner {
  private final EventRepository eventRepository;
  private int seedPosition;

  public EventDataSeeder(EventRepository eventRepository) {
    this.eventRepository = eventRepository;
  }

  @Override
  public void run(ApplicationArguments args) {
    if (eventRepository.count() != 0) return;
    eventRepository.saveAll(List.of(
        event("summer-beats", "Summer Beats Festival", "A night of live music, lights and big energy", "Music", "Mumbai", "D.Y. Patil Stadium, Navi Mumbai", "Saturday, 14 November 2026 · 6:30 PM", "14 NOV", 2499, "4.8", "Selling fast"),
        event("laugh-lines", "Laugh Lines: Mumbai", "A live stand-up night with the city’s sharpest comics", "Comedy", "Mumbai", "NCPA, Nariman Point", "Sunday, 22 November 2026 · 7:00 PM", "22 NOV", 799, "4.7", "Bestseller"),
        event("monsoon-room", "The Monsoon Room", "A tender new play about the people we call home", "Theatre", "Mumbai", "Prithvi Theatre, Juhu", "Saturday, 31 October 2026 · 7:00 PM", "31 OCT", 650, "4.8", "Limited seats"),
        event("clay-and-chai", "Clay & Chai: Pottery Session", "Try the wheel, shape your own cup and take it home", "Workshops", "Mumbai", "The Studio, Bandra West", "Sunday, 8 November 2026 · 11:00 AM", "08 NOV", 1250, "4.9", "Small group"),
        event("midnight-raga", "Midnight Raga", "An open-air evening of contemporary Indian music", "Music", "Mumbai", "Jio World Garden, BKC", "Friday, 27 November 2026 · 8:00 PM", "27 NOV", 999, "4.7", null),
        event("indie-after-hours", "Indie After Hours", "New sounds from India’s independent music scene", "Music", "Bengaluru", "Phoenix Marketcity, Whitefield", "Saturday, 28 November 2026 · 8:00 PM", "28 NOV", 1299, "4.6", null),
        event("other-side-of-rain", "The Other Side of Rain", "A close-up theatre story told in two acts", "Theatre", "Bengaluru", "Ranga Shankara, J.P. Nagar", "Sunday, 13 December 2026 · 6:30 PM", "13 DEC", 550, "4.8", null),
        event("bengaluru-laugh-club", "The Bengaluru Laugh Club", "A rotating lineup of local stand-up favourites", "Comedy", "Bengaluru", "The Comedy Theatre, Indiranagar", "Friday, 18 December 2026 · 8:00 PM", "18 DEC", 699, "4.6", null),
        event("city-stories", "City Stories: A Play", "An intimate new production about life in the big city", "Theatre", "Delhi NCR", "Kamani Auditorium, New Delhi", "Sunday, 6 December 2026 · 5:00 PM", "06 DEC", 599, "4.9", "Critics’ pick"),
        event("design-weekend", "Make Something: Design Weekend", "Hands-on sessions with makers, artists and designers", "Workshops", "Hyderabad", "HITEX Exhibition Centre", "Saturday, 12 December 2026 · 10:00 AM", "12 DEC", 1499, "4.8", null),
        event("open-air-sessions", "Open Air Sessions", "An easy-going evening of music under the stars", "Music", "Pune", "Mahalaxmi Lawns, Magarpatta", "Saturday, 19 December 2026 · 6:00 PM", "19 DEC", 999, "4.7", null),
        event("print-and-pattern", "Print & Pattern Studio", "Learn block printing and make a one-off tote", "Workshops", "Pune", "The Mills Social, Koregaon Park", "Sunday, 20 December 2026 · 11:00 AM", "20 DEC", 999, "4.8", "All materials included"),
        event("delhi-late-show", "The Delhi Late Show", "Quick-fire stand-up and crowd-work after dark", "Comedy", "Delhi NCR", "The Laugh Store, Aerocity", "Saturday, 19 December 2026 · 9:00 PM", "19 DEC", 799, "4.7", null)));
  }

  private EventEntity event(String id, String title, String subtitle, String category,
      String city, String venue, String date, String dateLabel, int fromPrice, String rating, String tag) {
    return new EventEntity(id, title, subtitle, category, city, venue, date, dateLabel,
        fromPrice, rating, tag, seedPosition++);
  }
}
