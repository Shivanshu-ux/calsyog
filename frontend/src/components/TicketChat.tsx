import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Send, User as UserIcon, ShieldAlert } from 'lucide-react';

export interface Reply {
    _id?: string;
    sender: 'admin' | 'user';
    message: string;
    createdAt: string;
}

export interface TicketProps {
    _id: string;
    name: string;
    email: string;
    subject: string;
    description: string;
    isResolved: boolean;
    createdAt: string;
    replies: Reply[];
    onReplySubmitted: (updatedTicket: any) => void;
}

export function TicketChat({ ticket, onClose }: { ticket: TicketProps; onClose: () => void }) {
    const { user } = useAuth();
    const [replyText, setReplyText] = useState('');
    const [sending, setSending] = useState(false);

    const handleSendReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim() || !user) return;

        setSending(true);
        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(`/api/help/${ticket._id}/reply`, { message: replyText }, config);
            ticket.onReplySubmitted(data);
            setReplyText('');
        } catch (error) {
            console.error('Failed to send reply:', error);
            alert('Failed to send reply.');
        } finally {
            setSending(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#0f0f0f] border border-white/20 rounded-xl w-full max-w-2xl flex flex-col max-h-[90vh] shadow-2xl overflow-hidden relative">

                {/* Header Details */}
                <div className="p-6 border-b border-white/10 shrink-0 bg-white/5">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <span className={`inline-block px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border mb-3 ${ticket.isResolved ? 'border-green-500/30 text-green-400 bg-green-500/10' : 'border-yellow-500/30 text-yellow-400 bg-yellow-500/10'}`}>
                                {ticket.isResolved ? 'Resolved' : 'Active Ticket'}
                            </span>
                            <h2 className="text-xl font-medium text-white">{ticket.subject}</h2>
                        </div>
                        <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-2xl leading-none">&times;</button>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-gray-400 font-mono">
                        <span>{ticket.name} &lt;{ticket.email}&gt;</span>
                        <span>•</span>
                        <span>{new Date(ticket.createdAt).toLocaleString()}</span>
                    </div>
                </div>

                {/* Chat History Scroll Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">

                    {/* Original Complaint */}
                    <div className="flex gap-4">
                        <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                            <UserIcon className="h-4 w-4 text-gray-400" />
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-300 w-full">
                            <p className="whitespace-pre-wrap leading-relaxed">{ticket.description}</p>
                        </div>
                    </div>

                    {/* Replies */}
                    {ticket.replies?.map((reply, idx) => {
                        const isMe = (user?.isAdmin && reply.sender === 'admin') || (!user?.isAdmin && reply.sender === 'user');

                        return (
                            <div key={idx} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : ''}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${reply.sender === 'admin' ? 'bg-primary/20 text-primary' : 'bg-white/10 text-gray-400'}`}>
                                    {reply.sender === 'admin' ? <ShieldAlert className="h-4 w-4" /> : <UserIcon className="h-4 w-4" />}
                                </div>
                                <div className={`max-w-[80%] rounded-2xl p-4 text-sm ${isMe
                                        ? 'bg-primary text-black rounded-tr-sm'
                                        : 'bg-white/10 border border-white/5 text-gray-300 rounded-tl-sm'
                                    }`}>
                                    <p className="whitespace-pre-wrap leading-relaxed">{reply.message}</p>
                                    <div className={`text-[10px] mt-2 opacity-70 ${isMe ? 'text-black/70' : 'text-gray-500'}`}>
                                        {new Date(reply.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Reply Input Box */}
                <div className="p-4 border-t border-white/10 shrink-0 bg-black">
                    <form onSubmit={handleSendReply} className="flex gap-3">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Type your reply here..."
                            className="flex-1 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary resize-none h-14"
                            disabled={sending}
                        />
                        <button
                            type="submit"
                            disabled={sending || !replyText.trim()}
                            className="bg-primary hover:bg-primary/90 text-black px-6 rounded-lg font-bold tracking-wider uppercase text-xs transition-colors disabled:opacity-50 flex items-center gap-2 h-14"
                        >
                            <Send className="h-4 w-4" />
                            {sending ? 'Sending' : 'Send'}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
