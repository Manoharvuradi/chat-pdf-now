'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  type: 'pdf' | 'question';
}

export function UpgradeModal({ open, onOpenChange, type }: UpgradeModalProps) {
  const title = type === 'pdf' 
    ? 'PDF Upload Limit Reached' 
    : 'Question Limit Reached';
    
  const description = type === 'pdf'
    ? 'You\'ve reached the free tier limit of 3 PDFs. Upgrade to upload unlimited documents.'
    : 'You\'ve used all 30 free questions this month. Upgrade to continue asking questions.';

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="my-4 space-y-3">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
            <h3 className="font-semibold text-blue-900 dark:text-blue-100">
              Pay-as-you-go
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              500 questions for $5
            </p>
            <p className="mt-1 text-xs text-blue-600 dark:text-blue-400">
              Never expires • Unlimited PDFs
            </p>
          </div>

          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 dark:border-purple-800 dark:bg-purple-900/20">
            <h3 className="font-semibold text-purple-900 dark:text-purple-100">
              Power User
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              $9/month
            </p>
            <p className="mt-1 text-xs text-purple-600 dark:text-purple-400">
              Unlimited questions • Unlimited PDFs
            </p>
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Maybe Later</AlertDialogCancel>
          <AlertDialogAction onClick={() => {
            // TODO: Redirect to checkout (Day 4)
            console.log('Upgrade clicked');
          }}>
            Upgrade Now
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}