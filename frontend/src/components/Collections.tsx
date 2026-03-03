import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export function Collections() {
    return (
        <section id="collections" className="grid grid-cols-1 md:grid-cols-2 h-[40vh] min-h-[350px] max-h-[450px]">
            {/* Calisthenics Collection */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="group relative h-full w-full overflow-hidden border-r border-[#1a1a1a]"
            >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <img
                        src="/damn.png"
                        alt="Calisthenics Rings"
                        className="h-full w-full object-contain p-8 opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-12 md:p-20">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                        Calisthenics
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-sm font-light transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        Master Your Strength
                    </p>
                    <p className="text-sm text-gray-400 max-w-md transform translate-y-4 opacity-0 transition-all duration-700 delay-100 group-hover:translate-y-0 group-hover:opacity-100 mb-8">
                        Discover the art of bodyweight mastery. Learn the core principles, progressive overload techniques, and how to build functional strength.
                    </p>
                    <Link to="/learn/calisthenics" className="inline-block px-8 py-3 border border-primary text-primary tracking-widest uppercase hover:bg-primary hover:text-black transition-colors transform translate-y-4 opacity-0 transition-all duration-700 delay-200 group-hover:translate-y-0 group-hover:opacity-100">
                        Understand Calisthenics
                    </Link>
                </div>
            </motion.div>

            {/* Yoga Collection */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
                className="group relative h-full w-full overflow-hidden"
            >
                <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
                    <img
                        src="/cool.jpg"
                        alt="Yoga Mat"
                        className="h-full w-full object-contain p-8 opacity-60 transition-opacity duration-300 group-hover:opacity-40"
                    />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

                <div className="absolute bottom-0 left-0 p-12 md:p-20">
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-4 transform translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                        Yoga
                    </h2>
                    <p className="text-gray-300 text-lg mb-8 max-w-sm font-light transform translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                        Find Your Balance
                    </p>
                    <p className="text-sm text-gray-400 max-w-md transform translate-y-4 opacity-0 transition-all duration-700 delay-100 group-hover:translate-y-0 group-hover:opacity-100 mb-8">
                        Explore the philosophy of mindful practice. Understand the fusion of physical postures, breath control, and deep meditation for inner balance.
                    </p>
                    <Link to="/learn/yoga" className="inline-block px-8 py-3 border border-primary text-primary tracking-widest uppercase hover:bg-primary hover:text-black transition-colors transform translate-y-4 opacity-0 transition-all duration-700 delay-200 group-hover:translate-y-0 group-hover:opacity-100">
                        Understand Yoga
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
