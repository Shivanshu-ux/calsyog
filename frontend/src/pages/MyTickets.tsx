import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { MessageSquare } from 'lucide-react';
import { TicketChat } from '../components/TicketChat';
import type { TicketProps } from '../components/TicketChat';
import { Link } from 'react-router-dom';

export function MyTickets() {
    const { user } = useAuth();
    const [tickets, setTickets] = useState<TicketProps[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const config = { headers: { Authorization: `Bearer ${user?.token}` } };
                const { data } = await axios.get('/api/help/mine', config);
                setTickets(data);
            } catch (error) {
                console.error('Failed to fetch tickets:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchTickets();
        } else {
            setLoading(false);
        }
    }, [user]);

    if (!user) {
        return (
            <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center pt-24 pb-12 px-4">
                <MessageSquare className="h-16 w-16 text-gray-600 mb-6" />
                <h2 className="text-2xl font-serif mb-4">Support Tickets</h2>
                <p className="text-gray-400 mb-8 max-w-md text-center">Please log in to view your submitted support tickets and track their resolution status.</p>
                <Link to="/login" className="bg-primary hover:bg-primary/90 text-black px-8 py-3 rounded-full font-bold tracking-wider uppercase transition-all">
                    Log In
                </Link>
            </div>
        );
    }

    if (loading) {
        return <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center mb-10">Loading Tickets...</div>;
    }

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

                <div className="mb-12 border-b border-white/10 pb-8">
                    <h1 className="text-4xl font-serif text-white mb-2">My Support Tickets</h1>
                    <p className="text-gray-400">Track and respond to your active support requests.</p>
                </div>

                {tickets.length === 0 ? (
                    <div className="text-center py-20 bg-white/5 border border-white/10 rounded-xl">
                        <MessageSquare className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="text-xl font-medium text-white mb-2">No tickets found</h3>
                        <p className="text-gray-400 mb-6">You haven't submitted any support requests yet.</p>
                        <Link to="/help" className="text-primary hover:text-primary/80 font-medium hover:underline">
                            Submit a new request
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {tickets.map(ticket => (
                            <div
                                key={ticket._id}
                                onClick={() => setSelectedTicketId(ticket._id)}
                                className="bg-white/5 border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-colors cursor-pointer flex justify-between items-center group relative overflow-hidden"
                            >
                                {/* Left unread indicator logic could go here */}
                                <div className="pr-10">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${ticket.isResolved ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
                                            {ticket.isResolved ? 'Resolved' : 'Active'}
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    <h3 className="text-lg font-medium text-white mb-1 group-hover:text-primary transition-colors">{ticket.subject}</h3>
                                    <p className="text-sm text-gray-400 line-clamp-1">{ticket.description}</p>
                                </div>
                                <div className="shrink-0 text-gray-500 group-hover:text-white transition-colors">
                                    <span className="text-xs uppercase font-bold tracking-wider">View Thread &rarr;</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

            </div>

            {/* Ticket Chat Modal */}
            {selectedTicketId && (
                <TicketChat
                    ticket={{
                        ...tickets.find(t => t._id === selectedTicketId)!,
                        onReplySubmitted: (updatedTicket: any) => {
                            setTickets(prev => prev.map(t => t._id === updatedTicket._id ? updatedTicket : t));
                        }
                    }}
                    onClose={() => setSelectedTicketId(null)}
                />
            )}
        </div>
    );
}
