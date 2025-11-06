import { errorLog } from '@/lib/logger'
import { useAuth } from '@/components/AuthProvider'

export interface PDFDownloadData {
  filename: string
  userId?: string
  userEmail?: string
}

export async function trackPDFDownload(data: PDFDownloadData): Promise<void> {
  try {
    await fetch('/api/analytics/track-pdf-download', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
  } catch (error) {
    errorLog('Error tracking PDF download:', error)
    // Don't throw error to avoid breaking the download
  }
}

// Hook for tracking PDF downloads with user context
export function usePDFTracking() {
  const { user } = useAuth()

  const trackDownload = async (filename: string) => {
    await trackPDFDownload({
      filename,
      userId: user?.id || '',
      userEmail: user?.email || '',
    })
  }

  return { trackDownload }
}
