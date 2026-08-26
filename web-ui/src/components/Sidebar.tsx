import React from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquareText, UploadCloud, DatabaseZap, ShieldCheck, Cpu } from 'lucide-react';
import { useRAG } from '../context/RAGContext';

export const Sidebar: React.FC = () => {
  const { vectorStats } = useRAG();

  const navItems = [
    { to: '/', label: 'Financial RAG Assistant', icon: MessageSquareText },
    { to: '/ingest', label: 'Document Ingestion Studio', icon: UploadCloud },
    { to: '/vector-telemetry', label: 'Vector Store Telemetry', icon: DatabaseZap },
    { to: '/audit-trail', label: 'Compliance Audit Trail', icon: ShieldCheck },
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0">
      <div className="space-y-6">
        <div>
          <div className="px-3 mb-2 text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">
            Platform Capabilities
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white font-semibold shadow-md shadow-indigo-600/20'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Engine Pipeline Card */}
        <div className="p-3.5 bg-slate-850 rounded-2xl border border-slate-800 space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-400" /> RAG Pipeline
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">ONLINE</span>
          </div>
          <div className="space-y-1 text-[11px] text-slate-400 font-mono">
            <div>• Dim: {vectorStats.embedding_dimension} L2</div>
            <div>• Top-K MMR: 4 Chunks</div>
            <div>• Gateway: Spring Boot 3.x</div>
          </div>
        </div>
      </div>

      <div className="text-[11px] text-slate-500 text-center font-mono">
        FinIntel v1.0.0 • Python 3.12 / TS
      </div>
    </aside>
  );
};
