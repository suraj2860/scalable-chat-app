interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div className='flex items-center border bg-gray-900 border-white w-80 h-16 space-x-4 p-2 animate-pulse'>
      <div className='h-12 w-12 rounded-full bg-gray-700'></div>
      <div className='h-4 w-32 bg-gray-700 rounded'></div>
    </div>      
  );
}