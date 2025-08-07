import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Bell, 
  Shield, 
  Settings,
  LogOut,
  Edit3,
  Save,
  X,
  CheckCircle,
  MessageSquare,
  TrendingUp
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIssues } from '../contexts/IssueContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { issues } = useIssues();
  
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    county: user?.county || '',
    constituency: user?.constituency || '',
    ward: user?.ward || ''
  });

  const userIssues = issues.filter(issue => issue.submittedBy === user?.id);
  const resolvedUserIssues = userIssues.filter(issue => issue.status === 'resolved');

  const handleSave = () => {
    // In a real app, this would update the user profile
    console.log('Saving user profile:', editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      county: user?.county || '',
      constituency: user?.constituency || '',
      ward: user?.ward || ''
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
          <p className="text-gray-600">Manage your account and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Personal Information</h2>
                {!isEditing ? (
                  <Button
                    variant="secondary"
                    onClick={() => setIsEditing(true)}
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      onClick={handleSave}
                      size="sm"
                    >
                      <Save className="h-4 w-4" />
                      Save
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={handleCancel}
                      size="sm"
                    >
                      <X className="h-4 w-4" />
                      Cancel
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-6">
                {isEditing ? (
                  <>
                    <Input
                      label="Full Name"
                      value={editedUser.name}
                      onChange={(value) => setEditedUser({...editedUser, name: value})}
                    />
                    <Input
                      label="Email Address"
                      type="email"
                      value={editedUser.email}
                      onChange={(value) => setEditedUser({...editedUser, email: value})}
                    />
                    <Input
                      label="Phone Number"
                      value={editedUser.phone}
                      onChange={(value) => setEditedUser({...editedUser, phone: value})}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Input
                        label="County"
                        value={editedUser.county}
                        onChange={(value) => setEditedUser({...editedUser, county: value})}
                      />
                      <Input
                        label="Constituency"
                        value={editedUser.constituency}
                        onChange={(value) => setEditedUser({...editedUser, constituency: value})}
                      />
                      <Input
                        label="Ward"
                        value={editedUser.ward}
                        onChange={(value) => setEditedUser({...editedUser, ward: value})}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">Full Name</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">{user.email}</p>
                        <p className="text-sm text-gray-500">Email Address</p>
                      </div>
                    </div>
                    {user.phone && (
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{user.phone}</p>
                          <p className="text-sm text-gray-500">Phone Number</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {user.ward}, {user.constituency}, {user.county}
                        </p>
                        <p className="text-sm text-gray-500">Location</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Shield className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="font-medium text-gray-900 capitalize">{user.role}</p>
                        <p className="text-sm text-gray-500">Account Type</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Settings */}
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Settings</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">Email Notifications</p>
                      <p className="text-sm text-gray-500">Receive updates about your issues</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-900">SMS Notifications</p>
                      <p className="text-sm text-gray-500">Get SMS updates for urgent issues</p>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <Card className="p-6 text-center">
              <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                <User className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{user.name}</h3>
              <p className="text-gray-600 text-sm mb-4 capitalize">{user.role}</p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-blue-600">{userIssues.length}</p>
                  <p className="text-sm text-gray-600">Issues Reported</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{resolvedUserIssues.length}</p>
                  <p className="text-sm text-gray-600">Issues Resolved</p>
                </div>
              </div>
            </Card>

            {/* Quick Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center gap-3 p-3 text-left bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-xl transition-colors">
                  <MessageSquare className="h-5 w-5" />
                  <span className="font-medium">View My Issues</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors">
                  <TrendingUp className="h-5 w-5" />
                  <span className="font-medium">My Activity</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 text-left bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl transition-colors">
                  <Settings className="h-5 w-5" />
                  <span className="font-medium">Account Settings</span>
                </button>
              </div>
            </Card>

            {/* Account Actions */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account</h3>
              <div className="space-y-3">
                <Button
                  variant="danger"
                  fullWidth
                  onClick={logout}
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </Button>
              </div>
            </Card>

            {/* Achievement Badge */}
            <Card className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200">
              <div className="text-center">
                <div className="bg-green-100 p-3 rounded-full inline-block mb-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <h4 className="font-semibold text-green-900 mb-2">Community Champion</h4>
                <p className="text-sm text-green-700">
                  Thank you for being an active citizen and helping improve your community!
                </p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;