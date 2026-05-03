import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Wallet, Banknote, ShieldCheck } from 'lucide-react';
import { cn } from '../lib/utils';
import { SEO } from '../components/SEO';

export function Checkout() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const [shipping, setShipping] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const [paymentMethod, setPaymentMethod] = useState('Credit/Debit Card');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        expiry: '',
        cvv: '',
        upiId: '',
    });

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        const fetchCart = async () => {
            try {
                const config = {
                    headers: { Authorization: `Bearer ${user.token}` }
                };
                const { data } = await axios.get('/api/cart', config);
                setCartItems(data.items || []);
                if (data.items.length === 0) {
                    navigate('/'); // Don't allow checkout with empty cart
                }
            } catch (error) {
                console.error('Failed to fetch cart:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [user, navigate]);

    // Dynamically load Razorpay SDK
    const loadRazorpay = () => {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
            document.body.appendChild(script);
        });
    };

    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shippingCost = total > 5000 ? 0 : 500;
    const finalTotal = total + shippingCost;

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setPlacingOrder(true);

        const config = {
            headers: { Authorization: `Bearer ${user?.token}` }
        };

        try {
            const orderData: any = {
                orderItems: cartItems.map(item => ({
                    name: item.name,
                    qty: item.quantity,
                    image: item.image,
                    price: item.price,
                    product: item.productId
                })),
                shippingAddress: shipping,
                paymentMethod,
                paymentDetails: paymentMethod === 'Credit/Debit Card'
                    ? { cardNumberLast4: paymentDetails.cardNumber.slice(-4) }
                    : paymentMethod === 'UPI' ? { upiId: paymentDetails.upiId } : {},
                totalPrice: finalTotal,
            };

            if (paymentMethod === 'Cash on Delivery') {
                // Direct checkout for COD
                await axios.post('/api/orders', orderData, config);
                navigate('/success');
            } else {
                // Razorpay Flow for Card / UPI
                const res = await loadRazorpay();
                if (!res) {
                    alert('Razorpay SDK failed to load. Are you online?');
                    setPlacingOrder(false);
                    return;
                }

                try {
                    // Create Razorpay order on backend
                    const { data: rpOrder } = await axios.post('/api/orders/razorpay', { amount: finalTotal }, config);

                    // Graceful fallback if Razorpay keys are not configured
                    if (rpOrder.id.startsWith('mock_order_')) {
                        (orderData.paymentDetails as any) = {
                            razorpayPaymentId: 'mock_payment_' + Date.now(),
                            razorpayOrderId: rpOrder.id,
                            razorpaySignature: 'mock_signature'
                        };
                        await axios.post('/api/orders', orderData, config);
                        navigate('/success');
                        return;
                    }

                    const options = {
                        key: "YOUR_RAZORPAY_KEY_ID_HERE", // User needs to replace this
                        amount: rpOrder.amount,
                        currency: rpOrder.currency,
                        name: "CalsYog",
                        description: "Premium Calisthenics & Yoga Equipment",
                        image: "/d.png",
                        order_id: rpOrder.id,
                        handler: async function (response: any) {
                            // On successful payment, save the order to DB
                            (orderData.paymentDetails as any) = {
                                razorpayPaymentId: response.razorpay_payment_id,
                                razorpayOrderId: response.razorpay_order_id,
                                razorpaySignature: response.razorpay_signature
                            };
                            await axios.post('/api/orders', orderData, config);
                            navigate('/success');
                        },
                        prefill: {
                            name: user?.name || "Customer",
                            email: user?.email || "",
                            contact: "9999999999"
                        },
                        theme: {
                            color: "#E5C355" // CalsYog Gold
                        }
                    };

                    const paymentObject = new (window as any).Razorpay(options);
                    paymentObject.open();
                } catch (rpError: any) {
                    console.error('Razorpay init error:', rpError);
                    alert(rpError.response?.data?.message || 'Failed to initialize payment gateway.');
                }
            }
        } catch (error) {
            console.error('Order failed:', error);
            alert('Failed to place order. Please try again.');
            setPlacingOrder(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-[#050505] flex items-center justify-center text-primary">Loading checkout...</div>;

    return (
        <div className="min-h-screen bg-[#050505] pt-24 pb-12">
            <SEO title="Checkout" noindex={true} />
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif text-white">Secure Checkout</h1>
                    <p className="text-gray-400 mt-2 flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        256-bit encryption. Your data is secure.
                    </p>
                </div>

                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Column: Form */}
                    <div className="flex-1 space-y-10">
                        <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-10">

                            {/* Shipping Address */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8">
                                <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
                                    <span className="bg-primary text-black w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold">1</span>
                                    Shipping Details
                                </h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
                                        <input
                                            required
                                            type="text"
                                            value={shipping.address}
                                            onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            placeholder="123 Luxury Avenue, Apt 4B"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                                            <input
                                                required
                                                type="text"
                                                value={shipping.city}
                                                onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-400 mb-1">Postal Code</label>
                                            <input
                                                required
                                                type="text"
                                                value={shipping.postalCode}
                                                onChange={(e) => setShipping({ ...shipping, postalCode: e.target.value })}
                                                className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Country</label>
                                        <input
                                            required
                                            type="text"
                                            value={shipping.country}
                                            onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                                            className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Method */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8">
                                <h2 className="text-xl font-serif text-white mb-6 flex items-center gap-3">
                                    <span className="bg-primary text-black w-6 h-6 rounded-full inline-flex items-center justify-center text-xs font-bold">2</span>
                                    Payment Method
                                </h2>

                                <div className="space-y-3">
                                    {/* Card Option */}
                                    <label className={cn(
                                        "flex flex-col p-4 border rounded-lg cursor-pointer transition-all",
                                        paymentMethod === 'Credit/Debit Card' ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/30"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Credit/Debit Card"
                                                checked={paymentMethod === 'Credit/Debit Card'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="accent-primary"
                                            />
                                            <CreditCard className={cn("h-5 w-5", paymentMethod === 'Credit/Debit Card' ? "text-primary" : "text-gray-400")} />
                                            <span className="text-white font-medium">Credit / Debit Card</span>
                                        </div>
                                        {paymentMethod === 'Credit/Debit Card' && (
                                            <div className="mt-4 pl-8 space-y-4 animate-in fade-in slide-in-from-top-2">
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="0000 0000 0000 0000"
                                                    value={paymentDetails.cardNumber}
                                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                                                    className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono tracking-widest text-sm"
                                                />
                                                <div className="grid grid-cols-2 gap-4">
                                                    <input
                                                        required
                                                        type="text"
                                                        placeholder="MM/YY"
                                                        value={paymentDetails.expiry}
                                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiry: e.target.value })}
                                                        className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono uppercase"
                                                    />
                                                    <input
                                                        required
                                                        type="password"
                                                        placeholder="CVV"
                                                        maxLength={4}
                                                        value={paymentDetails.cvv}
                                                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                                                        className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors font-mono"
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </label>

                                    {/* UPI Option */}
                                    <label className={cn(
                                        "flex flex-col p-4 border rounded-lg cursor-pointer transition-all",
                                        paymentMethod === 'UPI' ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/30"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="UPI"
                                                checked={paymentMethod === 'UPI'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="accent-primary"
                                            />
                                            <Wallet className={cn("h-5 w-5", paymentMethod === 'UPI' ? "text-primary" : "text-gray-400")} />
                                            <span className="text-white font-medium">UPI</span>
                                        </div>
                                        {paymentMethod === 'UPI' && (
                                            <div className="mt-4 pl-8 animate-in fade-in slide-in-from-top-2">
                                                <input
                                                    required
                                                    type="text"
                                                    placeholder="username@upi"
                                                    value={paymentDetails.upiId}
                                                    onChange={(e) => setPaymentDetails({ ...paymentDetails, upiId: e.target.value })}
                                                    className="w-full bg-black/50 border border-white/10 rounded-none px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
                                                />
                                            </div>
                                        )}
                                    </label>

                                    {/* COD Option */}
                                    <label className={cn(
                                        "flex flex-col p-4 border rounded-lg cursor-pointer transition-all",
                                        paymentMethod === 'Cash on Delivery' ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/30"
                                    )}>
                                        <div className="flex items-center gap-3">
                                            <input
                                                type="radio"
                                                name="payment"
                                                value="Cash on Delivery"
                                                checked={paymentMethod === 'Cash on Delivery'}
                                                onChange={(e) => setPaymentMethod(e.target.value)}
                                                className="accent-primary"
                                            />
                                            <Banknote className={cn("h-5 w-5", paymentMethod === 'Cash on Delivery' ? "text-primary" : "text-gray-400")} />
                                            <span className="text-white font-medium">Cash on Delivery</span>
                                        </div>
                                    </label>
                                </div>
                            </div>

                        </form>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className="lg:w-[400px]">
                        <div className="bg-white/5 border border-white/10 rounded-xl p-6 lg:p-8 sticky top-24">
                            <h2 className="text-xl font-serif text-white mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-[40vh] overflow-y-auto pr-2">
                                {cartItems.map((item) => (
                                    <div key={item._id} className="flex gap-4">
                                        <div className="h-16 w-16 bg-black rounded-md overflow-hidden flex-shrink-0">
                                            <img src={item.image} alt={item.name} className="h-full w-full object-cover opacity-80" />
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="text-white text-sm line-clamp-2">{item.name}</h3>
                                            <div className="flex justify-between mt-1 text-sm">
                                                <span className="text-gray-500">Qty: {item.quantity}</span>
                                                <span className="text-primary tracking-wide">₹{item.price.toLocaleString('en-IN')}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 pt-6 border-t border-white/10 text-sm">
                                <div className="flex justify-between text-gray-400">
                                    <span>Subtotal</span>
                                    <span>₹{total.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Shipping</span>
                                    <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toLocaleString('en-IN')}`}</span>
                                </div>
                                <div className="flex justify-between text-white text-lg font-serif pt-3 border-t border-white/10">
                                    <span>Total</span>
                                    <span className="text-primary">₹{finalTotal.toLocaleString('en-IN')}</span>
                                </div>
                            </div>

                            <button
                                form="checkout-form"
                                type="submit"
                                disabled={placingOrder}
                                className="w-full mt-8 py-4 bg-primary text-black font-bold uppercase tracking-widest hover:bg-primary/90 transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                            >
                                {placingOrder ? 'Processing...' : `Pay ₹${finalTotal.toLocaleString('en-IN')}`}
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
