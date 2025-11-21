// ============================================================================
// components/IOView.jsx - I/O & Infrastructure Optimization Component
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const IOView = ({ results }) => {
  const { getAuthFetch } = useAuth();
  const [containers, setContainers] = useState(null);
  const [loadBalancer, setLoadBalancer] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchIOData();
  }, []);

  const fetchIOData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authFetch = getAuthFetch();
      const [containersData, lbData] = await Promise.all([
        authFetch.get('/api/infrastructure/containers'),
        authFetch.get('/api/infrastructure/load-balancer')
      ]);
      setContainers(containersData);
      setLoadBalancer(lbData);
    } catch (err) {
      console.error('Failed to fetch infrastructure data:', err);
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const scaleService = async (serviceName, replicas) => {
    try {
      const authFetch = getAuthFetch();
      await authFetch.post(`/api/infrastructure/scale`, null, {
        params: { service: serviceName, replicas }
      });
      alert(`Scaling ${serviceName} to ${replicas} replicas`);
      // Refresh data
      fetchIOData();
    } catch (err) {
      console.error('Scale error:', err);
      alert('Failed to scale service');
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

  const ContainerStatus = ({ name, replicas, cpu_percent, memory_percent, status, onScale }) => {
    const statusColors = {
      healthy: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      critical: 'text-red-600 bg-red-100'
    };

    const currentReplicas = replicas?.current || replicas;
    const desiredReplicas = replicas?.desired || replicas;

    return (
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="font-medium">{String(name)}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">{String(currentReplicas)}/{String(desiredReplicas)}</span>
          <span className="text-gray-600">
            CPU: {cpu_percent != null ? cpu_percent.toFixed(1) : String(cpu_percent)}%
          </span>
          <span className="text-gray-600">
            Mem: {memory_percent != null ? memory_percent.toFixed(1) : String(memory_percent)}%
          </span>
          <span className={`px-2 py-1 rounded text-xs ${statusColors[status] || statusColors.healthy}`}>
            {String(status)}
          </span>
          <button
            onClick={() => {
              const newReplicas = prompt(`Enter new replica count for ${name}:`, currentReplicas);
              if (newReplicas) onScale(parseInt(newReplicas));
            }}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
          >
            Scale
          </button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-600">Loading infrastructure data...</p>
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
            onClick={fetchIOData}
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
        <h2 className="text-2xl font-bold text-gray-900">I/O & Infrastructure Optimization</h2>
        <button
          onClick={fetchIOData}
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
          title="Disk IOPS"
          value={results?.io?.diskIOPS != null ? String(results.io.diskIOPS) : '--'}
          unit="%"
          status="good"
        />
        <MetricCard
          title="Load Balance"
          value={results?.io?.loadBalance != null ? String(results.io.loadBalance) : '--'}
          unit="%"
          status="good"
        />
        <MetricCard
          title="Container Health"
          value={results?.io?.containerHealth != null ? String(results.io.containerHealth) : '--'}
          unit="%"
          status="good"
        />
        <MetricCard
          title="Queue Depth"
          value="8"
          unit=""
          status="good"
        />
      </div>

      {/* Container Status */}
      {containers && Array.isArray(containers) && containers.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Container Status</h3>
          <div className="space-y-2">
            {containers.map((container, idx) => (
              <ContainerStatus
                key={idx}
                {...container}
                onScale={(replicas) => scaleService(container.name, replicas)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Load Balancer Configuration */}
      {loadBalancer && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Load Balancer Configuration</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div>
                <p className="font-medium">
                  Health Check Interval: {String(loadBalancer.health_check_interval)}s
                </p>
                <p className="text-sm text-gray-600">
                  All backends healthy - {String(loadBalancer.total_connections)} active connections
                </p>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Configure
              </button>
            </div>
            {loadBalancer.backends && loadBalancer.backends.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Backend Servers</h4>
                <div className="space-y-2">
                  {loadBalancer.backends.map((backend, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white border rounded text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${backend.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium">{String(backend.id)}</span>
                      </div>
                      <span className="text-gray-600">{String(backend.connections)} connections</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!containers || containers.length === 0) && !loadBalancer && (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-4">Run a full analysis from the Dashboard to see infrastructure data</p>
        </div>
      )}
    </div>
  );
};

export default IOView;