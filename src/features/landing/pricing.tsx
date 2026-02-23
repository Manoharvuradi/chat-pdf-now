import { Check } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const tiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for trying out',
    features: [
      '30 questions per month',
      '3 PDF uploads',
      'Basic AI responses',
      'Secure storage',
    ],
    cta: 'Get Started',
    href: '/documents',
    popular: false,
  },
  {
    name: 'Pay-as-you-go',
    price: '$5',
    description: '500 question credits',
    features: [
      '500 questions',
      'Unlimited PDFs',
      'Never expires',
      'No subscription',
    ],
    cta: 'Buy Now',
    href: '/settings/billing',
    popular: false,
  },
  {
    name: 'Power User',
    price: '$9',
    period: '/month',
    description: 'For heavy users',
    features: [
      'Unlimited questions',
      'Unlimited PDFs',
      'Priority support',
      'Cancel anytime',
    ],
    cta: 'Subscribe',
    href: '/settings/billing',
    popular: true,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
            Choose the plan that works best for you
          </p>
        </div>
        
        <div className="mx-auto mt-16 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-3">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 ring-1 ${
                tier.popular
                  ? 'bg-linear-to-r from-blue-50 to-purple-50 ring-emerald-600 dark:from-blue-950/50 dark:to-purple-950/50'
                  : 'bg-white ring-stone-200 dark:bg-stone-900 dark:ring-stone-800'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="inline-flex rounded-full bg-linear-to-r from-emerald-600 to-green-500 px-4 py-1 text-sm font-semibold text-white shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}
              
              <h3 className="text-2xl font-bold text-stone-900 dark:text-white">
                {tier.name}
              </h3>
              <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
                {tier.description}
              </p>
              
              <p className="mt-6">
                <span className="text-4xl font-bold text-stone-900 dark:text-white">
                  {tier.price}
                </span>
                {tier.period && (
                  <span className="text-stone-600 dark:text-stone-400">
                    {tier.period}
                  </span>
                )}
              </p>
              
              <ul className="mt-8 space-y-3">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-emerald-600 dark:text-blue-400" />
                    <span className="text-stone-600 dark:text-stone-400">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              
              <Button
                asChild
                className={`mt-8 w-full ${
                  tier.popular
                    ? 'bg-linear-to-r from-emerald-600 to-green-500'
                    : ''
                }`}
                variant={tier.popular ? 'default' : 'outline'}
              >
                <Link href={tier.href as any}>
                  {tier.cta}
                </Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}