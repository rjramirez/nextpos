interface LoadingProps {
    size?: 'small' | 'medium' | 'large'
    color?: 'primary' | 'secondary' | 'white'
  }
  
  const Loading = ({ size = 'medium', color = 'primary' }: LoadingProps) => {
    const sizeClasses = {
      small: 'h-4 w-4',
      medium: 'h-8 w-8',
      large: 'h-12 w-12'
    }
  
    const colorClasses = {
      primary: 'border-blue-500',
      secondary: 'border-gray-500',
      white: 'border-white'
    }
  
    return (
      <div className="flex justify-center items-center min-h-[inherit]">
        <div 
          className={`
            animate-spin 
            rounded-full 
            border-2 
            border-t-transparent 
            ${sizeClasses[size]} 
            ${colorClasses[color]}
          `}
        />
      </div>
    )
  }
  
  export default Loading