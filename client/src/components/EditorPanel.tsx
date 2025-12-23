import { X } from 'lucide-react';
import React, { useEffect, useState } from 'react'
interface EditorPanelProps {
    selectedElement: {
        tagName: string;
        className: string;
        text: string;
        styles: {
            padding: string;
            margin: string;
            backgroundColor: string;
            color: string;
            fontSize: string;
        };
    } | null;
    onUpdate: (updates: any) => void;
    onClose: () => void;
}
const EditorPanel = ({selectedElement,onUpdate,onClose}: EditorPanelProps) => {
    const [values,setValues] = useState(selectedElement);
    useEffect(() => {
        setValues(selectedElement);
    }, [selectedElement])
    if(!selectedElement || !values) return null;
  return (
    <div className='absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-right-5'>
         <div className='flex justify-between items-center mb-4'>
            <h3 className='font-semibold text-gray-800'>Edit Element</h3>
            <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded-full'>
                <X className='w-4 h-4 text-gray-500'/>
            </button>
         </div>
    </div>
  )
}

export default EditorPanel