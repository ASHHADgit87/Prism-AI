import { CircleIcon, ScanLineIcon, SquareIcon, TriangleIcon } from 'lucide-react'
import React from 'react'
const steps = [
    { icon: ScanLineIcon, label: "Reviewing your input..." },
  { icon: SquareIcon, label: "Building the page framework..." },
  { icon: TriangleIcon, label: "Putting interface elements together..." },
  { icon: CircleIcon, label: "Wrapping up the final output..." }
]
const STEP_DURATION = 45000
const LoaderSteps = () => {
  return (
    <div className='w-full h-full flex flex-col items-center justify-center bg-gray-950 relative overflow-hidden text-white'>
     <div className='absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-fuchsia-500/10 blur-3xl animate-pulse'></div>
       <div className='relative z-10 w-32 h-32 flex items-center justify-center'>
          <div className='absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-30'/>
          <div className='absolute inset-4 rounded-full border border-purple-400/20'/>
          <div className='w-8 h-8 text-white opacity-80 animate-bounce'/>
       </div>
      {/* Step label - fade using transition only (no invisible start)*/}
      <p className='mt-8 text-lg font-light text-white/90 tracking-wide transition-all duration-700 ease-in-out opacity-100' key={current}>{steps[current].label}</p>
      <p className='text-xs text-gray-400 mt-2 transition-opacity duration-700 opacity-100'>This process usually takes about 2-3 minutes.</p>
    </div>
  )
}

export default LoaderSteps