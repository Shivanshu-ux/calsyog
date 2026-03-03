import { motion } from 'framer-motion';

export function Hero() {
    return (
        <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <img
                    src="https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=2070&auto=format&fit=crop"
                    alt="Athlete background"
                    className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-b from-background/40 to-transparent" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                >
                    <h2 className="text-2xl md:text-4xl font-serif font-medium text-primary mb-6 tracking-[0.4em] uppercase" style={{ textShadow: "0 2px 10px rgba(212,175,55,0.3)" }}>
                        CalsYog
                    </h2>
                    <h1 className="text-5xl md:text-8xl font-serif font-bold text-foreground mb-8 tracking-tight leading-tight">
                        Elevate Your Body & <br />
                        <span className="italic font-light">Soul</span>
                    </h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1, delay: 0.8 }}
                        className="mt-8 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 font-light leading-relaxed"
                    >
                        Handcrafted excellence meets uncompromising performance. Discover equipment designed for those who pursue mastery.
                    </motion.p>


                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, delay: 1 }}
                        className="flex flex-col items-center justify-center pt-8 mt-4"
                    >
                        <div className="flex items-center gap-6 mb-4">
                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 1.5 }}
                                className="h-[1px] w-12 md:w-24 bg-gradient-to-r from-transparent to-primary/80 origin-right"
                            />

                            <motion.div
                                animate={{
                                    y: [0, -8, 0],
                                    rotate: [45, 45, 45]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="relative w-8 h-8 md:w-10 md:h-10 rotate-45 border border-primary/40 flex items-center justify-center group cursor-pointer hover:border-primary hover:shadow-[0_0_15px_rgba(229,195,85,0.4)] transition-all duration-500"
                            >
                                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="w-1.5 h-1.5 bg-primary"
                                />
                                {/* Glow layer */}
                                <div className="absolute inset-0 bg-primary/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                            </motion.div>

                            <motion.div
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 1, delay: 1.5 }}
                                className="h-[1px] w-12 md:w-24 bg-gradient-to-l from-transparent to-primary/80 origin-left"
                            />
                        </div>

                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 1, delay: 2 }}
                            className="text-primary/70 uppercase tracking-[0.3em] text-xs font-semibold mt-4"
                        >
                            Discover More
                        </motion.span>
                    </motion.div>
                </motion.div>
            </div>

            {/* Scroll indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3">
                <div className="w-12 h-1 bg-primary rounded-full" />
                <div className="w-2 h-1 bg-white/20 rounded-full" />
                <div className="w-2 h-1 bg-white/20 rounded-full" />
            </div>
        </div>
    );
}
