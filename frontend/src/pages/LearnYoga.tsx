import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';
import { SEO } from '../components/SEO';

export function LearnYoga() {
    return (
        <div className="pt-24 min-h-screen bg-background text-foreground">
            <SEO 
                title="Learn Yoga - The Philosophy of Mindfulness" 
                description="Explore the ancient roots of Yoga, its different styles, core principles, and the incredible benefits it brings to mind and body."
                canonical="/learn/yoga" 
            />
            <div className="container mx-auto px-6 py-12">
                <SectionHeading title="The Philosophy of Yoga" as="h1" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-primary"
                >
                    <p className="text-xl leading-relaxed mb-8 font-light max-w-4xl">
                        Yoga is a physical, mental, and spiritual practice that originated in ancient India. It aims to control the mind, recognize a detached witness-consciousness, and transcend the ego. Engaging in yoga can help improve your flexibility, balance, and endurance while reducing stress and promoting relaxation.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 mb-16">
                        <div className="relative group overflow-hidden rounded-lg border border-[#1a1a1a] order-2 md:order-1">
                            <img
                                src="/myog.png"
                                alt="Yoga Practice"
                                className="w-full h-full object-cover min-h-[400px] transition-transform duration-700 group-hover:scale-105 opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                        <div className="bg-black/40 p-8 rounded-lg border border-[#1a1a1a] order-1 md:order-2">
                            <h2 className="text-3xl font-serif mb-6 text-primary">Core Principles</h2>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Pranayama (Breath Control):</strong> Using the breath to focus the mind and balance energy flows within the body throughout practice.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Asanas (Physical Postures):</strong> Poses designed to build strength, increase flexibility, and prepare the body for meditation.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Dhyana (Meditation):</strong> Developing uninterrupted contemplation and deep concentration for a calm and present mind.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Inner Balance:</strong> Integrating all practices to achieve a state of harmony and equanimity in everyday life.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-16">
                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">1. Introduction to Yoga</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Meaning and Origin of Yoga</h3><p className="font-light">Derived from the Sanskrit root "Yuj," meaning to yoke or unite. It originated in ancient India as a spiritual discipline.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Definition of Yoga</h3><p className="font-light">A practice that harmonizes the mind, body, and spirit. It is the cessation of the movements of the mind.</p></div>
                                <div><h3 className="text-xl font-medium text-white">History of Yoga</h3><p className="font-light">Tracing back over 5,000 years, yoga has evolved from ancient Vedic traditions to modern global practices.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">2. Philosophy of Yoga</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">The Eight Limbs of Yoga (Ashtanga Yoga)</h3><p className="font-light">Patanjali's foundational framework for a meaningful life. It serves as a guide for ethical living and spiritual growth.</p></div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div><h3 className="text-xl font-medium text-white">Yama (Moral Discipline)</h3><p className="font-light">Ethical standards and sense of integrity. Focusing on our behavior and how we conduct ourselves.</p></div>
                                    <div><h3 className="text-xl font-medium text-white">Niyama (Self-Discipline)</h3><p className="font-light">Spiritual observances and self-discipline. Activities like temple visits and personal meditation practices.</p></div>
                                    <div><h3 className="text-xl font-medium text-white">Asana (Postures)</h3><p className="font-light">The physical postures practiced in yoga. Designed to purify the body and provide physical strength.</p></div>
                                    <div><h3 className="text-xl font-medium text-white">Pranayama (Breathing Techniques)</h3><p className="font-light">Breath control, consisting of techniques to gain mastery over the respiratory process. Recognizing the connection between breath and mind.</p></div>
                                    <div><h3 className="text-xl font-medium text-white">Pratyahara (Withdrawal of Senses)</h3><p className="font-light">The conscious effort to draw our awareness away from the external world. Directing our attention internally.</p></div>
                                    <div><h3 className="text-xl font-medium text-white">Dharana (Concentration)</h3><p className="font-light">Focusing attention on a single point. Preparing the mind for meditation by slowing down the thought process.</p></div>
                                    <div><h3 className="text-xl font-medium text-white">Dhyana (Meditation)</h3><p className="font-light">Uninterrupted flow of concentration. Being keenly aware without focus, enveloped in profound stillness.</p></div>
                                    <div><h3 className="text-xl font-medium text-white">Samadhi (Self-Realization)</h3><p className="font-light">State of ecstasy and merging with the divine. The mediator transcends the self, establishing a profound connection to all living things.</p></div>
                                </div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">3. Types of Yoga</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Hatha Yoga</h3><p className="font-light text-sm">A physical focus balancing sun (ha) and moon (tha) energies.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Raja Yoga</h3><p className="font-light text-sm">The "Royal" path focusing on meditation and mind control.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Karma Yoga</h3><p className="font-light text-sm">The path of selfless service and action without attachment.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Bhakti Yoga</h3><p className="font-light text-sm">The path of devotion, emotion, and love for the divine.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Jnana Yoga</h3><p className="font-light text-sm">The path of knowledge, wisdom, and intellectual inquiry.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Ashtanga Yoga</h3><p className="font-light text-sm">A rigorous, structured series of postures synced with breath.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Kundalini Yoga</h3><p className="font-light text-sm">Focuses on awakening the dormant energy at the base of the spine.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Power Yoga</h3><p className="font-light text-sm">A fitness-based, vigorous vinyasa-style practice for strength.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Yin Yoga</h3><p className="font-light text-sm">Slow-paced practice holding poses for longer periods to target deep tissues.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">4. Yoga Asanas (Postures)</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-300">
                                <div><h3 className="text-lg font-medium text-white">Standing Poses</h3><p className="font-light text-sm">Builds strength, stamina, and grounding, like Warrior or Mountain pose.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Sitting Poses</h3><p className="font-light text-sm">Improves flexibility in hips and lower back, perfect for meditation.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Forward Bends</h3><p className="font-light text-sm">Calming poses that stretch the hamstrings and lower back.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Backward Bends</h3><p className="font-light text-sm">Heart-opening poses that energize and strengthen the spine.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Twisting Poses</h3><p className="font-light text-sm">Detoxifying movements that improve spinal mobility and digestion.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Balancing Poses</h3><p className="font-light text-sm">Enhances focus, core strength, and physical stability.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Inversions</h3><p className="font-light text-sm">Poses where the head is below the heart, improving circulation.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Relaxation Poses</h3><p className="font-light text-sm">Restorative poses like Savasana to calm the nervous system.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">5. Pranayama (Breathing Techniques)</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Importance of Breath Control</h3><p className="font-light">Connects the mind and body, regulating the nervous system. Essential for focusing energy during practice.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Types of Pranayama</h3><p className="font-light">Includes techniques like Ujjayi (ocean breath), Nadi Shodhana (alternate nostril), and Kapalabhati (skull shining breath).</p></div>
                                <div><h3 className="text-xl font-medium text-white">Benefits of Pranayama</h3><p className="font-light">Reduces stress, improves lung capacity, and enhances mental clarity. Oxygenates the blood efficiently.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">6. Meditation in Yoga</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Types of Meditation</h3><p className="font-light">Includes Mindfulness, Chakra, Mantra, and Vipassana meditation styles, each with distinct focus areas.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Benefits of Meditation</h3><p className="font-light">Promotes emotional health, enhances self-awareness, and improves attention span.</p></div>
                                <div><h3 className="text-xl font-medium text-white">How to Practice Meditation</h3><p className="font-light">Find a comfortable seat, focus on the breath or a mantra, and gently guide wandering thoughts back to the present.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">7. Benefits of Yoga</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Physical Benefits</h3><p className="font-light">Increased flexibility, muscle strength, and improved respiration, energy, and vitality.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Mental Benefits</h3><p className="font-light">Mental clarity, calmness, and sharpened concentration. Relieves chronic stress patterns.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Emotional Benefits</h3><p className="font-light">Encourages self-care and positivity. Helps manage anxiety and depressive symptoms.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Spiritual Benefits</h3><p className="font-light">Fosters a deeper sense of meaning and connection. Encourages mindfulness and present-moment awareness.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">8. Yoga for Different Age Groups</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Yoga for Children</h3><p className="font-light">Improves concentration, body awareness, and manages stress through fun, engaging poses.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Yoga for Adults</h3><p className="font-light">Balances hectic lifestyles, maintains physical fitness, and provides stress relief from work and daily life.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Yoga for Seniors</h3><p className="font-light">Focuses on gentle movements to maintain mobility, balance, and independence, reducing the risk of falls.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">9. Yoga and Health</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Yoga for Stress Relief</h3><p className="font-light">Lowers cortisol levels through mindful breathing and relaxation techniques.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Yoga for Weight Loss</h3><p className="font-light">Active styles like Ashtanga burn calories while promoting mindful eating habits.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Yoga for Flexibility</h3><p className="font-light">Systematically stretches and lengthens muscles, improving overall range of motion.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Yoga for Back Pain</h3><p className="font-light">Strengthens core muscles and improves posture, alleviating chronic tension.</p></div>
                                <div className="md:col-span-2"><h3 className="text-xl font-medium text-white">Yoga for Heart Health</h3><p className="font-light">Improves circulation, lowers blood pressure, and reduces risk factors for heart disease.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">10. Diet and Lifestyle in Yoga</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Yogic Diet</h3><p className="font-light">A balanced, natural approach to eating that supports physical health and spiritual practice.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Sattvic, Rajasic, and Tamasic Foods</h3><p className="font-light">Categorizing foods by energy: Sattvic (pure/light), Rajasic (stimulating), and Tamasic (heavy/dull).</p></div>
                                <div><h3 className="text-xl font-medium text-white">Daily Routine (Dinacharya)</h3><p className="font-light">Aligning daily activities with natural cycles to promote optimal health and energy levels.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">11. Safety and Precautions</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Do’s and Don’ts</h3><p className="font-light">Do listen to your body and practice on an empty stomach. Don't force postures or practice through sharp pain.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Contraindications</h3><p className="font-light">Certain conditions (like pregnancy or high blood pressure) require modifying or avoiding specific poses.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Common Mistakes</h3><p className="font-light">Holding the breath, pushing past physical limits, and comparing oneself to others in the class.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">12. Conclusion</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Importance of Consistency</h3><p className="font-light">Regular practice, even for a few minutes daily, yields far greater benefits than irregular, intense sessions.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Yoga as a Way of Life</h3><p className="font-light">Beyond the mat, yoga is a holistic approach to living mindfully, compassionately, and authentically.</p></div>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
