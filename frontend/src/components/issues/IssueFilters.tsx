import React from 'react';
import { Search, Filter } from 'lucide-react';

interface IssueFiltersProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  categoryFilter: string;
  onCategoryFilterChange: (category: string) => void;
  severityFilter: string;
  onSeverityFilterChange: (severity: string) => void;
  countyFilter: string;
  onCountyFilterChange: (county: string) => void;
  issueStats: {
    total: number;
    open: number;
    pending: number;
    resolved: number;
    closed: number;
  };
}

const IssueFilters: React.FC<IssueFiltersProps> = ({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  categoryFilter,
  onCategoryFilterChange,
  severityFilter,
  onSeverityFilterChange,
  countyFilter,
  onCountyFilterChange,
  issueStats
}) => {
  const statusOptions = [
    { value: 'all', label: 'All', count: issueStats.total },
    { value: 'open', label: 'Open', count: issueStats.open },
    { value: 'pending', label: 'Pending', count: issueStats.pending },
    { value: 'resolved', label: 'Resolved', count: issueStats.resolved },
    { value: 'closed', label: 'Closed', count: issueStats.closed }
  ];

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    { value: 'roads', label: '🛣️ Roads' },
    { value: 'water', label: '💧 Water' },
    { value: 'health', label: '🏥 Health' },
    { value: 'security', label: '🛡️ Security' },
    { value: 'corruption', label: '⚖️ Corruption' },
    { value: 'education', label: '🎓 Education' },
    { value: 'environment', label: '🌱 Environment' },
    { value: 'housing', label: '🏠 Housing' }
  ];

  const severityOptions = [
    { value: 'all', label: 'All Severities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const countyOptions = [
    { value: 'all', label: 'All Counties' },
    { value: 'Kiambu', label: 'Kiambu' },
    { value: 'Nairobi', label: 'Nairobi' },
    { value: 'Nakuru', label: 'Nakuru' },
    { value: 'Mombasa', label: 'Mombasa' },
    { value: 'Kisumu', label: 'Kisumu' }
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search issues..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Status Filter Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {statusOptions.map(option => (
          <button
            key={option.value}
            onClick={() => onStatusFilterChange(option.value)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              statusFilter === option.value
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {option.label} ({option.count})
          </button>
        ))}
      </div>

      {/* Advanced Filters */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilterChange(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={severityFilter}
          onChange={(e) => onSeverityFilterChange(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {severityOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={countyFilter}
          onChange={(e) => onCountyFilterChange(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          {countyOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default IssueFilters;