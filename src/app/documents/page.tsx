import { preloadQuery } from 'convex/nextjs';

import { api } from '@/convex/_generated/api';
import DocumentListView from '@/features/documents/document-list-view';
import { getAuthToken } from '@/lib/auth';
import Center from '@/components/center';
import Spinner from '@/components/spinner';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const token = await getAuthToken();
  // This will now wait for the user to exist
  const user = await preloadQuery(api.users.getCurrentUser);
  
  if (!user) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }
  const preloadedDocuments = await preloadQuery(
    api.documents.getUserDocuments,
    {},
    { token },
  );

  return (
    <div className="mx-auto w-full max-w-5xl p-4">
      <DocumentListView preloadedDocuments={preloadedDocuments} />
    </div>
  );
}
