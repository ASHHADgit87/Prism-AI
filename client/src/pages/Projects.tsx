import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types';
import { Loader2Icon } from 'lucide-react';

const Projects = () => {
  const {projectId} = useParams();
  const navigate = useNavigate();
  const [project,setProject] = useState<Project | null>(null);
  const [loading,setLoading] = useState(true);
  const [isGenerating,setIsGenerating] = useState(true);
  const [device,setDevice] = useState<'phone' | 'tablet' | 'desktop'>('desktop');
  const [isMenuOpen,setIsMenuOpen] = useState(false);
  const [isSaving,setIsSaving] = useState(false);
  const fetchProject = async() =>{
    
  }
  useEffect(() => {
    fetchProject();
  },[])
  if(loading){
    return (
      <>
      <div className='flex items-center justify-center h-screen'>
                 <Loader2Icon className='size-7 animate-spin text-violet-200'/>
      </div>
      </>
    )
  }
  return project ? (
    <div><h1>Projects</h1></div>
  ) :
  (
    <div className='flex items-center justify-center h-screen'>
         <p className='text-2xl font-medium text-gray-200'>Unable to load project!</p>
    </div>
  )
}

export default Projects