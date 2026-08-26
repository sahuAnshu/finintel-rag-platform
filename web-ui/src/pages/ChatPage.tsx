import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, Clock, FileText, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { useRAG } from '../context/RAGContext';

export const ChatPage: React.FC = () => {
  const { messages, sendQuery, isLoading, setSelectedCitation } = useRAG();
  const [inputText, setInputText] = useState('');

  const samplePrompts = [
    "What was the total financial settlement volume and operating margin in Q3?",
    "What are the dual-authorization threshold rules for refunds exceeding ₹50,000?",
    "What percentage breakdown of settlements occurred across UPI vs Credit Cards?",
    "How much potential loss was prevented by the automated fraud engine?"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    sendQuery(inputText);
    setInputText('');
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5.5rem)] max-w-5xl mx-auto space-y-4">
      {/* Top Banner */}
      <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="font-bold text-slate-100 text-sm flex items-center gap-2">
            <Bot className="w-4 h-4 text-indigo-400" />
            Financial Intelligence & RAG Q&A Assistant
          </h2>
          <p className="text-xs text-slate-400">
            Answers are grounded in audited 10-K filings, earnings reports, and risk policies via FAISS vector retrieval
          </p>
        </div>
        <span className="text-[10px] font-mono px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-bold">
          Top-K MMR Active
        </span>
      </div>

      {/* Messages Thread */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10 font-medium'
                  : 'bg-slate-850 text-slate-200 border border-slate-800 shadow-sm space-y-3'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {/* Citations & Telemetry Bar for Assistant Responses */}
              {msg.sender === 'assistant' && msg.citations && msg.citations.length > 0 && (
                <div className="pt-3 border-t border-slate-800/80 space-y-2">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" /> Verified Context Citations:
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {msg.citations.map((cit, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedCitation(cit)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-indigo-300 transition-all font-mono text-[10px]"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                        <span className="truncate max-w-[200px]">{cit.document_title}</span>
                        <span className="text-emerald-400 font-bold">{(cit.similarity_score * 100).toFixed(0)}%</span>
                        <ArrowUpRight className="w-3 h-3 text-slate-500" />
                      </button>
                    ))}
                  </div>

                  {/* Telemetry Metrics */}
                  <div className="flex items-center gap-4 text-[10px] text-slate-500 font-mono pt-1">
                    <span>Latency: {msg.latency_ms}ms</span>
                    <span>Tokens: {msg.tokens_used}</span>
                    <span>Confidence: {((msg.confidence_score || 0.95) * 100).toFixed(1)}%</span>
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3.5 items-center">
            <div className="w-8 h-8 rounded-xl bg-indigo-600/40 flex items-center justify-center text-white shrink-0">
              <Bot className="w-4 h-4 animate-spin" />
            </div>
            <div className="bg-slate-850 border border-slate-800 rounded-2xl px-4 py-3 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
              Retrieving high-dimension FAISS vectors & synthesizing response...
            </div>
          </div>
        )}
      </div>

      {/* Sample Query Prompt Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {samplePrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => sendQuery(p)}
            className="px-3 py-1.5 rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 hover:border-slate-700 text-[11px] whitespace-nowrap transition-all"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask a financial question regarding balance sheets, margins, or compliance policies..."
          className="w-full bg-slate-850 border border-slate-700 rounded-2xl pl-4 pr-24 py-3.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 shadow-xl"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="absolute right-2 top-2 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20"
        >
          <Send className="w-3.5 h-3.5" /> Ask RAG
        </button>
      </form>
    </div>
  );
};
