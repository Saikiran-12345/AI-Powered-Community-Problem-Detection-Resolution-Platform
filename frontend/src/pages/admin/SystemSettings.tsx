import React, { useState } from 'react';
import { Save, AlertTriangle, Database, Bot, ShieldCheck } from 'lucide-react';

export const SystemSettings = () => {
  const [isSaving, setIsSaving] = useState(false);
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    autoAssignOfficers: true,
    strictVerification: false,
    aiThreshold: '5.0',
    dataRetentionDays: '365'
  });

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Global configurations updated successfully.');
    }, 800);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">System Configurations</h1>
        <p className="text-gray-500 text-sm mt-1">Manage core platform rules, AI thresholds, and security parameters.</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Bot className="w-5 h-5 text-primary-600" /> AI & Automation
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Auto-Assign Critical Issues</p>
              <p className="text-sm text-gray-500 mt-1">Automatically route severity level "High" and "Critical" directly to Officers.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.autoAssignOfficers} onChange={e => setSettings({...settings, autoAssignOfficers: e.target.checked})} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>
          <div>
            <label className="font-semibold text-gray-900 block mb-1">AI Minimum Flagging Threshold (1.0 - 10.0)</label>
            <p className="text-sm text-gray-500 mb-3">Any reported issue scoring below this will bypass manual officer review.</p>
            <input type="number" step="0.5" min="1.0" max="10.0" value={settings.aiThreshold} onChange={e => setSettings({...settings, aiThreshold: e.target.value})} className="px-4 py-2 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-primary-500 w-32" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-600" /> Security & Access
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Strict Identity Verification</p>
              <p className="text-sm text-gray-500 mt-1">Require ID upload before Citizens can report issues.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.strictVerification} onChange={e => setSettings({...settings, strictVerification: e.target.checked})} />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-red-50 rounded-2xl border border-red-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-red-200">
          <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" /> Danger Zone
          </h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-red-900">System Maintenance Mode</p>
              <p className="text-sm text-red-700 mt-1">Lock out all Citizens and Officers. Only Admins can log in.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={settings.maintenanceMode} onChange={e => setSettings({...settings, maintenanceMode: e.target.checked})} />
              <div className="w-11 h-6 bg-red-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>
          <div>
            <button className="text-red-600 font-bold text-sm hover:underline">Flush System Cache & Database...</button>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95 flex items-center gap-2"
        >
          {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Configuration</>}
        </button>
      </div>
    </div>
  );
};
