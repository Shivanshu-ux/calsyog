import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';

export function AboutUs() {
    return (
        <div className="pt-24 min-h-screen bg-background text-foreground">
            <SEO 
                title="About CalsYog" 
                description="Discover our mission to elevate human potential by combining the ancient traditions of Yoga with the raw power of Calisthenics."
                canonical="/about" 
            />
            <div className="container mx-auto px-6 py-12 max-w-4xl">
                <SectionHeading title="About Us" as="h1" />

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-12"
                >
                    <section className="bg-black/20 p-8 md:p-12 rounded-lg border border-[#1a1a1a]">
                        <h2 className="text-3xl font-serif text-primary mb-6">Our Mission</h2>
                        <p className="text-gray-300 font-light leading-relaxed text-lg">
                            At Calsyog, we believe in the profound synergy between ancient yogic traditions and
                            the raw, uncompromising power of calisthenics. Our mission is to elevate human potential
                            by providing a luxury fitness experience that harmonizes the mind, body, and spirit.
                            We guide our community towards unparalleled physical mastery and inner tranquility.
                        </p>
                    </section>

                    <section className="bg-black/20 p-8 md:p-12 rounded-lg border border-[#1a1a1a]">
                        <h2 className="text-3xl font-serif text-primary mb-6">What We Do</h2>
                        <p className="text-gray-300 font-light leading-relaxed text-lg mb-4">
                            We curate premium, high-quality equipment designed for both the dedicated calisthenics
                            athlete and the devoted yoga practitioner. Beyond our meticulously crafted products,
                            we offer deep, comprehensive educational resources to ensure your practice remains safe,
                            effective, and continually evolving.
                        </p>
                        <p className="text-gray-300 font-light leading-relaxed text-lg">
                            Whether you are pursuing the perfect handstand, seeking deeper flexibility, or looking
                            to build functional, aesthetic muscle, Calsyog provides the tools and the knowledge
                            necessary for your journey toward self-mastery.
                        </p>
                    </section>
                </motion.div>
            </div>
        </div>
    );
}
