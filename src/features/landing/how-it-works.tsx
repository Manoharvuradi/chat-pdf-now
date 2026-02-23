import { Upload, MessageSquare, Sparkles } from 'lucide-react';

const steps = [
  {
    name: 'Upload Your PDF',
    description: 'Drag and drop or click to upload any PDF document.',
    icon: Upload,
  },
  {
    name: 'Ask Questions',
    description: 'Type your questions in natural language.',
    icon: MessageSquare,
  },
  {
    name: 'Get Instant Answers',
    description: 'AI analyzes your document and provides accurate answers.',
    icon: Sparkles,
  },
];

export function HowItWorks() {
  return (
    <section id='how-it-works' className="bg-stone-50 py-24 dark:bg-stone-900/50 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 dark:text-white sm:text-4xl">
            How it works
          </h2>
          <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
            Get started in three simple steps
          </p>
        </div>
        
        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.name} className="relative text-center">
                {/* Step number */}
                <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-r from-emerald-600 to-green-500 text-2xl font-bold text-white shadow-lg">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-lg bg-white shadow-md dark:bg-stone-800">
                  <step.icon className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold text-stone-900 dark:text-white">
                  {step.name}
                </h3>
                <p className="mt-2 text-stone-600 dark:text-stone-400">
                  {step.description}
                </p>
                
                {/* Connector */}
                {index < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden h-0.5 w-full bg-linear-to-r from-emerald-600 to-green-500 lg:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}