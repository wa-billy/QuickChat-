import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import { AuthContext } from '../../context/AuthContext'
import { useContext } from 'react'
import { useEffect } from 'react'

const Home = () => {

    const [selectedUser, setSelectedUser] = useState(false)
    const { authUser, token } = useContext(AuthContext)

    useEffect(() => {
        console.log(authUser);
        console.log(token);
        
    }, [authUser])

    return (
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div className={`backdrop-blur-xl border-2 border-gray-600 rounded-2xl
            overflow-hidden h-[100%] grid grid-cols-1 relative ${selectedUser ?
            'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]' : 'md:grid-cols-2'}`}>
                <Sidebar />
                <ChatContainer />
                <RightSidebar selectedUser={selectedUser} setSelectedUser={setSelectedUser}/>
            </div>
        </div>
    )
}

export default Home
