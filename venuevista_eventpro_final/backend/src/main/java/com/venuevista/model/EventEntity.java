package com.venuevista.model;

import com.venuevista.dto.EventResponse;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "events")
public class EventEntity {
  @Id
  @Column(length = 80, nullable = false)
  private String id;

  @Column(nullable = false, length = 160)
  private String title;

  @Column(nullable = false, length = 500)
  private String subtitle;

  @Column(nullable = false, length = 40)
  private String category;

  @Column(nullable = false, length = 100)
  private String city;

  @Column(nullable = false, length = 200)
  private String venue;

  @Column(nullable = false, length = 120)
  private String date;

  @Column(nullable = false, length = 20)
  private String dateLabel;

  @Column(nullable = false)
  private int fromPrice;

  @Column(nullable = false)
  private int position;

  @Column(nullable = false, length = 10)
  private String rating;

  @Column(length = 100)
  private String tag;

  protected EventEntity() {}

  public EventEntity(String id, String title, String subtitle, String category, String city,
      String venue, String date, String dateLabel, int fromPrice, String rating, String tag, int position) {
    this.id = id;
    this.title = title;
    this.subtitle = subtitle;
    this.category = category;
    this.city = city;
    this.venue = venue;
    this.date = date;
    this.dateLabel = dateLabel;
    this.fromPrice = fromPrice;
    this.position = position;
    this.rating = rating;
    this.tag = tag;
  }

  public String getId() { return id; }
  public String getTitle() { return title; }
  public String getSubtitle() { return subtitle; }
  public String getCategory() { return category; }
  public String getCity() { return city; }
  public String getVenue() { return venue; }
  public String getDate() { return date; }
  public String getDateLabel() { return dateLabel; }
  public int getFromPrice() { return fromPrice; }
  public int getPosition() { return position; }
  public String getRating() { return rating; }
  public String getTag() { return tag; }

  public EventResponse toResponse() {
    return new EventResponse(id, title, subtitle, category, city, venue, date, dateLabel,
        fromPrice, rating, tag);
  }
}
