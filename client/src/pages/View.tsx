import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import { dummyProjects } from '../assets/assets';

const View = () => {
  const {projectId} = useParams();
  const [code,setCode] = useState('');
  const [loading,setLoading] = useState(true);
  const fetchCode = async() =>{
    const code = dummyProjects.find(project => project.id === projectId )?.current_code;
    setTimeout(() => {
      if(code){
        setCode(code);
        setLoading(false);
      }
    },2000)
  }
  return (
    <div><h1>View</h1></div>
  )
}

export default View