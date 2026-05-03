import { ShoppingBag, User as UserIcon, LogOut, ShieldAlert, MessageSquare, Bell } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { Cart } from './Cart';

interface Notification {
    _id: string;
    message: string;
    isRead: boolean;
    relatedId: string;
    onModel: string;
    createdAt: string;
}

export function Navbar() {
export function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const { user, logout } = useAuth();
    const { cartCount } = useCart();
    const location = useLocation();
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        if (!user) return;
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get('/api/notifications', config);
            setNotifications(data);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        if (user) {
            fetchNotifications();
            // Poll for notifications every minute
            const interval = setInterval(fetchNotifications, 60000);
            return () => clearInterval(interval);
        } else {
            setNotifications([]);
        }
    }, [user]);

    const handleNotificationClick = async (notification: Notification) => {
        try {
            // Mark as read
            if (!notification.isRead) {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                await axios.put(`/api/notifications/${notification._id}/read`, {}, config);
                setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, isRead: true } : n));
            }
            setIsNotificationsOpen(false);

            // Redirect based on type
            if (user?.isAdmin) {
                navigate('/admin'); // Admins go to admin dashboard
            } else {
                if (notification.onModel === 'HelpRequest') navigate('/my-tickets');
                else if (notification.onModel === 'Order') navigate('/profile');
                else if (notification.onModel === 'ServiceBooking') navigate('/profile'); // Assuming profile will house bookings
            }
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    return (
        <nav className={cn(
            "fixed w-full z-50 transition-all duration-300",
            scrolled ? "bg-background/90 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center md:justify-between w-full">
                    <div className="flex-shrink-0 flex items-center justify-center md:justify-start">
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

                                {/* Notifications Dropdown Desktop */}
                                <div className="relative">
                                    <button
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                        className="text-sm font-medium text-gray-300 hover:text-primary transition-colors flex items-center gap-1 relative"
                                    >
                                        <Bell className="h-4 w-4" />
                                        {unreadCount > 0 && (
                                            <span className="absolute -top-2 -right-2 bg-primary text-black text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>

                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-[#111] border border-white/10 rounded-xl shadow-2xl py-2 z-50 overflow-hidden">
                                            <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                                                <h3 className="text-white font-medium">Notifications</h3>
                                            </div>
                                            <div className="max-h-80 overflow-y-auto">
                                                {notifications.length === 0 ? (
                                                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                                        No new notifications
                                                    </div>
                                                ) : (
                                                    notifications.map(notification => (
                                                        <div
                                                            key={notification._id}
                                                            onClick={() => handleNotificationClick(notification)}
                                                            className={cn(
                                                                "px-4 py-3 hover:bg-white/5 cursor-pointer transition-colors border-b border-white/5 last:border-0",
                                                                !notification.isRead && "bg-primary/5"
                                                            )}
                                                        >
                                                            <div className="flex justify-between items-start gap-2">
                                                                <p className={cn("text-sm", !notification.isRead ? "text-white font-medium" : "text-gray-400")}>
                                                                    {notification.message}
                                                                </p>
                                                                {!notification.isRead && <span className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />}
                                                            </div>
                                                            <p className="text-xs text-gray-600 mt-1">
                                                                {new Date(notification.createdAt).toLocaleDateString()}
                                                            </p>
                                                        </div>
                                                    ))
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

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

                    </div>
                </div>
            </div>

            {/* Cart Sidebar */}
            <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
        </nav>
    );
}
