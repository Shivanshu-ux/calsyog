import { Instagram, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Footer() {
    return (
        <footer id="contact" className="bg-background border-t border-white/5 py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <img src="/d.png" alt="CALSYOG" className="h-32 w-auto mb-8" />

                <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-12">
                    <Link to="/about" className="text-sm font-medium text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">About Us</Link>
                    <Link to="/help" className="text-sm font-medium text-gray-400 hover:text-primary uppercase tracking-widest transition-colors">Help</Link>
                </div>

                <div className="flex gap-6 mb-12">
                    <a href="https://www.instagram.com/calsyog/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors"><Instagram className="h-5 w-5" /></a>
                    <a href="mailto:calsyog@gmail.com" className="text-gray-500 hover:text-primary transition-colors"><Mail className="h-5 w-5" /></a>
                </div>

                <p className="text-xs text-gray-600 mb-8">
                    © {new Date().getFullYear()} Calsyog. All rights reserved.
                </p>

            </div>
        </footer>
    );
}
