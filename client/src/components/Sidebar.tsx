import React from 'react'
import type { Project } from '../types'
interface SidebarProps {
    isMenuOpen : boolean,
    project : Project,
    setProject : (project: Project) => void,
    isGenerating : boolean,
    setIsGenerating : (isGenerating : boolean) => void
}
const Sidebar = ({isMenuOpen,project,setProject,isGenerating,setIsGenerating} : SidebarProps) => {
  return (
    <div className=''>

    </div>
  )
}

export default Sidebar