// ============================================================================
// components/NetworkView.jsx - Network Optimization Component
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const NetworkView = ({ results, onApplyOptimization }) => {
  const { getAuthFetch } = useAuth();
  const [networkPerformance, setNetworkPerformance] = useState(null);
  const [regionalPerformance, setRegionalPerformance] = useState(null);
  const [networkOptimizations, setNetworkOptimizations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authFetch = getAuthFetch();
      const [performance, regions, optimizations] = await Promise.all([
        authFetch.get('/api/network/performance'),
        authFetch.get('/api/network/regions'),
        authFetch.get('/api/network/optimizations')
      ]);
      setNetworkPerformance(performance);
      setRegionalPerformance(regions);
      setNetworkOptimizations(optimizations);
    } catch (err) {
      console.error('Failed to fetch network data:', err);
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

  const RegionCard = ({ region, latency_ms, traffic_percent, status, recommendations }) => {
    const statusColors = {
      optimal: 'border-green-500 bg-green-50',
      warning: 'border-yellow-500 bg-yellow-50',
      critical: 'border-red-500 bg-red-50'
    };

    return (
      <div className={`border-2 ${statusColors[status] || statusColors.optimal} rounded-lg p-4`}>
        <h4 className="font-semibold text-gray-900 mb-2">{String(region)}</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Latency:</span>
            <span className="font-medium">{String(latency_ms)} ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Traffic:</span>
            <span className="font-medium">{String(traffic_percent)}%</span>
          </div>
        </div>
        {recommendations && recommendations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="text-xs text-gray-600 font-medium mb-1">Recommendations:</p>
            {recommendations.map((rec, idx) => (
              <p key={idx} className="text-xs text-gray-700">• {String(rec)}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const NetworkOptimizationItem = ({ title, impact, description, difficulty, estimated_time, onApply }) => (
    <div className="flex items-start justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">{String(title)}</span>
          {difficulty && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
              {String(difficulty)}
            </span>
          )}
        </div>
        {description && <p className="text-xs text-gray-600">{String(description)}</p>}
        {estimated_time && (
          <p className="text-xs text-gray-500 mt-1">Est. time: {String(estimated_time)}</p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-sm text-green-600 font-medium whitespace-nowrap">{String(impact)}</span>
        <button
          onClick={onApply}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition whitespace-nowrap"
        >
          Apply
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading network data...</p>
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
            onClick={fetchNetworkData}
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
        <h2 className="text-2xl font-bold text-gray-900">Network Optimization</h2>
        <button
          onClick={fetchNetworkData}
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
          title="Latency"
          value={networkPerformance?.latency_ms != null ? String(networkPerformance.latency_ms) : (results?.network?.latency != null ? String(results.network.latency) : '--')}
          unit="ms"
          status="good"
        />
        <MetricCard
          title="Throughput"
          value={networkPerformance?.throughput_mbps != null ? String(networkPerformance.throughput_mbps) : (results?.network?.throughput != null ? String(results.network.throughput) : '--')}
          unit="Mbps"
          status="good"
        />
        <MetricCard
          title="Packet Loss"
          value={networkPerformance?.packet_loss != null ? String(networkPerformance.packet_loss) : (results?.network?.packetLoss != null ? String(results.network.packetLoss) : '--')}
          unit="%"
          status="good"
        />
        <MetricCard
          title="Bandwidth Usage"
          value={networkPerformance?.bandwidth_usage_percent != null ? String(networkPerformance.bandwidth_usage_percent) : '62'}
          unit="%"
          status="good"
        />
      </div>

      {/* Geographic Distribution */}
      {regionalPerformance?.regions && regionalPerformance.regions.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {regionalPerformance.regions.map((region, idx) => (
              <RegionCard key={idx} {...region} />
            ))}
          </div>
          {regionalPerformance.global_average_latency && (
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <p className="text-gray-700">
                Global Average Latency:{' '}
                <span className="font-semibold">
                  {regionalPerformance.global_average_latency.toFixed(1)} ms
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Protocol Optimization */}
      {networkOptimizations && networkOptimizations.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Protocol Optimization</h3>
          <div className="space-y-2">
            {networkOptimizations.map((opt, idx) => (
              <NetworkOptimizationItem
                key={idx}
                {...opt}
                onApply={() => onApplyOptimization(opt?.title || 'network optimization')}
              />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!regionalPerformance?.regions || regionalPerformance.regions.length === 0) &&
       (!networkOptimizations || networkOptimizations.length === 0) && (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-4">Run a full analysis from the Dashboard to see network data</p>
        </div>
      )}
    </div>
  );
};

export default NetworkView;