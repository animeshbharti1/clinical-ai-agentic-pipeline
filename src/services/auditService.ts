import type { AuditEntry } from '../types/clinical';

/**
 * Service for logging immutable audit compliance entries and downloading JSON reports.
 */
export function createAuditEntry(
  stage: string,
  actor: 'Ingestion Agent' | 'Analysis Agent' | 'Draft Agent' | 'Urgent Alert System' | 'Doctor (Human)' | 'EHR Connector' | 'SMS Gateway' | 'Scheduler',
  action: string,
  details: string,
  colorCategory: 'gray' | 'teal' | 'coral' | 'red' | 'pink' | 'amber' | 'green'
): AuditEntry {
  return {
    id: `audit-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: new Date().toISOString(),
    stage,
    actor,
    action,
    details,
    colorCategory
  };
}

export function exportAuditLogAsJson(auditLogs: AuditEntry[]): void {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `clinical_audit_log_${new Date().toISOString().slice(0,10)}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
