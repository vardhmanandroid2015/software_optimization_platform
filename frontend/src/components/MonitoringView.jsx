// ============================================================================
// components/MonitoringView.jsx - Monitoring & Continuous Improvement Component
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const MonitoringView = () => {
  const { getAuthFetch } = useAuth();
  const [monitoringMetrics, setMonitoringMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [optimizationHistory, setOptimizationHistory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMonitoringData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchMonitoringData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchMonitoringData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authFetch = getAuthFetch();
      const [metrics, alertsData, history] = await Promise.all([
        authFetch.get('/api/monitoring/metrics'),
        authFetch.get('/api/monitoring/alerts'),
        authFetch.get('/api/monitoring/history?days=7')
      ]);
      setMonitoringMetrics(metrics);
      setAlerts(alertsData);
      setOptimizationHistory(history);
    } catch (err) {
      console.error('Failed to fetch monitoring data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const dismissAlert = async (alertId) => {
    try {
      const authFetch = getAuthFetch();
      await authFetch.post('/api/monitoring/alert/dismiss', { alert_id: alertId });
      // Refresh alerts
      const response = await authFetch.get('/api/monitoring/alerts');
      setAlerts(response);
    } catch (err) {
      console.error('Failed to dismiss alert:', err);
    }
  };

  const AlertItem = ({ id, severity, title, description, time, onDismiss }) => {
    const severityColors = {
      critical: 'border-l-red-500 bg-red-50',
      warning: 'border-l-yellow-500 bg-yellow-50',
      info: 'border-l-blue-500 bg-blue-50'
    };

    return (
      <div className={`border-l-4 ${severityColors[severity] || severityColors.info} p-3 rounded flex justify-between items-center`}>
        <div>
          <p className="font-medium text-gray-900">{String(title)}</p>
          {description && <p className="text-sm text-gray-600 mt-0.5">{String(description)}</p>}
          {time && <p className="text-sm text-gray-500 mt-1">{String(time)}</p>}
        </div>
        <button
          onClick={onDismiss}
          className="text-sm text-blue-600 hover:text-blue-700 ml-4 whitespace-nowrap"
        >
          Dismiss
        </button>
      </div>
    );
  };

  const HistoryItem = ({ date, action, impact, status, applied_by }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div>
          <p className="font-medium text-gray-900">{String(action)}</p>
          <p className="text-sm text-gray-600">{String(date)}</p>
          {applied_by && <p className="text-xs text-gray-500">Applied by: {String(applied_by)}</p>}
        </div>
      </div>
      <span className="text-sm text-green-600 font-medium">{String(impact)}</span>
    </div>
  );

  if (error) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm border border-red-200">
        <div className="text-center">
          <div className="text-red-600 mb-2">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Data</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchMonitoringData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Monitoring & Continuous Improvement</h2>
        <button
          onClick={fetchMonitoringData}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm disabled:bg-gray-400 transition"
        >
          <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Real-Time Metrics */}
      {monitoringMetrics && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Real-Time Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded">
              <div className="text-3xl font-bold text-blue-600">
                {monitoringMetrics.requests_per_minute?.toLocaleString() || '1,234'}
              </div>
              <div className="text-sm text-gray-600 mt-1">Requests/min</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded">
              <div className="text-3xl font-bold text-green-600">
                {monitoringMetrics.uptime_percent || '99.9'}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Uptime</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded">
              <div className="text-3xl font-bold text-purple-600">
                {monitoringMetrics.avg_response_time_ms || '156'}ms
              </div>
              <div className="text-sm text-gray-600 mt-1">Avg Response</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded">
              <div className="text-3xl font-bold text-orange-600">
                {monitoringMetrics.error_rate_percent || '0.02'}%
              </div>
              <div className="text-sm text-gray-600 mt-1">Error Rate</div>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Active Connections</p>
              <p className="text-lg font-semibold">{monitoringMetrics.active_connections || '542'}</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Throughput</p>
              <p className="text-lg font-semibold">{monitoringMetrics.throughput_mbps || '95.2'} Mbps</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600">Cache Hit Rate</p>
              <p className="text-lg font-semibold">{monitoringMetrics.cache_hit_rate || '87.5'}%</p>
            </div>
            <div className="p-3 bg-gray-50 rounded">
              <p className="text-gray-600">DB Queries/sec</p>
              <p className="text-lg font-semibold">{monitoringMetrics.database_queries_per_sec || '312'}</p>
            </div>
          </div>
        </div>
      )}

      {/* Active Alerts */}
      {alerts && Array.isArray(alerts) && alerts.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Active Alerts ({alerts.length})</h3>
          <div className="space-y-2">
            {alerts.map((alert, idx) => (
              <AlertItem
                key={idx}
                {...alert}
                onDismiss={() => dismissAlert(alert.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Optimization History */}
      {optimizationHistory && Array.isArray(optimizationHistory) && optimizationHistory.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Optimization History</h3>
          <div className="space-y-3">
            {optimizationHistory.map((item, idx) => (
              <HistoryItem key={idx} {...item} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!monitoringMetrics && (!alerts || alerts.length === 0) && (!optimizationHistory || optimizationHistory.length === 0) && !loading && (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Monitoring Data</h3>
          <p className="text-gray-600 mb-4">Run a full analysis from the Dashboard to start monitoring</p>
        </div>
      )}
    </div>
  );
};

export default MonitoringView;