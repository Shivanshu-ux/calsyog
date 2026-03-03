import { ShoppingBag, Menu, X, User as UserIcon, LogOut, ShieldAlert, MessageSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { Cart } from './Cart';

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            "fixed w-full z-50 transition-all duration-300",
            scrolled ? "bg-background/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between">
                    <div className="flex-shrink-0">
                        <Link to="/">
                            <img src="/d.png" alt="CALSYOG" className="h-16 w-auto" />
                        </Link>
                    </div>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-12">
                            <a href="/" className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide uppercase">Home</a>
                            <Link to="/services" className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide uppercase">Services</Link>
                            <Link to="/products" className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide uppercase">Products</Link>
                            <Link to="/help" className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide uppercase">Help</Link>
                            <a href="#contact" className="text-sm font-medium text-foreground hover:text-primary transition-colors tracking-wide uppercase">Contact</a>
                        </div>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        {user ? (
                            <div className="flex items-center space-x-4">
                                {user.isAdmin && (
                                    <Link to="/admin" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                        <ShieldAlert className="h-4 w-4" /> Admin
                                    </Link>
                                )}
                                <Link to="/profile" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <UserIcon className="h-4 w-4" /> Profile
                                </Link>
                                <Link to="/my-tickets" className="text-sm font-medium text-gray-300 hover:text-primary transition-colors flex items-center gap-1">
                                    <MessageSquare className="h-4 w-4" /> Tickets
                                </Link>
                                <button
                                    onClick={logout}
                                    className="text-sm font-medium text-gray-300 hover:text-primary transition-colors flex items-center gap-1"
                                >
                                    <LogOut className="h-4 w-4" /> Logout
                                </button>
                            </div>
                        ) : (
                            <Link to="/login" className="text-foreground hover:text-primary transition-colors">
                                <UserIcon className="h-5 w-5" />
                            </Link>
                        )}
                        {location.pathname === '/products' && (
                            <button
                                onClick={() => setIsCartOpen(true)}
                                className="p-2 rounded-full border border-primary/20 hover:border-primary hover:bg-primary/10 transition-all group relative"
                            >
                                <ShoppingBag className="h-5 w-5 text-primary group-hover:scale-105 transition-transform" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary text-black font-bold text-[10px] rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                    </div>

                    <div className="flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-foreground hover:text-primary transition-colors"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-b border-white/5 absolute w-full">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col items-center py-8">
                        <a href="/" onClick={() => setIsOpen(false)} className="text-foreground hover:text-primary block px-3 py-4 text-base font-medium uppercase tracking-widest border-b border-white/5 w-full text-center">Home</a>
                        <Link to="/services" onClick={() => setIsOpen(false)} className="text-foreground hover:text-primary block px-3 py-4 text-base font-medium uppercase tracking-widest border-b border-white/5 w-full text-center">Services</Link>
                        <Link to="/products" onClick={() => setIsOpen(false)} className="text-foreground hover:text-primary block px-3 py-4 text-base font-medium uppercase tracking-widest border-b border-white/5 w-full text-center">Products</Link>
                        <Link to="/help" onClick={() => setIsOpen(false)} className="text-foreground hover:text-primary block px-3 py-4 text-base font-medium uppercase tracking-widest border-b border-white/5 w-full text-center">Help</Link>
                        <a href="#contact" onClick={() => setIsOpen(false)} className="text-foreground hover:text-primary block px-3 py-4 text-base font-medium uppercase tracking-widest border-b border-white/5 w-full text-center">Contact</a>
                        {user ? (
                            <>
                                <Link to="/my-tickets" onClick={() => setIsOpen(false)} className="text-foreground hover:text-primary flex items-center justify-center space-x-2 px-3 py-4 text-base font-medium uppercase tracking-widest w-full text-center">
                                    <MessageSquare className="h-5 w-5" />
                                    <span>Tickets</span>
                                </Link>
                                <button onClick={() => { logout(); setIsOpen(false); }} className="text-foreground hover:text-primary flex items-center justify-center space-x-2 px-3 py-4 text-base font-medium uppercase tracking-widest w-full text-center border-t border-white/5">
                                    <LogOut className="h-5 w-5" />
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <Link to="/login" onClick={() => setIsOpen(false)} className="text-foreground hover:text-primary flex items-center justify-center space-x-2 px-3 py-4 text-base font-medium uppercase tracking-widest w-full text-center">
                                <UserIcon className="h-5 w-5" />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            )}

            {/* Cart Sidebar */}
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
}
