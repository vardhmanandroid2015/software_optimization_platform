import React, { useState } from 'react';
import { Activity, Cpu, Network, HardDrive, BarChart3, Play, Download, Settings, AlertCircle, CheckCircle, Clock } from 'lucide-react';

const PerformanceOptimizer = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [scanning, setScanning] = useState(false);
  const [results, setResults] = useState(null);

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: Activity },
    { id: 'software', name: 'Software', icon: Settings },
    { id: 'hardware', name: 'Hardware', icon: Cpu },
    { id: 'network', name: 'Network', icon: Network },
    { id: 'io', name: 'I/O & Infra', icon: HardDrive },
    { id: 'monitoring', name: 'Monitoring', icon: BarChart3 }
  ];

  const runAnalysis = () => {
    setScanning(true);
    setTimeout(() => {
      setResults({
        software: {
          codeEfficiency: 72,
          dbOptimization: 65,
          asyncProcessing: 80,
          issues: 12
        },
        hardware: {
          cpuUtilization: 68,
          memoryUsage: 75,
          diskPerformance: 82,
          recommendations: 5
        },
        network: {
          latency: 45,
          throughput: 88,
          packetLoss: 0.2,
          optimization: 7
        },
        io: {
          diskIOPS: 85,
          loadBalance: 90,
          containerHealth: 95,
          alerts: 3
        }
      });
      setScanning(false);
    }, 2000);
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Code Efficiency" value={results?.software.codeEfficiency || '--'} unit="%" status={results?.software.codeEfficiency > 70 ? 'good' : 'warning'} />
        <MetricCard title="CPU Utilization" value={results?.hardware.cpuUtilization || '--'} unit="%" status={results?.hardware.cpuUtilization < 80 ? 'good' : 'warning'} />
        <MetricCard title="Network Latency" value={results?.network.latency || '--'} unit="ms" status={results?.network.latency < 50 ? 'good' : 'warning'} />
        <MetricCard title="Disk IOPS" value={results?.io.diskIOPS || '--'} unit="%" status={results?.io.diskIOPS > 80 ? 'good' : 'warning'} />
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
          <button className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition">
            <Download className="w-5 h-5" />
            Export Report
          </button>
          <button className="flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition">
            <Settings className="w-5 h-5" />
            Auto-Optimize
          </button>
        </div>
      </div>

      {results && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Optimization Recommendations</h3>
          <div className="space-y-3">
            <RecommendationItem 
              severity="high"
              title="Database Query Optimization"
              description="Found 8 slow queries. Average execution time: 2.3s"
              action="Optimize Queries"
            />
            <RecommendationItem 
              severity="medium"
              title="Memory Usage Alert"
              description="Memory usage at 75%. Consider scaling up or implementing caching"
              action="View Details"
            />
            <RecommendationItem 
              severity="low"
              title="Container Resource Limits"
              description="3 containers without resource limits defined"
              action="Configure Limits"
            />
          </div>
        </div>
      )}
    </div>
  );

  const RecommendationItem = ({ severity, title, description, action }) => {
    const colors = {
      high: 'border-l-red-500 bg-red-50',
      medium: 'border-l-yellow-500 bg-yellow-50',
      low: 'border-l-blue-500 bg-blue-50'
    };

    return (
      <div className={`border-l-4 ${colors[severity]} p-4 rounded`}>
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold text-gray-900">{title}</h4>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
          <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
            {action} →
          </button>
        </div>
      </div>
    );
  };

  const SoftwareView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Software-Level Optimization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard title="Code Efficiency Score" value={results?.software.codeEfficiency || '--'} unit="%" status="good" />
        <MetricCard title="DB Query Performance" value={results?.software.dbOptimization || '--'} unit="%" status="warning" />
        <MetricCard title="Async Processing" value={results?.software.asyncProcessing || '--'} unit="%" status="good" />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Code Profiling Results</h3>
        <div className="space-y-3">
          <ProfileItem func="user_authentication()" time="234ms" calls="1,250" impact="high" />
          <ProfileItem func="database_query_users()" time="1,890ms" calls="856" impact="critical" />
          <ProfileItem func="image_processing()" time="567ms" calls="423" impact="medium" />
          <ProfileItem func="cache_refresh()" time="89ms" calls="2,341" impact="low" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Database Optimization</h3>
        <div className="space-y-2">
          <OptimizationOption title="Add index on users.email" impact="+45% query speed" />
          <OptimizationOption title="Implement query result caching" impact="-60% DB load" />
          <OptimizationOption title="Enable connection pooling" impact="+30% throughput" />
          <OptimizationOption title="Optimize JOIN operations" impact="+25% query speed" />
        </div>
      </div>
    </div>
  );

  const ProfileItem = ({ func, time, calls, impact }) => {
    const impactColors = {
      critical: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
        <div className="flex-1">
          <code className="text-sm font-mono text-gray-900">{func}</code>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{time}</span>
          <span className="text-sm text-gray-600">{calls} calls</span>
          <span className={`text-xs px-2 py-1 rounded ${impactColors[impact]}`}>
            {impact}
          </span>
        </div>
      </div>
    );
  };

  const OptimizationOption = ({ title, impact }) => (
    <div className="flex items-center justify-between p-3 border border-gray-200 rounded hover:bg-gray-50">
      <span className="text-sm text-gray-900">{title}</span>
      <div className="flex items-center gap-2">
        <span className="text-sm text-green-600 font-medium">{impact}</span>
        <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Apply
        </button>
      </div>
    </div>
  );

  const HardwareView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Hardware Optimization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="CPU Usage" value={results?.hardware.cpuUtilization || '--'} unit="%" status="good" />
        <MetricCard title="Memory Usage" value={results?.hardware.memoryUsage || '--'} unit="%" status="warning" />
        <MetricCard title="Disk Performance" value={results?.hardware.diskPerformance || '--'} unit="%" status="good" />
        <MetricCard title="GPU Utilization" value="42" unit="%" status="good" />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Resource Utilization Over Time</h3>
        <div className="h-48 flex items-end justify-between gap-2">
          {[65, 72, 68, 75, 70, 78, 73, 68, 72, 70, 75, 68].map((height, i) => (
            <div key={i} className="flex-1 bg-blue-500 rounded-t" style={{ height: `${height}%` }}></div>
          ))}
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          <span>00:00</span>
          <span>06:00</span>
          <span>12:00</span>
          <span>18:00</span>
          <span>24:00</span>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Scaling Recommendations</h3>
        <div className="space-y-3">
          <ScalingRec 
            type="Vertical"
            current="4 vCPU, 8GB RAM"
            recommended="8 vCPU, 16GB RAM"
            improvement="+85% processing capacity"
            cost="+$120/month"
          />
          <ScalingRec 
            type="Horizontal"
            current="2 instances"
            recommended="4 instances"
            improvement="+100% availability, +50% throughput"
            cost="+$240/month"
          />
        </div>
      </div>
    </div>
  );

  const ScalingRec = ({ type, current, recommended, improvement, cost }) => (
    <div className="p-4 border border-gray-200 rounded-lg">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-semibold text-gray-900">{type} Scaling</h4>
        <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Recommended</span>
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
      <div className="flex justify-between items-center text-sm">
        <span className="text-green-600">{improvement}</span>
        <span className="text-gray-600">{cost}</span>
      </div>
    </div>
  );

  const NetworkView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Network Optimization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Latency" value={results?.network.latency || '--'} unit="ms" status="good" />
        <MetricCard title="Throughput" value={results?.network.throughput || '--'} unit="Mbps" status="good" />
        <MetricCard title="Packet Loss" value={results?.network.packetLoss || '--'} unit="%" status="good" />
        <MetricCard title="Bandwidth Usage" value="62" unit="%" status="good" />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Geographic Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RegionCard region="US East" latency="12ms" traffic="45%" status="optimal" />
          <RegionCard region="EU West" latency="28ms" traffic="30%" status="optimal" />
          <RegionCard region="Asia Pacific" latency="156ms" traffic="20%" status="warning" />
          <RegionCard region="South America" latency="198ms" traffic="5%" status="critical" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Protocol Optimization</h3>
        <div className="space-y-2">
          <OptimizationOption title="Enable HTTP/2" impact="+40% request efficiency" />
          <OptimizationOption title="Implement gRPC for microservices" impact="+60% RPC speed" />
          <OptimizationOption title="Enable compression (Brotli)" impact="-70% payload size" />
          <OptimizationOption title="Use CDN for static assets" impact="-80% latency" />
        </div>
      </div>
    </div>
  );

  const RegionCard = ({ region, latency, traffic, status }) => {
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
            <span className="font-medium">{latency}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Traffic:</span>
            <span className="font-medium">{traffic}</span>
          </div>
        </div>
      </div>
    );
  };

  const IOView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">I/O & Infrastructure Optimization</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard title="Disk IOPS" value={results?.io.diskIOPS || '--'} unit="%" status="good" />
        <MetricCard title="Load Balance" value={results?.io.loadBalance || '--'} unit="%" status="good" />
        <MetricCard title="Container Health" value={results?.io.containerHealth || '--'} unit="%" status="good" />
        <MetricCard title="Queue Depth" value="8" unit="" status="good" />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Container Status</h3>
        <div className="space-y-2">
          <ContainerStatus name="api-service" replicas="3/3" cpu="45%" memory="62%" status="healthy" />
          <ContainerStatus name="worker-queue" replicas="5/5" cpu="72%" memory="58%" status="healthy" />
          <ContainerStatus name="database-primary" replicas="1/1" cpu="68%" memory="81%" status="warning" />
          <ContainerStatus name="cache-redis" replicas="2/2" cpu="32%" memory="45%" status="healthy" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Load Balancer Configuration</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Algorithm: Round Robin</p>
              <p className="text-sm text-gray-600">Evenly distributes requests</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">Change</button>
          </div>
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
            <div>
              <p className="font-medium">Health Check Interval: 10s</p>
              <p className="text-sm text-gray-600">All backends healthy</p>
            </div>
            <button className="text-sm text-blue-600 hover:text-blue-700">Configure</button>
          </div>
        </div>
      </div>
    </div>
  );

  const ContainerStatus = ({ name, replicas, cpu, memory, status }) => {
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
          <span className="text-gray-600">{replicas}</span>
          <span className="text-gray-600">CPU: {cpu}</span>
          <span className="text-gray-600">Mem: {memory}</span>
          <span className={`px-2 py-1 rounded text-xs ${statusColors[status]}`}>
            {status}
          </span>
        </div>
      </div>
    );
  };

  const MonitoringView = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Monitoring & Continuous Improvement</h2>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Real-Time Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded">
            <div className="text-3xl font-bold text-blue-600">1,234</div>
            <div className="text-sm text-gray-600 mt-1">Requests/min</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded">
            <div className="text-3xl font-bold text-green-600">99.9%</div>
            <div className="text-sm text-gray-600 mt-1">Uptime</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded">
            <div className="text-3xl font-bold text-purple-600">156ms</div>
            <div className="text-sm text-gray-600 mt-1">Avg Response</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded">
            <div className="text-3xl font-bold text-orange-600">0.02%</div>
            <div className="text-sm text-gray-600 mt-1">Error Rate</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Active Alerts</h3>
        <div className="space-y-2">
          <AlertItem severity="warning" title="High Memory Usage" time="2 min ago" />
          <AlertItem severity="info" title="Scheduled Maintenance Window" time="15 min ago" />
          <AlertItem severity="warning" title="Slow Query Detected" time="1 hour ago" />
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Optimization History</h3>
        <div className="space-y-3">
          <HistoryItem 
            date="2024-11-20"
            action="Enabled query caching"
            impact="-45% DB load"
            status="success"
          />
          <HistoryItem 
            date="2024-11-19"
            action="Scaled to 4 instances"
            impact="+100% capacity"
            status="success"
          />
          <HistoryItem 
            date="2024-11-18"
            action="Optimized image processing"
            impact="-60% processing time"
            status="success"
          />
        </div>
      </div>
    </div>
  );

  const AlertItem = ({ severity, title, time }) => {
    const severityColors = {
      critical: 'border-l-red-500 bg-red-50',
      warning: 'border-l-yellow-500 bg-yellow-50',
      info: 'border-l-blue-500 bg-blue-50'
    };

    return (
      <div className={`border-l-4 ${severityColors[severity]} p-3 rounded flex justify-between items-center`}>
        <div>
          <p className="font-medium text-gray-900">{title}</p>
          <p className="text-sm text-gray-600">{time}</p>
        </div>
        <button className="text-sm text-blue-600 hover:text-blue-700">View</button>
      </div>
    );
  };

  const HistoryItem = ({ date, action, impact, status }) => (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-5 h-5 text-green-500" />
        <div>
          <p className="font-medium text-gray-900">{action}</p>
          <p className="text-sm text-gray-600">{date}</p>
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
          <h1 className="text-2xl font-bold text-gray-900">Performance Optimization Platform</h1>
          <p className="text-sm text-gray-600">End-to-end optimization for your applications</p>
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