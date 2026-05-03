import { useState, useEffect } from 'react';
import { MapPin, ArrowRight, CheckCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import { SEO } from '../components/SEO';

type ServiceType = 'Calisthenics' | 'Yoga' | null;
type ClassMode = 'Online' | 'Offline';

export function Services() {
    const [selectedService, setSelectedService] = useState<ServiceType>(null);
    const [classMode, setClassMode] = useState<ClassMode>('Offline');
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });

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

        if (!selectedService) return;

        setIsSubmitting(true);
        try {
            await axios.post('/api/bookings', {
                serviceType: selectedService,
                classMode,
                name: formData.name,
                email: formData.email,
                phone: formData.phone
            });
            setIsSuccess(true);
            setFormData({ name: '', email: '', phone: '' });
            setSelectedService(null);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to submit booking. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="pt-32 pb-16 min-h-screen bg-background">
            <SEO 
                title="Book a Class - Calisthenics & Yoga Services" 
                description="Book your next online or offline Calisthenics and Yoga session with our expert trainers at CalsYog studios."
                canonical="/services" 
            />
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Sub-section */}
                <div className="text-center mb-16 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-playfair text-primary mb-6">Our Services</h1>
                    <p className="text-xl text-foreground/80 max-w-2xl mx-auto leading-relaxed">
                        Transform your mind and body. Select a discipline below to begin your journey with our expert instructors.
                    </p>
                </div>

                {isSuccess ? (
                    <div className="max-w-2xl mx-auto bg-green-500/10 border border-green-500/30 p-10 rounded-xl text-center animate-fade-in">
                        <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-6" />
                        <h2 className="text-3xl font-playfair text-green-400 mb-4">Request Submitted Successfully!</h2>
                        <p className="text-lg text-foreground/80 mb-8">
                            Thank you for booking with us. Our team will review your details and contact you shortly to confirm your schedule.
                        </p>
                        <button
                            onClick={() => setIsSuccess(false)}
                            className="py-3 px-8 bg-background border border-primary/30 text-primary hover:bg-primary/10 rounded-md transition-colors uppercase tracking-widest text-sm font-medium"
                        >
                            Book Another Session
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Service Selection */}
                        {!selectedService && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                                {/* Calisthenics Option */}
                                <div
                                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm p-8 hover:border-primary transition-colors flex flex-col items-center text-center"
                                    onClick={() => setSelectedService('Calisthenics')}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    <img src="/calis.png" alt="Calisthenics" className="w-32 h-32 object-contain mb-6 filter drop-shadow-lg" />
                                    <h2 className="text-3xl font-playfair text-primary mb-4">Calisthenics</h2>
                                    <p className="text-foreground/70 mb-8 flex-grow">
                                        Master your bodyweight. Build functional strength, explosive power, and extraordinary mobility from the ground up.
                                    </p>
                                    <span className="flex items-center gap-2 text-primary font-medium tracking-wide border-b border-primary pb-1 group-hover:gap-4 transition-all uppercase text-sm">
                                        Select Program <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>

                                {/* Yoga Option */}
                                <div
                                    className="group relative cursor-pointer overflow-hidden rounded-xl border border-primary/20 bg-background/50 backdrop-blur-sm p-8 hover:border-primary transition-colors flex flex-col items-center text-center"
                                    onClick={() => setSelectedService('Yoga')}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                                    <img src="/yogaa.png" alt="Yoga" className="w-32 h-32 object-contain mb-6 filter drop-shadow-lg" />
                                    <h2 className="text-3xl font-playfair text-primary mb-4">Yoga</h2>
                                    <p className="text-foreground/70 mb-8 flex-grow">
                                        Realign your mind and body. Enhance flexibility, find inner peace, and cultivate deep spiritual awareness.
                                    </p>
                                    <span className="flex items-center gap-2 text-primary font-medium tracking-wide border-b border-primary pb-1 group-hover:gap-4 transition-all uppercase text-sm">
                                        Select Program <ArrowRight className="h-4 w-4" />
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Booking Form */}
                        {selectedService && (
                            <div className="max-w-2xl mx-auto animate-fade-in">
                                <button
                                    onClick={() => setSelectedService(null)}
                                    className="mb-6 flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
                                >
                                    ← Back to Selection
                                </button>

                                <div className="bg-background/80 border border-primary/30 backdrop-blur-md p-8 md:p-10 rounded-xl shadow-2xl relative overflow-hidden">
                                    {/* Selected Service Badge */}
                                    <div className="absolute top-0 right-0 bg-primary/10 border-b border-l border-primary/20 px-6 py-2 rounded-bl-lg">
                                        <span className="font-playfair text-primary font-medium">{selectedService} Program</span>
                                    </div>

                                    <h2 className="text-3xl font-playfair text-white mb-2 pt-4">Complete Your Booking</h2>
                                    <p className="text-foreground/60 mb-8 border-b border-white/5 pb-6">Fill out your details below and we will get back to you to finalize your enrollment.</p>

                                    {error && <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-md text-sm">{error}</div>}

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        {/* Class Mode Toggle */}
                                        <div className="flex flex-col mb-8">
                                            <label className="text-sm font-medium text-foreground/80 mb-3 uppercase tracking-wide">Select Class Mode</label>
                                            <div className="flex bg-white/5 rounded-lg p-1 border border-primary/20">
                                                <button
                                                    type="button"
                                                    onClick={() => setClassMode('Online')}
                                                    className={`flex-1 py-3 text-sm font-medium transition-all rounded-md ${classMode === 'Online' ? 'bg-primary text-background shadow-md' : 'text-foreground/60 hover:text-white'}`}
                                                >
                                                    Online
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setClassMode('Offline')}
                                                    className={`flex-1 py-3 text-sm font-medium transition-all rounded-md ${classMode === 'Offline' ? 'bg-primary text-background shadow-md' : 'text-foreground/60 hover:text-white'}`}
                                                >
                                                    Offline (Studio)
                                                </button>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-foreground/80 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={formData.name}
                                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                    className="w-full px-4 py-3 bg-white/5 border border-primary/20 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors rounded-md"
                                                    placeholder="Enter your full name"
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground/80 mb-2">Email Address</label>
                                                    <input
                                                        type="email"
                                                        required
                                                        value={formData.email}
                                                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/5 border border-primary/20 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors rounded-md"
                                                        placeholder="you@email.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-foreground/80 mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        required
                                                        value={formData.phone}
                                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                        className="w-full px-4 py-3 bg-white/5 border border-primary/20 text-foreground placeholder:text-foreground/30 focus:border-primary focus:outline-none transition-colors rounded-md"
                                                        placeholder="+91 "
                                                    />
                                                </div>
                                            </div>
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
                                            {isSubmitting ? 'Submitting Request...' : (
                                                <span className="flex items-center justify-center gap-2">
                                                    Submit Booking Request <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                                </span>
                                            )}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Location Footer */}
                <div className="mt-24 pt-12 border-t border-white/5 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 border border-primary/10 rounded-xl p-8">
                        <div>
                            <h3 className="text-2xl font-playfair text-primary mb-3 flex items-center gap-3">
                                <MapPin className="h-6 w-6" />
                                Classes Available In
                            </h3>
                            <p className="text-foreground/70 max-w-xl">
                                We are actively conducting our offline training sessions across multiple premium locations in the Tri-City area. Contact us to find the studio closest to you.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-start md:justify-end max-w-lg">
                            {['Chandigarh', 'Zirakpur', 'Panchkula', 'Kharar', 'Mohali'].map((loc) => (
                                <span key={loc} className="px-5 py-2.5 bg-background border border-primary/20 rounded-full text-sm font-medium tracking-wide text-foreground/90 shadow-sm border-l-2 border-l-primary">
                                    {loc}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
