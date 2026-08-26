import React from 'react';
import { X, FileText, CheckCircle, Percent, Hash, BookOpen } from 'lucide-react';
import { useRAG } from '../context/RAGContext';

export const SourceCitationModal: React.FC = () => {
  const { selectedCitation, setSelectedCitation } = useRAG();

  if (!selectedCitation) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-slate-850 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Audited Source Citation Inspector</h3>
              <p className="text-xs text-slate-400">Exact grounding context retrieved from FAISS vector store</p>
            </div>
          </div>
          <button
            onClick={() => setSelectedCitation(null)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          <div className="grid grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <BookOpen className="w-3.5 h-3.5 text-indigo-400" /> Document Title:
              </span>
              <div className="font-bold text-slate-200 truncate">{selectedCitation.document_title}</div>
            </div>

            <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 space-y-1">
              <span className="text-slate-400 flex items-center gap-1">
                <Percent className="w-3.5 h-3.5 text-emerald-400" /> Relevance Score:
              </span>
              <div className="font-bold text-emerald-400">{(selectedCitation.similarity_score * 100).toFixed(1)}% Match</div>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-850 border border-slate-800 text-xs font-mono flex items-center justify-between">
            <span className="text-slate-400 flex items-center gap-1">
              <Hash className="w-3.5 h-3.5 text-sky-400" /> Section Header:
            </span>
            <span className="font-bold text-slate-200">{selectedCitation.section_heading || 'Financial Excerpt'}</span>
          </div>

          <div>
            <div className="text-xs font-semibold text-slate-300 mb-2">Raw Context Passage (Grounding Truth):</div>
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300 leading-relaxed whitespace-pre-wrap">
              {selectedCitation.excerpt}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-850 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-semibold font-mono">
            <CheckCircle className="w-4 h-4" /> Cryptographically Audited Context
          </span>
          <button
            onClick={() => setSelectedCitation(null)}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
