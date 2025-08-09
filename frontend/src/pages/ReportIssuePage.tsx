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
    county: user?.county || 'Homabay',
    constituency: user?.constituency || 'Suba South',
    ward: user?.ward || 'Kaksingri North',
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
    { value: 'Homabay', label: 'Homabay' },
    { value: 'Nairobi', label: 'Nairobi' },
    { value: 'Nakuru', label: 'Nakuru' },
    { value: 'Mombasa', label: 'Mombasa' },
    { value: 'Kisumu', label: 'Kisumu' }
  ];

  const handleNext = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const categorizeWithGemini = async (title: string, description: string) => {
    const prompt = `
You are an AI that categorizes public issue reports into exactly one of these categories:
roads, water, health, security, corruption, education, environment, housing.
Return ONLY the lowercase category name, nothing else.

Title: ${title}
Description: ${description}
    `;

    try {
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
      if (!apiKey) {
        console.error("❌ No API key found in VITE_GEMINI_API_KEY");
        return 'roads';
      }

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-1b-it:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await res.json();
      console.log("📦 Gemini API Response:", data);

      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        data?.candidates?.[0]?.output || '';

      if (!aiText) {
        console.warn("⚠️ No category returned from Gemini");
        return 'roads';
      }

      const normalized = aiText.toLowerCase().replace(/[^a-z]/g, '');
      const match = categoryOptions.find(c => normalized.includes(c.value));

      if (!match) {
        console.warn(`⚠️ Unknown category "${normalized}", defaulting to roads`);
        return 'roads';
      }

      return match.value;
    } catch (err) {
      console.error("💥 Gemini request failed:", err);
      return 'roads';
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const aiCategory = await categorizeWithGemini(formData.title, formData.description);
    console.log("✅ Final category from AI:", aiCategory);

    addIssue({
      ...formData,
      category: aiCategory,
      submittedBy: user?.id || '1',
      status: 'open'
    });

    setSubmitting(false);
    setSubmitted(true);

    setTimeout(() => {
      navigate('/issues');
    }, 3000);
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return formData.title;
      case 2: return formData.description && formData.severity;
      case 3: return formData.county && formData.constituency && formData.ward;
      default: return false;
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
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>AI Analysis:</strong> Categorized as "{categoryOptions.find(c => c.value === formData.category)?.label}" with "{formData.severity}" priority.
            </p>
          </div>
          <p className="text-sm text-gray-500">Redirecting to issues page...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4" /> Back
          </button>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Report Issue</h1>
            <span className="text-sm text-gray-500">{currentStep}/{totalSteps}</span>
          </div>
          <div className="flex gap-2">
            {[1, 2, 3].map(step => (
              <div key={step} className={`flex-1 h-2 rounded-full transition-colors ${step <= currentStep ? 'bg-blue-600' : 'bg-gray-200'}`} />
            ))}
          </div>
        </div>

        <Card className="p-8">
          {currentStep === 1 && (
            <div className="space-y-6">
              <Input label="Issue Title" value={formData.title} onChange={(value) => setFormData({...formData, title: value})} placeholder="Brief description" required />
              <Input label="Specific Location (Optional)" value={formData.location} onChange={(value) => setFormData({...formData, location: value})} placeholder="e.g., Near market" />
              <div className="grid grid-cols-2 gap-4">
                <Button variant="secondary" className="flex-1"><Camera className="h-4 w-4" /> Add Photo</Button>
                <Button variant="secondary" className="flex-1"><MapPin className="h-4 w-4" /> Use GPS</Button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <Input label="Description" value={formData.description} onChange={(value) => setFormData({...formData, description: value})} placeholder="Describe in detail" multiline rows={6} required />
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-900 mb-1">AI-Powered Analysis</h4>
                  <p className="text-sm text-yellow-800">
                    Our AI will automatically categorize and prioritize your issue.
                  </p>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <Select label="County" value={formData.county} onChange={(value) => setFormData({...formData, county: value})} options={countyOptions} required />
              <Input label="Constituency" value={formData.constituency} onChange={(value) => setFormData({...formData, constituency: value})} placeholder="Your constituency" required />
              <Input label="Ward" value={formData.ward} onChange={(value) => setFormData({...formData, ward: value})} placeholder="Your ward" required />
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-center">
                <input type="checkbox" id="anonymous" checked={formData.anonymous} onChange={(e) => setFormData({...formData, anonymous: e.target.checked})} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                <label htmlFor="anonymous" className="ml-3 text-sm text-gray-700">Submit anonymously</label>
              </div>
            </div>
          )}

          <div className="flex gap-4 mt-8 pt-6 border-t border-gray-200">
            {currentStep > 1 && <Button variant="secondary" onClick={handlePrev} className="flex-1">Previous</Button>}
            {currentStep < totalSteps ? (
              <Button onClick={handleNext} className="flex-1" disabled={!isStepValid()}>
                Next <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} className="flex-1" disabled={!isStepValid() || submitting}>
                {submitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Processing...</> : <><Send className="h-4 w-4" /> Submit Report</>}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportIssuePage;
