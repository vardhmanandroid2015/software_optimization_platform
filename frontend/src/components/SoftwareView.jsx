// ============================================================================
// components/SoftwareView.jsx - Software-Level Optimization Component
// ============================================================================
import React, { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';

const SoftwareView = ({ results, onApplyOptimization }) => {
  const { getAuthFetch } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [dbData, setDbData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSoftwareData();
  }, []);

  const fetchSoftwareData = async () => {
    setLoading(true);
    setError(null);
    try {
      const authFetch = getAuthFetch();
      const [profile, db] = await Promise.all([
        authFetch.get('/api/software/profile'),
        authFetch.get('/api/software/database')
      ]);
      setProfileData(profile);
      setDbData(db);
    } catch (err) {
      console.error('Failed to fetch software data:', err);
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

  const ProfileItem = ({ name, time_ms, calls, impact }) => {
    const impactColors = {
      critical: 'text-red-600 bg-red-100',
      high: 'text-orange-600 bg-orange-100',
      medium: 'text-yellow-600 bg-yellow-100',
      low: 'text-green-600 bg-green-100'
    };

    return (
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded hover:bg-gray-100 transition">
        <div className="flex-1">
          <code className="text-sm font-mono text-gray-900">{String(name)}</code>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{String(time_ms)}ms</span>
          <span className="text-sm text-gray-600">{String(calls)} calls</span>
          <span className={`text-xs px-2 py-1 rounded font-medium ${impactColors[impact] || impactColors.low}`}>
            {String(impact)}
          </span>
        </div>
      </div>
    );
  };

  const OptimizationOption = ({ title, impact, description, onApply }) => (
    <div className="flex items-start justify-between p-3 border border-gray-200 rounded hover:bg-gray-50 transition">
      <div className="flex-1">
        <span className="text-sm font-medium text-gray-900">{String(title)}</span>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{String(description)}</p>
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
          <p className="text-gray-600">Loading software data...</p>
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
            onClick={fetchSoftwareData}
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
        <h2 className="text-2xl font-bold text-gray-900">Software-Level Optimization</h2>
        <button
          onClick={fetchSoftwareData}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm flex items-center gap-2 disabled:bg-gray-400"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MetricCard
          title="Code Efficiency Score"
          value={results?.software?.codeEfficiency != null ? String(results.software.codeEfficiency) : '--'}
          unit="%"
          status={results?.software?.codeEfficiency > 70 ? 'good' : 'warning'}
        />
        <MetricCard
          title="DB Query Performance"
          value={results?.software?.dbOptimization != null ? String(results.software.dbOptimization) : '--'}
          unit="%"
          status={results?.software?.dbOptimization > 70 ? 'good' : 'warning'}
        />
        <MetricCard
          title="Async Processing"
          value={results?.software?.asyncProcessing != null ? String(results.software.asyncProcessing) : '--'}
          unit="%"
          status={results?.software?.asyncProcessing > 70 ? 'good' : 'warning'}
        />
      </div>

      {/* Code Profiling Results */}
      {profileData?.functions && profileData.functions.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Code Profiling Results</h3>
          <div className="space-y-3">
            {profileData.functions.map((func, idx) => (
              <ProfileItem key={idx} {...func} />
            ))}
          </div>

          {profileData.bottlenecks && profileData.bottlenecks.length > 0 && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
              <h4 className="text-sm font-semibold text-yellow-800 mb-2">Bottlenecks Detected</h4>
              <ul className="space-y-1">
                {profileData.bottlenecks.map((bottleneck, idx) => (
                  <li key={idx} className="text-sm text-yellow-700">
                    • {typeof bottleneck === 'string' ? bottleneck : JSON.stringify(bottleneck)}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Database Optimization */}
      {dbData && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Database Optimization</h3>

          {/* Slow Queries */}
          {dbData.slowQueries && dbData.slowQueries.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Slow Queries</h4>
              <div className="space-y-2">
                {dbData.slowQueries.map((query, idx) => (
                  <div key={idx} className="p-3 bg-red-50 border border-red-200 rounded">
                    <code className="text-xs text-red-800 break-all">
                      {typeof query === 'string' ? query : (query?.query ? String(query.query) : 'N/A')}
                    </code>
                    {query?.time && (
                      <p className="text-xs text-red-600 mt-1">Execution time: {String(query.time)}ms</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Index Suggestions */}
          {dbData.indexSuggestions && dbData.indexSuggestions.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Index Suggestions</h4>
              <div className="space-y-2">
                {dbData.indexSuggestions.map((suggestion, idx) => (
                  <div key={idx} className="p-3 bg-blue-50 border border-blue-200 rounded">
                    <p className="text-sm text-blue-800">
                      {typeof suggestion === 'string'
                        ? suggestion
                        : `Add index on ${suggestion?.table || 'table'}.${suggestion?.column || 'column'}`
                      }
                    </p>
                    {suggestion?.improvement && (
                      <p className="text-xs text-blue-600 mt-1">
                        Expected improvement: {String(suggestion.improvement)}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Optimizations */}
          {dbData.optimizations && dbData.optimizations.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-2">Available Optimizations</h4>
              <div className="space-y-2">
                {dbData.optimizations.map((opt, idx) => (
                  <OptimizationOption
                    key={idx}
                    title={opt?.title || 'Optimization'}
                    impact={opt?.impact || 'Unknown'}
                    description={opt?.description}
                    onApply={() => onApplyOptimization(opt?.title || 'optimization')}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Recommendations */}
      {profileData?.recommendations && profileData.recommendations.length > 0 && (
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
          <div className="space-y-2">
            {profileData.recommendations.map((rec, idx) => {
              // Handle if rec is an object
              let displayText = '';
              if (typeof rec === 'string') {
                displayText = rec;
              } else if (typeof rec === 'object' && rec !== null) {
                // If it's an object, try to extract meaningful info
                displayText = rec.recommendation || rec.message || rec.text || JSON.stringify(rec);
              } else {
                displayText = String(rec);
              }

              return (
                <div key={idx} className="p-3 border-l-4 border-blue-500 bg-blue-50 rounded">
                  <p className="text-sm text-gray-800">{displayText}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {(!profileData?.functions || profileData.functions.length === 0) &&
       (!dbData?.optimizations || dbData.optimizations.length === 0) && (
        <div className="bg-white rounded-lg p-12 text-center border border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-4">Run a full analysis from the Dashboard to see software optimization data</p>
        </div>
      )}
    </div>
  );
};

export default SoftwareView;