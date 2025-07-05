
const Loading = () => {
  return (
    <div className="flex flex-row gap-2 absolute top-0 left-0 right-0 bottom-0 justify-center items-center">
  <div className="w-4 h-4 rounded-full bg-red-500 animate-bounce"></div>
  <div
    className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.3s]"
  ></div>
  <div
    className="w-4 h-4 rounded-full bg-red-500 animate-bounce [animation-delay:-.5s]"
  ></div>
</div>
  )
}

export default Loading