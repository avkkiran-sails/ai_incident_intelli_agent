package com.example.backend.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {
    private String incidentId;
    private String serviceName;
    private String environment;
    private String timestamp;
    private String severity;
    private AgentAnalysis analysis;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class AgentAnalysis {
        private ExtractedContext context;
        private CorrelationFindings findings;
        private String rootCauseHypothesis;
        private double confidenceScore;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ExtractedContext {
        private String errorType;
        private String affectedClass;
        private String buildVersion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CorrelationFindings {
        private List<String> recentCommits;
        private List<String> linkedJiraStories;
        private List<String> similarPastIncidents;
    }
}
