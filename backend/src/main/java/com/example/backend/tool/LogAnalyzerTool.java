package com.example.backend.tool;

import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

@Component
public class LogAnalyzerTool {

    @Tool("Analyzes raw logs to extract the affected service name, error type, and affected class")
    public String analyzeLogs(String rawLogs) {
        // Mock implementation
        System.out.println("Executing LogAnalyzerTool on: " + rawLogs.substring(0, Math.min(rawLogs.length(), 20)) + "...");
        return """
            {
                "serviceName": "auth-service",
                "errorType": "500 Internal Server Error",
                "affectedClass": "com.example.auth.ValidationFilter",
                "buildVersion": "v1.4.2"
            }
            """;
    }
}
