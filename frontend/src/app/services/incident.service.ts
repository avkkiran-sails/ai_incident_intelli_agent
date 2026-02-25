import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IncidentRequest, IncidentResponse } from '../models/incident.model';

@Injectable({
    providedIn: 'root'
})
export class IncidentService {
    private apiUrl = 'http://localhost:8081/api/incidents';

    constructor(private http: HttpClient) { }

    analyzeIncident(request: IncidentRequest): Observable<IncidentResponse> {
        return this.http.post<IncidentResponse>(`${this.apiUrl}/analyze`, request);
    }

    performAction(incidentId: string, action: string): Observable<string> {
        return this.http.post(`${this.apiUrl}/${incidentId}/action?action=${action}`, {}, { responseType: 'text' });
    }
}
