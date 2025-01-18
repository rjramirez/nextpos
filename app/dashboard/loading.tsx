import Loading from '@/app/loading'

export default function DashboardLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar skeleton */}
      <div className="w-64 bg-white border-r border-gray-200 p-4">
        {/* Logo/Brand skeleton */}
        <div className="h-8 w-32 bg-gray-200 rounded animate-pulse mb-8" />
        
        {/* Navigation items skeleton */}
        <div className="space-y-2">
          {[...Array(5)].map((_, index) => (
            <div 
              key={index}
              className="h-10 bg-gray-200 rounded animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Main content area */}
      <div className="flex-1 p-4">
        {/* Header skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
        </div>

        {/* Stats/Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[...Array(4)].map((_, index) => (
            <div 
              key={index}
              className="bg-white p-4 rounded-lg shadow-sm"
            >
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
            </div>
          ))}
        </div>

        {/* Content skeleton */}
        <div className="bg-white rounded-lg shadow-sm p-4">
          {/* Table header skeleton */}
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
          </div>

          {/* Table rows skeleton */}
          <div className="space-y-3">
            {[...Array(5)].map((_, index) => (
              <div 
                key={index}
                className="flex justify-between items-center border-b border-gray-100 pb-3"
              >
                <div className="h-4 w-48 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Center loading spinner */}
        <div className="fixed inset-0 flex items-center justify-center bg-white/50">
          <Loading size="large" color="primary" />
        </div>
      </div>
    </div>
  )
}