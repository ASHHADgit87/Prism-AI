import React, { forwardRef, useRef } from 'react'
import type { Project } from '../types'
import { iframeScript } from '../assets/assets';

interface ProjectPreviewProps {
    project : Project;
    isGenerating : boolean;
    device ? : 'phone' | 'tablet' | 'desktop';
    showEditorPanel : boolean
}
export interface ProjectPreviewRef {
    getCode: () => string | undefined
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({project,isGenerating,device = 'desktop',showEditorPanel = true},ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const injectPreview = (html: string) => {
        if(!html) return '';
        if(!showEditorPanel) return html;
        if(html.includes('</body>')){
            return html.replace('</body>' , iframeScript + '</body>');
        }else{
            return html + iframeScript;
        }
    }
  return (
    <div className='relative h-full bg-gray-900 flex-1 rounded-xl overflow-hidden max-sm:ml-2'>
        {project.current_code?(
            <>
                    <iframe ref={iframeRef} className='w-full h-full' srcDoc={injectPreview(project.current_code)}/>
            </>
        )
        :
        isGenerating && (
            <div>
                Loading
            </div>
        )
    }
    </div>
  )
})

export default ProjectPreview