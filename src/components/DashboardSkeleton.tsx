export default function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="h-10 w-48 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-10 w-24 bg-gray-200 animate-pulse rounded"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Health Metrics Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 w-32 bg-gray-200 mb-6 rounded"></div>
            
            <div className="space-y-8">
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 mb-4 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 mb-4 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Activity Summary Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 w-40 bg-gray-200 mb-6 rounded"></div>
            
            <div className="space-y-8">
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 mb-4 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 mb-4 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
          
          {/* Sleep Data Skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
            <div className="h-6 w-28 bg-gray-200 mb-6 rounded"></div>
            
            <div className="space-y-8">
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 mb-4 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 mb-4 rounded"></div>
              </div>
              
              <div>
                <div className="h-4 w-24 bg-gray-200 mb-2 rounded"></div>
                <div className="h-8 w-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 