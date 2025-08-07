import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Plus, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  Eye,
  Star,
  Users,
  MapPin
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIssues } from '../contexts/IssueContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import IssueCard from '../components/issues/IssueCard';
import StatsCard from '../components/analytics/StatsCard';

const HomePage: React.FC = () => {
  const { user } = useAuth();
  const { issues, upvoteIssue, downvoteIssue } = useIssues();

  const totalIssues = issues.length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

  const recentIssues = issues.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to Uwazi254
            </h1>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Your voice matters. Report community issues and track their resolution 
              in real-time. Together, we build better communities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/report">
                <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Plus className="h-5 w-5" />
                  Report an Issue
                </Button>
              </Link>
              <Link to="/issues">
                <Button variant="ghost" size="lg" className="text-white border-white hover:bg-white/10">
                  <Eye className="h-5 w-5" />
                  Browse Issues
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-gray-600">
            Here's what's happening in your community
          </p>
        </div>

        {/* Quick Stats */}
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/report" className="block">
                  <div className="bg-blue-50 hover:bg-blue-100 text-blue-700 p-4 rounded-xl transition-colors flex items-center gap-3">
                    <Plus className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Report New Issue</p>
                      <p className="text-sm text-blue-600">Submit a community concern</p>
                    </div>
                  </div>
                </Link>
                <Link to="/issues" className="block">
                  <div className="bg-gray-50 hover:bg-gray-100 text-gray-700 p-4 rounded-xl transition-colors flex items-center gap-3">
                    <Eye className="h-5 w-5" />
                    <div>
                      <p className="font-medium">Browse Issues</p>
                      <p className="text-sm text-gray-600">See what others are reporting</p>
                    </div>
                  </div>
                </Link>
                <Link to="/analytics" className="block">
                  <div className="bg-green-50 hover:bg-green-100 text-green-700 p-4 rounded-xl transition-colors flex items-center gap-3">
                    <TrendingUp className="h-5 w-5" />
                    <div>
                      <p className="font-medium">View Analytics</p>
                      <p className="text-sm text-green-600">Track community progress</p>
                    </div>
                  </div>
                </Link>
              </div>
            </Card>

            {/* Community Impact */}
            <Card className="p-6 mt-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-green-100 p-2 rounded-xl">
                  <Star className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-green-900">Community Impact</h4>
                  <p className="text-sm text-green-700">Your reports make a difference</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-900">{resolvedIssues}</p>
                  <p className="text-sm text-green-700">Issues Resolved</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-900">{totalIssues}</p>
                  <p className="text-sm text-green-700">Total Reports</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Recent Issues */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Recent Issues</h3>
              <Link 
                to="/issues"
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                View All →
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentIssues.length === 0 ? (
                <Card className="p-8 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No issues yet</h3>
                  <p className="text-gray-600 mb-4">
                    Be the first to report a community issue
                  </p>
                  <Link to="/report">
                    <Button>
                      <Plus className="h-4 w-4" />
                      Report First Issue
                    </Button>
                  </Link>
                </Card>
              ) : (
                recentIssues.map(issue => (
                  <IssueCard 
                    key={issue.id} 
                    issue={issue} 
                    onUpvote={upvoteIssue}
                    onDownvote={downvoteIssue}
                  />
                ))
              )}
            </div>
          </div>
        </div>

        {/* Featured Success Story */}
        <Card className="p-8 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <div className="flex items-start gap-4">
            <div className="bg-blue-100 p-3 rounded-xl">
              <CheckCircle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Success Story: Water Crisis Resolved
              </h3>
              <p className="text-gray-700 mb-4">
                Thanks to citizen reports through Uwazi254, the water shortage in Kahawa West 
                was quickly identified and resolved. The county government responded within 48 hours, 
                fixing the burst pipe and restoring water supply to over 5,000 residents.
              </p>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>Kahawa West, Kiambu</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>5,000+ residents affected</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>Resolved in 48 hours</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;