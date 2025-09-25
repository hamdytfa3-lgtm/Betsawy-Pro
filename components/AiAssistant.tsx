import React, { useState, useRef, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { IconSparkles } from './icons/IconSparkles';
import { IconPaperAirplane } from './icons/IconPaperAirplane';

interface Message {
    sender: 'user' | 'ai';
    text: string;
}

// A function to safely get the API key at runtime
function getApiKey(): string | undefined {
    try {
        // This check prevents ReferenceError in environments where 'process' is not defined.
        if (typeof process !== 'undefined' && process?.env) {
            return process.env['API_KEY'];
        }
    } catch (e) {
        console.error("AI Assistant: Error accessing API_KEY", e);
    }
    return undefined;
}

const AiAssistant: React.FC = () => {
    const [ai, setAi] = useState<any | null>(null);
    const [isAiReady, setIsAiReady] = useState(false);
    const [aiError, setAiError] = useState<string | null>(null);

    const { items, suppliers, customers, transactions } = useData();
    const [messages, setMessages] = useState<Message[]>([
        { sender: 'ai', text: "مرحباً، أنا 'نبيه'، مساعدك الذكي للمخزون. يمكنك أن تسألني عن حالة المخزون، مثل 'ما هي الأصناف الأكثر مبيعاً؟' أو 'هل هناك أصناف على وشك النفاد؟'" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const initializeAi = async () => {
            const apiKey = getApiKey();
            if (!apiKey) {
                setAiError("ميزة المساعد الذكي غير متاحة. الرجاء التأكد من إعداد مفتاح API.");
                setIsAiReady(true);
                return;
            }

            try {
                // Dynamic import prevents module-level crashes from taking down the whole app.
                const { GoogleGenAI } = await import('@google/genai');
                const genAi = new GoogleGenAI({ apiKey });
                setAi(genAi);
            } catch (error) {
                console.error("AI Assistant: Failed to load or initialize GoogleGenAI.", error);
                setAiError("حدث خطأ أثناء تهيئة المساعد الذكي.");
            } finally {
                setIsAiReady(true);
            }
        };

        initializeAi();
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async () => {
        if (!input.trim() || isLoading || !ai) return;

        const userMessage: Message = { sender: 'user', text: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const contextData = { items, suppliers, customers, transactions };
            const prompt = `
                User question: "${input}"

                Here is the inventory data in JSON format for your analysis: 
                ${JSON.stringify(contextData)}
            `;

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    systemInstruction: "You are an intelligent assistant specializing in inventory data analysis. Your name is 'Nabeeh' (نبيه). Analyze the provided context data and provide clear, concise, and helpful answers and insights in Arabic based on the user's question. Format your response for readability, using markdown for lists or bold text where appropriate.",
                }
            });
            
            const aiMessage: Message = { sender: 'ai', text: response.text };
            setMessages(prev => [...prev, aiMessage]);

        } catch (error) {
            console.error("AI Assistant Error:", error);
            const errorMessage: Message = { sender: 'ai', text: "عذراً، حدث خطأ أثناء محاولة معالجة طلبك. الرجاء المحاولة مرة أخرى." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const isAssistantDisabled = !ai || !!aiError;

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mt-8">
            <h2 className="text-xl font-bold mb-4 text-gray-700 flex items-center">
                <IconSparkles className="h-6 w-6 text-purple-500 ml-3" />
                مساعد المخزون الذكي (نبيه)
            </h2>
            <div className="h-72 overflow-y-auto p-4 mb-4 border rounded-md bg-gray-50 space-y-4">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                        {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0"><IconSparkles className="h-5 w-5 text-purple-600"/></div>}
                        <div className={`max-w-lg p-3 rounded-lg shadow-sm ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-bl-none' : 'bg-white text-gray-800 rounded-br-none'}`}>
                            <p className="text-sm" style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                        </div>
                    </div>
                ))}
                 {!isAiReady && (
                    <div className="flex justify-center items-center h-full">
                        <div className="text-center text-gray-500">
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                            <p>جاري تهيئة المساعد الذكي...</p>
                        </div>
                    </div>
                 )}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSendMessage()}
                    placeholder={!isAiReady ? "جاري التحميل..." : (isAssistantDisabled ? "المساعد الذكي غير متاح حالياً" : "اسأل عن أي شيء يخص مخزونك...")}
                    disabled={isLoading || !isAiReady || isAssistantDisabled}
                    className="flex-1 p-2.5 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100"
                    aria-label="Ask AI assistant"
                />
                <button 
                    onClick={handleSendMessage} 
                    disabled={isLoading || !input.trim() || !isAiReady || isAssistantDisabled}
                    className="bg-blue-600 text-white p-2.5 rounded-md hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center w-11 h-11"
                    aria-label="إرسال"
                >
                    {isLoading ? 
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> :
                        <IconPaperAirplane className="h-5 w-5" />
                    }
                </button>
            </div>
             {aiError && <p className="text-xs text-red-500 mt-2">{aiError}</p>}
        </div>
    );
};

export default AiAssistant;