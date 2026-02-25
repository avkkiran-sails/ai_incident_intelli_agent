package com.example.backend.agent;

import org.springframework.stereotype.Service;

@Service
public class IncidentAgent {

  public String analyzeIncident(String incidentDescription, String rawLogs) {
    return """
        {
          "context": {
            "errorType": "500 Internal Server Error",
            "affectedClass": "com.example.auth.ValidationFilter",
            "buildVersion": "v1.4.2"
          },
          "findings": {
            "recentCommits": ["a1b2c3d4 - AUTH-221 Refactor validation (jane.doe)"],
            "linkedJiraStories": ["AUTH-221 - Refactor OAuth2 validation logic (DONE)"],
            "similarPastIncidents": ["INC-1049 - Login 500 API gateway timeout on Auth service (Similarity: 82%)"]
          },
          "rootCauseHypothesis": "The recent commit 'AUTH-221' refactored the OAuth validation logic in 'ValidationFilter', which is now throwing a runtime exception under load. This is highly correlated with past incident INC-1049, suggesting an underlying API gateway connection leakage.",
          "confidenceScore": 88.5
        }
        """;
  }
}
