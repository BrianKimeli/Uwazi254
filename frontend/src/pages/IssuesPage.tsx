import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { useIssues } from '../contexts/IssueContext';
import IssueCard from '../components/issues/IssueCard';
import IssueFilters from '../components/issues/IssueFilters';
import Card from '../components/ui/Card';

const IssuesPage: React.FC = () => {
  const { issues, upvoteIssue, downvoteIssue } = useIssues();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [countyFilter, setCountyFilter] = useState('all');

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         issue.ward.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    const matchesCounty = countyFilter === 'all' || issue.county === countyFilter;
    
    return matchesSearch && matchesStatus && matchesCategory && matchesSeverity && matchesCounty;
  });

  const issueStats = {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    pending: issues.filter(i => i.status === 'pending').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    closed: issues.filter(i => i.status === 'closed').length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Community Issues</h1>
          <p className="text-gray-600">
            Browse and track issues reported by citizens across Kenya
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <IssueFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryFilterChange={setCategoryFilter}
            severityFilter={severityFilter}
            onSeverityFilterChange={setSeverityFilter}
            countyFilter={countyFilter}
            onCountyFilterChange={setCountyFilter}
            issueStats={issueStats}
          />
        </div>

        {/* Results */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">
            Showing {filteredIssues.length} of {issues.length} issues
          </p>
        </div>

        {/* Issues List */}
        <div className="space-y-6">
          {filteredIssues.length === 0 ? (
            <Card className="p-12 text-center">
              <MessageSquare className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No issues found</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                {searchTerm || statusFilter !== 'all' || categoryFilter !== 'all' || severityFilter !== 'all' || countyFilter !== 'all'
                  ? 'Try adjusting your search criteria or filters to find more issues.'
                  : 'No issues have been reported yet. Be the first to report a community concern.'
                }
              </p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredIssues.map(issue => (
                <IssueCard 
                  key={issue.id} 
                  issue={issue} 
                  onUpvote={upvoteIssue}
                  onDownvote={downvoteIssue}
                />
              ))}
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredIssues.length > 0 && filteredIssues.length < issues.length && (
          <div className="text-center mt-8">
            <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors">
              Load More Issues
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssuesPage;