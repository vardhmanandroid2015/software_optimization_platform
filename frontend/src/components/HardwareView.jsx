// ============================================================================
// components/HardwareView.jsx - Hardware Optimization Component
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const HardwareView = ({ results }) => {
  const { getAuthFetch } = useAuth();
  const [hardwareHistory, setHardwareHistory] = useState(null);
  const [scalingRecs, setScalingRecs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHardwareData();
  }, []);

  const fetchHardwareData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authFetch = getAuthFetch();
      const [history, recs] = await Promise.all([
        authFetch.get('/api/hardware/history?hours=24'),
        authFetch.get('/api/hardware/recommendations')
      ]);
      setHardwareHistory(history);
      setScalingRecs(recs);
    } catch (err) {
      console.error('Failed to fetch hardware data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, unit, status }) => (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start mb-2">
        <h4 className="text-sm font-medium text-gray-600">{title}</h4>
        <div className={`w-2 h-2 rounded-full ${
          status === 'good' ? 'bg-green-500' :
          status === 'warning' ? 'bg-yellow-500' :
          'bg-red-500'
        }`}></div>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {value}<span className="text-sm text-gray-500 ml-1">{unit}</span>
      </div>
    </div>
  );

  const ScalingRec = ({ type, current, recommended, improvement, cost, priority, reasoning }) => (
    <div className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{String(type)}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          priority === 'high' ? 'bg-red-100 text-red-700' :
          priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {String(priority)} priority
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
        <div>
          <span className="text-gray-600">Current:</span>
          <p className="font-medium">{String(current)}</p>
        </div>
        <div>
          <span className="text-gray-600">Recommended:</span>
          <p className="font-medium">{String(recommended)}</p>
        </div>
      </div>
      {reasoning && (
        <div className="text-sm text-gray-600 mb-2">
          <p>{String(reasoning)}</p>
        </div>
      )}
      <div className="flex justify-between items-center text-sm">
        <span className="text-green-600 font-medium">{String(improvement)}</span>
        <span className="text-gray-600">{String(cost)}</span>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading hardware data...</p>
        </div>
      </div>
    );
  }

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
            onClick={fetchHardwareData}
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
        <h2 className="text-2xl font-bold text-gray-900">Hardware Optimization</h2>
        <button
          onClick={fetchHardwareData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2 disabled:bg-gray-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="CPU Usage"
          value={results?.hardware?.cpuUtilization != null ? String(results.hardware.cpuUtilization) : '--'}
          unit="%"
          status={results?.hardware?.cpuUtilization < 80 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Memory Usage"
          value={results?.hardware?.memoryUsage != null ? String(results.hardware.memoryUsage) : '--'}
          unit="%"
          status={results?.hardware?.memoryUsage < 80 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Disk Performance"
          value={results?.hardware?.diskPerformance != null ? String(results.hardware.diskPerformance) : '--'}
          unit="%"
          status="good"
        />
        <MetricCard
          title="Temperature"
          value="42"
          unit="°C"
          status="good"
        />
      </div>

      {/* Resource Utilization Chart */}
      {hardwareHistory?.data_points && hardwareHistory.data_points.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Resource Utilization Over Time</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {hardwareHistory.data_points.slice(-12).map((point, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-500 rounded-t hover:bg-blue-600 transition cursor-pointer"
                style={{ height: `${point?.cpu_percent || 0}%` }}
                title={`CPU: ${point?.cpu_percent?.toFixed(1) || 0}%`}
              ></div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>-24h</span>
            <span>-18h</span>
            <span>-12h</span>
            <span>-6h</span>
            <span>Now</span>
          </div>
          {hardwareHistory.summary && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-blue-50 rounded">
                <p className="text-gray-600">Avg CPU</p>
                <p className="text-lg font-semibold">
                  {hardwareHistory.summary.avg_cpu?.toFixed(1) || '0.0'}%
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded">
                <p className="text-gray-600">Max CPU</p>
                <p className="text-lg font-semibold">
                  {hardwareHistory.summary.max_cpu?.toFixed(1) || '0.0'}%
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Scaling Recommendations */}
      {scalingRecs?.recommendations && scalingRecs.recommendations.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Scaling Recommendations</h3>
          <div className="space-y-3">
            {scalingRecs.recommendations.map((rec, idx) => (
              <ScalingRec key={idx} {...rec} />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!hardwareHistory?.data_points || hardwareHistory.data_points.length === 0) &&
       (!scalingRecs?.recommendations || scalingRecs.recommendations.length === 0) && (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-4">Run a full analysis from the Dashboard to see hardware data</p>
        </div>
      )}
    </div>
  );
};

export default HardwareView;