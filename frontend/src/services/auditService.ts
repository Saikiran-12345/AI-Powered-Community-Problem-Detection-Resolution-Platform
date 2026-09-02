export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  action: string;
  entityId: string;
  details: string;
}

const AUDIT_KEY = 'civicai_audit';

export const auditService = {
  log: (userId: string, action: string, entityId: string, details: string) => {
    const logs: AuditLog[] = JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
    logs.push({
      id: `AUD-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId,
      action,
      entityId,
      details
    });
    localStorage.setItem(AUDIT_KEY, JSON.stringify(logs));
  },
  getAll: (): AuditLog[] => {
    return JSON.parse(localStorage.getItem(AUDIT_KEY) || '[]');
  }
};
