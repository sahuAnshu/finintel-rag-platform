import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { RAGProvider } from './context/RAGContext';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { SourceCitationModal } from './components/SourceCitationModal';
import { ChatPage } from './pages/ChatPage';
import { IngestPage } from './pages/IngestPage';
import { VectorTelemetryPage } from './pages/VectorTelemetryPage';
import { AuditPage } from './pages/AuditPage';

export const AppContent: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-slate-900 text-slate-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl">
          <Routes>
            <Route path="/" element={<ChatPage />} />
            <Route path="/ingest" element={<IngestPage />} />
            <Route path="/vector-telemetry" element={<VectorTelemetryPage />} />
            <Route path="/audit-trail" element={<AuditPage />} />
          </Routes>
        </main>
      </div>
      <SourceCitationModal />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <RAGProvider>
      <Router>
        <AppContent />
      </Router>
    </RAGProvider>
  );
};

export default App;
