import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    _id: string;
}

interface Order {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    orderItems: OrderItem[];
    paymentMethod: string;
    trackingNumber?: string;
    trackingUrl?: string;
}

export function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };
                const { data } = await axios.get('/api/orders/myorders', config);
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyOrders();
        }
    }, [user]);

    if (!user) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Please login to view profile.</div>;
    if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading your history...</div>;

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12 border-b border-white/10 pb-8"
                >
                    <h1 className="text-4xl font-serif text-white mb-2">My Profile</h1>
                    <p className="text-gray-400">Welcome back, {user.name}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                </motion.div>

                <h2 className="text-2xl font-serif text-white mb-6">Order History</h2>

                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl">
                        <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-400 font-serif">You have no orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={order._id}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/10">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">Order #{order._id}</p>
                                        <p className="text-sm text-gray-400">Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${order.isPaid ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                            {order.isPaid ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {order.isPaid ? 'Paid via ' + order.paymentMethod : 'Payment Pending'}
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${order.isDelivered ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'}`}>
                                            {order.isDelivered ? <CheckCircle className="h-3 w-3" /> : <Truck className="h-3 w-3" />}
                                            {order.isDelivered ? 'Delivered' : 'Processing Validation'}
                                        </span>
                                        {order.trackingNumber && (
                                            <a
                                                href={order.trackingUrl || '#'}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition-colors"
                                            >
                                                <MapPin className="h-3 w-3" />
                                                Track: {order.trackingNumber}
                                            </a>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {order.orderItems.map(item => (
                                        <div key={item._id} className="flex items-center gap-4">
                                            <div className="h-16 w-16 bg-black rounded-md overflow-hidden flex-shrink-0">
                                                <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-80" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-white text-sm">{item.name}</h3>
                                                <p className="text-gray-500 text-sm">Qty: {item.qty}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-primary tracking-wide">₹{(item.price * item.qty).toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-6 border-t border-white/10 flex justify-end">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-400 mb-1">Total Amount</p>
                                        <p className="text-2xl font-serif text-primary">₹{order.totalPrice.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
