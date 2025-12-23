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
        
    </div>
  )
}

export default EditorPanel