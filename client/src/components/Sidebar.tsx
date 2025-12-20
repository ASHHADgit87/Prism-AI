import React from 'react'
import type { Message, Project } from '../types'
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
                                <div>
                                    
                                </div>
                              )}
                            </div>
                        )
                    }
                })}
            </div>
            {/* Input Area*/}
            <form>

            </form>
        </div>   
    </div>
  )
}

export default Sidebar