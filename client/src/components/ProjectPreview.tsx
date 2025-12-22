import React, { forwardRef, useRef } from 'react'
import type { Project } from '../types'
import { iframeScript } from '../assets/assets';

interface ProjectPreviewProps {
    project : Project;
    isGenerating : boolean;
    device ? : 'phone' | 'tablet' | 'desktop';
    showEditorPanel? : boolean;
}
export interface ProjectPreviewRef {
    getCode: () => string | undefined
}

const ProjectPreview = forwardRef<ProjectPreviewRef, ProjectPreviewProps>(({project,isGenerating,device = 'desktop',showEditorPanel = true},ref) => {
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const resolutions = {
        phone : 'w-[412px]',
        tablet : 'w-[768px]',
        desktop : 'w-full'
    }
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
                    <iframe ref={iframeRef}  srcDoc={injectPreview(project.current_code)}className={`h-full max-sm:w-full ${resolutions[device]} max-auto transition-all`} />
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