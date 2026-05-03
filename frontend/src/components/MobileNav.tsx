import { Home, ShoppingBag, Grid, HelpCircle, User } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';

export function MobileNav() {
    const location = useLocation();
    const { user } = useAuth();
    const { cartCount } = useCart();

    const navItems = [
        { name: 'Home', path: '/', icon: Home },
        { name: 'Services', path: '/services', icon: Grid },
        { name: 'Products', path: '/products', icon: ShoppingBag, hasBadge: true },
        { name: 'Help', path: '/help', icon: HelpCircle },
        { name: 'Profile', path: user ? '/profile' : '/login', icon: User },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-white/10 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            className="relative flex flex-col items-center justify-center w-full h-full space-y-1 group"
                        >
                            <div className={cn(
                                "p-1.5 rounded-full transition-all duration-300",
                                isActive ? "bg-primary/20 text-primary" : "text-gray-400 group-hover:text-gray-200"
                            )}>
                                <Icon className="h-5 w-5" />
                            </div>
                            
                            {item.hasBadge && cartCount > 0 && (
                                <span className="absolute top-1 right-1/2 translate-x-3 bg-primary text-black font-bold text-[9px] rounded-full h-4 w-4 flex items-center justify-center animate-in zoom-in border border-background">
                                    {cartCount}
                                </span>
                            )}
                            
                            <span className={cn(
                                "text-[10px] font-medium transition-colors",
                                isActive ? "text-primary" : "text-gray-400"
                            )}>
                                {item.name}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
