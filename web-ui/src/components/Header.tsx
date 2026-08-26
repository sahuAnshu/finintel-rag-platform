import React from 'react';
import { Sparkles, Shield, Cpu, Terminal, Building2 } from 'lucide-react';
import { useRAG } from '../context/RAGContext';

export const Header: React.FC = () => {
  const { userRole, setUserRole, vectorStats } = useRAG();

  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-6 py-3.5 flex items-center justify-between">
      {/* Brand & Stack */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-sky-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 font-bold text-white text-lg">
          FI
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-white tracking-tight">FinIntel RAG</h1>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-bold">
              GenAI Platform
            </span>
          </div>
          <p className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
            <span>FastAPI + LangChain</span>
            <span className="text-slate-600">•</span>
            <span>FAISS Vector Index</span>
            <span className="text-slate-600">•</span>
            <span>Spring Boot Gateway</span>
          </p>
        </div>
      </div>

      {/* Center Role Selector */}
      <div className="hidden md:flex items-center gap-3 bg-slate-850 p-1.5 rounded-xl border border-slate-800">
        <span className="text-xs font-semibold text-slate-400 pl-2 flex items-center gap-1">
          <Shield className="w-3.5 h-3.5 text-indigo-400" />
          Audited Role:
        </span>
        <select
          value={userRole}
          onChange={(e) => setUserRole(e.target.value)}
          className="bg-slate-900 text-xs font-medium text-slate-200 border border-slate-700 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 cursor-pointer"
        >
          <option value="FINANCIAL_ANALYST">Financial Analyst (Read / Audit)</option>
          <option value="COMPLIANCE_OFFICER">Compliance Officer (Risk Policy)</option>
          <option value="SYSTEM_ADMIN">System Administrator (Full Ingestion)</option>
        </select>
      </div>

      {/* Right Telemetry Badge & Profile */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-850 border border-slate-800 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span className="text-slate-400">FAISS Vectors:</span>
          <span className="text-emerald-400 font-bold">{vectorStats.total_indexed_vectors}</span>
        </div>

        <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
          <div className="w-9 h-9 rounded-full bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300 font-bold text-sm">
            AS
          </div>
          <div className="hidden lg:block text-left">
            <div className="text-xs font-semibold text-slate-200">Anshuman Sahu</div>
            <div className="text-[10px] text-slate-400 flex items-center gap-1">
              <Building2 className="w-3 h-3 text-slate-500" /> Full-Stack & GenAI Engineer
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
