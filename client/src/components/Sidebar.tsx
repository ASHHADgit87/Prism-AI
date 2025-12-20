import React from 'react'
import type { Message, Project, Version } from '../types'
import { BotIcon, EyeIcon, UserIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
interface SidebarProps {
    isMenuOpen : boolean,
    project : Project,
    setProject : (project: Project) => void,
    isGenerating : boolean,
    setIsGenerating : (isGenerating : boolean) => void
}
const Sidebar = ({isMenuOpen,project,setProject,isGenerating,setIsGenerating} : SidebarProps) => {
  return (
    <div className = {`h-full sm:max-w-sm rounded-xl bg-gray-900 border-gray-800 transition-all ${isMenuOpen ? 'max-sm:w-0 overflow-hidden' : 'w-full'}`}>
        <div className='flex flex-col h-full'>
            {/* Message Container*/}
            <div className='flex-1 overflow-y-auto no-scrollbar px-3 flex flex-col gap-4'>
                {[...project.conversation,...project.versions].sort((a,b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()).map((message)=>{
                    const isMessage = 'content' in message;

                    if(isMessage){
                        const msg = message as Message;
                        const isUser = msg.role === 'user';
                        return(
                            <div key={msg.id} className={`flex items-start gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
                              {!isUser && (
                                <div className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center '>
                                    <BotIcon className='size-5 text-1hite'/>
                                </div>
                              )}
                              <div className={`max-w-[80%] p-2 px-4 rounded-2xl shadow-sm text-sm mt-5 leading-relaxed ${isUser ? 'bg-linear-to-r from-indigo-500 to-indigo-600 text-white rounded-tr-none': 'rouned-tl-none bg-gray-800 text-gray-100'}`}>
                                {msg.content}
                              </div>
                              {isUser && (
                                <div className='w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center'>
                                    <UserIcon className='size-5 text-gray-200'/>
                                </div>
                              ) }
                            </div>
                        )
                    }
                    else{
                        const ver = message as Version;
                        return(
                            <div key={ver.id} className='w-4/5 mx-auto my-2 p-3 rounded-xl bg-gray-800 text-gray-100 shadow flex flex-col gap-2'>
                                <div className='text-xs font-medium'>
                                    Code Updated <br/> <span className='text-gray-500 text-xs font-normal'>
                                        {new Date(ver.timestamp).toLocaleString()}
                                    </span>
                                </div> 
                                <div className='flex items-center justify-between'>
                                    {project.current_version_index === ver.id ? (
                                        <button className='px-3 py-1 rounded-md text-xs bg-gray-700'>Current Version</button>
                                    ):(
                                        <button className='px-3 py-1 rounded-md text-xs bg-indigo-500hover:bg-indigo-600 text-white'>Roll Back To This Version</button>
                                    )}
                                    <Link target='_blank' to={`/preview/${project.id}/${ver.id}`}>
                                    <EyeIcon className='size-6 p-1 bg-gray-700 hover:bg-indigo-500 transition-colors rounded'/>
                                    </Link>
                                </div> 

                            </div>
                        )
                    }
                })}
                {
                    isGenerating && (
                        <div className='flex items-start gap-3 justify-start'>
                            <div className='w-8 h-8 rounded-full bg-linear-to-br from-indigo-600 to-indigo-700 flex items-center justify-center '>
                                <BotIcon className='size-5 text-white'/>
                            </div> 
                        </div>
                    )
                }
            </div>
            {/* Input Area*/}
            <form>

            </form>
        </div>   
    </div>
  )
}

export default Sidebar