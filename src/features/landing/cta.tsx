import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function CTA() {
  return (
    <section className="bg-linear-to-r from-emerald-600 to-green-500 py-24">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to transform how you read PDFs?
          </h2>
          <p className="mt-6 text-lg leading-8 text-blue-100">
            Start chatting with your documents today.
          </p>
          <div className="mt-10">
            <Button
              asChild
              size="lg"
              className="bg-white px-8 text-lg font-semibold text-blue-600 shadow-xl hover:bg-stone-50"
            >
              <Link href="/documents">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}