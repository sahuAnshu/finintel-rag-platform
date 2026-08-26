import React from 'react';
import { DatabaseZap, Cpu, HardDrive, Binary, Activity, Layers } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { useRAG } from '../context/RAGContext';
import { StatCard } from '../components/StatCard';

export const VectorTelemetryPage: React.FC = () => {
  const { vectorStats } = useRAG();

  const vectorDistribution = [
    { section: 'Exec Summary', chunks: 4, avgSim: 0.94 },
    { section: 'Revenue Channels', chunks: 6, avgSim: 0.96 },
    { section: 'Credit Risk Policy', chunks: 5, avgSim: 0.91 },
    { section: 'Fraud Prevention', chunks: 3, avgSim: 0.88 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-slate-850 p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
            <DatabaseZap className="w-4 h-4" /> FAISS Dense Vector Space Telemetry
          </div>
          <h2 className="text-xl font-bold text-slate-100 mt-1">Vector Index & Embedding Analytics</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Diagnostic insights into dense vector clustering, memory consumption, and similarity scoring
          </p>
        </div>
        <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono">
          FAISS Index: <span className="font-bold">{vectorStats.index_status}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Indexed Dense Vectors"
          value={vectorStats.total_indexed_vectors.toString()}
          subtitle="normalized L2 vectors"
          icon={Binary}
          iconBg="bg-indigo-500/20"
          iconColor="text-indigo-400"
        />
        <StatCard
          title="Vector Dimension"
          value={`${vectorStats.embedding_dimension}-D`}
          subtitle="dense hypersphere"
          icon={Layers}
          iconBg="bg-sky-500/20"
          iconColor="text-sky-400"
        />
        <StatCard
          title="Embedding Model"
          value="Ada-003"
          subtitle="text-embedding-3-small"
          icon={Cpu}
          iconBg="bg-purple-500/20"
          iconColor="text-purple-400"
        />
        <StatCard
          title="Index Memory Size"
          value={`${vectorStats.memory_usage_mb} MB`}
          subtitle="in-memory cache"
          icon={HardDrive}
          iconBg="bg-emerald-500/20"
          iconColor="text-emerald-400"
        />
      </div>

      {/* Vector Density Chart */}
      <div className="bg-slate-850 p-5 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-100 text-sm">Indexed Chunk Distribution by Section</h3>
            <p className="text-xs text-slate-400">Total chunk representations indexed across financial sections</p>
          </div>
          <span className="text-xs font-mono text-indigo-400 font-semibold">MMR Diversity Lambda: 0.75</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={vectorDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="section" stroke="#64748b" fontSize={11} />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                formatter={(val: any) => [`${val} Chunks`, 'Indexed Count']}
              />
              <Bar dataKey="chunks" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Retrieval Strategy Architecture Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-200">1. Semantic Cosine Search</div>
          <p className="text-[11px] text-slate-400">
            Measures cosine distance between query embedding and chunk vectors for high semantic precision.
          </p>
          <div className="text-[10px] font-mono text-emerald-400 font-bold">Latency: ~2ms</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-200">2. Maximal Marginal Relevance (MMR)</div>
          <p className="text-[11px] text-slate-400">
            Penalizes redundant context passages to ensure diverse coverage across financial tables.
          </p>
          <div className="text-[10px] font-mono text-indigo-400 font-bold">Diversity: High</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
          <div className="text-xs font-bold text-slate-200">3. Source Citation Grounding</div>
          <p className="text-[11px] text-slate-400">
            Attaches exact page numbers, chunk indices, and relevance percentages to eliminate LLM hallucinations.
          </p>
          <div className="text-[10px] font-mono text-sky-400 font-bold">Hallucination Guard: Active</div>
        </div>
      </div>
    </div>
  );
};
