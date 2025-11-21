// ============================================================================
// PerformanceOptimizer.jsx - Clean Parent Component
// ============================================================================
import React, { useState } from 'react';
import { Activity, Cpu, Network, HardDrive, BarChart3, Settings } from 'lucide-react';
import { useAuth } from './AuthContext';

// Import all view components
import DashboardView from './components/DashboardView';
import SoftwareView from './components/SoftwareView';
import HardwareView from './components/HardwareView';
import NetworkView from './components/NetworkView';
import IOView from './components/IOView';
import MonitoringView from './components/MonitoringView';

const PerformanceOptimizer = () => {
  const { getAuthFetch } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'software', name: 'Software', icon: Settings },
    { id: 'hardware', name: 'Hardware', icon: Cpu },
    { id: 'network', name: 'Network', icon: Network },
    { id: 'io', name: 'I/O & Infra', icon: HardDrive },
    { id: 'monitoring', name: 'Monitoring', icon: BarChart3 }
  ];

  // ============================================================================
  // API Functions
  // ============================================================================

  const runAnalysis = async () => {
    setScanning(true);
    setError(null);

    try {
      const authFetch = getAuthFetch();
      const response = await authFetch.post('/api/analysis/full', {
        target_path: ".",
        deep_scan: false
      });
      setResults(response);
    } catch (err) {
      setError('Failed to run analysis. Make sure the backend server is running.');
      console.error('Analysis error:', err);
    } finally {
      setScanning(false);
    }
  };

  const exportReport = async () => {
    try {
      const authFetch = getAuthFetch();
      const response = await authFetch.get('/api/report/export?format=json');

      const dataStr = JSON.stringify(response, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `performance-report-${new Date().toISOString()}.json`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export report');
    }
  };

  const autoOptimize = async () => {
    try {
      const authFetch = getAuthFetch();
      await authFetch.post('/api/optimize/auto');
      alert('Auto-optimization started! This will run in the background.');
    } catch (err) {
      console.error('Auto-optimize error:', err);
      alert('Failed to start auto-optimization');
    }
  };

  const applyOptimization = async (title) => {
    try {
      const authFetch = getAuthFetch();
      await authFetch.post('/api/software/optimize', {
        optimization_type: title,
        target: "system",
        auto_apply: true
      });
      alert(`Applied optimization: ${title}`);
      runAnalysis();
    } catch (err) {
      console.error('Apply optimization error:', err);
      alert('Failed to apply optimization');
    }
  };

  // ============================================================================
  // Render View Based on Active Tab
  // ============================================================================

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            results={results}
            scanning={scanning}
            error={error}
            onRunAnalysis={runAnalysis}
            onExportReport={exportReport}
            onAutoOptimize={autoOptimize}
            onApplyOptimization={applyOptimization}
          />
        );
      case 'software':
        return (
          <SoftwareView
            results={results}
            onApplyOptimization={applyOptimization}
          />
        );
      case 'hardware':
        return <HardwareView results={results} />;
      case 'network':
        return (
          <NetworkView
            results={results}
            onApplyOptimization={applyOptimization}
          />
        );
      case 'io':
        return <IOView results={results} />;
      case 'monitoring':
        return <MonitoringView />;
      default:
        return (
          <DashboardView
            results={results}
            scanning={scanning}
            error={error}
            onRunAnalysis={runAnalysis}
            onExportReport={exportReport}
            onAutoOptimize={autoOptimize}
            onApplyOptimization={applyOptimization}
          />
        );
    }
  };

  // ============================================================================
  // Main Render
  // ============================================================================

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Tab Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.name}
            </button>
          );
        })}
      </div>

      {/* Active View Content */}
      {renderContent()}
    </div>
  );
};

export default PerformanceOptimizer;