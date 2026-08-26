import React from 'react';
import { ShieldCheck, History, UserCheck, Clock, Zap, Download } from 'lucide-react';
import { useRAG } from '../context/RAGContext';

export const AuditPage: React.FC = () => {
  const { auditLogs } = useRAG();

  const handleExportAudit = () => {
    const jsonStr = JSON.stringify(auditLogs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `finintel_audit_trail_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
            <ShieldCheck className="w-4 h-4" /> Regulatory Governance & Auditing
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Compliance Audit & Query Trail</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable tracking of financial RAG queries, prompt token consumption, latency, and caller roles
          </p>
        </div>

        <button
          onClick={handleExportAudit}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-all"
        >
          <Download className="w-4 h-4 text-indigo-400" />
          Export Audit Logs (JSON)
        </button>
      </div>

      {/* Audit Table */}
      <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Logged Query Invocations ({auditLogs.length})</span>
          <span className="text-[11px] text-slate-400 font-mono">Synchronized with Spring Boot Enterprise Gateway</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                <th className="py-3 px-4">Audit ID</th>
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Caller Role</th>
                <th className="py-3 px-4 font-sans">Query Text</th>
                <th className="py-3 px-4">Latency</th>
                <th className="py-3 px-4">Tokens</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-indigo-400 font-bold">{log.id}</td>
                  <td className="py-3 px-4 text-slate-400">{log.timestamp}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                      {log.user_role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-sans text-slate-200 truncate max-w-xs">{log.query}</td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{log.latency_ms}ms</td>
                  <td className="py-3 px-4 text-slate-300">{log.tokens_used}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
