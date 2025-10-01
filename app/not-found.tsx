import ErrorPage from '@/components/ErrorPage'

export default function NotFound() {
  return (
    <ErrorPage
      title="Page Not Found"
      message="The page you're looking for doesn't exist. It might have been moved, deleted, or you entered the wrong URL."
      type="not-found"
      showRetry={false}
      showBack={false}
      showHome={true}
    />
  )
}
