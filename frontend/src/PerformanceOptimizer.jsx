// ============================================================================
// PerformanceOptimizer.jsx - Complete API Integrated Version
// ============================================================================
import React, { useState, useEffect } from 'react';
import { Activity, Cpu, Network, HardDrive, BarChart3, Play, Download, Settings, AlertCircle, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'http://localhost:8000';

const PerformanceOptimizer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // State for individual views
  const [profileData, setProfileData] = useState(null);
  const [dbData, setDbData] = useState(null);
  const [hardwareHistory, setHardwareHistory] = useState(null);
  const [scalingRecs, setScalingRecs] = useState(null);
  const [networkPerformance, setNetworkPerformance] = useState(null);
  const [regionalPerformance, setRegionalPerformance] = useState(null);
  const [networkOptimizations, setNetworkOptimizations] = useState(null);
  const [containers, setContainers] = useState(null);
  const [loadBalancer, setLoadBalancer] = useState(null);
  const [monitoringMetrics, setMonitoringMetrics] = useState(null);
  const [alerts, setAlerts] = useState(null);
  const [optimizationHistory, setOptimizationHistory] = useState(null);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'software', name: 'Software', icon: Settings },
    { id: 'hardware', name: 'Hardware', icon: Cpu },
    { id: 'network', name: 'Network', icon: Network },
    { id: 'io', name: 'I/O & Infra', icon: HardDrive },
    { id: 'monitoring', name: 'Monitoring', icon: BarChart3 }
  ];

  // Auto-refresh monitoring data every 30 seconds
  useEffect(() => {
    if (activeTab === 'monitoring' && results) {
      const interval = setInterval(() => {
        fetchMonitoringData();
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [activeTab, results]);

  // API Functions
  const runAnalysis = async () => {
    setScanning(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/api/analysis/full`, {
        target_path: ".",
        deep_scan: false
      });

      setResults(response.data);
    } catch (err) {
      setError('Failed to run analysis. Make sure the backend server is running on port 8000.');
      console.error('Analysis error:', err);
    } finally {
      setScanning(false);
    }
  };

  const fetchMonitoringData = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/monitoring/metrics`);
      setMonitoringMetrics(response.data);
    } catch (err) {
      console.error('Monitoring fetch error:', err);
    }
  };

  const exportReport = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/report/export?format=json`);

      const dataStr = JSON.stringify(response.data, null, 2);
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
      await axios.post(`${API_BASE_URL}/api/optimize/auto`);
      alert('Auto-optimization started! This will run in the background.');
    } catch (err) {
      console.error('Auto-optimize error:', err);
      alert('Failed to start auto-optimization');
    }
  };

  const applyOptimization = async (title) => {
    try {
      await axios.post(`${API_BASE_URL}/api/software/optimize`, {
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

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">System Performance Overview</h2>
        <p className="text-blue-100">Real-time analysis and optimization recommendations</p>
        {error && (
          <div className="mt-3 bg-red-500 bg-opacity-20 border border-red-300 rounded p-3">
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Code Efficiency"
          value={results?.software?.codeEfficiency || '--'}
          unit="%"
          status={results?.software?.codeEfficiency > 70 ? 'good' : 'warning'}
        />
        <MetricCard
          title="CPU Utilization"
          value={results?.hardware?.cpuUtilization || '--'}
          unit="%"
          status={results?.hardware?.cpuUtilization < 80 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Network Latency"
          value={results?.network?.latency || '--'}
          unit="ms"
          status={results?.network?.latency < 50 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Disk IOPS"
          value={results?.io?.diskIOPS || '--'}
          unit="%"
          status={results?.io?.diskIOPS > 80 ? 'good' : 'warning'}
        />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={runAnalysis}
            disabled={scanning}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
          >
            {scanning ? <Clock className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
            {scanning ? 'Analyzing...' : 'Run Full Analysis'}
          </button>
          <button
            onClick={exportReport}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
          <button
            onClick={autoOptimize}
            className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition"
          >
            <Settings className="w-5 h-5" />
            Auto-Optimize
          </button>
        </div>
      </div>

      {results?.software?.details?.recommendations && (
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
                onAction={() => applyOptimization(rec.title)}
              />
            ))}
          </div>
        </div>
      )}
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
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            {action} →
          </button>
        </div>
      </div>
    );
  };

  const SoftwareView = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [profile, db] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/software/profile`),
            axios.get(`${API_BASE_URL}/api/software/database`)
          ]);
          setProfileData(profile.data);
          setDbData(db.data);
        } catch (err) {
          console.error('Failed to fetch software data:', err);
        }
      };

      if (activeTab === 'software') {
        fetchData();
      }
    }, [activeTab]);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Software-Level Optimization</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard title="Code Efficiency Score" value={results?.software?.codeEfficiency || '--'} unit="%" status="good" />
          <MetricCard title="DB Query Performance" value={results?.software?.dbOptimization || '--'} unit="%" status="warning" />
          <MetricCard title="Async Processing" value={results?.software?.asyncProcessing || '--'} unit="%" status="good" />
        </div>

        {profileData && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Code Profiling Results</h3>
            <div className="space-y-3">
              {profileData.functions?.map((func, idx) => (
                <ProfileItem key={idx} {...func} />
              ))}
            </div>
          </div>
        )}

        {dbData && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Database Optimization</h3>
            <div className="space-y-2">
              {dbData.optimizations?.map((opt, idx) => (
                <OptimizationOption
                  key={idx}
                  title={opt.title}
                  impact={opt.impact}
                  onApply={() => applyOptimization(opt.title)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ProfileItem = ({ name, time_ms, calls, impact }) => {
    const impactColors = {
      critical: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
        <div className="flex-1">
          <code className="text-sm font-mono text-gray-900">{name}</code>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{time_ms}ms</span>
          <span className="text-sm text-gray-600">{calls} calls</span>
          <span className={`text-xs px-2 py-1 rounded ${impactColors[impact]}`}>
            {impact}
          </span>
        </div>
      </div>
    );
  };

  const OptimizationOption = ({ title, impact, onApply }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
      <span className="text-sm text-gray-900">{title}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600 font-medium">{impact}</span>
        <button
          onClick={onApply}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );

  const HardwareView = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [history, recs] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/hardware/history?hours=24`),
            axios.get(`${API_BASE_URL}/api/hardware/recommendations`)
          ]);
          setHardwareHistory(history.data);
          setScalingRecs(recs.data);
        } catch (err) {
          console.error('Failed to fetch hardware data:', err);
        }
      };

      if (activeTab === 'hardware') {
        fetchData();
      }
    }, [activeTab]);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Hardware Optimization</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="CPU Usage"
            value={results?.hardware?.cpuUtilization || '--'}
            unit="%"
            status={results?.hardware?.cpuUtilization < 80 ? 'good' : 'warning'}
          />
          <MetricCard
            title="Memory Usage"
            value={results?.hardware?.memoryUsage || '--'}
            unit="%"
            status={results?.hardware?.memoryUsage < 80 ? 'good' : 'warning'}
          />
          <MetricCard
            title="Disk Performance"
            value={results?.hardware?.diskPerformance || '--'}
            unit="%"
            status="good"
          />
          <MetricCard
            title="GPU Utilization"
            value="42"
            unit="%"
            status="good"
          />
        </div>

        {hardwareHistory && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Resource Utilization Over Time</h3>
            <div className="h-48 flex items-end justify-between gap-2">
              {hardwareHistory.data_points?.slice(-12).map((point, i) => (
                <div
                  key={i}
                  className="flex-1 bg-blue-500 rounded-t"
                  style={{ height: `${point.cpu_percent}%` }}
                  title={`CPU: ${point.cpu_percent.toFixed(1)}%`}
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
                  <p className="text-lg font-semibold">{hardwareHistory.summary.avg_cpu?.toFixed(1)}%</p>
                </div>
                <div className="p-3 bg-purple-50 rounded">
                  <p className="text-gray-600">Max CPU</p>
                  <p className="text-lg font-semibold">{hardwareHistory.summary.max_cpu?.toFixed(1)}%</p>
                </div>
              </div>
            )}
          </div>
        )}

        {scalingRecs && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Scaling Recommendations</h3>
            <div className="space-y-3">
              {scalingRecs.recommendations?.map((rec, idx) => (
                <ScalingRec key={idx} {...rec} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const ScalingRec = ({ type, current, recommended, improvement, cost, priority, reasoning }) => (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{type}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          priority === 'high' ? 'bg-red-100 text-red-700' :
          priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
          'bg-blue-100 text-blue-700'
        }`}>
          {priority} priority
        </span>
      </div>
      <div className="grid grid-cols-2 gap-4 text-sm mb-2">
        <div>
          <span className="text-gray-600">Current:</span>
          <p className="font-medium">{current}</p>
        </div>
        <div>
          <span className="text-gray-600">Recommended:</span>
          <p className="font-medium">{recommended}</p>
        </div>
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <p>{reasoning}</p>
      </div>
      <div className="flex justify-between items-center text-sm">
        <span className="text-green-600 font-medium">{improvement}</span>
        <span className="text-gray-600">{cost}</span>
      </div>
    </div>
  );

  const NetworkView = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [performance, regions, optimizations] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/network/performance`),
            axios.get(`${API_BASE_URL}/api/network/regions`),
            axios.get(`${API_BASE_URL}/api/network/optimizations`)
          ]);
          setNetworkPerformance(performance.data);
          setRegionalPerformance(regions.data);
          setNetworkOptimizations(optimizations.data);
        } catch (err) {
          console.error('Failed to fetch network data:', err);
        }
      };

      if (activeTab === 'network') {
        fetchData();
      }
    }, [activeTab]);

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">Network Optimization</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Latency"
            value={networkPerformance?.latency_ms || results?.network?.latency || '--'}
            unit="ms"
            status="good"
          />
          <MetricCard
            title="Throughput"
            value={networkPerformance?.throughput_mbps || results?.network?.throughput || '--'}
            unit="Mbps"
            status="good"
          />
          <MetricCard
            title="Packet Loss"
            value={networkPerformance?.packet_loss || results?.network?.packetLoss || '--'}
            unit="%"
            status="good"
          />
          <MetricCard
            title="Bandwidth Usage"
            value={networkPerformance?.bandwidth_usage_percent || '62'}
            unit="%"
            status="good"
          />
        </div>

        {regionalPerformance && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {regionalPerformance.regions?.map((region, idx) => (
                <RegionCard key={idx} {...region} />
              ))}
            </div>
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <p className="text-gray-700">
                Global Average Latency: <span className="font-semibold">{regionalPerformance.global_average_latency?.toFixed(1)} ms</span>
              </p>
            </div>
          </div>
        )}

        {networkOptimizations && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Protocol Optimization</h3>
            <div className="space-y-2">
              {networkOptimizations.map((opt, idx) => (
                <NetworkOptimizationItem
                  key={idx}
                  {...opt}
                  onApply={() => applyOptimization(opt.title)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const RegionCard = ({ region, latency_ms, traffic_percent, status, recommendations }) => {
    const statusColors = {
      optimal: 'border-green-500 bg-green-50',
      warning: 'border-yellow-500 bg-yellow-50',
      critical: 'border-red-500 bg-red-50'
    };

    return (
      <div className={`border-2 ${statusColors[status]} rounded-lg p-4`}>
        <h4 className="font-semibold text-gray-900 mb-2">{region}</h4>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Latency:</span>
            <span className="font-medium">{latency_ms} ms</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Traffic:</span>
            <span className="font-medium">{traffic_percent}%</span>
          </div>
        </div>
        {recommendations && recommendations.length > 0 && (
          <div className="mt-3 pt-3 border-t border-gray-300">
            <p className="text-xs text-gray-600 font-medium mb-1">Recommendations:</p>
            {recommendations.map((rec, idx) => (
              <p key={idx} className="text-xs text-gray-700">• {rec}</p>
            ))}
          </div>
        )}
      </div>
    );
  };

  const NetworkOptimizationItem = ({ title, impact, description, difficulty, estimated_time, onApply }) => (
    <div className="flex items-start justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-medium text-gray-900">{title}</span>
          <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{difficulty}</span>
        </div>
        <p className="text-xs text-gray-600">{description}</p>
        {estimated_time && (
          <p className="text-xs text-gray-500 mt-1">Est. time: {estimated_time}</p>
        )}
      </div>
      <div className="flex items-center gap-2 ml-4">
        <span className="text-sm text-green-600 font-medium whitespace-nowrap">{impact}</span>
        <button
          onClick={onApply}
          className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Apply
        </button>
      </div>
    </div>
  );

  const IOView = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [containersData, lbData] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/infrastructure/containers`),
            axios.get(`${API_BASE_URL}/api/infrastructure/load-balancer`)
          ]);
          setContainers(containersData.data);
          setLoadBalancer(lbData.data);
        } catch (err) {
          console.error('Failed to fetch infrastructure data:', err);
        }
      };

      if (activeTab === 'io') {
        fetchData();
      }
    }, [activeTab]);

    const scaleService = async (serviceName, replicas) => {
      try {
        await axios.post(`${API_BASE_URL}/api/infrastructure/scale`, null, {
          params: { service: serviceName, replicas }
        });
        alert(`Scaling ${serviceName} to ${replicas} replicas`);
        // Refresh data
        const response = await axios.get(`${API_BASE_URL}/api/infrastructure/containers`);
        setContainers(response.data);
      } catch (err) {
        console.error('Scale error:', err);
        alert('Failed to scale service');
      }
    };

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">I/O & Infrastructure Optimization</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <MetricCard
            title="Disk IOPS"
            value={results?.io?.diskIOPS || '--'}
            unit="%"
            status="good"
          />
          <MetricCard
            title="Load Balance"
            value={results?.io?.loadBalance || '--'}
            unit="%"
            status="good"
          />
          <MetricCard
            title="Container Health"
            value={results?.io?.containerHealth || '--'}
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

        {containers && (
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

        {loadBalancer && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Load Balancer Configuration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">Health Check Interval: {loadBalancer.health_check_interval}s</p>
                  <p className="text-sm text-gray-600">All backends healthy - {loadBalancer.total_connections} active connections</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700">Configure</button>
              </div>
              <div className="mt-4">
                <h4 className="text-sm font-semibold mb-2">Backend Servers</h4>
                <div className="space-y-2">
                  {loadBalancer.backends?.map((backend, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-white border rounded text-sm">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${backend.status === 'healthy' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="font-medium">{backend.id}</span>
                      </div>
                      <span className="text-gray-600">{backend.connections} connections</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const ContainerStatus = ({ name, replicas, cpu_percent, memory_percent, status, onScale }) => {
    const statusColors = {
      healthy: 'text-green-600 bg-green-100',
      warning: 'text-yellow-600 bg-yellow-100',
      critical: 'text-red-600 bg-red-100'
    };

    return (
      <div className="flex items-center justify-between p-3 border border-gray-200 rounded">
        <div className="flex items-center gap-3">
          <div className={`w-2 h-2 rounded-full ${status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className="font-medium">{name}</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-gray-600">{replicas?.current || replicas}/{replicas?.desired || replicas}</span>
          <span className="text-gray-600">CPU: {cpu_percent?.toFixed(1) || cpu_percent}%</span>
          <span className="text-gray-600">Mem: {memory_percent?.toFixed(1) || memory_percent}%</span>
          <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
            {status}
          </span>
          <button
            onClick={() => {
              const newReplicas = prompt(`Enter new replica count for ${name}:`, replicas?.current || replicas);
              if (newReplicas) onScale(parseInt(newReplicas));
            }}
            className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
          >
            Scale
          </button>
        </div>
      </div>
    );
  };

  const MonitoringView = () => {
    useEffect(() => {
      const fetchData = async () => {
        try {
          const [metrics, alertsData, history] = await Promise.all([
            axios.get(`${API_BASE_URL}/api/monitoring/metrics`),
            axios.get(`${API_BASE_URL}/api/monitoring/alerts`),
            axios.get(`${API_BASE_URL}/api/monitoring/history?days=7`)
          ]);
          setMonitoringMetrics(metrics.data);
          setAlerts(alertsData.data);
          setOptimizationHistory(history.data);
        } catch (err) {
          console.error('Failed to fetch monitoring data:', err);
        }
      };

      if (activeTab === 'monitoring') {
        fetchData();
      }
    }, [activeTab]);

    const dismissAlert = async (alertId) => {
      try {
        await axios.post(`${API_BASE_URL}/api/monitoring/alert/dismiss`, { alert_id: alertId });
        // Refresh alerts
        const response = await axios.get(`${API_BASE_URL}/api/monitoring/alerts`);
        setAlerts(response.data);
      } catch (err) {
        console.error('Failed to dismiss alert:', err);
      }
    };

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Monitoring & Continuous Improvement</h2>
          <button
            onClick={() => {
              const fetchData = async () => {
                const [metrics, alertsData] = await Promise.all([
                  axios.get(`${API_BASE_URL}/api/monitoring/metrics`),
                  axios.get(`${API_BASE_URL}/api/monitoring/alerts`)
                ]);
                setMonitoringMetrics(metrics.data);
                setAlerts(alertsData.data);
              };
              fetchData();
            }}
            className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

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

        {alerts && alerts.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Active Alerts ({alerts.length})</h3>
            <div className="space-y-2">
              {alerts.map((alert, idx) => (
                <AlertItem key={idx} {...alert} onDismiss={() => dismissAlert(alert.id)} />
              ))}
            </div>
          </div>
        )}

        {optimizationHistory && optimizationHistory.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold mb-4">Optimization History</h3>
            <div className="space-y-3">
              {optimizationHistory.map((item, idx) => (
                <HistoryItem key={idx} {...item} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const AlertItem = ({ severity, title, description, time, onDismiss }) => {
    const severityColors = {
      critical: 'border-l-red-500 bg-red-50',
      warning: 'border-l-yellow-500 bg-yellow-50',
      info: 'border-l-blue-500 bg-blue-50'
    };

    return (
      <div className={`border-l-4 ${severityColors[severity]} p-3 rounded flex justify-between items-center`}>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          {description && <p className="text-sm text-gray-600 mt-0.5">{description}</p>}
          <p className="text-sm text-gray-500 mt-1">{time}</p>
        </div>
        <button
          onClick={onDismiss}
          className="text-sm text-blue-600 hover:text-blue-700 ml-4"
        >
          Dismiss
        </button>
      </div>
    );
  };

  const HistoryItem = ({ date, action, impact, status, applied_by }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div>
          <p className="font-medium text-gray-900">{action}</p>
          <p className="text-sm text-gray-600">{date}</p>
          {applied_by && <p className="text-xs text-gray-500">Applied by: {applied_by}</p>}
        </div>
      </div>
      <span className="text-sm text-green-600 font-medium">{impact}</span>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView />;
      case 'software': return <SoftwareView />;
      case 'hardware': return <HardwareView />;
      case 'network': return <NetworkView />;
      case 'io': return <IOView />;
      case 'monitoring': return <MonitoringView />;
      default: return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Performance Optimization Platform</h1>
              <p className="text-sm text-gray-600">End-to-end optimization for your applications</p>
            </div>
            <button 
              onClick={runAnalysis}
              disabled={scanning}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              <RefreshCw className={`w-4 h-4 ${scanning ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
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

        {renderContent()}
      </div>
    </div>
  );
};

export default PerformanceOptimizer;