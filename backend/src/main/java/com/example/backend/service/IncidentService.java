package com.example.backend.service;

import com.example.backend.agent.IncidentAgent;
import com.example.backend.model.IncidentResponse;
import com.example.backend.model.IncidentRequest;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import java.util.UUID;
import java.time.Instant;

@Service
public class IncidentService {

    private final IncidentAgent incidentAgent;
    private final ObjectMapper objectMapper;

    public IncidentService(IncidentAgent incidentAgent, ObjectMapper objectMapper) {
        this.incidentAgent = incidentAgent;
        this.objectMapper = objectMapper;
    }

    public IncidentResponse processIncident(IncidentRequest request) {
        // Dummy raw logs simulation based on the prompt
        String mockRawLogs = "2026-02-25 10:15:30 ERROR [auth-service] org.apache.catalina.core.ContainerBase.[Tomcat].[localhost].[/].[dispatcherServlet] : Servlet.service() for servlet [dispatcherServlet] in context with path [] threw exception [Request processing failed: java.lang.RuntimeException: Login 500 error in production] with root cause\\ncom.example.auth.ValidationFilter.doFilter(ValidationFilter.java:42)";

        // Agent triggers tool calls and formulates a JSON response
        System.out.println("Triggering AI Agent analysis...");
        String agentJsonResponse = incidentAgent.analyzeIncident(request.getDescription(), mockRawLogs);
        
        System.out.println("AI Agent response: " + agentJsonResponse);

        IncidentResponse.AgentAnalysis analysis;
        try {
            // Remove markdown formatting if the model still includes it despite system prompt
            if (agentJsonResponse.startsWith("```json")) {
                agentJsonResponse = agentJsonResponse.substring(7, agentJsonResponse.lastIndexOf("```"));
            } else if (agentJsonResponse.startsWith("```")) {
                agentJsonResponse = agentJsonResponse.substring(3, agentJsonResponse.lastIndexOf("```"));
            }
            analysis = objectMapper.readValue(agentJsonResponse, IncidentResponse.AgentAnalysis.class);
        } catch (Exception e) {
            System.err.println("Failed to parse Agent JSON: " + e.getMessage());
            analysis = new IncidentResponse.AgentAnalysis();
            analysis.setRootCauseHypothesis("Failed to parse agent response: " + e.getMessage());
            analysis.setConfidenceScore(0.0);
        }

        return new IncidentResponse(
            request.getIncidentId() != null ? request.getIncidentId() : "INC-" + UUID.randomUUID().toString().substring(0, 8),
            "auth-service",
            "Production",
            Instant.now().toString(),
            "High",
            analysis
        );
    }
}
