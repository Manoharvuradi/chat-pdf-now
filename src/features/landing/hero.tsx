'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-linear-to-rr from-blue-50 via-purple-50 to-pink-50 dark:from-blue-950/20 dark:via-purple-950/20 dark:to-pink-950/20" />
      
      {/* Grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)]" />
      
      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-linear-to-r from-emerald-600 to-green-500 px-4 py-1.5 text-sm font-medium text-white shadow-lg">
            <Sparkles className="h-4 w-4" />
            AI-Powered PDF Chat
          </div>
          
          {/* Heading */}
          <h1 className="text-5xl font-black tracking-tight text-stone-900 dark:text-white sm:text-7xl">
            Chat with Your
            <span className="bg-linear-to-r from-emerald-600 to-green-500 bg-clip-text text-transparent">
              {' '}PDFs
            </span>
          </h1>
          
          {/* Subheading */}
          <p className="mt-6 text-lg leading-8 text-stone-600 dark:text-stone-400">
            Upload any PDF and start asking questions. Get instant answers powered by AI. 
            No more endless scrolling through documents.
          </p>
          
          {/* CTA Buttons */}
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              asChild
              size="lg"
              className="bg-linear-to-r from-emerald-600 to-green-500 px-8 text-lg font-semibold shadow-xl hover:shadow-2xl"
            >
              <Link href="/documents">
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-2 px-8 text-lg font-semibold"
            >
              <Link href="#pricing">
                View Pricing
              </Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-stone-900 dark:text-white">30</div>
              <div className="text-sm text-stone-600 dark:text-stone-400">Free Questions</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-stone-900 dark:text-white">3</div>
              <div className="text-sm text-stone-600 dark:text-stone-400">Free PDFs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-stone-900 dark:text-white"> 5s</div>
              <div className="text-sm text-stone-600 dark:text-stone-400">Response Time</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}