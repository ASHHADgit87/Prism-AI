import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import type { Project } from '../types';
import { ArrowBigDownDashIcon, EyeIcon, EyeOffIcon, FullscreenIcon, LaptopIcon, Loader2Icon, MessageSquareIcon, SaveIcon, SmartphoneIcon, TabletIcon, XIcon } from 'lucide-react';
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
  const saveProject = async () => {
    
  } 
  const downloadCode = async () => {
    
  }
  const togglePublish = async () => {
    
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
        <div className='hidden sm:flex gap-2 bg-gray-950 p-1.5 rounded-md'>
          <SmartphoneIcon onClick={()=> setDevice('phone')} className={`size-6 p-1 rounded cursor-pointer ${device === 'phone' ? 'bg-gray-700' : '' }`} />
          <TabletIcon onClick={()=> setDevice('tablet')} className={`size-6 p-1 rounded cursor-pointer ${device === 'tablet' ? 'bg-gray-700' : '' }`} />
          <LaptopIcon onClick={()=> setDevice('desktop')} className={`size-6 p-1 rounded cursor-pointer ${device === 'desktop' ? 'bg-gray-700' : '' }`} />
        </div>
        {/*Right*/}
        <div className='flex items-center justify-end gap-3 flex-1 text-xs sm:text-sm'>
            <button onClick={saveProject}  disabled={isSaving} className='max-sm:hidden bg-gray-800 hover:bg-gray-700 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors border border-gray-700'>{isSaving ? <Loader2Icon size={16} className='animate-spin'/> :
              <SaveIcon size={16}/>}Save
            </button>
            <Link className='flex items-center gap-2 px-4 py-1 rounded sm:rounded-sm border border-gray-700 hover:border-gray-500 transition-colors' target='_blank' to={`/preview/${projectId}`}>
             <FullscreenIcon size={16}/>Preview
            </Link>
            <button onClick={downloadCode} className='bg-linear-to-br from-blue-700 to-blue-600 hover:from-blue-600 hover:to-blue-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors'>
              <ArrowBigDownDashIcon size={16}/>Download
            </button>
            <button onClick={togglePublish} className='bg-linear-to-br from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white px-3.5 py-1 flex items-center gap-2 rounded sm:rounded-sm transition-colors'>
              {project.isPublished ? <EyeOffIcon size={16}/> : <EyeIcon size={16}/>}
              {project.isPublished ? 'Unpublish' : 'Publish'}
            </button>
        </div> 
      </div>
      <div className='flex-1 flex overflow-auto'>
            <div>Sidebar</div>
            <div className='flex-1 p-2 pl-0'>Project Preview</div>
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