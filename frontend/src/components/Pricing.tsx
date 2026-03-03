import { Check } from 'lucide-react';
import { SectionHeading } from './SectionHeading';

const plans = [
    {
        name: "Starter",
        price: "$29",
        description: "Perfect for independent instructors.",
        features: [
            "Up to 50 active students",
            "Basic scheduling",
            "Email support",
            "Mobile app access"
        ]
    },
    {
        name: "Pro",
        price: "$79",
        featured: true,
        description: "For growing studios with multiple classes.",
        features: [
            "Unlimited students",
            "Advanced scheduling & waitlists",
            "Payment processing",
            "Priority support",
            "Custom branding"
        ]
    },
    {
        name: "Enterprise",
        price: "Custom",
        description: "Tailored solutions for large franchises.",
        features: [
            "Multi-location support",
            "Dedicated account manager",
            "API access",
            "SSO & advanced security",
            "White-label mobile app"
        ]
    }
];

export function Pricing() {
    return (
        <section id="pricing" className="py-24 bg-slate-900 relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-900/0 to-slate-900/0 pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <SectionHeading
                    title="Simple, transparent pricing"
                    subtitle="Choose the perfect plan for your studio's journey. No hidden fees."
                    as="h2"
                    className="mb-16"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, index) => (
                        <div
                            key={index}
                            className={`relative p-8 rounded-2xl border ${plan.featured ? 'border-indigo-500 bg-slate-800/50 shadow-2xl shadow-indigo-500/10' : 'border-white/10 bg-slate-900'} flex flex-col`}
                        >
                            {plan.featured && (
                                <div className="absolute top-0 right-0 -mr-1 -mt-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                                    POPULAR
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                                <p className="text-slate-400 text-sm mb-6">{plan.description}</p>
                                <div className="flex items-baseline">
                                    <span className="text-4xl font-bold text-white">{plan.price}</span>
                                    {plan.price !== "Custom" && <span className="text-slate-500 ml-2">/month</span>}
                                </div>
                            </div>

                            <ul className="space-y-4 mb-8 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start">
                                        <Check className="h-5 w-5 text-indigo-400 mr-3 flex-shrink-0" />
                                        <span className="text-slate-300 text-sm">{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-3 px-4 rounded-xl font-semibold transition-all ${plan.featured
                                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg hover:shadow-indigo-500/25'
                                : 'bg-white/10 hover:bg-white/20 text-white'
                                }`}>
                                Choose {plan.name}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
