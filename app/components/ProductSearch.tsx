export interface ProductSearchProps {
  searchTerm: string
  onSearch: (value: string) => void
}

export interface ProductSearchWithPaginationProps extends ProductSearchProps {
  currentPage: number
  totalPages: number
  onPageChange: (newPage: number) => void
}

export const ProductSearch = ({ 
  searchTerm, 
  onSearch, 
  currentPage, 
  totalPages, 
  onPageChange 
}: ProductSearchWithPaginationProps) => (
  <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4 mb-4">
    <div className="w-full">
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
      />
    </div>
    {totalPages > 1 && (
      <div className="flex items-center space-x-2">
        <button 
          onClick={() => onPageChange(currentPage - 1)} 
          disabled={currentPage === 1}
          className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          ←
        </button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <button 
          onClick={() => onPageChange(currentPage + 1)} 
          disabled={currentPage === totalPages}
          className="px-3 py-2 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          →
        </button>
      </div>
    )}
  </div>
)