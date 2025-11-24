import ErrorPage from '@/components/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      type="not-found"
      showRetry={false}
      showBack={false}
      showHome={true}
    />
  )
}
