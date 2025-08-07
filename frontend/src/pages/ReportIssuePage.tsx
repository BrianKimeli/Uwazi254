import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Camera, 
  MapPin, 
  Send, 
  ChevronRight, 
  AlertTriangle,
  CheckCircle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useIssues } from '../contexts/IssueContext';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Card from '../components/ui/Card';

const ReportIssuePage: React.FC = () => {
  const { user } = useAuth();
  const { addIssue } = useIssues();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'roads',
    county: user?.county || 'Kiambu',
    constituency: user?.constituency || 'Ruiru',
    ward: user?.ward || 'Kahawa West',
    location: '',
    severity: 'medium',
    anonymous: false
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = 3;

  const categoryOptions = [
    { value: 'roads', label: '🛣️ Roads & Infrastructure' },
    { value: 'water', label: '💧 Water & Sanitation' },
    { value: 'health', label: '🏥 Healthcare' },
    { value: 'security', label: '🛡️ Security & Safety' },
    { value: 'corruption', label: '⚖️ Corruption' },
    { value: 'education', label: '🎓 Education' },
    { value: 'environment', label: '🌱 Environment' },
    { value: 'housing', label: '🏠 Housing' }
  ];

  const severityOptions = [
    { value: 'low', label: 'Low - Can wait' },
    { value: 'medium', label: 'Medium - Important' },
    { value: 'high', label: 'High - Urgent' },
    { value: 'critical', label: 'Critical - Emergency' }
  ];

  const countyOptions = [
    { value: 'Kiambu', label: 'Kiambu' },
    { value: 'Nairobi', label: 'Nairobi' },
    { value: 'Nakuru', label: 'Nakuru' },
    { value: 'Mombasa', label: 'Mombasa' },
    { value: 'Kisumu', label: 'Kisumu' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    // Simulate AI categorization delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addIssue({
      ...formData,
      submittedBy: user?.id || '1',
      status: 'open'
    });
    
    setSubmitting(false);
    setSubmitted(true);
    
    // Redirect after success
    setTimeout(() => {
      navigate('/issues');
    }, 3000);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.title && formData.category;
      case 2:
        return formData.description && formData.severity;
      case 3:
        return formData.county && formData.constituency && formData.ward;
      default:
        return false;
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="bg-green-100 p-4 rounded-full inline-block mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Issue Reported Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your report has been submitted and will be reviewed by the relevant authorities. 
            You'll receive updates on its progress.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>AI Analysis Complete:</strong> Your issue has been automatically 
              categorized as "{categoryOptions.find(c => c.value === formData.category)?.label}" 
              with "{formData.severity}\" priority.
            </p>
          </div>
          <p className="text-sm text-gray-500">
            Redirecting to issues page...
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
          
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Report Issue</h1>
            <span className="text-sm text-gray-500">{currentStep}/{totalSteps}</span>
          </div>
          
          {/* Progress Bar */}
          <div className="flex gap-2">
            {[1, 2, 3].map(step => (
              <div
                key={step}
                className={`flex-1 h-2 rounded-full transition-colors ${
                  step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>

        <Card className="p-8">
          {/* Step 1: What & Category */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  What's the issue?
                </h2>
                <p className="text-gray-600">
                  Tell us what's happening in your community
                </p>
              </div>

              <Input
                label="Issue Title"
                value={formData.title}
                onChange={(value) => setFormData({...formData, title: value})}
                placeholder="Brief description of the issue"
                required
              />

              <Select
                label="Category"
                value={formData.category}
                onChange={(value) => setFormData({...formData, category: value})}
                options={categoryOptions}
                required
              />

              <Input
                label="Specific Location (Optional)"
                value={formData.location}
                onChange={(value) => setFormData({...formData, location: value})}
                placeholder="e.g., Near Kahawa West Shopping Center"
              />

              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="flex-1">
                  <Camera className="h-4 w-4" />
                  Add Photo
                </Button>
                <Button variant="secondary" className="flex-1">
                  <MapPin className="h-4 w-4" />
                  Use GPS
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Details */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Tell us more
                </h2>
                <p className="text-gray-600">
                  Provide details to help us understand better
                </p>
              </div>

              <Input
                label="Description"
                value={formData.description}
                onChange={(value) => setFormData({...formData, description: value})}
                placeholder="Describe the issue in detail. How does it affect you and your community?"
                multiline
                rows={6}
                required
              />

              <Select
                label="How urgent is this?"
                value={formData.severity}
                onChange={(value) => setFormData({...formData, severity: value})}
                options={severityOptions}
                required
              />

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-yellow-900 mb-1">AI-Powered Analysis</h4>
                    <p className="text-sm text-yellow-800">
                      Our AI will automatically categorize and prioritize your issue 
                      to ensure it reaches the right authorities quickly.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Location & Submit */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                  Where exactly?
                </h2>
                <p className="text-gray-600">
                  Help us locate the issue precisely
                </p>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <Select
                  label="County"
                  value={formData.county}
                  onChange={(value) => setFormData({...formData, county: value})}
                  options={countyOptions}
                  required
                />
                <Input
                  label="Constituency"
                  value={formData.constituency}
                  onChange={(value) => setFormData({...formData, constituency: value})}
                  placeholder="Your constituency"
                  required
                />
                <Input
                  label="Ward"
                  value={formData.ward}
                  onChange={(value) => setFormData({...formData, ward: value})}
                  placeholder="Your ward"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="anonymous"
                    checked={formData.anonymous}
                    onChange={(e) => setFormData({...formData, anonymous: e.target.checked})}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="anonymous" className="ml-3 text-sm text-gray-700">
                    Submit anonymously (your identity will be protected)
                  </label>
                </div>
              </div>

              {/* Preview */}
              <Card className="p-4 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-3">Review Your Report</h4>
                <div className="space-y-2 text-sm">
                  <p><strong>Issue:</strong> {formData.title}</p>
                  <p><strong>Category:</strong> {categoryOptions.find(c => c.value === formData.category)?.label}</p>
                  <p><strong>Location:</strong> {formData.ward}, {formData.constituency}, {formData.county}</p>
                  <p><strong>Urgency:</strong> {severityOptions.find(u => u.value === formData.severity)?.label}</p>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && (
              <Button
                variant="secondary"
                onClick={handlePrev}
                className="flex-1"
              >
                Previous
              </Button>
            )}
            
            {currentStep < totalSteps ? (
              <Button
                onClick={handleNext}
                className="flex-1"
                disabled={!isStepValid()}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="flex-1"
                disabled={!isStepValid() || submitting}
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Submit Report
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssuePage;