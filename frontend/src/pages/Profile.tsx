import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Package, Truck, CheckCircle, Clock, MapPin, MessageSquare, X as CloseIcon, Send, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SEO } from '../components/SEO';

interface Reply {
    sender: string;
    message: string;
    createdAt: string;
    _id?: string;
}

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
    replies?: Reply[];
}

interface ServiceBooking {
    _id: string;
    serviceType: string;
    classMode: string;
    name: string;
    email: string;
    phone: string;
    isContacted: boolean;
    createdAt: string;
    replies?: Reply[];
}

export function Profile() {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [bookings, setBookings] = useState<ServiceBooking[]>([]);
    const [loading, setLoading] = useState(true);

    // Chat modal state
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [selectedBooking, setSelectedBooking] = useState<ServiceBooking | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [submitReplyType, setSubmitReplyType] = useState<'order' | 'booking' | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const config = {
                    headers: {
                        Authorization: `Bearer ${user?.token}`,
                    },
                };

                // Fetch Orders
                const { data: ordersData } = await axios.get('/api/orders/myorders', config);
                setOrders(ordersData);

                // Fetch Bookings (We'll assume user can fetch their own bookings by matching email or a new endpoint.
                // Wait, there is no /mybookings endpoint currently. 
                // Let's create one or just use /api/bookings?email=... if admin endpoint allows it.
                // Since this was not added in the backend, I need to add that route to bookings.js!)
                const { data: bookingsData } = await axios.get('/api/bookings/mybookings', config);
                setBookings(bookingsData);

            } catch (error) {
                console.error('Failed to fetch data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user]);

    const handleSendOrderReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedOrder || !user) return;

        setSubmitReplyType('order');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/orders/${selectedOrder._id}/reply`, { message: replyMessage }, config);

            setOrders(prev => prev.map(o => o._id === data._id ? data : o));
            setSelectedOrder(data);
            setReplyMessage('');
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSubmitReplyType(null);
        }
    };

    const handleSendBookingReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedBooking || !user) return;

        setSubmitReplyType('booking');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/bookings/${selectedBooking._id}/reply`, { message: replyMessage }, config);

            setBookings(prev => prev.map(b => b._id === data._id ? data : b));
            setSelectedBooking(data);
            setReplyMessage('');
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSubmitReplyType(null);
        }
    };

    if (!user) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Please login to view profile.</div>;
    if (loading) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Loading your history...</div>;

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-12">
            <SEO title="Your Profile" noindex={true} />
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

                {/* --- Orders Section --- */}
                <h2 className="text-2xl font-serif text-white mb-6">Order History</h2>
                {orders.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl mb-12">
                        <Package className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-400 font-serif">You have no orders yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6 mb-12">
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
                                        <button
                                            onClick={() => { setSelectedOrder(order); setReplyMessage(''); }}
                                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                                        >
                                            <MessageSquare className="h-3 w-3" />
                                            Chat ({order.replies?.length || 0})
                                        </button>
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

                {/* --- Service Bookings Section --- */}
                <h2 className="text-2xl font-serif text-white mb-6">Service Bookings</h2>
                {bookings.length === 0 ? (
                    <div className="text-center py-12 bg-white/5 border border-white/10 rounded-xl mb-12">
                        <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-xl text-gray-400 font-serif">You have no service bookings yet.</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {bookings.map((booking, index) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                key={booking._id}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-white">{booking.serviceType} - {booking.classMode} Class</h3>
                                        <p className="text-sm text-gray-500 mt-1">Booked on {new Date(booking.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 ${booking.isContacted ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'}`}>
                                            {booking.isContacted ? <CheckCircle className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
                                            {booking.isContacted ? 'Contacted' : 'Pending Contact'}
                                        </span>
                                        <button
                                            onClick={() => { setSelectedBooking(booking); setReplyMessage(''); }}
                                            className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-1 bg-white/10 text-white border border-white/20 hover:bg-white/20 transition-colors"
                                        >
                                            <MessageSquare className="h-3 w-3" />
                                            Chat ({booking.replies?.length || 0})
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Order Chat Modal */}
            <AnimatePresence>
                {selectedOrder && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                                <h3 className="text-lg font-medium text-white">Order #{selectedOrder._id.substring(0, 8)} Chat</h3>
                                <button onClick={() => setSelectedOrder(null)} className="text-gray-400 hover:text-white transition-colors">
                                    <CloseIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {(selectedOrder.replies || []).length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">No messages yet. Send a message to start chatting about your order.</div>
                                ) : (
                                    (selectedOrder.replies || []).map((reply, idx) => (
                                        <div key={idx} className={`flex ${reply.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${reply.sender === 'user' ? 'bg-primary text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                                                <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                                <p className={`text-[10px] mt-1 text-right ${reply.sender === 'user' ? 'text-black/70' : 'text-gray-400'}`}>
                                                    {new Date(reply.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/50">
                                <form onSubmit={handleSendOrderReply} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!replyMessage.trim() || submitReplyType === 'order'}
                                        className="bg-primary text-black p-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Booking Chat Modal */}
            <AnimatePresence>
                {selectedBooking && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                                <h3 className="text-lg font-medium text-white">Booking: {selectedBooking.serviceType} Chat</h3>
                                <button onClick={() => setSelectedBooking(null)} className="text-gray-400 hover:text-white transition-colors">
                                    <CloseIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {(selectedBooking.replies || []).length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">No messages yet. Ask a question about your booking.</div>
                                ) : (
                                    (selectedBooking.replies || []).map((reply, idx) => (
                                        <div key={idx} className={`flex ${reply.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${reply.sender === 'user' ? 'bg-primary text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                                                <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                                <p className={`text-[10px] mt-1 text-right ${reply.sender === 'user' ? 'text-black/70' : 'text-gray-400'}`}>
                                                    {new Date(reply.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="p-4 border-t border-white/10 bg-black/50">
                                <form onSubmit={handleSendBookingReply} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={replyMessage}
                                        onChange={(e) => setReplyMessage(e.target.value)}
                                        placeholder="Type your message..."
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!replyMessage.trim() || submitReplyType === 'booking'}
                                        className="bg-primary text-black p-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center justify-center shrink-0"
                                    >
                                        <Send className="h-5 w-5" />
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
