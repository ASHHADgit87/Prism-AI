import { ScanLineIcon, SquareIcon } from 'lucide-react'
import React from 'react'
const steps = [
    {icon : ScanLineIcon , label: "Analyzing Your Request....."},
    {icon : SquareIcon , label: "Generating Layout Structure....."},
    {icon : ScanLineIcon , label: "Assembling UI Components....."},
    {icon : ScanLineIcon , label: "Finalizing Your Website....."}
]
const STEP_DURATION = 45000
const LoaderSteps = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden text-white'>
     <div className='absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl animate-pulse'>
       <div className='relative z-10 w-32 h-32 flex items-center justify-center'>
          <div/>
       </div>
     </div>
    </div>
  )
}

export default LoaderSteps