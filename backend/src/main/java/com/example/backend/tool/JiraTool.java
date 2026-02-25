package com.example.backend.tool;

import dev.langchain4j.agent.tool.Tool;
import org.springframework.stereotype.Component;

@Component
public class JiraTool {

    @Tool("Fetches details of a Jira story given its ID")
    public String fetchJiraStory(String jiraId) {
        // Mock implementation
        System.out.println("Executing JiraTool for story: " + jiraId);
        if (jiraId.contains("AUTH-221")) {
            return "{'id': 'AUTH-221', 'title': 'Refactor OAuth2 validation logic', 'status': 'DONE', 'assignee': 'jane.doe'}";
        }
        return "{'error': 'Story not found'}";
    }
}
