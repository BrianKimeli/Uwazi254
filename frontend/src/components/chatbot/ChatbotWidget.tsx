import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ChatbotWidgetProps {
    onClose: () => void;
}

type Issue = {
    id: string;
    title: string;
    description: string;
    category: string;
    severity: string;
    status: string;
    county: string;
    constituency: string;
    ward: string;
    location?: string;
    dateSubmitted: string;
    lastUpdated: string;
    submittedBy: string;
    anonymous: boolean;
    upvotes: number;
    downvotes: number;
    adminResponse?: {
        id: string;
        message: string;
        respondedBy: string;
        respondedAt: string;
        isPublic: boolean;
    };
    tags: string[];
};

const mockIssues: Issue[] = [
    // ... (your existing mock issues data)
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
            isPublic: true,
        },
        tags: ['water', 'infrastructure', 'urgent'],
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
        tags: ['roads', 'safety', 'infrastructure'],
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
            isPublic: true,
        },
        tags: ['security', 'lighting', 'safety'],
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
        tags: ['environment', 'health', 'sanitation'],
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
        tags: ['health', 'staffing', 'medical'],
    },
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
        tags: ['flood', 'climate change', 'emergency', 'displacement'],
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
        tags: ['water', 'borehole', 'sanitation', 'infrastructure'],
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
        tags: ['health', 'staffing', 'hospital', 'medical'],
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
        tags: ['roads', 'transport', 'infrastructure', 'agriculture'],
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
        tags: ['environment', 'sanitation', 'health', 'waste management'],
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
        tags: ['security', 'safety', 'crime', 'lighting'],
    },
];

type Message = { sender: 'user' | 'bot'; text: string };

const ChatbotWidget: React.FC<ChatbotWidgetProps> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
    const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';

    const findRelevantIssues = (query: string) => {
        const keywords = query.toLowerCase().split(' ');
        
        return mockIssues.filter(issue => 
          keywords.some(keyword => 
            issue.title.toLowerCase().includes(keyword) ||
            issue.description.toLowerCase().includes(keyword) ||
            issue.county.toLowerCase().includes(keyword) ||
            issue.constituency.toLowerCase().includes(keyword)
          )
        );
    };

    const sendMessage = async () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        const userMsg: Message = { sender: 'user', text: trimmed };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        if (!GEMINI_API_KEY) {
            setLoading(false);
            const reply = 'AI is not configured. Please get a free API key and set it as VITE_GEMINI_API_KEY.';
            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
            console.error('Missing Gemini API key (VITE_GEMINI_API_KEY).');
            return;
        }

        // RAG Implementation: Find relevant issues to provide as context
        const relevantIssues = findRelevantIssues(trimmed);
        let context = '';

        if (relevantIssues.length > 0) {
            context = `Here is some background information from Uwazi254's issue database:\n\n`;
            context += relevantIssues.map(issue => 
              `Issue ID: ${issue.id}\nTitle: ${issue.title}\nDescription: ${issue.description}\n` +
              `County: ${issue.county}\nConstituency: ${issue.constituency}\nStatus: ${issue.status}\n` +
              (issue.adminResponse ? `Admin Response: ${issue.adminResponse.message}\n` : '') +
              `Date Submitted: ${issue.dateSubmitted}\n\n`
            ).join('');
        } else {
            context = `We do not have any specific issues in our database matching this query.`;
        }

        const systemInstruction = `You are a chatbot for Uwazi254, a citizen feedback system in Kenya. Your name is UwaziBot. You respond to queries in a friendly, conversational tone, and can use a mix of English and Swahili to feel more authentic. Your main goal is to answer questions about citizen issues based on the provided context. If an issue has an admin response, include that in your answer. If the answer is not in the context, state that you cannot find information on that specific issue. Be concise, helpful, and never break character as UwaziBot.`;

        const requestBody = {
            systemInstruction: {
                parts: [{ text: systemInstruction }]
            },
            contents: [
                ...messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
                { role: 'user', parts: [{ text: `${context}\n\nUser's Query: ${trimmed}` }] }
            ],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
            },
        };

        try {
            const res = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            if (!res.ok) {
                const errorJson = await res.json().catch(() => null);
                const errorMsg = errorJson?.error?.message || `API Error ${res.status}`;
                throw new Error(errorMsg);
            }

            const data = await res.json();
            const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, no response received.';

            setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
        } catch (err: any) {
            console.error('Chatbot error:', err);
            const errorMsg =
                err?.message?.includes('quota') || err?.message?.includes('429')
                    ? 'AI rate limit reached. Try again later.'
                    : `AI Error: ${err.message || 'Could not reach service.'}`;

            setMessages(prev => [...prev, { sender: 'bot', text: errorMsg }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed bottom-20 right-6 bg-white shadow-2xl rounded-2xl flex flex-col border border-gray-200 z-50
                     w-80 sm:w-96 lg:w-[28rem] max-h-[100vh]"
        >
            {/* Header */}
            <div className="flex items-center justify-between bg-green-600 text-white px-4 py-3 rounded-t-2xl">
                <span className="font-semibold">Uwazi254 Chatbot</span>
                <button onClick={onClose} className="hover:text-gray-200">
                    <X className="h-5 w-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.length === 0 && (
                    <p className="text-sm text-gray-500 text-center">
                        👋 Habari! I'm UwaziBot. I'm here to help you with community issues. How can I help?
                    </p>
                )}

                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`p-3 rounded-lg max-w-[80%] break-words ${
                            msg.sender === 'user' ? 'bg-green-100 self-end text-right ml-auto' : 'bg-gray-100 self-start text-left mr-auto'
                        }`}
                    >
                        {msg.text}
                    </div>
                ))}

                {loading && <p className="text-sm text-gray-400">Thinking...</p>}
            </div>

            {/* Input */}
            <div className="flex border-t border-gray-200">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter') sendMessage();
                    }}
                    placeholder="Ask about community issues..."
                    className="flex-1 p-3 outline-none text-sm"
                />
                <button onClick={sendMessage} className="bg-green-600 text-white px-4 hover:bg-green-700">
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatbotWidget;