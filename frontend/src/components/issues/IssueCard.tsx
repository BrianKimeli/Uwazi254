import React from 'react';
import { MapPin, ThumbsUp, ThumbsDown, Calendar, User, AlertTriangle } from 'lucide-react';
import { Issue } from '../../types';
import Card from '../ui/Card';
import Button from '../ui/Button';

interface IssueCardProps {
  issue: Issue;
  onClick?: () => void;
  showActions?: boolean;
  onUpvote?: (id: string) => void;
  onDownvote?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
  compact?: boolean;
}

const IssueCard: React.FC<IssueCardProps> = ({
  issue,
  onClick,
  showActions = false,
  onUpvote,
  onDownvote,
  onStatusChange,
  compact = false
}) => {
  const statusColors = {
    open: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    resolved: 'bg-green-100 text-green-800',
    closed: 'bg-gray-100 text-gray-800'
  };

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
    low: 'text-green-600',
    medium: 'text-yellow-600',
    high: 'text-orange-600',
    critical: 'text-red-600'
  };

  const handleVote = (e: React.MouseEvent, type: 'up' | 'down') => {
    e.stopPropagation();
    if (type === 'up' && onUpvote) {
      onUpvote(issue.id);
    } else if (type === 'down' && onDownvote) {
      onDownvote(issue.id);
    }
  };

  return (
    <Card 
      className={`p-5 ${compact ? 'p-4' : ''}`}
      onClick={onClick}
      hover={!!onClick}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3 flex-1">
          <span className="text-2xl">{categoryEmojis[issue.category]}</span>
          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 leading-tight ${compact ? 'text-sm' : 'text-base'}`}>
              {issue.title}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-xs text-gray-500 truncate">
                {issue.ward}, {issue.constituency}
              </span>
              {!issue.anonymous && (
                <>
                  <span className="text-gray-300">•</span>
                  <User className="h-3 w-3 text-gray-400" />
                </>
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 py-1 rounded-lg text-xs font-medium ${statusColors[issue.status]}`}>
            {issue.status}
          </span>
          <div className="flex items-center gap-1">
            <AlertTriangle className={`h-3 w-3 ${severityColors[issue.severity]}`} />
            <span className={`text-xs font-medium ${severityColors[issue.severity]}`}>
              {issue.severity}
            </span>
          </div>
        </div>
      </div>

      {!compact && (
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {issue.description}
        </p>
      )}

      {issue.adminResponse && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-3 mb-4">
          <p className="text-blue-800 text-xs">
            <strong>Official Response:</strong> {issue.adminResponse.message}
          </p>
          <p className="text-blue-600 text-xs mt-1">
            {new Date(issue.adminResponse.respondedAt).toLocaleDateString()}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={(e) => handleVote(e, 'up')}
            className="flex items-center gap-1 text-gray-500 hover:text-green-600 transition-colors"
          >
            <ThumbsUp className="h-4 w-4" />
            <span className="text-xs font-medium">{issue.upvotes}</span>
          </button>
          <button 
            onClick={(e) => handleVote(e, 'down')}
            className="flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
          >
            <ThumbsDown className="h-4 w-4" />
            <span className="text-xs font-medium">{issue.downvotes}</span>
          </button>
          <div className="flex items-center gap-1 text-gray-400">
            <Calendar className="h-3 w-3" />
            <span className="text-xs">
              {new Date(issue.dateSubmitted).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        {showActions && onStatusChange && (
          <select 
            value={issue.status}
            onChange={(e) => {
              e.stopPropagation();
              onStatusChange(issue.id, e.target.value);
            }}
            className="text-xs bg-white border border-gray-200 rounded-lg px-2 py-1"
            onClick={(e) => e.stopPropagation()}
          >
            <option value="open">Open</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        )}
      </div>
    </Card>
  );
};

export default IssueCard;