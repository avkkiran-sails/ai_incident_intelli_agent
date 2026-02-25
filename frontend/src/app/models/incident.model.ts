export interface IncidentRequest {
    incidentId?: string;
    description: string;
    timestamp?: string;
}

export interface ExtractedContext {
    errorType: string;
    affectedClass: string;
    buildVersion: string;
}

export interface CorrelationFindings {
    recentCommits: string[];
    linkedJiraStories: string[];
    similarPastIncidents: string[];
}

export interface AgentAnalysis {
    context: ExtractedContext;
    findings: CorrelationFindings;
    rootCauseHypothesis: string;
    confidenceScore: number;
}

export interface IncidentResponse {
    incidentId: string;
    serviceName: string;
    environment: string;
    timestamp: string;
    severity: string;
    analysis: AgentAnalysis;
}
