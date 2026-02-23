import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t border-stone-200 dark:border-stone-800">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="text-center">
          <p className="text-2xl font-bold text-stone-900 dark:text-white">
            Chat PDF Now
          </p>
          <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
            Transform your PDFs into interactive conversations
          </p>
          
          <div className="mt-8 flex justify-center gap-6">
            <Link
              href="/documents"
              className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            >
              Documents
            </Link>
            <Link
              href="/settings/billing"
              className="text-sm text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white"
            >
              Pricing
            </Link>
          </div>
          
          <p className="mt-8 text-xs text-stone-500">
            © {new Date().getFullYear()} Chat PDF Now. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}