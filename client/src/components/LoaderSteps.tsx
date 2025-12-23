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
    <div>

    </div>
  )
}

export default LoaderSteps