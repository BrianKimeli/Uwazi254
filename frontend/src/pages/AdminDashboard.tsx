import React, { useState } from 'react';
import { 
  Shield, 
  MessageSquare, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Filter,
  Search,
  Send,
  Eye,
  Edit3
} from 'lucide-react';
import { useIssues } from '../contexts/IssueContext';
import { useAuth } from '../contexts/AuthContext';
import IssueCard from '../components/issues/IssueCard';
import StatsCard from '../components/analytics/StatsCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { issues, updateIssueStatus, addAdminResponse } = useIssues();
  
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter issues for admin view
  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    
    // Admin can see all issues, but prioritize their county
    return matchesSearch && matchesStatus;
  });

  const totalIssues = issues.length;
  const openIssues = issues.filter(i => i.status === 'open').length;
  const pendingIssues = issues.filter(i => i.status === 'pending').length;
  const resolvedIssues = issues.filter(i => i.status === 'resolved').length;

  const handleStatusChange = (issueId: string, newStatus: string) => {
    updateIssueStatus(issueId, newStatus as any);
  };

  const handleAddResponse = (issueId: string) => {
    if (responseText.trim()) {
      addAdminResponse(issueId, {
        message: responseText,
        respondedBy: user?.id || '2',
        isPublic: true
      });
      setResponseText('');
      setSelectedIssue(null);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'All Issues', count: totalIssues },
    { value: 'open', label: 'Open', count: openIssues },
    { value: 'pending', label: 'Pending', count: pendingIssues },
    { value: 'resolved', label: 'Resolved', count: resolvedIssues }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-3 rounded-xl">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Manage and respond to citizen reports</p>
            </div>
          </div>
          
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-red-800 text-sm">
              <strong>Admin Access:</strong> You have administrative privileges to manage issues, 
              update statuses, and provide official responses to citizens.
            </p>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Issues"
            value={totalIssues}
            icon={MessageSquare}
            color="text-blue-600"
          />
          <StatsCard
            title="Open Issues"
            value={openIssues}
            icon={AlertTriangle}
            color="text-red-600"
          />
          <StatsCard
            title="Pending"
            value={pendingIssues}
            icon={Clock}
            color="text-yellow-600"
          />
          <StatsCard
            title="Resolved"
            value={resolvedIssues}
            icon={CheckCircle}
            color="text-green-600"
          />
        </div>

        {/* Filters and Search */}
        <Card className="p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex gap-2 overflow-x-auto">
              {statusOptions.map(option => (
                <button
                  key={option.value}
                  onClick={() => setStatusFilter(option.value)}
                  className={`flex-shrink-0 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    statusFilter === option.value
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {option.label} ({option.count})
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Issues List */}
        <div className="space-y-6">
          {filteredIssues.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all'
                  ? 'Try adjusting your search or filter criteria.'
                  : 'No issues have been reported yet.'
                }
              </p>
            </Card>
          ) : (
            filteredIssues.map(issue => (
              <Card key={issue.id} className="p-6">
                <IssueCard 
                  issue={issue}
                  showActions={true}
                  onStatusChange={handleStatusChange}
                  compact={false}
                />
                
                {/* Admin Actions */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1">
                      {selectedIssue === issue.id ? (
                        <div className="space-y-4">
                          <Input
                            label="Official Response"
                            value={responseText}
                            onChange={setResponseText}
                            placeholder="Provide an official response to this issue..."
                            multiline
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              onClick={() => handleAddResponse(issue.id)}
                              disabled={!responseText.trim()}
                            >
                              <Send className="h-4 w-4" />
                              Send Response
                            </Button>
                            <Button
                              variant="secondary"
                              onClick={() => {
                                setSelectedIssue(null);
                                setResponseText('');
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => setSelectedIssue(issue.id)}
                          >
                            <Edit3 className="h-4 w-4" />
                            Add Response
                          </Button>
                          <select
                            value={issue.status}
                            onChange={(e) => handleStatusChange(issue.id, e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="open">Open</option>
                            <option value="pending">Pending</option>
                            <option value="resolved">Resolved</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      )}
                    </div>
                    
                    <div className="lg:w-64">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-medium text-gray-900 mb-2">Issue Details</h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p><strong>ID:</strong> #{issue.id}</p>
                          <p><strong>Submitted:</strong> {new Date(issue.dateSubmitted).toLocaleDateString()}</p>
                          <p><strong>Upvotes:</strong> {issue.upvotes}</p>
                          <p><strong>Anonymous:</strong> {issue.anonymous ? 'Yes' : 'No'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Quick Actions */}
        <Card className="p-6 mt-8 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">Bulk Status Update</h4>
              <p className="text-sm text-gray-600 mb-3">Update multiple issues at once</p>
              <Button variant="secondary" size="sm">
                Bulk Update
              </Button>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">Export Reports</h4>
              <p className="text-sm text-gray-600 mb-3">Download issue reports for analysis</p>
              <Button variant="secondary" size="sm">
                Export Data
              </Button>
            </div>
            <div className="bg-white p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-2">Send Notifications</h4>
              <p className="text-sm text-gray-600 mb-3">Notify citizens about updates</p>
              <Button variant="secondary" size="sm">
                Send Updates
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;