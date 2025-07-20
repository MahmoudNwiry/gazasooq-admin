
const Loading = () => {
  return (
    <div className="flex flex-row gap-2 absolute top-0 left-0 right-0 bottom-0 z-999999 justify-center items-center">
      
      <svg className="animate-spin h-8 w-8 text-brand-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-100" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2.93 6.343A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3.93-1.595z"></path>
      </svg>
      <span className="text-gray-600 dark:text-gray-300">جارٍ التحميل...</span>

    </div>
  )
}

export default Loading