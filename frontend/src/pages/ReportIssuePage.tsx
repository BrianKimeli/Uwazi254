import React, { useState, useRef } from 'react';
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

  const fileInputRef = useRef<HTMLInputElement>(null);

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
    anonymous: false,
    photoFile: null as File | null,    // <-- Added photoFile to store selected file
    photoPreview: null as string | null // <-- Added photoPreview for preview URL
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

  const fineGrainedFallbacks: Record<string, string> = {
    pothole: 'roads',
    tarmac: 'roads',
    drainage: 'water',
    sewer: 'water',
    clinic: 'health',
    hospital: 'health',
    crime: 'security',
    theft: 'security',
    bribe: 'corruption',
    mismanagement: 'corruption',
    school: 'education',
    teacher: 'education',
    pollution: 'environment',
    deforestation: 'environment',
    rent: 'housing',
    eviction: 'housing'
  };

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

  // 🧠 AI Categorization with Hugging Face Zero-Shot Classification
  const categorizeWithHuggingFace = async (title: string, description: string) => {
    const apiKey = import.meta.env.VITE_HF_API_KEY;
    if (!apiKey) {
      console.error("❌ Missing Hugging Face API key");
      return 'roads';
    }

    const candidateCategories = categoryOptions.map(c => c.value);

    try {
      const res = await fetch(
        "https://api-inference.huggingface.co/models/facebook/bart-large-mnli",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            inputs: `${title}\n\n${description}`,
            parameters: {
              candidate_labels: candidateCategories,
              multi_label: false
            }
          })
        }
      );

      const data = await res.json();
      console.log("📦 HF Classification Response:", data);

      // Main AI match
      let aiCategory = data?.labels?.[0]?.toLowerCase();

      // ✅ If AI returned a valid category
      if (aiCategory && candidateCategories.includes(aiCategory)) {
        return aiCategory;
      }

      // 🔍 Check fine-grained fallback keywords
      const combinedText = `${title} ${description}`.toLowerCase();
      for (const keyword in fineGrainedFallbacks) {
        if (combinedText.includes(keyword)) {
          return fineGrainedFallbacks[keyword];
        }
      }

      console.warn("⚠️ Could not categorize, defaulting to 'roads'");
      return 'roads';

    } catch (err) {
      console.error("💥 Hugging Face request failed:", err);
      return 'roads';
    }
  };
  const determineSeverity = (title: string, description: string) => {
    const text = `${title} ${description}`.toLowerCase();

    if (text.includes("emergency") || text.includes("critical") || text.includes("collapse") || text.includes("attack") || text.includes("dead") || text.includes("injured")) {
      return "critical"
    }
    if (text.includes("urgent") || text.includes("severe") || text.includes("danger") || text.includes("unsafe") || text.includes("accident")) {
      return "high";
    }
    if (text.includes("minor") || text.includes("small issue") || text.includes("slight")) {
      return "low";
    }
    return "medium";
  };

  const handleSubmit = async () => {
    setSubmitting(true);

    const aiCategory = await categorizeWithHuggingFace(formData.title, formData.description);
    const aiSeverity = determineSeverity(formData.title, formData.description);

    const updatedFormData = { ...formData, category: aiCategory, severity: aiSeverity };
    setFormData(updatedFormData);

    addIssue({
      ...updatedFormData,
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
      case 1: return formData.title.trim().length > 0;
      case 2: return formData.description.trim().length > 0 && formData.severity;
      case 3: return formData.county && formData.constituency && formData.ward;
      default: return false;
    }
  };

  // Handler to open file picker when Add Photo clicked
  const handleAddPhotoClick = () => {
    fileInputRef.current?.click();
  };

  // Handler to update state on file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const photoURL = URL.createObjectURL(file);
      setFormData(prev => ({
        ...prev,
        photoFile: file,
        photoPreview: photoURL
      }));
    }
  };

  // Handler for using GPS to set location
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setFormData(prev => ({
          ...prev,
          location: `Lat: ${latitude.toFixed(5)}, Lon: ${longitude.toFixed(5)}`
        }));
      },
      (err) => {
        alert(`Error getting location: ${err.message}`);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
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
                <Button variant="secondary" className="flex-1" onClick={handleAddPhotoClick}>
                  <Camera className="h-4 w-4" /> Add Photo
                </Button>
                <Button variant="secondary" className="flex-1" onClick={handleUseGPS}>
                  <MapPin className="h-4 w-4" /> Use GPS
                </Button>
              </div>

              {/* Hidden file input for photo upload */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />

              {/* Preview selected photo */}
              {formData.photoPreview && (
                <img
                  src={formData.photoPreview}
                  alt="Preview"
                  className="mt-4 max-h-48 rounded-lg object-cover"
                />
              )}
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
