import React from 'react'
import {assets} from '../assets/assets'
import { Star } from 'lucide-react'
import {SignIn} from  '@clerk/clerk-react'

const Login = () => {
  return (
  <div className='min-h-screen relative flex flex-col md:flex-row'>
     <img 
    src={assets.bgImage}
    alt="Background" 
    className='absolute top-0 left-0 z-0 w-full h-full object-cover'/>

  {/* Left side: Branding */}
  <div className='flex-1 flex flex-col items-start justify-between p-6 md:p-10 lg:pl-40'>
      <img src={assets.logo} alt="Logo" className='h-12 object-contain mb-8'/>
      <div className='flex flex-col gap-2'>
        <div className='flex items-center gap-2'>
          <img src={assets.group_users} alt="Group Users" className='h-8 md:h-10 object-contain'/>
          <div className='flex flex-col items-start'>
            <div className='flex items-center gap-1 mb-0'>
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className='size-4 md:size-4.5 text-transparent fill-amber-500' />
              ))}
            </div>
            <p className='mt-0'>Used by 12K+ doctors</p>
          </div>
        </div>
        <div className='mt-10'>
          <h2 className='text-3xl md:text-6xl md:pb-2 font-bold bg-gradient-to-r from-indigo-950 to-indigo-700 bg-clip-text text-transparent'> Supporting Doctors, Securing Health </h2>
          <p className='text-xl md:text-3xl text-indigo-900 max-w-72 md:max-w-md'>Where doctors Connect, Elevate, and get Empowered</p>
        </div>
      </div>
      <span className='md:h-10'></span>
    </div>

    {/* Right side: SignIn */}
    <div className='flex-1 flex items-center justify-center p-6'>
      <SignIn />
    </div>
  </div>

    

  )
}

export default Login