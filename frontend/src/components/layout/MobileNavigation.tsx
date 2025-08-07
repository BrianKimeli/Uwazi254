import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MessageSquare, Plus, BarChart3, User, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const MobileNavigation: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/issues', label: 'Issues', icon: MessageSquare },
    { path: '/report', label: 'Report', icon: Plus, highlight: true },
    { path: '/analytics', label: 'Stats', icon: BarChart3 },
    { path: '/profile', label: 'Profile', icon: User }
  ];

  // Add admin tab for admin users
  if (user?.role === 'admin') {
    navItems.splice(4, 0, { path: '/admin', label: 'Admin', icon: Shield });
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 safe-area-bottom z-50">
      <div className="flex justify-around items-center">
        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isHighlight = item.highlight;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
                isHighlight 
                  ? 'bg-blue-600 text-white shadow-lg transform scale-110' 
                  : isActive 
                    ? 'text-blue-600 bg-blue-50' 
                    : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon className={`h-5 w-5 ${isHighlight ? 'h-6 w-6' : ''}`} />
              <span className={`text-xs mt-1 font-medium ${isHighlight ? 'text-xs' : ''}`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNavigation;