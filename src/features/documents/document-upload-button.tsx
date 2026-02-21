'use client';

import { Loader2, Upload } from 'lucide-react';
import { useCallback, useState } from 'react';
import { pdfjs } from 'react-pdf';

import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/components/upgrade-modal';
import useDocumentUpload from '@/hooks/use-document-upload';
import { useUserLimits } from '@/hooks/use-user-limits';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export interface DocumentUploadButtonProps {
  showToast?: boolean;
  onUploadSuccess?: () => void;
  onUploadError?: (error: unknown) => void;
}

export default function DocumentUploadButton(props: DocumentUploadButtonProps) {
  const { upload, isUploading } = useDocumentUpload({
    showToast: props.showToast,
    onUploadSuccess: props.onUploadSuccess,
    onUploadError: props.onUploadError,
  });
  
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { canUploadPDF, pdfCount, pdfLimit } = useUserLimits();

  const handleUpload = useCallback(
    function handleUpload() {
      // Check if user can upload
      if (!canUploadPDF) {
        setShowUpgradeModal(true);
        return;
      }
      
      // Proceed with upload if allowed
      const fileInput = document.createElement('input');
      fileInput.type = 'file';
      fileInput.accept = '.pdf';
      fileInput.onchange = async (e) => {
        const selectedDocument = (e.target as HTMLInputElement).files?.[0];
        if (selectedDocument) {
          await upload(selectedDocument);
        }
      };
      fileInput.click();
    },
    [upload, canUploadPDF],
  );

  return (
    <>
      <Button
        className="text-primary-foreground w-40 bg-emerald-600 hover:bg-emerald-700"
        onClick={handleUpload}
        disabled={isUploading}
        title={`${pdfCount}/${pdfLimit === Infinity ? '∞' : pdfLimit} PDFs uploaded`}
      >
        {isUploading ? <Loader2 className="animate-spin" /> : <Upload />}
        {isUploading ? 'Uploading...' : 'Upload'}
      </Button>

      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        type="pdf"
      />
    </>
  );
}