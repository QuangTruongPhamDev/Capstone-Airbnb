import React from 'react'
import Sidebar from '../components/Header/Sidebar/Sidebar'



export default function Template_admin({ content }) {
  return (
    <div className='flex h-screen'>
            {/* Sidebar bên trái kéo dài toàn bộ màn hình */}
            <div className='w-64 h-full bg-blue-900'>
                <Sidebar/>
            </div>
            {/* Nội dung chính */}
            <div className='flex-grow p-4 overflow-auto'>
                {content}
            </div>
        </div>
  )
}
