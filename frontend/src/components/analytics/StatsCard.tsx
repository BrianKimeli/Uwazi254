import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Card from '../ui/Card';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: LucideIcon;
  color: string;
  trend?: 'up' | 'down' | 'neutral';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  trend = 'neutral'
}) => {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const getIconBgColor = () => {
    if (color.includes('green')) return 'bg-green-100 text-green-600';
    if (color.includes('red')) return 'bg-red-100 text-red-600';
    if (color.includes('yellow')) return 'bg-yellow-100 text-yellow-600';
    if (color.includes('purple')) return 'bg-purple-100 text-purple-600';
    return 'bg-blue-100 text-blue-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-gray-600 text-sm font-medium mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
          {change && (
            <p className={`text-sm font-medium ${getTrendColor()}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl ${getIconBgColor()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </Card>
  );
};

export default StatsCard;