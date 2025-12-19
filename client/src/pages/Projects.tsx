import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types';
import { LaptopIcon, Loader2Icon, MessageSquareIcon, SmartphoneIcon, TabletIcon, XIcon } from 'lucide-react';
import { dummyConversations, dummyProjects } from '../assets/assets';

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
     const project = dummyProjects.find(project => project.id === projectId )
     setTimeout(() => {
        if(project){
          setProject({...project, conversation : dummyConversations});
          setLoading(false)
          setIsGenerating(project.current_code ? false : true)
        }
     },2000)
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
    <div className='flex flex-col h-screen w-full bg-gray-900 text-white'>
      <div className='flex max-sm:flex-col sm:items-center gap-4 px-4 py-2 no-scrollbar'>
        {/*Left*/}
        <div className='flex items-center gap-2 sm:min-w-90 text-nowrap'>
           <img src='/favicon.svg' alt='logo' className='h-6 cursor-pointer ' onClick={()=>navigate('/')}/>
           <div>
            <p className='text-sm text-medium capitalize truncate'>{project.name}</p>
            <p className='text-xs text-gray-400 -mt-0.5'>Previewing Last Saved Version</p>
           </div>
           <div className='sm:hidden flex-1 flex justify-end'>
              {isMenuOpen ? <MessageSquareIcon onClick={()=>setIsMenuOpen(false)} className='size-6 cursor-pointer'/> : <XIcon onClick={()=>setIsMenuOpen(true)} className='size-6 cursor-pointer'/>}
           </div>
        </div>
        {/*Middle*/}
        <div>
          <SmartphoneIcon onClick={()=> setDevice('phone')} className={`size-6 p-1 rounded cursor-pointer ${device === 'phone' ? 'bg-gray-700' : '' }`} />
          <TabletIcon onClick={()=> setDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? 'bg-gray-700' : '' }`} />
          <LaptopIcon onClick={()=> setDevice('desktop')} className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? 'bg-gray-700' : '' }`} />
        </div>
        {/*Right*/}
        <div>

        </div>
      </div>
    </div>
  ) :
  (
    <div className='flex items-center justify-center h-screen'>
         <p className='text-2xl font-medium text-gray-200'>Unable to load project!</p>
    </div>
  )
}

export default Projects