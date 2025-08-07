import React from 'react';
import { 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Users,
  MapPin,
  Calendar
} from 'lucide-react';
import { useIssues } from '../contexts/IssueContext';
import StatsCard from '../components/analytics/StatsCard';
import Card from '../components/ui/Card';

const AnalyticsPage: React.FC = () => {
  const { issues } = useIssues();

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  // Category breakdown
  const categoryStats = issues.reduce((acc, issue) => {
    acc[issue.category] = (acc[issue.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // County breakdown
  const countyStats = issues.reduce((acc, issue) => {
    acc[issue.county] = (acc[issue.county] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Severity breakdown
  const severityStats = issues.reduce((acc, issue) => {
    acc[issue.severity] = (acc[issue.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const categoryEmojis = {
    roads: '🛣️',
    water: '💧',
    health: '🏥',
    security: '🛡️',
    corruption: '⚖️',
    education: '🎓',
    environment: '🌱',
    housing: '🏠'
  };

  const severityColors = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-600">
            Track community issues and government response across Kenya
          </p>
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Issues"
            value={totalIssues}
            change="+12% this month"
            icon={MessageSquare}
            color="text-blue-600"
            trend="up"
          />
          <StatsCard
            title="Resolved"
            value={resolvedIssues}
            change="+18% this month"
            icon={CheckCircle}
            color="text-green-600"
            trend="up"
          />
          <StatsCard
            title="Pending"
            value={pendingIssues}
            change="-5% this month"
            icon={Clock}
            color="text-yellow-600"
            trend="down"
          />
          <StatsCard
            title="Resolution Rate"
            value={`${resolutionRate}%`}
            change="+3% this month"
            icon={TrendingUp}
            color="text-purple-600"
            trend="up"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Status Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Status Overview</h3>
            <div className="space-y-4">
              {[
                { status: 'Open', count: openIssues, color: 'bg-red-500', textColor: 'text-red-700' },
                { status: 'Pending', count: pendingIssues, color: 'bg-yellow-500', textColor: 'text-yellow-700' },
                { status: 'Resolved', count: resolvedIssues, color: 'bg-green-500', textColor: 'text-green-700' }
              ].map(item => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 ${item.color} rounded-full`}></div>
                    <span className="text-gray-700 font-medium">{item.status}</span>
                  </div>
                  <div className="text-right">
                    <span className={`font-semibold ${item.textColor}`}>{item.count}</span>
                    <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className={`${item.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${totalIssues > 0 ? (item.count / totalIssues) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Severity Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Severity Distribution</h3>
            <div className="space-y-4">
              {Object.entries(severityStats)
                .sort(([,a], [,b]) => b - a)
                .map(([severity, count]) => (
                  <div key={severity} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 ${severityColors[severity as keyof typeof severityColors]} rounded-full`}></div>
                      <span className="text-gray-700 font-medium capitalize">{severity}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className={`${severityColors[severity as keyof typeof severityColors]} h-2 rounded-full transition-all duration-500`}
                          style={{ width: `${totalIssues > 0 ? (count / totalIssues) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Category Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Issues by Category</h3>
            <div className="space-y-4">
              {Object.entries(categoryStats)
                .sort(([,a], [,b]) => b - a)
                .map(([category, count]) => (
                  <div key={category} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{categoryEmojis[category as keyof typeof categoryEmojis]}</span>
                      <span className="text-gray-700 font-medium capitalize">{category}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${totalIssues > 0 ? (count / totalIssues) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>

          {/* County Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Issues by County</h3>
            <div className="space-y-4">
              {Object.entries(countyStats)
                .sort(([,a], [,b]) => b - a)
                .map(([county, count]) => (
                  <div key={county} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-700 font-medium">{county}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-900">{count}</span>
                      <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${totalIssues > 0 ? (count / totalIssues) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6 mt-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {issues.slice(0, 8).map(issue => (
              <div key={issue.id} className="flex items-start gap-4 p-4 bg-gray-50 rounded-xl">
                <div className={`w-3 h-3 rounded-full mt-2 ${
                  issue.status === 'resolved' ? 'bg-green-500' :
                  issue.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                }`}></div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{issue.title}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                    <span>{issue.ward}, {issue.county}</span>
                    <span>•</span>
                    <span>{new Date(issue.dateSubmitted).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="capitalize">{issue.category}</span>
                  </div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  issue.status === 'resolved' ? 'bg-green-100 text-green-800' :
                  issue.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                  'bg-red-100 text-red-800'
                }`}>
                  {issue.status}
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Impact Summary */}
        <Card className="p-8 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <div className="bg-blue-100 p-4 rounded-full inline-block mb-3">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{totalIssues}</p>
                <p className="text-gray-600">Issues Reported</p>
              </div>
              <div>
                <div className="bg-green-100 p-4 rounded-full inline-block mb-3">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{resolvedIssues}</p>
                <p className="text-gray-600">Issues Resolved</p>
              </div>
              <div>
                <div className="bg-purple-100 p-4 rounded-full inline-block mb-3">
                  <TrendingUp className="h-8 w-8 text-purple-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{resolutionRate}%</p>
                <p className="text-gray-600">Resolution Rate</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;