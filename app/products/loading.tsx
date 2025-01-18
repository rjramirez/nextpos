import Loading from '@/app/loading'

export default function ProductsLoading() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-4">
        <div className="flex justify-between items-center mb-4">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
          <div className="flex gap-2">
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
            <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>

        <div className="mb-4">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8 gap-1.5">
          {[...Array(12)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="aspect-square bg-gray-200 animate-pulse" />
              <div className="p-2 space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
                <div className="flex justify-between items-center">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse" />
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="fixed inset-0 flex items-center justify-center bg-white/50">
          <Loading size="large" color="primary" />
        </div>
      </div>
    </div>
  )
} 