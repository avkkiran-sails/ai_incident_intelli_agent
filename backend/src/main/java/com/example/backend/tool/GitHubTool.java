package com.example.backend.tool;

import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

@Component
public class GitHubTool {

    @Tool("Fetches recent commits touching the affected service or module")
    public String fetchRecentCommits(String serviceName) {
        // Mock implementation
        System.out.println("Executing GitHubTool for service: " + serviceName);
        if (serviceName.contains("auth")) {
            return "[{'commitId': 'a1b2c3d4', 'message': 'AUTH-221 Refactor validation', 'author': 'jane.doe', 'time': '2026-02-24T18:14:48Z'}]";
        }
        return "[]";
    }
}
