import { motion } from 'framer-motion';
import { SectionHeading } from './SectionHeading';

export function Philosophy() {
    return (
        <section id="philosophy" className="py-24 bg-background relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                <SectionHeading
                    title="Where Luxury Meets Performance"
                    subtitle="Crafted for Excellence"
                    as="h2"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
                    {/* Mastery */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="group p-8 border border-white/5 hover:border-primary/30 transition-all duration-500 bg-black/50"
                    >
                        <div className="mb-8 flex justify-center">
                            <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <div className="w-3 h-3 bg-primary rounded-full" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif text-primary mb-4">Mastery</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Every piece is designed for those who refuse to compromise. We believe in the pursuit of perfection through disciplined practice.
                        </p>
                    </motion.div>

                    {/* Harmony */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        className="group p-8 border border-primary/50 transition-all duration-500 bg-black/50 relative"
                    >
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="mb-8 flex justify-center relative z-10">
                            <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary/20 transition-colors bg-primary/10">
                                <div className="w-3 h-3 bg-primary rounded-full scale-125" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif text-primary mb-4 relative z-10">Harmony</h3>
                        <p className="text-gray-400 text-sm leading-relaxed relative z-10">
                            Balance between strength and serenity. Our equipment honors both the warrior and the sage within you.
                        </p>
                    </motion.div>

                    {/* Legacy */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.8, delay: 0.6 }}
                        className="group p-8 border border-white/5 hover:border-primary/30 transition-all duration-500 bg-black/50"
                    >
                        <div className="mb-8 flex justify-center">
                            <div className="w-16 h-16 rounded-full border border-primary flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                <div className="w-3 h-3 bg-primary rounded-full" />
                            </div>
                        </div>
                        <h3 className="text-2xl font-serif text-primary mb-4">Legacy</h3>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Built to last generations. We create heirlooms, not disposables—equipment that grows with your journey.
                        </p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
