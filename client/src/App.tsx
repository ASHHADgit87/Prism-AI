import { Toaster } from 'sonner'
import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import Community from './pages/Community'
import Pricing from './pages/Pricing'
import View from './pages/View'
import Projects from './pages/Projects'
import Preview from './pages/Preview'
import MyProjects from './pages/MyProjects'
import Navbar from './components/Navbar'
import AuthPage from './pages/auth/AuthPage'
import Settings from './pages/Settings'

const App = () => {
  const {pathname} = useLocation();
  const hideNavbar = pathname.startsWith('/projects/') && pathname !== '/projects' 
  || pathname.startsWith('/view/')
  || pathname.startsWith('/preview/')
  return (
    <div>
      <Toaster/>
      {!hideNavbar && <Navbar/>}
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/community' element={<Community/>} />
        <Route path='/pricing' element={<Pricing/>} />
        <Route path='/view/:projectId' element={<View/>} />
        <Route path='/projects/:projectId' element={<Projects/>} />
        <Route path='/preview/:projectId' element={<Preview/>} />
        <Route path='/preview/:projectId/:versionId' element={<Preview/>} />
        <Route path='/projects' element={<MyProjects/>} />
         <Route path="/auth/:pathname" element={<AuthPage/>} />
         <Route path="/account/settings" element={<Settings/>} />
      </Routes>
    </div>
  )
}

export default App