import { useState, useEffect } from 'react';
import axios from 'axios';
import { SEO } from '../components/SEO';
import { useAuth } from '../context/AuthContext';
import { Truck, CheckCircle, Package, MessageSquare, X as CloseIcon, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TicketChat } from '../components/TicketChat';
import type { Reply as TicketReply } from '../components/TicketChat';

interface Reply {
    sender: string;
    message: string;
    createdAt: string;
    _id?: string;
}

interface Order {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    trackingNumber?: string;
    trackingUrl?: string;
    replies?: Reply[];
    user: {
        name: string;
        email: string;
    };
}

interface Booking {
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

interface HelpRequest {
    _id: string;
    name: string;
    email: string;
    subject: string;
    description: string;
    isResolved: boolean;
    createdAt: string;
    replies: TicketReply[];
}

export function Admin() {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'orders' | 'bookings' | 'help'>('orders');

    // Orders State
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);
    const [deliveringId, setDeliveringId] = useState<string | null>(null);
    const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
    const [trackingInput, setTrackingInput] = useState({ number: '', url: '' });
    const [savingTracking, setSavingTracking] = useState(false);

    // Bookings State
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(true);

    // Help Requests State
    const [helpRequests, setHelpRequests] = useState<HelpRequest[]>([]);
    const [loadingHelp, setLoadingHelp] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    // Chat states
    const [selectedOrderChat, setSelectedOrderChat] = useState<Order | null>(null);
    const [selectedBookingChat, setSelectedBookingChat] = useState<Booking | null>(null);
    const [replyMessage, setReplyMessage] = useState('');
    const [submitReplyType, setSubmitReplyType] = useState<'order' | 'booking' | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const { data } = await axios.get('/api/orders', config);
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch all orders:', error);
            } finally {
                setLoadingOrders(false);
            }
        };

        const fetchBookings = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const { data } = await axios.get('/api/bookings', config);
                setBookings(data);
            } catch (error) {
                console.error('Failed to fetch bookings:', error);
            } finally {
                setLoadingBookings(false);
            }
        };

        const fetchHelpRequests = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const { data } = await axios.get('/api/help', config);
                setHelpRequests(data);
            } catch (error) {
                console.error('Failed to fetch help requests:', error);
            } finally {
                setLoadingHelp(false);
            }
        };

        if (user && user.isAdmin) {
            fetchOrders();
            fetchBookings();
            fetchHelpRequests();
        } else {
            console.error('Not authorized as admin');
            setLoadingOrders(false);
            setLoadingBookings(false);
            setLoadingHelp(false);
        }
    }, [user]);

    const deliverHandler = async (orderId: string) => {
        setDeliveringId(orderId);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            await axios.put(`/api/orders/${orderId}/deliver`, {}, config);

            // Update local state
            setOrders(orders.map(o => o._id === orderId ? { ...o, isDelivered: true } : o));
        } catch (error) {
            console.error('Failed to deliver order', error);
            alert('Failed to mark as delivered');
        } finally {
            setDeliveringId(null);
        }
    };

    const saveTrackingHandler = async (orderId: string) => {
        setSavingTracking(true);
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user?.token}`,
                },
            };
            await axios.put(`/api/orders/${orderId}/tracking`, {
                trackingNumber: trackingInput.number,
                trackingUrl: trackingInput.url
            }, config);

            // Update local state
            setOrders(orders.map(o => o._id === orderId ? { ...o, trackingNumber: trackingInput.number, trackingUrl: trackingInput.url } : o));
            setEditingTrackingId(null);
        } catch (error) {
            console.error('Failed to update tracking', error);
            alert('Failed to update tracking');
        } finally {
            setSavingTracking(false);
        }
    };

    const toggleContactStatus = async (bookingId: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.put(`/api/bookings/${bookingId}/contacted`, {}, config);
            setBookings(bookings.map(b => b._id === bookingId ? { ...b, isContacted: !b.isContacted } : b));
        } catch (error) {
            console.error('Failed to update contact status', error);
            alert('Failed to update booking status');
        }
    };

    const toggleHelpStatus = async (helpId: string) => {
        try {
            const config = { headers: { Authorization: `Bearer ${user?.token}` } };
            await axios.put(`/api/help/${helpId}/resolve`, {}, config);
            setHelpRequests(helpRequests.map(h => h._id === helpId ? { ...h, isResolved: !h.isResolved } : h));
        } catch (error) {
            console.error('Failed to update help request status', error);
            alert('Failed to update help request status');
        }
    };

    const handleSendOrderReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedOrderChat || !user) return;

        setSubmitReplyType('order');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/orders/${selectedOrderChat._id}/reply`, { message: replyMessage }, config);

            setOrders(orders.map(o => o._id === data._id ? data : o));
            setSelectedOrderChat(data);
            setReplyMessage('');
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSubmitReplyType(null);
        }
    };

    const handleSendBookingReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMessage.trim() || !selectedBookingChat || !user) return;

        setSubmitReplyType('booking');
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/bookings/${selectedBookingChat._id}/reply`, { message: replyMessage }, config);

            setBookings(bookings.map(b => b._id === data._id ? data : b));
            setSelectedBookingChat(data);
            setReplyMessage('');
        } catch (error) {
            console.error('Failed to send reply:', error);
        } finally {
            setSubmitReplyType(null);
        }
    };

    if (!user || !user.isAdmin) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center">Access Denied. Admins Only.</div>;
    if (loadingOrders || loadingBookings || loadingHelp) return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center mb-10">Loading Platform Data...</div>;

    const totalRevenue = orders.reduce((sum, order) => sum + (order.isPaid ? order.totalPrice : 0), 0);

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-12">
            <SEO title="Admin Dashboard" noindex={true} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-12 flex justify-between items-end border-b border-white/10 pb-8">
                    <div>
                        <h1 className="text-4xl font-serif text-white mb-2">Platform Administration</h1>
                        <p className="text-gray-400">Manage all customer orders in one place.</p>
                    </div>
                    <div className="text-right">
                        <p className="text-sm text-gray-500 uppercase tracking-widest">Total Sales Revenue</p>
                        <p className="text-3xl font-serif text-primary mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
                    </div>
                </div>

                <div className="mb-10 flex border-b border-white/10">
                    <button
                        onClick={() => setActiveTab('orders')}
                        className={`px-6 py-3 font-medium text-sm tracking-widest uppercase transition-colors ${activeTab === 'orders' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
                    >
                        Store Orders
                    </button>
                    <button
                        onClick={() => setActiveTab('bookings')}
                        className={`px-6 py-3 font-medium text-sm tracking-widest uppercase transition-colors ${activeTab === 'bookings' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
                    >
                        Service Bookings
                    </button>
                    <button
                        onClick={() => setActiveTab('help')}
                        className={`px-6 py-3 font-medium text-sm tracking-widest uppercase transition-colors flex items-center gap-2 ${activeTab === 'help' ? 'text-primary border-b-2 border-primary' : 'text-gray-500 hover:text-white'}`}
                    >
                        <MessageSquare className="h-4 w-4" /> Help/Complaints
                    </button>
                </div>

                <div className="bg-white/5 border border-white/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        {activeTab === 'orders' && (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="text-xs uppercase bg-black/50 text-gray-400 border-b border-white/10">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Order ID</th>
                                        <th scope="col" className="px-6 py-4">Customer</th>
                                        <th scope="col" className="px-6 py-4">Date</th>
                                        <th scope="col" className="px-6 py-4 text-right">Total</th>
                                        <th scope="col" className="px-6 py-4 text-center">Paid</th>
                                        <th scope="col" className="px-6 py-4 text-center">Delivered</th>
                                        <th scope="col" className="px-6 py-4 text-center">Tracking</th>
                                        <th scope="col" className="px-6 py-4 text-center w-48">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {orders.map(order => (
                                        <tr key={order._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 font-mono text-xs">{order._id.substring(18)}</td>
                                            <td className="px-6 py-4 text-white">
                                                {order.user?.name || 'Unknown'} <br />
                                                <span className="text-xs text-gray-500">{order.user?.email}</span>
                                            </td>
                                            <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-right text-primary font-medium">₹{order.totalPrice.toLocaleString('en-IN')}</td>

                                            <td className="px-6 py-4 text-center">
                                                {order.isPaid ? (
                                                    <CheckCircle className="h-4 w-4 text-green-500 mx-auto" />
                                                ) : (
                                                    <span className="text-red-500 text-xs font-bold w-4 h-4 mx-auto block">X</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                {order.isDelivered ? (
                                                    <CheckCircle className="h-4 w-4 text-blue-400 mx-auto" />
                                                ) : (
                                                    <span className="text-yellow-500 text-xs font-bold w-4 h-4 mx-auto block">-</span>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center">
                                                {editingTrackingId === order._id ? (
                                                    <div className="flex flex-col gap-2">
                                                        <input
                                                            type="text"
                                                            placeholder="Tracking #"
                                                            value={trackingInput.number}
                                                            onChange={(e) => setTrackingInput({ ...trackingInput, number: e.target.value })}
                                                            className="bg-black border border-white/20 px-2 py-1 text-xs rounded text-white"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="URL"
                                                            value={trackingInput.url}
                                                            onChange={(e) => setTrackingInput({ ...trackingInput, url: e.target.value })}
                                                            className="bg-black border border-white/20 px-2 py-1 text-xs rounded text-white"
                                                        />
                                                        <div className="flex gap-2 justify-center mt-1">
                                                            <button
                                                                onClick={() => saveTrackingHandler(order._id)}
                                                                disabled={savingTracking}
                                                                className="text-green-500 text-[10px] uppercase font-bold tracking-wider hover:text-green-400"
                                                            >
                                                                {savingTracking ? '...' : 'Save'}
                                                            </button>
                                                            <button
                                                                onClick={() => setEditingTrackingId(null)}
                                                                className="text-gray-500 text-[10px] uppercase font-bold tracking-wider hover:text-gray-300"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="flex flex-col items-center">
                                                        {order.trackingNumber ? (
                                                            <a
                                                                href={order.trackingUrl || '#'}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-xs text-primary hover:underline font-mono"
                                                            >
                                                                {order.trackingNumber}
                                                            </a>
                                                        ) : (
                                                            <span className="text-xs text-gray-600 italic">No tracking</span>
                                                        )}
                                                        <button
                                                            onClick={() => {
                                                                setEditingTrackingId(order._id);
                                                                setTrackingInput({ number: order.trackingNumber || '', url: order.trackingUrl || '' });
                                                            }}
                                                            className="text-gray-400 hover:text-white text-[10px] uppercase mt-2 tracking-wider font-semibold"
                                                        >
                                                            Edit
                                                        </button>
                                                    </div>
                                                )}
                                            </td>

                                            <td className="px-6 py-4 text-center align-middle">
                                                <div className="flex flex-col gap-2 w-full">
                                                    {!order.isDelivered ? (
                                                        <button
                                                            onClick={() => deliverHandler(order._id)}
                                                            disabled={deliveringId === order._id}
                                                            className="bg-primary/20 hover:bg-primary/30 text-white border border-primary/30 px-3 py-1.5 rounded text-[10px] tracking-wider uppercase font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1 w-full"
                                                        >
                                                            <Truck className="h-3 w-3" />
                                                            {deliveringId === order._id ? 'Sending...' : 'Dispatch'}
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-500 text-[10px] italic flex items-center justify-center gap-1 py-1.5 w-full uppercase">
                                                            <Package className="h-3 w-3" /> Delivered
                                                        </span>
                                                    )}

                                                    <button
                                                        onClick={() => { setSelectedOrderChat(order); setReplyMessage(''); }}
                                                        className="px-3 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors border w-full border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 flex justify-center items-center gap-1"
                                                    >
                                                        <MessageSquare className="h-3 w-3" /> Chat ({order.replies?.length || 0})
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {orders.length === 0 && activeTab === 'orders' && (
                            <div className="p-12 text-center text-gray-500">
                                No store orders found in the system.
                            </div>
                        )}

                        {activeTab === 'bookings' && (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="text-xs uppercase bg-black/50 text-gray-400 border-b border-white/10">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Submission Date</th>
                                        <th scope="col" className="px-6 py-4">Service Details</th>
                                        <th scope="col" className="px-6 py-4">Lead Contact</th>
                                        <th scope="col" className="px-6 py-4 text-center w-48">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 align-top">{new Date(booking.createdAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 text-white align-top">
                                                <span className="font-playfair text-primary text-lg block">{booking.serviceType}</span>
                                                <span className="text-xs bg-white/10 px-2 py-0.5 rounded tracking-wide uppercase">{booking.classMode}</span>
                                            </td>
                                            <td className="px-6 py-4 text-white align-top">
                                                <div className="font-medium">{booking.name}</div>
                                                <div className="text-xs text-gray-500">{booking.email}</div>
                                                <div className="text-xs text-primary/80 mt-1 font-mono">{booking.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 text-center align-middle">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <button
                                                        onClick={() => toggleContactStatus(booking._id)}
                                                        className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors border w-full ${booking.isContacted
                                                            ? 'border-green-500/30 text-green-500 bg-green-500/10 hover:bg-green-500/20'
                                                            : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
                                                            }`}
                                                    >
                                                        {booking.isContacted ? 'Yes, Resolved' : 'Pending Contact'}
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedBookingChat(booking); setReplyMessage(''); }}
                                                        className="px-4 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors border w-full border-blue-500/30 text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 flex justify-center items-center gap-1"
                                                    >
                                                        <MessageSquare className="h-3 w-3" /> Chat ({booking.replies?.length || 0})
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {bookings.length === 0 && activeTab === 'bookings' && (
                            <div className="p-12 text-center text-gray-500">
                                No service bookings found.
                            </div>
                        )}

                        {activeTab === 'help' && (
                            <table className="w-full text-left text-sm text-gray-400">
                                <thead className="text-xs uppercase bg-black/50 text-gray-400 border-b border-white/10">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Submitted On</th>
                                        <th scope="col" className="px-6 py-4">User Info</th>
                                        <th scope="col" className="px-6 py-4">Problem Context</th>
                                        <th scope="col" className="px-6 py-4 text-center w-48">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {helpRequests.map(request => (
                                        <tr key={request._id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 w-40 align-top">{new Date(request.createdAt).toLocaleString()}</td>
                                            <td className="px-6 py-4 w-64 text-white align-top">
                                                <div className="font-medium">{request.name}</div>
                                                <a href={`mailto:${request.email}`} className="text-xs text-primary/80 hover:underline">{request.email}</a>
                                            </td>
                                            <td className="px-6 py-4 text-white">
                                                <div className="font-bold text-gray-200 mb-2 pb-1 border-b border-white/10">{request.subject}</div>
                                                <p className="text-xs text-gray-400 whitespace-pre-wrap leading-relaxed">{request.description}</p>
                                            </td>
                                            <td className="px-6 py-4 text-center w-48 align-middle">
                                                <div className="flex flex-col gap-2 w-full">
                                                    <button
                                                        onClick={() => setSelectedTicketId(request._id)}
                                                        className="px-4 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors border w-full border-blue-500/30 text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 flexItems-center justify-center gap-1"
                                                    >
                                                        <MessageSquare className="h-3 w-3 inline" /> View Thread ({request.replies?.length || 0})
                                                    </button>

                                                    <button
                                                        onClick={() => toggleHelpStatus(request._id)}
                                                        className={`px-4 py-1.5 rounded text-[10px] font-bold tracking-wider uppercase transition-colors border w-full ${request.isResolved
                                                            ? 'border-green-500/30 text-green-500 bg-green-500/10 hover:bg-green-500/20'
                                                            : 'border-yellow-500/30 text-yellow-500 bg-yellow-500/10 hover:bg-yellow-500/20'
                                                            }`}
                                                    >
                                                        {request.isResolved ? 'Mark Pending' : 'Mark Resolved'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}

                        {helpRequests.length === 0 && activeTab === 'help' && (
                            <div className="p-12 text-center text-gray-500">
                                No help requests or complaints have been submitted yet.
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Help/Complaint Chat Modal */}
            {selectedTicketId && (
                <TicketChat
                    ticket={{
                        ...helpRequests.find(h => h._id === selectedTicketId)!,
                        onReplySubmitted: (updatedTicket: any) => {
                            setHelpRequests(prev => prev.map(h => h._id === updatedTicket._id ? updatedTicket : h));
                        }
                    }}
                    onClose={() => setSelectedTicketId(null)}
                />
            )}

            {/* Order Chat Modal */}
            <AnimatePresence>
                {selectedOrderChat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                                <h3 className="text-lg font-medium text-white">Order #{selectedOrderChat._id.substring(0, 8)} Chat</h3>
                                <button onClick={() => setSelectedOrderChat(null)} className="text-gray-400 hover:text-white transition-colors">
                                    <CloseIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {(selectedOrderChat.replies || []).length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">No messages yet.</div>
                                ) : (
                                    (selectedOrderChat.replies || []).map((reply, idx) => (
                                        <div key={idx} className={`flex ${reply.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${reply.sender === 'admin' ? 'bg-primary text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                                                <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                                <p className={`text-[10px] mt-1 text-right ${reply.sender === 'admin' ? 'text-black/70' : 'text-gray-400'}`}>
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
                                        placeholder="Type reply to customer..."
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
                {selectedBookingChat && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl overflow-hidden flex flex-col h-[600px] max-h-[80vh]"
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-white/5">
                                <h3 className="text-lg font-medium text-white">Booking: {selectedBookingChat.serviceType} Chat</h3>
                                <button onClick={() => setSelectedBookingChat(null)} className="text-gray-400 hover:text-white transition-colors">
                                    <CloseIcon className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                                {(selectedBookingChat.replies || []).length === 0 ? (
                                    <div className="text-center text-gray-500 py-10">No messages yet.</div>
                                ) : (
                                    (selectedBookingChat.replies || []).map((reply, idx) => (
                                        <div key={idx} className={`flex ${reply.sender === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${reply.sender === 'admin' ? 'bg-primary text-black rounded-tr-sm' : 'bg-white/10 text-white rounded-tl-sm'}`}>
                                                <p className="text-sm whitespace-pre-wrap">{reply.message}</p>
                                                <p className={`text-[10px] mt-1 text-right ${reply.sender === 'admin' ? 'text-black/70' : 'text-gray-400'}`}>
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
                                        placeholder="Type reply to lead..."
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
