interface ProductSearchProps {
  searchTerm: string
  onSearch: (value: string) => void
}

export const ProductSearch = ({ searchTerm, onSearch }: ProductSearchProps) => (
  <div className="mb-4">
    <input
      type="text"
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => onSearch(e.target.value)}
      className="px-3 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    />
  </div>
)
