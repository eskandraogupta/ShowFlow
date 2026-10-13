package com.venuevista.dto;

public record EventResponse(
    String id,
    String title,
    String subtitle,
    String category,
    String city,
    String venue,
    String date,
    String dateLabel,
    int fromPrice,
    String rating,
    String tag) {
}
