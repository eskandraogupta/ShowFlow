package com.venuevista;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest(properties = "spring.datasource.url=jdbc:h2:mem:venuevista-test;DB_CLOSE_DELAY=-1")
@AutoConfigureMockMvc
class VenueVistaApplicationTests {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void healthEndpointReturnsUp() throws Exception {
        mockMvc.perform(get("/api/health"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("UP"));
    }

    @Test
    void eventCatalogIsSeededAndFilterable() throws Exception {
        mockMvc.perform(get("/api/events").param("city", "Mumbai"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", org.hamcrest.Matchers.hasSize(5)))
                .andExpect(jsonPath("$[0].id").value("summer-beats"));
    }

    @Test
    void bookingIsStoredAndDuplicateSeatsAreRejected() throws Exception {
        String request = """
                {
                  "eventId": "summer-beats",
                  "seatCodes": ["A03", "A04"],
                  "showtime": "6:30 PM",
                  "fullName": "Test Patron",
                  "email": "patron@example.com",
                  "phone": "9876543210",
                  "paymentMethod": "UPI"
                }
                """;

        MvcResult result = mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("RESERVED"))
                .andExpect(jsonPath("$.subtotal").value(4998))
                .andExpect(jsonPath("$.total").value(5155))
                .andReturn();

        String bookingId = objectMapper.readTree(result.getResponse().getContentAsString())
                .get("bookingId").asText();
        mockMvc.perform(get("/api/bookings/{id}", bookingId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.seatCodes.length()").value(2));

        mockMvc.perform(post("/api/bookings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(request))
                .andExpect(status().isConflict());

    }
}
