import SidebarBarWrapper from '@/shared/components/sidebar'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='flex h-full min-h-screen bg-black'>
        {/* Sidebar */}
        <aside className='w-[280px] min-w-[250px] max-w-[300px] border-r border-slate-800 text-white p-4'>
            <div className='sticky top-0'>
                <SidebarBarWrapper/>
            </div>
        </aside>
        
        {/* Main content area */}
        <main className='flex-1'>
            <div className='overflow-auto'>{children}</div>
        </main>
    </div>
  )
}

export default Layout