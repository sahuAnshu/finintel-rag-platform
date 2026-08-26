import React, { useState } from 'react';
import { UploadCloud, FileText, CheckCircle2, Layers, Sliders, Database, ArrowRight } from 'lucide-react';
import { useRAG } from '../context/RAGContext';

export const IngestPage: React.FC = () => {
  const { documents, ingestDocument } = useRAG();
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('FINANCIAL_REPORT');
  const [content, setContent] = useState('');
  const [chunkSize, setChunkSize] = useState(800);
  const [chunkOverlap, setChunkOverlap] = useState(150);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) return;

    setIsSubmitting(true);
    const success = await ingestDocument(title, category, content);
    setIsSubmitting(false);

    if (success) {
      setSuccessBanner(`Successfully chunked and indexed "${title}" into FAISS Vector Store!`);
      setTitle('');
      setContent('');
      setTimeout(() => setSuccessBanner(null), 4000);
    }
  };

  const handleLoadSample = () => {
    setTitle('Q4 2025 Projected Flight Settlement & Hedging Strategy');
    setCategory('FINANCIAL_REPORT');
    setContent(`# SkyReserve Financial — Q4 2025 Settlement Forecast\n\n## Foreign Exchange & Jet Fuel Hedging\nSkyReserve has hedged 70% of foreign currency exposure at ₹84.20/USD, protecting net gross transaction margins across European and Gulf corridors.\n\n## Projected Settlement Volume\nExpected Q4 volume is modeled at ₹48,500,000 with a target operating ratio of 26.2%.`);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
            <UploadCloud className="w-4 h-4" /> Document Ingestion & Chunking Studio
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Vector Index Ingestion Pipeline</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Parses financial reports, recursively generates chunks with semantic overlap, and indexes vector embeddings
          </p>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          className="px-3.5 py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono transition-all"
        >
          + Load Financial Sample
        </button>
      </div>

      {successBanner && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {successBanner}
        </div>
      )}

      {/* Ingestion Form */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 space-y-4">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-400" /> Ingestion & Chunking Parameters
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                required
                placeholder="e.g. 2025 Annual 10-K Filing or Credit Policy"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Document Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-slate-200 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                <option value="FINANCIAL_REPORT">Quarterly / Annual Financial Report</option>
                <option value="POLICY">Enterprise Risk & Compliance Policy</option>
                <option value="10K_FILING">SEC Form 10-K / 10-Q Filing</option>
                <option value="AUDIT_MEMO">Internal Audit Memo</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 font-mono">
            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Recursive Chunk Size:</span>
                <span className="text-indigo-400 font-bold">{chunkSize} chars</span>
              </div>
              <input
                type="range"
                min="300"
                max="2000"
                step="50"
                value={chunkSize}
                onChange={(e) => setChunkSize(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between text-slate-400 mb-1">
                <span>Chunk Overlap:</span>
                <span className="text-indigo-400 font-bold">{chunkOverlap} chars</span>
              </div>
              <input
                type="range"
                min="50"
                max="400"
                step="25"
                value={chunkOverlap}
                onChange={(e) => setChunkOverlap(Number(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 mb-1">Document Raw Text / Markdown Content</label>
            <textarea
              required
              rows={6}
              placeholder="Paste financial statements, balance sheet summaries, or compliance guidelines here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3.5 text-slate-200 font-mono text-xs focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting || !title || !content}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
            >
              <Database className="w-4 h-4" />
              {isSubmitting ? 'Chunking & Indexing...' : 'Index Into Vector Store'}
            </button>
          </div>
        </form>
      </div>

      {/* Ingested Documents List */}
      <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200">Active Document Registry ({documents.length})</span>
          <span className="text-[11px] text-slate-400 font-mono">Managed via LangChain Document Loaders</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] bg-slate-900/50">
                <th className="py-3 px-4">Doc ID</th>
                <th className="py-3 px-4 font-sans">Document Title</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Chunk Count</th>
                <th className="py-3 px-4">Characters</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {documents.map((doc) => (
                <tr key={doc.document_id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 text-slate-400">{doc.document_id}</td>
                  <td className="py-3 px-4 font-sans font-medium text-slate-200">{doc.title}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-slate-700">
                      {doc.category}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-emerald-400 font-bold">{doc.chunk_count} Chunks</td>
                  <td className="py-3 px-4 text-slate-400">{doc.character_count.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                      INDEXED
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
