import { Star, CheckCircle, Search } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

import { SectionHeading } from '../components/SectionHeading';

const products = [
    {
        name: "Elite Gymnastic Rings",
        price: "₹0.00",
        image: "/ring.png",
        description: "Precision-engineered wooden rings with military-grade straps",
        rating: 5,
        reviews: 124,
        available: false
    },
    {
        name: "Serenity Pro Mat",
        price: "₹0.00",
        image: "/mat.png",
        description: "Eco-luxury cork and natural rubber, 6mm thickness",
        rating: 5,
        reviews: 89,
        available: false
    },
    {
        name: "Pro Calisthenics Parallettes",
        price: "₹1,499",
        image: "/Posty.jpg",
        description: "Solid wood construction with non-slip base for mastering planches",
        rating: 5,
        reviews: 156,
        available: true
    },
    {
        name: "Heavy-Duty Dip Bars",
        price: "₹0.00",
        image: "/dips.png",
        description: "Adjustable width and height for perfect form and versatility",
        rating: 4,
        reviews: 94,
        available: false
    },
    {
        name: "Mounted Pull-Up Bar",
        price: "₹0.00",
        image: "/Pullup.png",
        description: "Industrial grade steel for explosive muscle ups and hanging leg raises",
        rating: 5,
        reviews: 203,
        available: false
    },
    {
        name: "Eco-Cork Yoga Block",
        price: "₹0.00",
        image: "/block.png",
        description: "High-density natural cork for superior stability and alignment",
        rating: 5,
        reviews: 42,
        available: false
    },
    {
        name: "Mobility Stretching Bands",
        price: "₹0.00",
        image: "/strech.png",
        description: "Premium latex bands for deep stretching and injury prevention",
        rating: 4,
        reviews: 67,
        available: false
    },
    {
        name: "Performance Wrist Wraps",
        price: "₹0.00",
        image: "/band.png",
        description: "Heavy-duty support for wrists during intense static holds",
        rating: 5,
        reviews: 89,
        available: false
    }
];

export function Products() {
    const { user } = useAuth();
    const { addToCart } = useCart();
    const [adding, setAdding] = useState<string | null>(null);
    const [added, setAdded] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState('all');

    const displayProducts = useMemo(() => {
        let filtered = products;

        if (priceRange !== 'all') {
            filtered = filtered.filter(p => {
                const priceMatch = p.price.replace(/[^\d]/g, '');
                const priceNum = parseInt(priceMatch, 10);

                if (priceRange === 'under_2000') return priceNum < 2000;
                if (priceRange === '2000_to_5000') return priceNum >= 2000 && priceNum <= 5000;
                if (priceRange === 'above_5000') return priceNum > 5000;
                return true;
            });
        }

        if (!searchTerm) return filtered;

        const lowerSearch = searchTerm.toLowerCase();
        const matched = filtered.filter(p => p.name.toLowerCase().includes(lowerSearch) || p.description.toLowerCase().includes(lowerSearch));
        const unmatched = filtered.filter(p => !p.name.toLowerCase().includes(lowerSearch) && !p.description.toLowerCase().includes(lowerSearch));

        return [...matched, ...unmatched];
    }, [searchTerm, priceRange]);

    const handleAddToCart = async (product: any, e: React.MouseEvent) => {
        e.stopPropagation();

        if (!user) {
            alert('Please login to add items to the cart');
            return;
        }

        setAdding(product.name);
        try {
            await addToCart(product);
            setAdded(product.name);
            setTimeout(() => setAdded(null), 2000);
        } catch (error) {
            console.error('Error adding to cart', error);
            alert('Failed to add to cart');
        } finally {
            setAdding(null);
        }
    };

    return (
        <div className="pt-32 pb-24 min-h-screen bg-[#0a0a0a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="All Products"
                    subtitle="Premium gear for your calisthenics and yoga journey"
                    as="h2"
                />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >

                    <div className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                        <div className="relative group flex-1">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search for products..."
                                className="block w-full pl-12 pr-4 py-3 border border-gray-800 rounded-full leading-5 bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-300 shadow-sm"
                            />
                        </div>
                        <div className="relative">
                            <select
                                value={priceRange}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="appearance-none block w-full sm:w-48 pl-4 pr-10 py-3 border border-gray-800 rounded-full leading-5 bg-gray-900 text-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-300 shadow-sm cursor-pointer"
                            >
                                <option value="all">All Prices</option>
                                <option value="under_2000">Under ₹2,000</option>
                                <option value="2000_to_5000">₹2,000 - ₹5,000</option>
                                <option value="above_5000">Above ₹5,000</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {displayProducts.map((product, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: index * 0.1 }}
                            className="group cursor-pointer"
                        >
                            <div className="relative aspect-[4/5] overflow-hidden bg-gray-900 mb-6 border border-[#1a1a1a]">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className={`h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 ${product.available === false ? 'grayscale max-w-full' : ''}`}
                                />
                                {product.available === false && (
                                    <div className="absolute top-4 left-4 bg-red-600/90 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider rounded-sm z-10 backdrop-blur-sm">
                                        Not Available
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                                <button
                                    onClick={(e) => handleAddToCart(product, e)}
                                    disabled={adding === product.name || added === product.name || product.available === false}
                                    className={`absolute bottom-0 left-0 w-full py-4 text-black font-bold uppercase tracking-widest translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center gap-2 ${product.available === false ? 'bg-gray-500 cursor-not-allowed opacity-100 disabled:opacity-100' : 'bg-primary disabled:opacity-80'}`}
                                >
                                    {adding === product.name ? (
                                        'Adding...'
                                    ) : added === product.name ? (
                                        <><CheckCircle className="h-5 w-5" /> Added</>
                                    ) : product.available === false ? (
                                        'Out of Stock'
                                    ) : (
                                        'Add to Cart'
                                    )}
                                </button>
                            </div>

                            <h3 className="text-xl font-serif text-white mb-2">{product.name}</h3>
                            <p className="text-sm text-gray-500 mb-3 line-clamp-2">{product.description}</p>

                            <div className="flex items-center justify-between">
                                <span className="text-primary font-medium">{product.price}</span>
                                <div className="flex items-center gap-1">
                                    {[...Array(product.rating)].map((_, i) => (
                                        <Star key={i} className="h-3 w-3 fill-primary text-primary" />
                                    ))}
                                    <span className="text-xs text-gray-500 ml-1">({product.reviews})</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
