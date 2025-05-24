import React from 'react'
import Navbar from '../components/Navbar'
import UserDashboard from '../Dashboard/UserDashboard'

function Home() {
  return (
    <section>
        <div>
            <Navbar/>
        </div>
        <div>
            <UserDashboard/>
        </div>
    </section>
  )
}

export default Home