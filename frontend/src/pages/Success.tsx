import { CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Success() {
    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center py-24 px-4">
            <div className="max-w-md w-full bg-white/5 border border-white/10 rounded-2xl p-8 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                </div>

                <h1 className="text-3xl font-serif text-white mb-4">Order Confirmed</h1>
                <p className="text-gray-400 mb-8">
                    Thank you for your purchase. We've received your order and are preparing it for absolute perfection. A confirmation email has been sent to you.
                </p>

                <div className="space-y-4">
                    <Link
                        to="/"
                        className="w-full block py-4 bg-primary text-black font-bold uppercase tracking-widest hover:bg-primary/90 transition-all"
                    >
                        Return Home
                    </Link>
                    <Link
                        to="/#products"
                        className="w-full block py-4 bg-transparent text-white border border-white/20 font-bold uppercase tracking-widest hover:border-primary transition-all"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}
