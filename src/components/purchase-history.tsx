'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { format } from 'date-fns';

export function PurchaseHistory() {
  const purchases = useQuery(api.billing.getPurchaseHistory);

  if (!purchases) {
    return <div className="text-sm text-stone-500">Loading...</div>;
  }

  if (purchases.length === 0) {
    return (
      <div className="text-sm text-stone-500">
        No purchase history yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {purchases.map((purchase) => (
        <div
          key={purchase._id}
          className="flex items-center justify-between rounded-lg border bg-white p-4 dark:bg-stone-900"
        >
          <div>
            <p className="font-medium">
              {purchase.credits} Question Credits
            </p>
            <p className="text-sm text-stone-500">
              {format(new Date(purchase.purchaseDate), 'MMM dd, yyyy')}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold">${purchase.amountPaid.toFixed(2)}</p>
            <p className="text-xs text-stone-500 capitalize">{purchase.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}