export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'citizen' | 'admin' | 'moderator';
  county?: string;
  constituency?: string;
  ward?: string;
  avatar?: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: 'roads' | 'water' | 'health' | 'security' | 'corruption' | 'education' | 'environment' | 'housing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  county: string;
  constituency: string;
  ward: string;
  location?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  dateSubmitted: string;
  lastUpdated: string;
  submittedBy: string;
  anonymous: boolean;
  upvotes: number;
  downvotes: number;
  images?: string[];
  adminResponse?: AdminResponse;
  internalNotes?: InternalNote[];
  tags?: string[];
  priority?: number;
}

export interface AdminResponse {
  id: string;
  message: string;
  respondedBy: string;
  respondedAt: string;
  isPublic: boolean;
}

export interface InternalNote {
  id: string;
  note: string;
  addedBy: string;
  addedAt: string;
}

export interface County {
  id: string;
  name: string;
  constituencies: Constituency[];
}

export interface Constituency {
  id: string;
  name: string;
  wards: Ward[];
}

export interface Ward {
  id: string;
  name: string;
}

export interface Analytics {
  totalIssues: number;
  resolvedIssues: number;
  pendingIssues: number;
  openIssues: number;
  resolutionRate: number;
  averageResolutionTime: number;
  categoryBreakdown: Record<string, number>;
  severityBreakdown: Record<string, number>;
  countyBreakdown: Record<string, number>;
  monthlyTrends: Array<{
    month: string;
    issues: number;
    resolved: number;
  }>;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  issueUpdates: boolean;
  weeklyDigest: boolean;
}