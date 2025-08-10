import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Issue, AdminResponse } from '../types';

interface IssueContextType {
  issues: Issue[];
  addIssue: (issue: Omit<Issue, 'id' | 'dateSubmitted' | 'lastUpdated' | 'upvotes' | 'downvotes'>) => void;
  updateIssueStatus: (id: string, status: Issue['status'], response?: string) => void;
  upvoteIssue: (id: string) => void;
  downvoteIssue: (id: string) => void;
  addAdminResponse: (issueId: string, response: Omit<AdminResponse, 'id' | 'respondedAt'>) => void;
  loading: boolean;
}

const IssueContext = createContext<IssueContextType | undefined>(undefined);

export const useIssues = () => {
  const context = useContext(IssueContext);
  if (context === undefined) {
    throw new Error('useIssues must be used within an IssueProvider');
  }
  return context;
};

// Mock issues for demo
const mockIssues: Issue[] = [
    {
      id: '6',
      title: 'Rising Lake Victoria water levels flooding homes',
      description: 'The rising water levels of Lake Victoria are causing flash floods, displacing families and destroying property in the coastal areas of Suba North. Residents need immediate assistance and long-term solutions.',
      category: 'environment',
      severity: 'critical',
      status: 'open',
      county: 'Homa Bay',
      constituency: 'Suba North',
      ward: 'Rusinga Island',
      location: 'Rusinga West',
      dateSubmitted: '2024-08-08',
      lastUpdated: '2024-08-09',
      submittedBy: '6',
      anonymous: true,
      upvotes: 210,
      downvotes: 5,
      tags: ['flood', 'climate change', 'emergency', 'displacement']
  },
  {
      id: '7',
      title: 'Broken boreholes causing water scarcity',
      description: 'The borehole that serves several villages in Gwassi South has been broken for over a month. People are forced to walk long distances to fetch water, affecting daily life and sanitation.',
      category: 'water',
      severity: 'high',
      status: 'pending',
      county: 'Homa Bay',
      constituency: 'Suba South',
      ward: 'Gwassi South',
      location: 'Gwassi South',
      dateSubmitted: '2024-08-07',
      lastUpdated: '2024-08-07',
      submittedBy: '7',
      anonymous: false,
      upvotes: 95,
      downvotes: 0,
      tags: ['water', 'borehole', 'sanitation', 'infrastructure']
  },
  {
      id: '8',
      title: 'Lack of medical staff at Homa Bay County Hospital',
      description: 'The County Hospital is severely understaffed, leading to long wait times and poor patient care, especially in the maternity and emergency wards. The community urgently needs more doctors and nurses.',
      category: 'health',
      severity: 'critical',
      status: 'open',
      county: 'Homa Bay',
      constituency: 'Homa Bay Town',
      ward: 'Homa Bay Central',
      location: 'Homa Bay County Hospital',
      dateSubmitted: '2024-08-09',
      lastUpdated: '2024-08-09',
      submittedBy: '8',
      anonymous: false,
      upvotes: 180,
      downvotes: 12,
      tags: ['health', 'staffing', 'hospital', 'medical']
  },
  {
      id: '9',
      title: 'Poor road conditions in Karachuonyo',
      description: 'The main road connecting Kendu Bay Town and the inland areas is impassable, especially during the rainy season. This is hindering business and making it difficult for farmers to get their produce to market.',
      category: 'roads',
      severity: 'high',
      status: 'pending',
      county: 'Homa Bay',
      constituency: 'Karachuonyo',
      ward: 'Kendu Bay Town',
      location: 'Kendu Bay',
      dateSubmitted: '2024-08-06',
      lastUpdated: '2024-08-08',
      submittedBy: '9',
      anonymous: false,
      upvotes: 112,
      downvotes: 4,
      tags: ['roads', 'transport', 'infrastructure', 'agriculture']
  },
  {
      id: '10',
      title: 'Poor waste management in Oyugis town',
      description: 'Garbage collection is irregular, leading to a buildup of waste in public areas. This is attracting pests and poses a serious health risk to residents, especially in market areas.',
      category: 'environment',
      severity: 'medium',
      status: 'open',
      county: 'Homa Bay',
      constituency: 'Kasipul',
      ward: 'West Kamagak',
      location: 'Oyugis Market',
      dateSubmitted: '2024-08-09',
      lastUpdated: '2024-08-09',
      submittedBy: '10',
      anonymous: false,
      upvotes: 67,
      downvotes: 2,
      tags: ['environment', 'sanitation', 'health', 'waste management']
  },
  {
      id: '11',
      title: 'Security concerns in Ndhiwa after dark',
      description: 'There has been an increase in night-time muggings and robberies in Ndhiwa town. Residents are requesting increased police patrols and better street lighting to improve safety.',
      category: 'security',
      severity: 'high',
      status: 'pending',
      county: 'Homa Bay',
      constituency: 'Ndhiwa',
      ward: 'Kanyadoto',
      location: 'Ndhiwa Town',
      dateSubmitted: '2024-08-06',
      lastUpdated: '2024-08-06',
      submittedBy: '11',
      anonymous: true,
      upvotes: 134,
      downvotes: 1,
      tags: ['security', 'safety', 'crime', 'lighting']
  },
  {
    id: '1',
    title: 'Water shortage in Kahawa West',
    description: 'There has been no water supply in Kahawa West for the past 2 weeks. Residents are forced to buy water from vendors at very high prices. This is affecting daily activities and businesses in the area.',
    category: 'water',
    severity: 'high',
    status: 'pending',
    county: 'Kiambu',
    constituency: 'Ruiru',
    ward: 'Kahawa West',
    location: 'Kahawa West Shopping Center',
    dateSubmitted: '2024-08-05',
    lastUpdated: '2024-08-06',
    submittedBy: '1',
    anonymous: false,
    upvotes: 127,
    downvotes: 3,
    adminResponse: {
      id: '1',
      message: 'We have identified a burst pipe that is causing the water shortage. Our technical team is working on repairs and water supply should resume within 48 hours.',
      respondedBy: '2',
      respondedAt: '2024-08-06',
      isPublic: true
    },
    tags: ['water', 'infrastructure', 'urgent']
  },
  {
    id: '2',
    title: 'Dangerous potholes on Thika Road',
    description: 'Large potholes have developed on the main Thika Road near Kahawa Sukari. These are causing accidents and damaging vehicles. Emergency repairs are needed.',
    category: 'roads',
    severity: 'high',
    status: 'open',
    county: 'Kiambu',
    constituency: 'Ruiru',
    ward: 'Biashara',
    dateSubmitted: '2024-08-04',
    lastUpdated: '2024-08-04',
    submittedBy: '1',
    anonymous: true,
    upvotes: 89,
    downvotes: 1,
    tags: ['roads', 'safety', 'infrastructure']
  },
  {
    id: '3',
    title: 'Poor street lighting increases crime',
    description: 'Street lights have been broken for months in Mwiki area. This has made the area unsafe at night with increased cases of muggings and theft.',
    category: 'security',
    severity: 'critical',
    status: 'resolved',
    county: 'Nairobi',
    constituency: 'Kasarani',
    ward: 'Mwiki',
    dateSubmitted: '2024-08-01',
    lastUpdated: '2024-08-03',
    submittedBy: '3',
    anonymous: false,
    upvotes: 156,
    downvotes: 2,
    adminResponse: {
      id: '2',
      message: 'New LED street lights have been installed and are now operational. We have also increased police patrols in the area.',
      respondedBy: '2',
      respondedAt: '2024-08-03',
      isPublic: true
    },
    tags: ['security', 'lighting', 'safety']
  },
  {
    id: '4',
    title: 'Garbage collection delays in Eastleigh',
    description: 'Garbage has not been collected for over a week in Eastleigh North. The accumulating waste is becoming a health hazard.',
    category: 'environment',
    severity: 'medium',
    status: 'pending',
    county: 'Nairobi',
    constituency: 'Kamukunji',
    ward: 'Eastleigh North',
    dateSubmitted: '2024-08-07',
    lastUpdated: '2024-08-07',
    submittedBy: '1',
    anonymous: false,
    upvotes: 45,
    downvotes: 0,
    tags: ['environment', 'health', 'sanitation']
  },
  {
    id: '5',
    title: 'Understaffed health center',
    description: 'Kiambu Health Center is severely understaffed. Patients wait for hours and some are turned away. More medical staff needed urgently.',
    category: 'health',
    severity: 'high',
    status: 'open',
    county: 'Kiambu',
    constituency: 'Kiambu',
    ward: 'Township',
    dateSubmitted: '2024-08-03',
    lastUpdated: '2024-08-03',
    submittedBy: '1',
    anonymous: false,
    upvotes: 78,
    downvotes: 1,
    tags: ['health', 'staffing', 'medical']
  }
];

export const IssueProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>(mockIssues);
  const [loading, setLoading] = useState(false);

  const addIssue = (newIssue: Omit<Issue, 'id' | 'dateSubmitted' | 'lastUpdated' | 'upvotes' | 'downvotes'>) => {
    const issue: Issue = {
      ...newIssue,
      id: Date.now().toString(),
      dateSubmitted: new Date().toISOString().split('T')[0],
      lastUpdated: new Date().toISOString().split('T')[0],
      upvotes: 0,
      downvotes: 0
    };
    
    setIssues(prev => [issue, ...prev]);
  };

  const updateIssueStatus = (id: string, status: Issue['status'], response?: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id 
        ? { 
            ...issue, 
            status, 
            lastUpdated: new Date().toISOString().split('T')[0],
            ...(response && {
              adminResponse: {
                id: Date.now().toString(),
                message: response,
                respondedBy: '2', // Mock admin ID
                respondedAt: new Date().toISOString(),
                isPublic: true
              }
            })
          }
        : issue
    ));
  };

  const upvoteIssue = (id: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id 
        ? { ...issue, upvotes: issue.upvotes + 1 }
        : issue
    ));
  };

  const downvoteIssue = (id: string) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id 
        ? { ...issue, downvotes: issue.downvotes + 1 }
        : issue
    ));
  };

  const addAdminResponse = (issueId: string, response: Omit<AdminResponse, 'id' | 'respondedAt'>) => {
    const adminResponse: AdminResponse = {
      ...response,
      id: Date.now().toString(),
      respondedAt: new Date().toISOString()
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            adminResponse,
            lastUpdated: new Date().toISOString().split('T')[0]
          }
        : issue
    ));
  };

  const value = {
    issues,
    addIssue,
    updateIssueStatus,
    upvoteIssue,
    downvoteIssue,
    addAdminResponse,
    loading
  };

  return (
    <IssueContext.Provider value={value}>
      {children}
    </IssueContext.Provider>
  );
};