import { complaintService } from './complaintService';

export const analyticsService = {
  getCategoryStats: () => {
    const complaints = complaintService.getAll();
    const map = new Map<string, number>();
    complaints.forEach(c => {
      map.set(c.category, (map.get(c.category) || 0) + 1);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  },

  getTrendData: () => {
    // Generate simulated 30-day trend data based on current complaints
    const complaints = complaintService.getAll();
    const data = [];
    for (let i = 29; i >= 0; i--) {
       const date = new Date();
       date.setDate(date.getDate() - i);
       const dateStr = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
       
       // Simulate daily counts + actual data
       const actualToday = complaints.filter(c => new Date(c.dateReported).toDateString() === date.toDateString()).length;
       data.push({
          date: dateStr,
          reported: Math.floor(Math.random() * 10) + actualToday,
          resolved: Math.floor(Math.random() * 8)
       });
    }
    return data;
  },

  getSeverityBreakdown: () => {
    const complaints = complaintService.getAll();
    const breakdown = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0, UNCLASSIFIED: 0 };
    complaints.forEach(c => {
       if (c.aiAnalysis?.severity) {
         breakdown[c.aiAnalysis.severity as keyof typeof breakdown]++;
       } else {
         breakdown.UNCLASSIFIED++;
       }
    });
    return [
       { name: 'Critical', value: breakdown.CRITICAL, fill: '#ef4444' },
       { name: 'High', value: breakdown.HIGH, fill: '#f97316' },
       { name: 'Medium', value: breakdown.MEDIUM, fill: '#eab308' },
       { name: 'Low', value: breakdown.LOW, fill: '#3b82f6' },
       { name: 'Pending AI', value: breakdown.UNCLASSIFIED, fill: '#9ca3af' }
    ];
  }
};
