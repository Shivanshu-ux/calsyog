import { Calendar, Users, CreditCard, BarChart, Shield, Smartphone } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const features = [
    {
        icon: Calendar,
        title: "Smart Scheduling",
        description: "Drag-and-drop calendar with automated conflict detection and waitlist management."
    },
    {
        icon: Users,
        title: "Student Management",
        description: "Detailed profiles, attendance tracking, and personalized progress notes."
    },
    {
        icon: CreditCard,
        title: "Seamless Payments",
        description: "Secure payment processing for classes, workshops, and memberships."
    },
    {
        icon: BarChart,
        title: "Insightful Analytics",
        description: "Track revenue, retention, and class popularity with beautiful visualizations."
    },
    {
        icon: Shield,
        title: "Secure & Private",
        description: "Enterprise-grade data protection to keep your studio and student data safe."
    },
    {
        icon: Smartphone,
        title: "Mobile App",
        description: "Dedicated app for instructors and students to manage bookings on the go."
    }
];

export function Features() {
    return (
        <section id="features" className="py-24 bg-slate-950 relative">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeading
                    title="Everything you need to run your studio"
                    subtitle="Powerful tools designed specifically for the unique needs of yoga studios and independent instructors."
                    as="h2"
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div key={index} className="group p-8 rounded-2xl bg-slate-900 border border-white/5 hover:border-indigo-500/30 hover:bg-slate-800/50 transition-all duration-300">
                            <div className="w-12 h-12 rounded-lg bg-indigo-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <feature.icon className="h-6 w-6 text-indigo-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
