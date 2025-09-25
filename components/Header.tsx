import React, { useState, useEffect } from 'react';

const AVATAR_CACHE_KEY = 'admin_avatar_url_v1';

interface HeaderProps {
    title: string;
}

// A function to safely get the API key at runtime
function getApiKey(): string | undefined {
    try {
        // This check prevents ReferenceError in environments where 'process' is not defined.
        if (typeof process !== 'undefined' && process?.env) {
            return process.env['API_KEY'];
        }
    } catch (e) {
        console.error("Header: Error accessing API_KEY", e);
    }
    return undefined;
}


const Header: React.FC<HeaderProps> = ({ title }) => {
    // State to hold the AI client instance
    const [ai, setAi] = useState<any | null>(null);
    const [isAiInitialized, setIsAiInitialized] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(() => {
        try {
            return localStorage.getItem(AVATAR_CACHE_KEY);
        } catch (error) {
            console.error("Could not access localStorage:", error);
            return null;
        }
    });
    
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const initializeAi = async () => {
            const apiKey = getApiKey();
            if (!apiKey) {
                console.warn("Header: API_KEY not found. AI features will be disabled.");
                setIsAiInitialized(true); // Mark as "initialized" to stop trying
                return;
            }

            try {
                // Dynamic import prevents module-level crashes from taking down the whole app.
                const { GoogleGenAI } = await import('@google/genai');
                const genAi = new GoogleGenAI({ apiKey });
                setAi(genAi);
            } catch (error) {
                console.error("Header: Failed to load or initialize GoogleGenAI.", error);
            } finally {
                setIsAiInitialized(true);
            }
        };

        initializeAi();
    }, []);

    useEffect(() => {
        // This effect runs once AI is initialized (or initialization fails)
        if (!isAiInitialized) return;

        // If we have a cached avatar, we're done.
        if (avatarUrl) {
            setLoading(false);
            return;
        }

        // If AI is not available (failed to init or no key), we're also done.
        if (!ai) {
            setLoading(false);
            return;
        }

        const generateAndCacheAvatar = async () => {
            setLoading(true);
            try {
                const response = await ai.models.generateImages({
                    model: 'imagen-4.0-generate-001',
                    prompt: "A modern, minimalist logo for a user avatar. The logo features the Arabic letter 'ح' (Ha) in an abstract, elegant style. Use a sophisticated color palette of deep navy blue and silver on a clean white background. The style should be a flat 2D vector graphic, professional and clean.",
                    config: {
                      numberOfImages: 1,
                      outputMimeType: 'image/jpeg',
                      aspectRatio: '1:1',
                    },
                });
                
                const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
                const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
                
                try {
                    localStorage.setItem(AVATAR_CACHE_KEY, imageUrl);
                } catch (error) {
                    console.error("Could not save avatar to localStorage:", error);
                }
                setAvatarUrl(imageUrl);
            } catch (error) {
                console.error("Failed to generate avatar:", error);
            } finally {
                setLoading(false);
            }
        };

        generateAndCacheAvatar();
    }, [ai, isAiInitialized, avatarUrl]);


    const renderAvatar = () => {
        // Show loading state ONLY if we are actively fetching an avatar
        if (loading) {
            return (
                <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse"></div>
            );
        }
        if (avatarUrl) {
            return (
                <img src={avatarUrl} alt="System administrator avatar" className="w-10 h-10 rounded-full object-cover" />
            );
        }
        // Fallback if no avatar in cache and AI failed or is disabled
        return (
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center">
               <span className="text-xl font-bold">ح</span>
            </div>
        );
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
                 <div className="flex items-center">
                    {renderAvatar()}
                    <div className="mr-3 text-right">
                       <p className="text-sm font-medium text-gray-700">حمدى بهنساوى</p>
                       <p className="text-xs text-gray-500">مدير النظام</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;