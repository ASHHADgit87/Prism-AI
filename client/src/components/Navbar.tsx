import React, { useEffect, useState } from 'react'
import { assets } from '../assets/assets';
import { Link, useNavigate } from 'react-router-dom';
import { authClient } from '@/lib/auth-client';
import {UserButton} from '@daveyplate/better-auth-ui'
import api from '@/configs/axios';
import { toast } from 'sonner';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = React.useState(false);
    const navigate = useNavigate();
    const [credits, setCredits] = useState(0);
    
    const {data: session} = authClient.useSession();
    const getCredits = async () => {
        try {
            const {data} = await api.get('/api/user/credits');
            setCredits(data.credits);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || error.message);
            console.log(error);
        } 
    }
    useEffect(() => {
        if(session?.user){
            getCredits();
        }
    },[session?.user])
    return (
        <>
        <nav className="sticky top-0 z-50 flex items-center justify-between w-full py-4 px-4 md:px-16 lg:px-24 xl:px-32 backdrop-blur border-b text-white border-[#00331a]">
            <Link to='/'>
                <img src={assets.logo} alt='' className='h-5 sm:h-7'/>
            </Link>

            <div className="hidden md:flex items-center gap-8 transition duration-500">
                <Link to='/' className="hover:text-[#00FFAB] transition">Home</Link>
                <Link to='/projects' className="hover:text-[#00FFAB] transition">My Projects</Link>
                <Link to='/community' className="hover:text-[#00FFAB] transition">Community</Link>
                <Link to='/pricing' className="hover:text-[#00FFAB] transition">Pricing</Link>
            </div>

            <div className="flex items-center gap-3">
                {!session?.user ? (
                     <button 
                    onClick={() => navigate('/auth/signin')} 
                    className="border-3 border-[#004d1a] px-6 py-1.5 max-sm:text-sm bg-gradient-to-r from-[#004d1a] via-[#00FFAB] to-[#0073b3] hover:brightness-110 active:scale-95 transition rounded text-white font-medium"
                >
                    Get started
                </button>
                ) :(
                    <>
                    <button className='bg-white/10 px-5 py-1.5 text-xs sm:text-sm border text-gray-200 rounded-full'>Credits: <span className='text-indigo-300'>{credits}</span></button>
                   <UserButton size='icon'/>
                   </>
                )
                    
                }

                <button id="open-menu" className="md:hidden active:scale-90 transition" onClick={() => setMenuOpen(true)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 5h16"/>
                        <path d="M4 12h16"/>
                        <path d="M4 19h16"/>
                    </svg>
                </button>
            </div>
        </nav>

        {menuOpen && (
            <div className="fixed inset-0 z-[100] bg-[#004d1a]/70 text-white backdrop-blur flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300">
                <Link to='/' onClick={() => setMenuOpen(false)} className="hover:text-[#00FFAB] transition">Home</Link>
                <Link to='/projects' onClick={() => setMenuOpen(false)} className="hover:text-[#00FFAB] transition">My Projects</Link>
                <Link to='/community' onClick={() => setMenuOpen(false)} className="hover:text-[#00FFAB] transition">Community</Link>
                <Link to='/pricing' onClick={() => setMenuOpen(false)} className="hover:text-[#00FFAB] transition">Pricing</Link>
                
                <button 
                    className="active:ring-3 active:ring-[#00FFAB] aspect-square size-10 p-1 items-center justify-center bg-gradient-to-r from-[#004d1a] via-[#00FFAB] to-[#0073b3] hover:brightness-110 text-white rounded-md flex" 
                    onClick={() => setMenuOpen(false)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18"/>
                        <path d="m6 6 12 12"/>
                    </svg>
                </button>
            </div>
        )}
        </>
    )
}

export default Navbar
