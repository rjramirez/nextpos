// app/components/Pagination.tsx
import React from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const Pagination: React.FC<PaginationProps> = ({ 
  currentPage, 
  totalPages, 
  onPageChange 
}) => {
  // Generate an array of page numbers to display
  const generatePageNumbers = () => {
    const pageNumbers = []
    const maxPagesToShow = 5
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2))
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

    // Adjust start page if we're near the end
    if (endPage === totalPages) {
      startPage = Math.max(1, totalPages - maxPagesToShow + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i)
    }

    return pageNumbers
  }

  // Disable previous/next buttons when at first/last page
  const isPreviousDisabled = currentPage === 1
  const isNextDisabled = currentPage === totalPages

  return (
    <div className="flex justify-center items-center space-x-2 my-4">
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPreviousDisabled}
        className={`px-4 py-2 border rounded ${
          isPreviousDisabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'hover:bg-gray-100'
        }`}
      >
        Previous
      </button>

      {/* Page Numbers */}
      {generatePageNumbers().map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 border rounded ${
            page === currentPage 
              ? 'bg-blue-500 text-white' 
              : 'hover:bg-gray-100'
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextDisabled}
        className={`px-4 py-2 border rounded ${
          isNextDisabled 
            ? 'bg-gray-200 cursor-not-allowed' 
            : 'hover:bg-gray-100'
        }`}
      >
        Next
      </button>
    </div>
  )
}