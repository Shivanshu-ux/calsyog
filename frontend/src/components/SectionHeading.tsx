import { motion } from 'framer-motion';

interface SectionHeadingProps {
    title: string;
    subtitle?: string;
    as?: 'h1' | 'h2' | 'h3';
    className?: string;
}

export function SectionHeading({
    title,
    subtitle,
    as: Component = 'h2',
    className = '',
}: SectionHeadingProps) {
    const headingClasses =
        Component === 'h1'
            ? 'text-4xl md:text-6xl font-serif text-white tracking-[0.1em] uppercase drop-shadow-lg'
            : Component === 'h2'
                ? 'text-3xl md:text-5xl font-serif text-white tracking-[0.1em] uppercase drop-shadow-lg'
                : 'text-2xl md:text-4xl font-serif text-white tracking-[0.1em] uppercase drop-shadow-lg';

    return (
        <div className={`text-center mb-16 ${className}`}>
            <div className="flex items-center justify-center gap-4 md:gap-8 mb-6">
                {/* Left decorative elements */}
                <div className="flex items-center gap-2 md:gap-4">
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-[1px] w-16 md:w-32 bg-gradient-to-r from-transparent via-primary/50 to-primary origin-right"
                    />
                    <motion.div
                        initial={{ rotate: -90, opacity: 0 }}
                        whileInView={{ rotate: 45, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 md:w-3 md:h-3 border border-primary flex items-center justify-center"
                    >
                        <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-primary" />
                    </motion.div>
                </div>

                {/* Center Text */}
                <div className="relative">
                    <Component className={headingClasses}>
                        {title}
                    </Component>
                    {/* Subtle glow behind text */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[150%] bg-primary/10 blur-[40px] -z-10 rounded-[100%]" />
                </div>

                {/* Right decorative elements */}
                <div className="flex items-center gap-2 md:gap-4">
                    <motion.div
                        initial={{ rotate: 90, opacity: 0 }}
                        whileInView={{ rotate: 45, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="w-2 h-2 md:w-3 md:h-3 border border-primary flex items-center justify-center"
                    >
                        <div className="w-0.5 h-0.5 md:w-1 md:h-1 bg-primary" />
                    </motion.div>
                    <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="h-[1px] w-16 md:w-32 bg-gradient-to-l from-transparent via-primary/50 to-primary origin-left"
                    />
                </div>
            </div>

            {subtitle && (
                <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                    className="text-gray-400 font-light tracking-wide max-w-2xl mx-auto"
                >
                    {subtitle}
                </motion.p>
            )}
        </div>
    );
}
