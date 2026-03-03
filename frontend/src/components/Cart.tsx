import { X, Trash2, ShoppingBag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { cn } from '../lib/utils';
import { Link, useNavigate } from 'react-router-dom';

interface CartProps {
    isOpen: boolean;
    onClose: () => void;
}

export function Cart({ isOpen, onClose }: CartProps) {
    const { user } = useAuth();
    const { cartItems: items, removeFromCart } = useCart();
    const navigate = useNavigate();

    const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div className={cn(
                "fixed inset-y-0 right-0 w-full md:w-[400px] bg-[#0a0a0a] border-l border-white/10 z-50 transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl",
                isOpen ? "translate-x-0" : "translate-x-full"
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <ShoppingBag className="h-6 w-6 text-primary" />
                        <h2 className="text-xl font-serif text-white uppercase tracking-widest">Your Cart</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-full hover:bg-white/5 transition-colors text-gray-400 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {!user ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <ShoppingBag className="h-12 w-12 text-gray-600 mb-2" />
                            <p className="text-gray-400">Please login to view your cart.</p>
                            <Link
                                to="/login"
                                onClick={onClose}
                                className="px-6 py-2 bg-primary text-black font-bold uppercase tracking-wider text-sm hover:bg-primary/90 transition-colors"
                            >
                                Login Now
                            </Link>
                        </div>
                    ) : items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                            <ShoppingBag className="h-12 w-12 text-gray-600 mb-2" />
                            <p className="text-gray-400 text-lg">Your cart is empty.</p>
                            <a
                                href="/#products"
                                onClick={onClose}
                                className="text-primary hover:text-white transition-colors underline underline-offset-4"
                            >
                                Continue Shopping
                            </a>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {items.map((item) => (
                                <div key={item._id} className="flex gap-4 p-4 bg-white/5 rounded-lg border border-white/5">
                                    <div className="h-24 w-24 bg-black rounded-md overflow-hidden flex-shrink-0">
                                        <img
                                            src={item.image || '/placeholder.png'}
                                            alt={item.name}
                                            className="h-full w-full object-cover opacity-80"
                                        />
                                    </div>
                                    <div className="flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-white font-medium line-clamp-1">{item.name}</h3>
                                            <p className="text-primary mt-1">₹{item.price.toLocaleString('en-IN')}</p>
                                        </div>
                                        <div className="flex items-center justify-between mt-2">
                                            <span className="text-sm text-gray-400">Qty: {item.quantity}</span>
                                            <button
                                                onClick={() => removeFromCart(item.productId)}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-1"
                                                title="Remove Item"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {user && items.length > 0 && (
                    <div className="p-6 border-t border-white/10 bg-black/50">
                        <div className="flex justify-between items-center mb-6">
                            <span className="text-gray-400 font-medium">Subtotal</span>
                            <span className="text-2xl font-serif text-white">₹{total.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                            onClick={() => {
                                onClose();
                                navigate('/checkout');
                            }}
                            className="w-full py-4 bg-primary text-black font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}
