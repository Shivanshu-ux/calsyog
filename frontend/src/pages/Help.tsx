import { useState, useEffect } from 'react';
import { Mail, MessageSquare, AlertCircle, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';

export function Help() {
    const [formData, setFormData] = useState({ name: '', email: '', subject: '', description: '' });

    // Captcha State
    const [captchaConfig, setCaptchaConfig] = useState({ num1: 0, num2: 0, operator: '+' });
    const [captchaInput, setCaptchaInput] = useState('');
    const [captchaError, setCaptchaError] = useState('');

    // Status State
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const generateCaptcha = () => {
        const operators = ['+', '-'];
        const num1 = Math.floor(Math.random() * 10) + 5; // 5 to 14
        const num2 = Math.floor(Math.random() * 5) + 1; // 1 to 5
        const operator = operators[Math.floor(Math.random() * operators.length)];
        setCaptchaConfig({ num1, num2, operator });
        setCaptchaInput('');
        setCaptchaError('');
    };

    useEffect(() => {
        generateCaptcha();
    }, []);

    const validateCaptcha = () => {
        const { num1, num2, operator } = captchaConfig;
        const answer = operator === '+' ? num1 + num2 : num1 - num2;
        return parseInt(captchaInput) === answer;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!validateCaptcha()) {
            setCaptchaError('Incorrect math answer. Please try again.');
            generateCaptcha();
            return;
        }

        setIsSubmitting(true);
        try {
            await axios.post('/api/help', formData);
            setIsSuccess(true);
            setFormData({ name: '', email: '', subject: '', description: '' });
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit help request. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-32 pb-16 min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Sub-section */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-playfair text-primary mb-6">How Can We Help You?</h1>
                    <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                        Encountering an issue or have a question? Describe it below and our team will get back to you and resolve it as soon as possible.
                    </p>
                </div>

                {isSuccess ? (
                    <div className="max-w-2xl mx-auto bg-green-500/10 border border-green-500/30 p-10 rounded-xl text-center flex flex-col items-center animate-fade-in">
                        <CheckCircle className="h-16 w-16 text-green-400 mb-6" />
                        <h2 className="text-3xl font-playfair text-green-400 mb-4">Request Sent Successfully!</h2>
                        <p className="text-lg text-foreground/80 mb-8 max-w-lg">
                            Thank you for reaching out. We have received your message and will send an update to your email shortly.
                        </p>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="py-3 px-8 bg-background border border-primary/30 text-primary hover:bg-primary/10 rounded-md transition-colors uppercase tracking-widest text-sm font-medium"
                        >
                            Send Another Message
                        </button>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto bg-background/80 border border-primary/30 backdrop-blur-md p-8 md:p-12 rounded-xl shadow-2xl animate-fade-in relative overflow-hidden">
                        {/* Selected Service Badge */}
                        <div className="absolute top-0 right-0 bg-primary/10 border-b border-l border-primary/20 px-6 py-2 rounded-bl-lg flex items-center gap-2">
                            <MessageSquare className="h-4 w-4 text-primary" />
                            <span className="font-playfair text-primary font-medium">Support Ticket</span>
                        </div>

                        <h2 className="text-3xl font-playfair text-white mb-2 pt-4">Submit a Problem</h2>
                        <p className="text-foreground/60 mb-8 border-b border-white/5 pb-6">Please provide as much detail as possible so we can assist you better.</p>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-500 rounded-md text-sm flex items-center gap-3">
                                <AlertCircle className="h-5 w-5 shrink-0" />
                                <p>{error}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-primary/20 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors rounded-md"
                                        placeholder="Your full name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-foreground/80 mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 bg-white/5 border border-primary/20 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors rounded-md"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-primary/20 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors rounded-md"
                                    placeholder="Brief summary of the issue (e.g., Payment failed, Login issue)"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-foreground/80 mb-2">Problem Description</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-primary/20 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors rounded-md resize-none"
                                    placeholder="Please describe exactly what happened or what you need help with in detail..."
                                />
                            </div>

                            {/* Captcha */}
                            <div className="pt-4 mt-2 border-t border-white/5">
                                <label className="block text-sm font-medium text-foreground/80 mb-3">Security Check</label>
                                <div className="flex flex-wrap sm:flex-nowrap items-center gap-4">
                                    <div className="flex items-center bg-white/5 border border-primary/20 rounded-md px-4 py-3 select-none">
                                        <span className="text-xl font-bold tracking-widest font-mono text-primary mr-3">
                                            {captchaConfig.num1} {captchaConfig.operator} {captchaConfig.num2} =
                                        </span>
                                        <input
                                            type="number"
                                            required
                                            value={captchaInput}
                                            onChange={e => setCaptchaInput(e.target.value)}
                                            className="w-20 bg-transparent border-b border-primary/50 text-white font-mono text-xl focus:border-primary focus:outline-none text-center"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateCaptcha}
                                        className="p-3 border border-primary/20 text-foreground/60 hover:text-primary hover:border-primary/50 rounded-md transition-colors"
                                        title="Get a new math problem"
                                    >
                                        <RefreshCw className="h-5 w-5" />
                                    </button>
                                </div>
                                {captchaError && <p className="text-red-400 text-sm mt-3 animate-pulse">{captchaError}</p>}
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full mt-6 py-4 px-6 border border-transparent text-sm font-bold text-background bg-primary hover:bg-primary/90 transition-all uppercase tracking-widest rounded-md focus:ring-2 focus:ring-offset-2 focus:ring-offset-background focus:ring-primary disabled:opacity-70 disabled:cursor-not-allowed group"
                            >
                                {isSubmitting ? 'Sending...' : (
                                    <span className="flex items-center justify-center gap-2">
                                        Submit Request <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                )}
                            </button>
                        </form>
                    </div>
                )}

                {/* Contact Alternatives */}
                <div className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center animate-fade-in-up md:px-12" style={{ animationDelay: '0.2s' }}>
                    <h3 className="text-xl font-playfair text-primary mb-6">Other ways to reach us</h3>
                    <div className="flex items-center gap-4 bg-primary/5 border border-primary/10 rounded-full py-3 px-8">
                        <Mail className="h-5 w-5 text-primary" />
                        <span className="text-foreground/80 font-medium">calsyog@gmail.com</span>
                    </div>
                </div>

            </div>
        </div>
    );
}
