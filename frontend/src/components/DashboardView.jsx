// ============================================================================
// components/DashboardView.jsx - Dashboard Overview Component
// ============================================================================
import React from 'react';
import { Play, Download, Settings, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const DashboardView = ({
  results,
  scanning,
  error,
  onRunAnalysis,
  onExportReport,
  onAutoOptimize,
  onApplyOptimization
}) => {

  const MetricCard = ({ title, value, unit, status }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        {status === 'good' && <CheckCircle className="w-4 h-4 text-green-500" />}
        {status === 'warning' && <AlertCircle className="w-4 h-4 text-yellow-500" />}
        {status === 'critical' && <AlertCircle className="w-4 h-4 text-red-500" />}
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}<span className="text-sm text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );

  const RecommendationItem = ({ severity, title, description, action, onAction }) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-blue-500 bg-blue-50',
      critical: 'border-l-red-600 bg-red-50'
    };

    return (
      <div className={`border-l-4 ${colors[severity] || colors.medium} p-4 rounded`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button
            onClick={onAction}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium whitespace-nowrap"
          >
            {action} →
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">System Performance Overview</h2>
        <p className="text-blue-100">Real-time analysis and optimization recommendations</p>
        {error && (
          <div className="mt-3 bg-red-500 bg-opacity-20 border border-red-300 rounded p-3">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Code Efficiency"
          value={results?.software?.codeEfficiency != null ? String(results.software.codeEfficiency) : '--'}
          unit="%"
          status={results?.software?.codeEfficiency > 70 ? 'good' : 'warning'}
        />
        <MetricCard
          title="CPU Utilization"
          value={results?.hardware?.cpuUtilization != null ? String(results.hardware.cpuUtilization) : '--'}
          unit="%"
          status={results?.hardware?.cpuUtilization < 80 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Network Latency"
          value={results?.network?.latency != null ? String(results.network.latency) : '--'}
          unit="ms"
          status={results?.network?.latency < 50 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Disk IOPS"
          value={results?.io?.diskIOPS != null ? String(results.io.diskIOPS) : '--'}
          unit="%"
          status={results?.io?.diskIOPS > 80 ? 'good' : 'warning'}
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={onRunAnalysis}
            disabled={scanning}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {scanning ? <Clock className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {scanning ? 'Analyzing...' : 'Run Full Analysis'}
          </button>
          <button
            onClick={onExportReport}
            disabled={scanning}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
          <button
            onClick={onAutoOptimize}
            disabled={scanning}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 disabled:bg-gray-400 transition"
          >
            <Settings className="w-5 h-5" />
            Auto-Optimize
          </button>
        </div>
      </div>

      {/* Optimization Recommendations */}
      {results?.software?.details?.recommendations && results.software.details.recommendations.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
          <div className="space-y-3">
            {results.software.details.recommendations.slice(0, 3).map((rec, idx) => (
              <RecommendationItem
                key={idx}
                severity={rec.impact || 'medium'}
                title={rec.title}
                description={rec.description}
                action="Apply"
                onAction={() => onApplyOptimization(rec.title)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State - No Analysis Yet */}
      {!results && !scanning && (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Ready to Analyze</h3>
          <p className="text-gray-600 mb-4">Click "Run Full Analysis" to get started with performance optimization</p>
          <button
            onClick={onRunAnalysis}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Run Analysis Now
          </button>
        </div>
      )}

      {/* System Status Summary */}
      {results && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">System Status Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Software Performance</h4>
              </div>
              <p className="text-sm text-gray-600">
                {results.software?.issues || 0} issues detected
              </p>
              <p className="text-sm text-gray-600">
                Efficiency: {results.software?.codeEfficiency || 0}%
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Hardware Resources</h4>
              </div>
              <p className="text-sm text-gray-600">
                CPU: {results.hardware?.cpuUtilization || 0}%
              </p>
              <p className="text-sm text-gray-600">
                Memory: {results.hardware?.memoryUsage || 0}%
              </p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Network Status</h4>
              </div>
              <p className="text-sm text-gray-600">
                Latency: {results.network?.latency || 0}ms
              </p>
              <p className="text-sm text-gray-600">
                Throughput: {results.network?.throughput || 0} Mbps
              </p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <h4 className="font-semibold text-gray-900">Infrastructure</h4>
              </div>
              <p className="text-sm text-gray-600">
                Container Health: {results.io?.containerHealth || 0}%
              </p>
              <p className="text-sm text-gray-600">
                Load Balance: {results.io?.loadBalance || 0}%
              </p>
            </div>
          </div>
          {results.timestamp && (
            <p className="text-xs text-gray-500 mt-4 text-center">
              Last analyzed: {new Date(results.timestamp).toLocaleString()}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardView;