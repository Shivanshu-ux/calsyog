import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

export interface CartItem {
    _id: string;
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
}

interface CartContextType {
    cartItems: CartItem[];
    addToCart: (item: any) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    clearCart: () => void;
    fetchCart: () => Promise<void>;
    cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);

    useEffect(() => {
        if (user) {
            fetchCart();
        } else {
            setCartItems([]);
        }
    }, [user]);

    const fetchCart = async () => {
        if (!user) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            const { data } = await axios.get('/api/cart', config);
            setCartItems(data.items || []);
        } catch (error) {
            console.error('Failed to fetch cart:', error);
        }
    };

    const addToCart = async (product: any) => {
        if (!user) throw new Error("Must be logged in");

        // Clean price string, e.g., "₹3,500" -> 3500
        const cleanPrice = parseInt(product.price.replace(/[^\d]/g, ''), 10);

        const config = {
            headers: { Authorization: `Bearer ${user.token}` }
        };

        await axios.post('/api/cart', {
            productId: product.name.toLowerCase().replace(/\s+/g, '-'),
            name: product.name,
            price: cleanPrice,
            quantity: 1,
            image: product.image
        }, config);

        // Refresh cart after adding
        await fetchCart();
    };

    const removeFromCart = async (productId: string) => {
        if (!user) return;
        try {
            const config = {
                headers: { Authorization: `Bearer ${user.token}` }
            };
            await axios.delete(`/api/cart/${productId}`, config);
            setCartItems(prev => prev.filter(item => item.productId !== productId));
        } catch (error) {
            console.error('Failed to remove item:', error);
            throw error;
        }
    };

    const clearCart = () => {
        setCartItems([]);
    };

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart, fetchCart, cartCount }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
