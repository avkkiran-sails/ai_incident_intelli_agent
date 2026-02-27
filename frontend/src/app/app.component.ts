import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { IncidentService } from './services/incident.service';
import { IncidentRequest, IncidentResponse } from './models/incident.model';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'AI incident intelli agent';

  _activeTab = 'Dashboard';
  get activeTab(): string {
    return this._activeTab;
  }
  set activeTab(val: string) {
    this._activeTab = val;
    this.updateTitle();
  }

  isSidebarCollapsed = false;

  incident: IncidentResponse | null = null;
  loading = false;
  actionMessage = '';

  activeIncidentsList: any[] = [];
  rcaHistoryList: any[] = [];
  workflowRunsList: any[] = [];
  selectedWorkflowIncidentId: string | null = null;
  currentPage = 1;
  itemsPerPage = 10;

  sortField: 'timestamp' | 'severity' = 'timestamp';
  sortDirection: 'asc' | 'desc' = 'desc';

  // Settings State
  settings = {
    apiKey: 'sk-xxxxxxxxxxxxxxxxxxxxxxxx',
    model: 'gemini-1.5-pro',
    temperature: 0.2,
    jiraUrl: 'https://company.atlassian.net',
    githubToken: 'ghp_xxxxxxxxxxxxxxxxxxxxxx',
    autoApproveLowSeverity: false,
    vectorDbEnabled: true
  };
  settingsSaved = false;

  constructor(private incidentService: IncidentService, private titleService: Title) {
    this.updateTitle();
  }

  ngOnInit() {
    this.generateMockIncidents();
  }

  generateMockIncidents() {
    const services = ['auth-service', 'payment-gateway', 'user-profile-api', 'inventory-db', 'notification-worker'];
    const envs = ['Production', 'Staging'];
    const severities = ['High', 'Critical', 'Medium'];
    const descriptions = ['Login 500 error', 'Database timeout', 'Failed payment webhook', 'High memory usage', 'Pod crashloop'];

    for (let i = 1; i <= 25; i++) {
      this.activeIncidentsList.push({
        id: `INC-1${(1000 + i).toString().substring(1)}`,
        serviceName: services[Math.floor(Math.random() * services.length)],
        environment: envs[Math.floor(Math.random() * envs.length)],
        severity: severities[Math.floor(Math.random() * severities.length)],
        description: descriptions[Math.floor(Math.random() * descriptions.length)] + ' in ' + envs[Math.floor(Math.random() * envs.length)],
        timestamp: new Date(Date.now() - Math.floor(Math.random() * 100000000)).toISOString()
      });
    }
    this.sortIncidents();
  }

  sortIncidents() {
    const severityMap: { [key: string]: number } = {
      'Critical': 3,
      'High': 2,
      'Medium': 1
    };

    this.activeIncidentsList.sort((a, b) => {
      if (this.sortField === 'severity') {
        const weightA = severityMap[a.severity] || 0;
        const weightB = severityMap[b.severity] || 0;
        if (weightA !== weightB) {
          return this.sortDirection === 'desc' ? weightB - weightA : weightA - weightB;
        }
        // Fallback to timestamp if severity is same
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      } else {
        const timeA = new Date(a.timestamp).getTime();
        const timeB = new Date(b.timestamp).getTime();
        return this.sortDirection === 'desc' ? timeB - timeA : timeA - timeB;
      }
    });
  }

  toggleSort(field: 'timestamp' | 'severity') {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
    } else {
      this.sortField = field;
      this.sortDirection = 'desc';
    }
    this.currentPage = 1;
    this.sortIncidents();
  }

  get paginatedIncidents() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.activeIncidentsList.slice(start, start + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.activeIncidentsList.length / this.itemsPerPage);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }

  get displayedWorkflowRuns() {
    if (this.selectedWorkflowIncidentId) {
      return this.workflowRunsList.filter(run => run.incidentId === this.selectedWorkflowIncidentId);
    }
    return this.workflowRunsList;
  }

  viewAgentWorkflow(incidentId: string) {
    this.selectedWorkflowIncidentId = incidentId;
    this.activeTab = 'Agent Workflows';
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  updateTitle() {
    this.titleService.setTitle(`${this.title} | ${this.activeTab}`);
  }

  triggerMockIncident() {
    this.analyzeIncident({ description: 'Login 500 error in production' });
  }

  analyzeIncidentFromList(inc: any) {
    inc.analyzed = true;
    this.activeTab = 'Dashboard';
    this.analyzeIncident({
      incidentId: inc.id,
      description: inc.description
    });
  }

  analyzeIncident(req: IncidentRequest) {
    this.loading = true;
    this.incident = null;
    this.actionMessage = '';

    setTimeout(() => { // Simulated delay for visual effect
      this.incidentService.analyzeIncident(req).subscribe({
        next: (res) => {
          this.incident = res;
          this.loading = false;

          if (!this.workflowRunsList.find(w => w.incidentId === res.incidentId)) {
            const step1 = parseFloat((Math.random() * 1.5 + 0.1).toFixed(1));
            const step2 = parseFloat((Math.random() * 2.0 + 0.5).toFixed(1));
            const step3 = parseFloat((Math.random() * 1.0 + 0.2).toFixed(1));
            const step4 = parseFloat((Math.random() * 1.5 + 0.5).toFixed(1));
            const step5 = parseFloat((Math.random() * 2.5 + 1.0).toFixed(1));
            const totalDuration = (step1 + step2 + step3 + step4 + step5).toFixed(1);

            this.workflowRunsList.unshift({
              id: `WF-${Math.floor(Math.random() * 9000) + 1000}`,
              incidentId: res.incidentId,
              status: 'Completed',
              startTime: new Date().toISOString(),
              duration: `${totalDuration}s`,
              steps: [
                { name: 'Extract Logs', status: 'Success', icon: '📝', time: `${step1}s` },
                { name: 'Query Vector DB', status: 'Success', icon: '🔍', time: `${step2}s` },
                { name: 'Fetch Jira Issues', status: 'Success', icon: '🎫', time: `${step3}s` },
                { name: 'Fetch GitHub Commits', status: 'Success', icon: '🔗', time: `${step4}s` },
                { name: 'Generate RCA Hypothesis', status: 'Success', icon: '🧠', time: `${step5}s` }
              ]
            });
          }
        },
        error: (err) => {
          console.error(err);
          this.loading = false;
        }
      });
    }, 1500);
  }

  performAction(action: string) {
    if (!this.incident) return;
    this.incidentService.performAction(this.incident.incidentId, action).subscribe({
      next: (res) => {
        this.actionMessage = res;

        if (action === 'APPROVE') {
          // Add to RCA History
          this.rcaHistoryList.unshift({
            ...this.incident,
            approvedAt: new Date().toISOString()
          });

          // Remove from active list
          this.activeIncidentsList = this.activeIncidentsList.filter(i => i.id !== this.incident!.incidentId);

          // Navigate to RCA History after short delay
          setTimeout(() => {
            this.incident = null;
            this.actionMessage = '';
            this.activeTab = 'RCA History';
          }, 1500);
        }
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  saveSettings() {
    this.settingsSaved = true;
    setTimeout(() => {
      this.settingsSaved = false;
    }, 3000);
  }
}
