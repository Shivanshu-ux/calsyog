import { motion } from 'framer-motion';
import { SectionHeading } from '../components/SectionHeading';

export function LearnCalisthenics() {
    return (
        <div className="pt-24 min-h-screen bg-background text-foreground">
            <div className="container mx-auto px-6 py-12">
                <SectionHeading title="The Art of Calisthenics" as="h1" />
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="prose prose-invert max-w-none prose-p:text-gray-300 prose-headings:text-primary"
                >
                    <p className="text-xl leading-relaxed mb-8 font-light max-w-4xl">
                        Calisthenics is a form of strength training consisting of a variety of movements that exercise large muscle groups. These exercises are often performed rhythmically and with minimal equipment, as bodyweight exercises. They are intended to increase strength, fitness, and flexibility, through movements such as pulling, pushing, bending, jumping, or swinging, using one's body weight for resistance.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 mb-16">
                        <div className="bg-black/40 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">Core Principles</h2>
                            <ul className="space-y-4 text-gray-300">
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Progressive Overload:</strong> Gradually increasing the difficulty of exercises to continually challenge the muscles and promote growth.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Body Control and Awareness:</strong> Developing kinesthetic awareness and mastering the movement of one's body in space.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Functional Strength:</strong> Building strength that translates directly to real-world physical activities and overall athleticism.</span>
                                </li>
                                <li className="flex items-start">
                                    <span className="text-primary mr-3 text-xl">•</span>
                                    <span><strong>Flexibility and Mobility:</strong> Ensuring muscles and joints can move through their full range of motion safely and effectively.</span>
                                </li>
                            </ul>
                        </div>
                        <div className="relative group overflow-hidden rounded-lg border border-[#1a1a1a]">
                            <img
                                src="/mcal.png"
                                alt="Calisthenics Training"
                                className="w-full h-full object-cover min-h-[400px] transition-transform duration-700 group-hover:scale-105 opacity-80"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                        </div>
                    </div>

                    <div className="space-y-16">
                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">1. Introduction to Calisthenics</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Meaning and Definition</h3><p className="font-light">From the ancient Greek words "kalos" (beauty) and "sthenos" (strength). It's the art of using your bodyweight to maximize physical power and athletic ability.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Origin and History</h3><p className="font-light">Practiced by ancient Greeks and Spartans for military preparation. It has evolved into a global fitness movement and competitive sport today.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Difference Between Calisthenics and Gym Training</h3><p className="font-light">Gym training isolates muscles with external weights, while calisthenics relies on bodyweight and compound movements for functional strength and neuromuscular control.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">2. Principles of Calisthenics</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Bodyweight Resistance</h3><p className="font-light">Using gravity and the lever of your own body as the primary source of resistance to build strength and muscle mass.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Progressive Overload</h3><p className="font-light">Instead of adding plates, you change the mechanical advantage or leverage (e.g., moving from a normal pushup to a one-arm pushup).</p></div>
                                <div><h3 className="text-xl font-medium text-white">Mind-Muscle Connection</h3><p className="font-light">Intense focus on activating specific muscle groups during complex movements to ensure proper form and maximize tension.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Consistency and Discipline</h3><p className="font-light">Mastery of advanced skills requires months or years of dedicated, consistent practice and rigorous discipline.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Mobility and Control</h3><p className="font-light">Developing the active flexibility required to control your body smoothly through extended ranges of motion.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">3. Types of Calisthenics Training</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Beginner Level Training</h3><p className="font-light text-sm">Focuses on building foundational strength with basic pull-ups, push-ups, dips, and squats.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Intermediate Level Training</h3><p className="font-light text-sm">Introduces explosive movements and early progressions for advanced skills like the muscle-up.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Advanced/Street Workout</h3><p className="font-light text-sm">High-level mastery combining static holds, freestyle flows, and gravity-defying dynamic tricks.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Static Holds</h3><p className="font-light text-sm">Isometric exercises holding the body in a fixed position, demanding immense core and connective tissue strength.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Dynamic Movements</h3><p className="font-light text-sm">Explosive, rhythmic movements that train fast-twitch muscle fibers, agility, and spatial awareness.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Skill-Based Training</h3><p className="font-light text-sm">Dedicated sessions specifically targeting the neurological adaptations required for complex calisthenics moves.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">4. Fundamental Exercises</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-300">
                                <div><h3 className="text-lg font-medium text-white">Push Exercises</h3><p className="font-light text-sm">Push-ups, dips, and handstand push-ups to develop the chest, shoulders, and triceps.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Pull Exercises</h3><p className="font-light text-sm">Pull-ups, chin-ups, and australian pull-ups to build a powerful back and strong biceps.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Leg Exercises</h3><p className="font-light text-sm">Bodyweight squats, lunges, and pistol squats for lower body power and balance.</p></div>
                                <div><h3 className="text-lg font-medium text-white">Core Exercises</h3><p className="font-light text-sm">Planks, L-sits, and hanging leg raises to forge an unbreakable midsection and spinal stability.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">5. Skill Development</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Handstand</h3><p className="font-light text-sm">The foundation of inverted balance, requiring shoulder mobility and micro-adjustments in the wrists.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Front Lever</h3><p className="font-light text-sm">Holding the body completely horizontal facing upward, relying heavily on lat and core strength.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Back Lever</h3><p className="font-light text-sm">A horizontal hold facing the ground that heavily stresses the chest, shoulders, and biceps tendon.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Planche</h3><p className="font-light text-sm">Balancing horizontally on the hands with feet off the ground, arguably the hardest straight-arm static skill.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Muscle-Up</h3><p className="font-light text-sm">An explosive pull-up that transitions directly into a straight-bar dip in one fluid motion.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Human Flag</h3><p className="font-light text-sm">Holding the body horizontally outward from a vertical pole, requiring immense oblique and lateral chain strength.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">6. Training Structure</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Warm-Up Routine</h3><p className="font-light">Essential joint mobilization and dynamic stretching to prepare the central nervous system and prevent injury.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Main Workout</h3><p className="font-light">The core volume of the session, focusing on fundamental pushes, pulls, and legs using progressive overload.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Skill Practice</h3><p className="font-light">Practicing advanced movements (like handstands) while fresh, prior to major fatigue setting in.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Cool Down & Stretching</h3><p className="font-light">Passive stretching to downregulate the nervous system and improve the mobility required for advanced skills.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Rest and Recovery</h3><p className="font-light">Allowing connective tissues (tendons and ligaments) which heal slower than muscles, adequate time to repair.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">7. Progressions and Regressions</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Beginner Progressions</h3><p className="font-light">Starting with modified versions of exercises, such as knee push-ups or negative (eccentric) pull-ups.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Assisted Variations</h3><p className="font-light">Using resistance bands or workout partners to reduce the percentage of body weight being lifted.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Advanced Variations</h3><p className="font-light">Making exercises harder by changing leverage (e.g., archer push-ups) or removing points of contact (e.g., one-arm pull-ups).</p></div>
                                <div><h3 className="text-xl font-medium text-white">How to Scale Exercises</h3><p className="font-light">Adjusting sets, reps, and leverage points to perfectly match an athlete's current level of strength safely.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">8. Benefits of Calisthenics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Strength Development</h3><p className="font-light">Builds dense, functional muscle and real-world strength by moving the body through space.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Muscle Growth</h3><p className="font-light">Hypertrophy is easily achievable with appropriate volume and time under tension using bodyweight alone.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Fat Loss</h3><p className="font-light">High-intensity calisthenics burns significant calories and inherently encourages athletes to maintain lower body fat.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Improved Mobility</h3><p className="font-light">Moves like deep squats and skin-the-cats demand and concurrently develop extreme joint mobility.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Better Body Control</h3><p className="font-light">Develops proprioception—your brain's ability to know exactly where your body is in space.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Functional Fitness</h3><p className="font-light">Trains the body to perform better in daily life activities and athletic endeavors across all sports.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">9. Nutrition for Calisthenics</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Protein Requirements</h3><p className="font-light">Crucial for repairing muscle and connective tissues heavily taxed during intense bodyweight training.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Balanced Diet</h3><p className="font-light">Adequate complex carbohydrates to fuel intense workouts, and healthy fats for hormone regulation.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Hydration</h3><p className="font-light">Essential for joint lubrication, muscle function, and recovery, especially when training outdoors.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Bulking vs Cutting</h3><p className="font-light">Excess weight acts as an immediate penalty in calisthenics; "lean bulking" is generally preferred over "dirty bulking".</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">10. Equipment Used</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Pull-Up Bar</h3><p className="font-light">The foundational piece of equipment for all horizontal and vertical pulling movements and static holds.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Parallel Bars</h3><p className="font-light">Essential for practicing dips, L-sits, planches, and dynamic freestyle transitions.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Gymnastic Rings</h3><p className="font-light">Free-moving equipment that provides no stability, forcing the core and stabilizer muscles into overdrive.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Resistance Bands</h3><p className="font-light">Used both to assist in learning difficult skills (like pulling up) and to add resistance to basic moves (like pushups).</p></div>
                                <div><h3 className="text-xl font-medium text-white">Weighted Vest</h3><p className="font-light">Worn to increase resistance for fundamental exercises once bodyweight alone is no longer challenging enough.</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">11. Common Mistakes and Safety</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Improper Form</h3><p className="font-light">"Ego lifting" in calisthenics by using momentum instead of strict muscle engagement, risking severe tendon injury.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Overtraining</h3><p className="font-light">Ignoring rest days results in central nervous system burnout and persistent connective tissue inflammation.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Skipping Warm-Up</h3><p className="font-light">Diving straight into heavy statics (like planches) without warming up the wrists and shoulders is a recipe for disaster.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Injury Prevention</h3><p className="font-light">Prehabilitating joints, focusing on mobility, and stopping immediately when experiencing sharp pain rather than "pushing through".</p></div>
                            </div>
                        </section>

                        <section className="bg-black/20 p-8 rounded-lg border border-[#1a1a1a]">
                            <h2 className="text-3xl font-serif mb-6 text-primary">12. Calisthenics as a Lifestyle</h2>
                            <div className="space-y-4 text-gray-300">
                                <div><h3 className="text-xl font-medium text-white">Discipline and Mental Strength</h3><p className="font-light">Overcoming the extreme frustration of learning difficult neurological skills builds immense mental fortitude.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Community and Street Workout Culture</h3><p className="font-light">A global, highly supportive community characterized by outdoor parks, team training, and freely sharing knowledge.</p></div>
                                <div><h3 className="text-xl font-medium text-white">Long-Term Progression</h3><p className="font-light">The endless journey of mastering the body; there is always a harder variation, a cleaner line, or a longer hold to achieve.</p></div>
                            </div>
                        </section>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
