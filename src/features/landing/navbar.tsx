'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, FileText, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@clerk/nextjs';

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isSignedIn } = useAuth();

  return (
<nav className="sticky top-0 z-50 border-b border-stone-200 bg-white/80 backdrop-blur-lg dark:border-stone-800 dark:bg-stone-950/80">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="flex h-16 items-center">
          
          {/* 1. Logo Container (Left aligned) */}
          <div className="flex flex-1 items-center justify-start">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-linear-to-r from-emerald-600 to-green-600">
                <Bot className="size-6 text-white" />
              </div>
              <span className="hidden font-bold text-stone-900 dark:text-white sm:inline-block">
                Chat Pdf Now
              </span>
            </Link>
          </div>

          {/* 2. Desktop Navigation (Perfectly Centered) */}
          <div className="hidden items-center gap-8 md:flex">
            <Link
              href="#features"
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            >
              Pricing
            </Link>
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-stone-600 transition-colors hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            >
              How It Works
            </Link>
          </div>

          {/* 3. CTA Buttons (Right aligned) */}
          <div className="hidden flex-1 items-center justify-end gap-4 md:flex">
            {isSignedIn ? (
              <Button asChild className="bg-linear-to-r from-emerald-600 to-green-600 text-white">
                <Link href="/documents">Go to Dashboard</Link>
              </Button>
            ) : (
              <>
                <Button asChild variant="ghost">
                  <Link href={"/sign-in" as any}>Sign In</Link>
                </Button>
                <Button asChild className="bg-linear-to-r from-emerald-600 to-green-600 text-white">
                  <Link href={"/sign-up" as any}>Get Started</Link>
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-stone-700 dark:text-stone-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {mobileMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-t border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 md:hidden">
          <div className="space-y-1 px-6 py-4">
            <Link
              href="#features"
              className="block rounded-lg px-3 py-2 text-base font-medium text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              href="#pricing"
              className="block rounded-lg px-3 py-2 text-base font-medium text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="#how-it-works"
              className="block rounded-lg px-3 py-2 text-base font-medium text-stone-600 hover:bg-stone-50 dark:text-stone-400 dark:hover:bg-stone-900"
              onClick={() => setMobileMenuOpen(false)}
            >
              How It Works
            </Link>
            
            <div className="mt-4 border-t border-stone-100 pt-4 dark:border-stone-800">
              {isSignedIn ? (
                <Button asChild className="w-full bg-linear-to-r from-emerald-600 to-green-600">
                  <Link href="/documents">Go to Dashboard</Link>
                </Button>
              ) : (
                <div className="flex flex-col gap-2">
                  <Button asChild variant="outline" className="w-full">
                    <Link href={"/sign-in" as any}>Sign In</Link>
                  </Button>
                  <Button asChild className="w-full bg-linear-to-r from-emerald-600 to-green-600 text-white">
                    <Link href={"/sign-up" as any}>Get Started</Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}