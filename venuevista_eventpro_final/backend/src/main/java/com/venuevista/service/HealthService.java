package com.venuevista.service;

import com.venuevista.dto.HealthResponse;
import java.time.Instant;
import org.springframework.stereotype.Service;

@Service
public class HealthService {
  public HealthResponse getHealth() {
    return new HealthResponse("UP", Instant.now());
  }
}
