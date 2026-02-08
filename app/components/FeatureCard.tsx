import React from 'react';

interface FeatureCardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    icon?: React.ReactNode;
}

export default function FeatureCard({ children, className = '', title, icon }: FeatureCardProps) {
    return (
        <div className={`bg-white/60 backdrop-blur-sm border border-grid p-7 md:p-8 flex flex-col h-full shadow-sm hover:shadow-md transition-all rounded-sm ${className}`}>
            {/* Header */}
            <div className="mb-5 flex items-center justify-between">
                {icon && <div className="p-2.5 bg-paper rounded-sm border border-grid text-accent">{icon}</div>}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-ink mb-3 font-space leading-tight">
                {title}
            </h3>

            <div className="text-ink-light text-[15px] leading-relaxed flex-grow font-inter">
                {children}
            </div>
        </div>
    );
}
