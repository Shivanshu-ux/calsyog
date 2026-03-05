import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

export const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/auth/register', { name, email, password });
            login(data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registration failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const { data } = await axios.post('/api/auth/external-login', {
                token: credentialResponse.credential,
            });
            login(data);
            navigate('/');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Google Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="max-w-md w-full space-y-8 p-8 border border-primary/20 bg-background/50 backdrop-blur-sm rounded-lg">
                <div className="text-center">
                    <h2 className="text-3xl font-playfair text-primary">Create an Account</h2>
                    <p className="mt-2 text-sm text-foreground/60">
                        Join the world of luxury
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    {error && <div className="text-red-500 text-sm text-center">{error}</div>}
                    <div className="space-y-4">
                        <div>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 bg-transparent border border-primary/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                placeholder="Full Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-transparent border border-primary/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                placeholder="Email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-transparent border border-primary/30 text-foreground placeholder-foreground/50 focus:outline-none focus:border-primary transition-colors"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-background bg-primary hover:bg-primary/90 transition-colors"
                        >
                            Sign up
                        </button>
                    </div>
                </form>

                <div className="mt-6 flex flex-col items-center gap-4">
                    <div className="relative w-full">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-primary/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-background text-foreground/60">Or continue with</span>
                        </div>
                    </div>

                    <GoogleLogin
                        onSuccess={handleGoogleSuccess}
                        onError={() => setError('Google Registration Failed')}
                        theme="filled_black"
                    />
                </div>

                <p className="mt-2 text-center text-sm text-foreground/60">
                    Already a member?{' '}
                    <Link to="/login" className="font-medium text-primary hover:text-primary/80 transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};
