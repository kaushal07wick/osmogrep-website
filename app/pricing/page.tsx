'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

type Plan = {
  id: string;
  category: 'solo' | 'team' | 'enterprise';
  name: string;
  price: string;
  period: string;
  note: string;
  features: string[];
  cta: string;
};

const plans: Plan[] = [
  {
    id: 'solo',
    category: 'solo',
    name: 'Solo',
    price: '$2',
    period: '/mo',
    note: 'For individuals testing runtime workflows.',
    features: ['Runtime checks', 'Basic test runs', 'Single project'],
    cta: 'Choose Solo',
  },
  {
    id: 'solo-pro',
    category: 'solo',
    name: 'Solo Pro',
    price: '$10',
    period: '/mo',
    note: 'For power users shipping frequently.',
    features: ['Everything in Solo', 'Patch suggestions', 'Stress presets'],
    cta: 'Choose Solo Pro',
  },
  {
    id: 'teams',
    category: 'team',
    name: 'Teams',
    price: '$200',
    period: '/mo',
    note: 'For collaborative runtime validation.',
    features: ['Parallel execution', 'Audit logs', 'Shared projects', 'Team controls'],
    cta: 'Choose Teams',
  },
  {
    id: 'enterprise',
    category: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    note: 'For scale, compliance, and dedicated support.',
    features: ['SSO/SAML', 'Private deployment', 'Custom integrations', 'Dedicated support'],
    cta: 'Contact Sales',
  },
];

export default function PricingPage() {
  const [selected, setSelected] = useState<'solo' | 'team' | 'enterprise'>('solo');

  const visiblePlans = useMemo(
    () => plans.filter((plan) => plan.category === selected),
    [selected],
  );

  return (
    <main className="min-h-screen pt-24 pb-28">
      <section className="container mx-auto max-w-[1200px] px-6">
        <div className="max-w-3xl mb-10">
          <div className="page-chip mb-4">
            Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight text-accent">
            Select your plan
          </h1>
          <p className="mt-4 text-lg text-ink-light">
            Choose Solo, Team, or Enterprise and compare the plans instantly.
          </p>
        </div>

        <div className="inline-flex border border-grid bg-white/70 rounded-sm p-1 gap-1 mb-8">
          <button
            className={`px-4 py-2 text-sm rounded-sm transition-colors ${selected === 'solo' ? 'bg-accent text-white' : 'text-ink-light hover:text-accent hover:bg-accent/10 active:bg-accent/15'}`}
            onClick={() => setSelected('solo')}
          >
            Solo
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-sm transition-colors ${selected === 'team' ? 'bg-accent text-white' : 'text-ink-light hover:text-accent hover:bg-accent/10 active:bg-accent/15'}`}
            onClick={() => setSelected('team')}
          >
            Team
          </button>
          <button
            className={`px-4 py-2 text-sm rounded-sm transition-colors ${selected === 'enterprise' ? 'bg-accent text-white' : 'text-ink-light hover:text-accent hover:bg-accent/10 active:bg-accent/15'}`}
            onClick={() => setSelected('enterprise')}
          >
            Enterprise
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {visiblePlans.map((plan) => (
            <div key={plan.id} className="border border-grid rounded-sm p-6 bg-white/65 backdrop-blur-sm">
              <h2 className="text-2xl font-bold text-accent">{plan.name}</h2>
              <div className="mt-3">
                <span className="text-4xl font-bold text-ink">{plan.price}</span>
                <span className="text-sm text-ink-light ml-1">{plan.period}</span>
              </div>
              <p className="mt-2 text-sm text-ink-light">{plan.note}</p>

              <ul className="mt-5 space-y-2 text-sm text-ink-light">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <span className="text-accent">+</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button className="btn-primary mt-6 w-full py-2.5">
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-[1200px] px-6 mt-16">
        <div className="border border-grid rounded-sm bg-white/60 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-accent">Need deployment advice?</h2>
            <p className="text-sm text-ink-light mt-1">We can help map the right plan for your runtime and CI usage.</p>
          </div>
          <div className="flex gap-3">
            <Link href="/get-started" className="btn-primary px-5 py-2.5">
              Get Started
            </Link>
            <Link href="/docs" className="btn-outline px-5 py-2.5">
              View Docs
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
