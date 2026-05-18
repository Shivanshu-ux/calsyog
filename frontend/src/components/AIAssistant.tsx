import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { cn } from '../lib/utils';

interface Message {
    role: 'user' | 'model';
    text: string;
}

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'model', text: "Hi there! I'm your CalsYog Assistant. I can answer questions about our products, services, or guide you anywhere you want to go. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const navigate = useNavigate();

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    const handleSend = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        
        const newHistory = [...messages, { role: 'user' as const, text: userMessage }];
        setMessages(newHistory);
        setIsLoading(true);

        try {
            const { data } = await axios.post('/api/ai/chat', {
                message: userMessage,
                history: messages // send previous history for context
            });

            let responseText = data.text;
            
            // Check for navigation command
            const navRegex = /__NAVIGATE__\/(.*?)__/g;
            let match;
            let didNavigate = false;

            while ((match = navRegex.exec(responseText)) !== null) {
                const path = '/' + match[1].trim();
                navigate(path);
                didNavigate = true;
            }

            // Remove the navigation command from the visible text
            responseText = responseText.replace(/__NAVIGATE__\/.*?__/g, '').trim();

            setMessages([...newHistory, { role: 'model', text: responseText }]);

            // If we navigated, auto-close the chat after a brief delay so they can see the page
            if (didNavigate) {
                setTimeout(() => setIsOpen(false), 2000);
            }

        } catch (error: any) {
            console.error("AI Error:", error);
            const errorMessage = error.response?.data?.error || "Sorry, I am having trouble connecting to my servers right now.";
            setMessages([...newHistory, { role: 'model', text: errorMessage }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* Floating Action Button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.button
                        initial={{ scale: 1, opacity: 1 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        onClick={() => setIsOpen(true)}
                        className="fixed bottom-20 right-6 md:bottom-10 md:right-10 z-[9999] bg-primary text-black p-4 rounded-full shadow-[0_0_20px_rgba(var(--primary),0.5)] hover:bg-primary/90 transition-all hover:scale-110"
                    >
                        <MessageSquare className="h-6 w-6" />
                    </motion.button>
                )}
            </AnimatePresence>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 50, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 50, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[100] w-[calc(100vw-3rem)] md:w-96 bg-[#111] border border-white/10 rounded-2xl shadow-2xl flex flex-col h-[500px] max-h-[80vh] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="bg-white/5 border-b border-white/10 p-4 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <Bot className="h-5 w-5 text-primary" />
                                <h3 className="text-white font-medium">CalsYog AI</h3>
                            </div>
                            <button 
                                onClick={() => setIsOpen(false)}
                                className="text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, idx) => (
                                <div key={idx} className={cn("flex", msg.role === 'user' ? "justify-end" : "justify-start")}>
                                    <div className={cn(
                                        "max-w-[85%] rounded-2xl p-3 flex gap-3",
                                        msg.role === 'user' 
                                            ? "bg-primary text-black rounded-tr-sm" 
                                            : "bg-white/10 text-gray-200 rounded-tl-sm"
                                    )}>
                                        {msg.role === 'model' && <Bot className="h-4 w-4 mt-1 flex-shrink-0 text-primary" />}
                                        <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                            
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white/10 text-gray-200 rounded-2xl rounded-tl-sm p-3 flex items-center gap-2 max-w-[85%]">
                                        <Bot className="h-4 w-4 text-primary" />
                                        <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Area */}
                        <div className="p-4 bg-black/50 border-t border-white/10">
                            <form onSubmit={handleSend} className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask something..."
                                    disabled={isLoading}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                                />
                                <button
                                    type="submit"
                                    disabled={!input.trim() || isLoading}
                                    className="bg-primary text-black p-2.5 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
                                >
                                    <Send className="h-4 w-4" />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
