import { Loader2Icon } from 'lucide-react';
import React, { useState } from 'react'
import Footer from '../components/Footer';
import { authClient } from '@/lib/auth-client';
import { toast } from 'sonner';
import api from '@/configs/axios';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const {data: session} = authClient.useSession();
    const [input, setInput] = React.useState('');
    const [loading ,setLoading ] = useState(false)
    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
          if(!session?.user){
            return toast.error('Please Sign In To Use This Feature.');
          } 
          else if(!input.trim()){
            return toast.error('Please Enter a Message');
          }
          setLoading(true);
          const {data} = await api.post('/api/user/project', {initial_prompt: input});
          setLoading(false);
          navigate(`/projects/${data.projectId}`);
        } catch (error: any) {
          setLoading(false);
          toast.error(error?.response?.data?.message || error.message);
          console.log(error);
        }
        
        
    }

    return (
      <>
        <section 
          className="flex flex-col items-center text-white text-sm pb-20 px-4 font-poppins min-h-screen"
          style={{
            background: `linear-gradient(180deg, #004d1a 0%, #0073b3 100%)`
          }}
        >
          <a href="https://prebuiltui.com" className="flex items-center gap-2 border border-[#00FFA3] rounded-full p-1 pr-3 text-sm mt-20">
            <span className="bg-[#00FFAB] text-xs px-3 py-1 rounded-full">NEW</span>
            <p className="flex items-center gap-2">
              <span>Try 30 days free trial option</span>
              <svg className="mt-[1px]" width="6" height="9" viewBox="0 0 6 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="m1 1 4 3.5L1 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </p>
          </a>

          <h1 className="text-center text-[40px] leading-[48px] md:text-6xl md:leading-[70px] mt-4 font-semibold max-w-3xl">
            From imagination to a website, built with Prism AI.
          </h1>

          <p className="text-center text-base max-w-md mt-2">
            Build complete websites from a simple idea — no design skills needed.
          </p>

          <form 
            onSubmit={onSubmitHandler} 
            className="bg-[#004d1a]/40 max-w-2xl w-full rounded-xl p-4 mt-10 border border-[#00FFAB] focus-within:ring-2 ring-[#00FFAB] transition-all"
          >
            <textarea 
  onChange={e => setInput(e.target.value)} 
  onKeyDown={(e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      e.currentTarget.form?.requestSubmit();
    }
  }}
  className="bg-transparent outline-none text-gray-200 resize-none w-full" 
  rows={4} 
  placeholder="Describe your website in details" 
  required 
/>

            <button 
              className="border-2 border-[#004d1a] ml-auto flex items-center gap-2 bg-gradient-to-r from-[#004d1a] via-[#00FFAB] to-[#0073b3] rounded-md px-4 py-2 text-white font-medium hover:brightness-110 transition"
            >
              {!loading? 'Create with AI' : (
                  <>
                    Creating <Loader2Icon className="animate-spin"/>
                  </>
              )}
            </button>
          </form>

        
        </section>
        <Footer/>
      </>
    )
}

export default Home
