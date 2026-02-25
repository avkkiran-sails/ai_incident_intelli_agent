package com.example.backend.tool;

import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

@Component
public class VectorDBTool {

    @Tool("Searches past incidents for similar issues given an error type or description")
    public String searchSimilarIncidents(String description) {
        // Mock implementation
        System.out.println("Executing VectorDBTool for description: " + description);
        if (description.toLowerCase().contains("500") || description.toLowerCase().contains("login")) {
            return "[{'incidentId': 'INC-1049', 'description': 'Login 500 API gateway timeout on Auth service', 'similarity': 82, 'resolution': 'Restarted auth pods and scaled replicas'}]";
        }
        return "[]";
    }
}
