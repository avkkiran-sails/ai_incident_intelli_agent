package com.example.backend.controller;

import com.example.backend.model.IncidentRequest;
import com.example.backend.model.IncidentResponse;
import com.example.backend.service.IncidentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/incidents")
@CrossOrigin(origins = "*", allowedHeaders = "*")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping("/analyze")
    public ResponseEntity<IncidentResponse> runAnalysis(@RequestBody IncidentRequest request) {
        IncidentResponse response = incidentService.processIncident(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/action")
    public ResponseEntity<String> performAction(@PathVariable String id, @RequestParam String action) {
        System.out.println("Performing action on incident " + id + ": " + action);
        if ("APPROVE".equalsIgnoreCase(action)) {
            return ResponseEntity.ok("RCA Draft Approved and Published for " + id);
        } else if ("REJECT".equalsIgnoreCase(action)) {
            return ResponseEntity.ok("RCA Draft Rejected for " + id);
        } else if ("RERUN".equalsIgnoreCase(action)) {
            return ResponseEntity.ok("Extended search initiated for " + id);
        }
        return ResponseEntity.badRequest().body("Invalid action");
    }
}
