import { Zap, Shield, Brain, Clock, Upload, Sparkles } from 'lucide-react';

const features = [
  {
    name: 'Lightning Fast',
    description: 'Get instant answers from your PDFs. No waiting, no hassle.',
    icon: Zap,
  },
  {
    name: 'AI-Powered',
    description: 'Advanced AI understands context and provides accurate answers.',
    icon: Brain,
  },
  {
    name: 'Secure & Private',
    description: 'Your documents are encrypted and never shared with third parties.',
    icon: Shield,
  },
  {
    name: 'Easy Upload',
    description: 'Simply drag and drop your PDFs. Start chatting in seconds.',
    icon: Upload,
  },
  {
    name: '24/7 Availability',
    description: 'Access your documents and chat anytime, anywhere.',
    icon: Clock,
  },
  {
    name: 'Smart Insights',
    description: 'Discover insights you might have missed with intelligent analysis.',
    icon: Sparkles,
  },
];

export function Features() {
  return (
    <section id='features' className="py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-base font-semibold leading-7 text-emerald-600 dark:text-emerald-400">
            Everything you need
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
            Powerful features for your PDFs
          </p>
          <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
            Transform the way you interact with documents. Extract information, get summaries, and discover insights effortlessly.
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-7xl">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.name}
                className="relative rounded-2xl border border-stone-200 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-stone-800 dark:bg-stone-900"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-r from-emerald-600 to-green-500">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-stone-900 dark:text-white">
                    {feature.name}
                  </h3>
                </div>
                <p className="mt-4 text-stone-600 dark:text-stone-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}