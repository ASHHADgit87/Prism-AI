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
    const handleChange = (field: string, value: string) => {
        const newValues = {
            ...values,[field]: value};
            if(field in values.styles){
                newValues.styles = {
                    ...values.styles,
                    [field]: value
                }
            }
            setValues(newValues);
            onUpdate({[field]: value});
    }
  return (
    <div className='absolute top-4 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50 animate-in fade-in slide-in-from-right-5'>
         <div className='flex justify-between items-center mb-4'>
            <h3 className='font-semibold text-gray-800'>Edit Element</h3>
            <button onClick={onClose} className='p-1 hover:bg-gray-100 rounded-full'>
                <X className='w-4 h-4 text-gray-500'/>
            </button>
         </div>
         <div className='space-y-4 text-black'>
            <div>
                <label className='block text-xs font-medium text-gray-500 mb-1'>
                    Text Content
                </label>
                <textarea value={values.text} onChange={(e) => handleChange('text',e.target.value)} className='w-full text-sm p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none min-h-20'/>
            </div>
            <div>
                <label className='block text-xs font-medium text-gray-500 mb-1'>
                    Class Name
                </label>
                <input type='text' value={values.className || ''} onChange={(e) => handleChange('className',e.target.value)} className='w-full text-sm p-2 border rounded-md focus:ring-2 focus:ring-indigo-500 outline-none '/>
            </div>
            <div>
                
            </div>
         </div>
    </div>
  )
}

export default EditorPanel